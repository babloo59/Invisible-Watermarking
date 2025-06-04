# 🖼️ Image Watermarking Web App (React + Flask)

A full-stack web application for watermarking images using deep learning. This tool lets you upload a **cover image** and a **watermark image**, generate a **watermarked image**, and extract the watermark with **PSNR** and **SSIM** quality metrics.

---

## 📸 Features

- Upload a cover and watermark image
- Backend processes the watermark embedding and extraction
- View and download:
  - Watermarked image
  - Recovered watermark
- Displays image quality metrics:
  - PSNR (Peak Signal-to-Noise Ratio)
  - SSIM (Structural Similarity Index)

---

## 🛠️ Technologies Used

### Frontend
- React.js
- Tailwind CSS
- Axios

### Backend
- Flask
- OpenCV / NumPy / PIL
- Flask-CORS
- Gunicorn (for deployment)

---

## 🔧 Project Structure

image-watermarking/
├── backend/
│ ├── app.py # Flask app
│ ├── watermark_utils.py # Embedding/extraction logic
│ ├── static/ # Saved images (watermarked, recovered)
│ ├── requirements.txt
│ └── Procfile # For Render deployment
└── frontend/
├── src/
│ ├── Upload.jsx # Main UI component
│ └── api.js # Axios API config
├── public/
├── .env # Backend API URL
└── package.json
