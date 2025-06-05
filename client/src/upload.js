import React, { useState } from "react";
import API from "./api";

function Upload() {
  const [cover, setCover] = useState(null);
  const [watermark, setWatermark] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewCover, setPreviewCover] = useState(null);
  const [previewWatermark, setPreviewWatermark] = useState(null);

  const handleCover = (e) => {
    const file = e.target.files[0];
    setCover(file);
    if (file) setPreviewCover(URL.createObjectURL(file));
  };

  const handleWatermark = (e) => {
    const file = e.target.files[0];
    setWatermark(file);
    if (file) setPreviewWatermark(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!cover || !watermark) return alert("Please select both images.");

    const formData = new FormData();
    formData.append("cover", cover);
    formData.append("watermark", watermark);

    setLoading(true);
    setResult(null);

    try {
      const res = await API.post("/upload", formData);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-700 min-h-screen text-white p-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Upload Cover and Watermark Images
      </h2>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Cover Image */}
        <div className="bg-slate-600 p-4 rounded-lg shadow-md w-full md:w-1/2">
          <label className="block font-medium mb-2">Cover Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleCover}
            className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:border-0 
                       file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {previewCover && (
            <div className="mt-4">
              <img
                src={previewCover}
                alt="Cover Preview"
                className="w-48 h-auto rounded shadow-md border"
              />
            </div>
          )}
        </div>

        {/* Watermark Image */}
        <div className="bg-slate-600 p-4 rounded-lg shadow-md w-full md:w-1/2">
          <label className="block font-medium mb-2">Watermark Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleWatermark}
            className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:border-0 
                       file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {previewWatermark && (
            <div className="mt-4">
              <img
                src={previewWatermark}
                alt="Watermark Preview"
                className="w-48 h-auto rounded shadow-md border"
              />
            </div>
          )}
        </div>
      </div>

      {/* Upload Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={handleSubmit}
          className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-xl transition"
        >
          Upload
        </button>
      </div>

      {/* Loader */}
      {loading && (
        <div className="w-full mt-6">
          <div className="relative w-full bg-gray-200 h-3 overflow-hidden rounded-full">
            <div className="absolute top-0 left-0 w-1/3 h-full bg-blue-600 animate-[loader-slide_1s_infinite]"></div>
          </div>
          <p className="text-blue-300 mt-2 font-medium text-center">⏳ Processing images...</p>

          <style>{`
            @keyframes loader-slide {
              0% { left: -33%; }
              50% { left: 50%; }
              100% { left: 100%; }
            }
          `}</style>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="mt-8 space-y-6">
          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-600 p-4 rounded-lg shadow-md">
              <p><strong>PSNR:</strong> {result.psnr.toFixed(2)} dB</p>
              <p><strong>SSIM:</strong> {result.ssim.toFixed(4)}</p>
            </div>
            <div className="bg-slate-600 p-4 rounded-lg shadow-md">
              <p><strong>PSNR:</strong> {result.psnr_recovered.toFixed(2)} dB</p>
              <p><strong>SSIM:</strong> {result.ssim_recovered.toFixed(4)}</p>
            </div>
          </div>

          {/* Output Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Watermarked */}
            <div className="bg-slate-600 p-4 rounded-lg shadow-md text-center">
              <h4 className="mb-2 font-semibold">Watermarked Image</h4>
              <img
                src={`https://invisible-watermarking-wnw2.onrender.com/${result.watermarked_url}`}
                width={200}
                alt="Watermarked"
                className="mx-auto"
              />
              <a
                className="mt-4 inline-block bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg"
                href={`https://invisible-watermarking-wnw2.onrender.com/${result.watermarked_url}`}
                download
              >
                Download
              </a>
            </div>

            {/* Recovered Watermark */}
            <div className="bg-slate-600 p-4 rounded-lg shadow-md text-center">
              <h4 className="mb-2 font-semibold">Recovered Watermark</h4>
              <img
                src={`https://invisible-watermarking-wnw2.onrender.com/${result.recovered_url}`}
                width={200}
                alt="Recovered"
                className="mx-auto"
              />
              <a
                className="mt-4 inline-block bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg"
                href={`https://invisible-watermarking-wnw2.onrender.com/${result.recovered_url}`}
                download
              >
                Download
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Upload;
