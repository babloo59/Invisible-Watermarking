// src/App.js
import React from "react";
import Upload from "./upload";
import Gallery from "./gallery";

function App() {
  return (
    <div className="bg-slate-700 text-white min-h-screen p-8">
      <h1 className="text-5xl font-bold mb-6 text-white text-center bg-slate-700 p-8">Invisible Watermarking App</h1>
      <Upload />
      <Gallery />
    </div>
  );
}

export default App;
