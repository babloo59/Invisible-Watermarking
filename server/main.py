from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from PIL import Image
import os
from db import save_image_entry, get_all_images
from model import RDNEncoder, RDNDecoder
from utils import save_image, compute_metrics
import torch
from torchvision import transforms

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
transform = transforms.Compose([
    transforms.Resize((128, 128)),
    transforms.ToTensor()
])

@app.route("/uploads/<path:filename>")
def serve_uploads(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

@app.route("/api/upload", methods=["POST"])
def upload():
    cover_file = request.files.get("cover")
    watermark_file = request.files.get("watermark")

    if not cover_file or not watermark_file:
        return jsonify({"error": "Missing one or both images"}), 400

    cover_path = os.path.join(UPLOAD_FOLDER, "cover_" + cover_file.filename)
    watermark_path = os.path.join(UPLOAD_FOLDER, "wm_" + watermark_file.filename)

    cover_file.save(cover_path)
    watermark_file.save(watermark_path)

    cover = transform(Image.open(cover_path).convert("RGB")).unsqueeze(0).to(device)
    watermark = transform(Image.open(watermark_path).convert("RGB")).unsqueeze(0).to(device)

    encoder = RDNEncoder().to(device)
    decoder = RDNDecoder().to(device)
    optimizer = torch.optim.Adam(list(encoder.parameters()) + list(decoder.parameters()), lr=1e-4)
    loss_fn = torch.nn.MSELoss()

    for _ in range(300):
        encoder.train(); decoder.train()
        wm = encoder(cover, watermark)
        rec = decoder(wm)
        loss = 0.7 * loss_fn(wm, cover) + 0.3 * loss_fn(rec, watermark)
        optimizer.zero_grad(); loss.backward(); optimizer.step()

    encoder.eval(); decoder.eval()
    with torch.no_grad():
        wm = encoder(cover, watermark)
        rec = decoder(wm)

    wm_filename = f"output_{cover_file.filename}"
    rec_filename = f"recovered_{watermark_file.filename}"
    wm_path = os.path.join(UPLOAD_FOLDER, wm_filename)
    rec_path = os.path.join(UPLOAD_FOLDER, rec_filename)

    save_image(wm, wm_path)
    save_image(rec, rec_path)

    psnr_score, ssim_score = compute_metrics(cover, wm)
    psnr_score_rec, ssim_score_rec = compute_metrics(watermark, rec)

    save_image_entry(
        cover_file.filename,
        wm_filename,
        rec_filename,
        {
            "PSNR": psnr_score,
            "SSIM": ssim_score,
            "PSNR_recovered": psnr_score_rec,
            "SSIM_recovered": ssim_score_rec
        }
    )

    return jsonify({
        "message": "Processed successfully",
        "psnr": psnr_score,
        "ssim": ssim_score,
        "psnr_recovered": psnr_score_rec,
        "ssim_recovered": ssim_score_rec,
        "watermarked_url": f"/uploads/{wm_filename}",
        "recovered_url": f"/uploads/{rec_filename}"
    })

@app.route("/api/images", methods=["GET"])
def get_images():
    return jsonify(get_all_images())

if __name__ == "__main__":
    app.run(debug=True)
