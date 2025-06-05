import React, { useEffect, useState } from "react";
import API from "./api";

function Gallery() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    API.get("/images")
      .then(res => setImages(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="bg-slate-800 min-h-screen text-white p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Watermarked Image Gallery</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((img, idx) => {
          const metrics = img?.metrics || {};

          const psnr = metrics.PSNR;
          const ssim = metrics.SSIM;
          const psnrRecovered = metrics.PSNR_recovered;
          const ssimRecovered = metrics.SSIM_recovered;

          return (
            <div key={idx} className="bg-slate-700 p-4 rounded-xl shadow-lg">
              <p className="font-semibold text-blue-300 mb-2">{img.original}</p>

              <div className="mb-4">
                <p className="text-sm text-gray-300">Watermarked Image:</p>
                <img
                  src={`https://invisible-watermarking-wnw2.onrender.com/uploads/${img.watermarked}`}
                  alt="Watermarked"
                  className="w-full h-auto rounded mt-2"
                />
                {psnr !== undefined && ssim !== undefined ? (
                  <p className="mt-1 text-sm">
                    <strong>PSNR:</strong> {psnr.toFixed(2)} dB<br />
                    <strong>SSIM:</strong> {ssim.toFixed(4)}
                  </p>
                ) : (
                  <p className="mt-1 text-yellow-400 text-sm">Metrics not available</p>
                )}
              </div>

              <div>
                <p className="text-sm text-gray-300">Recovered Watermark:</p>
                <img
                  src={`https://invisible-watermarking-wnw2.onrender.com/uploads/${img.recovered}`}
                  alt="Recovered"
                  className="w-full h-auto rounded mt-2"
                />
                {psnrRecovered !== undefined && ssimRecovered !== undefined ? (
                  <p className="mt-1 text-sm">
                    <strong>PSNR:</strong> {psnrRecovered.toFixed(2)} dB<br />
                    <strong>SSIM:</strong> {ssimRecovered.toFixed(4)}
                  </p>
                ) : (
                  <p className="mt-1 text-yellow-400 text-sm">Metrics not available</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Gallery;
