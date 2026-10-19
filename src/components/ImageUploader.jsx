import React, { useRef, useState } from "react";
import { Upload, Link2, X, Image as ImageIcon, Eye } from "lucide-react";

export default function ImageUploader({
  label,
  value,
  onChange,
  onReset,
  helperText,
  aspect = "video", // "square" | "video" | "avatar" | "wide"
}) {
  const fileInputRef = useRef(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Photos are stored inside the site's single database record (1 MB limit),
  // so every upload is resized and compressed before it is saved.
  const compressImage = (file) =>
    new Promise((resolve, reject) => {
      if (file.type === "image/svg+xml") {
        if (file.size > 150 * 1024) return reject(new Error("SVG is too large (max 150 KB)."));
        const r = new FileReader();
        r.onload = () => resolve(r.result);
        r.onerror = reject;
        r.readAsDataURL(file);
        return;
      }
      const url = URL.createObjectURL(file);
      const img = new window.Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        const keepAlpha = file.type === "image/png";
        const TARGET = 110 * 1024; // ~110 KB per image
        let maxDim = keepAlpha ? 800 : 1000;
        let quality = 0.72;
        let out = "";
        for (let i = 0; i < 8; i++) {
          const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(img.width * scale));
          canvas.height = Math.max(1, Math.round(img.height * scale));
          const ctx = canvas.getContext("2d");
          if (!keepAlpha) {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          out = canvas.toDataURL(keepAlpha ? "image/png" : "image/jpeg", quality);
          if (out.length * 0.75 <= TARGET) break;
          maxDim = Math.round(maxDim * 0.8);
          quality = Math.max(0.5, quality - 0.06);
        }
        resolve(out);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("That file could not be read as an image."));
      };
      img.src = url;
    });

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow picking the same file again
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      alert("Image is larger than 15 MB. Please choose a smaller image.");
      return;
    }

    try {
      const dataUrl = await compressImage(file);
      setImgError(false);
      onChange(dataUrl);
    } catch (err) {
      alert(err.message || "Could not use that image.");
    }
  };

  const getAspectClass = () => {
    switch (aspect) {
      case "avatar":
        return "w-20 h-20 rounded-full object-cover";
      case "square":
        return "w-24 h-24 rounded-xl object-cover";
      case "wide":
        return "w-full h-32 rounded-xl object-cover";
      case "video":
      default:
        return "w-full h-40 rounded-xl object-cover";
    }
  };

  return (
    <div className="bg-[#0A1128]/10 border border-[#0A1128]/[0.15] rounded-2xl p-4 transition hover:border-[#0A1128]/[0.15]">
      {label && (
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#0A1128]/80">
            {label}
          </label>
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="text-xs font-semibold text-[#0A1128]/50 hover:text-[#0A1128] transition"
              title="Reset to default image"
            >
              Reset to original
            </button>
          )}
        </div>
      )}

      {/* Preview and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* Thumbnail Preview */}
        <div className="relative group shrink-0 border border-[#0A1128]/[0.15] bg-[#0A1128]/10 rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
          {value && !imgError ? (
            <img
              src={value}
              alt={label || "Preview"}
              className={getAspectClass()}
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              className={`flex flex-col items-center justify-center text-[#0A1128]/60 p-4 ${
                aspect === "avatar"
                  ? "w-20 h-20 rounded-full"
                  : aspect === "square"
                  ? "w-24 h-24"
                  : "w-36 h-24"
              }`}
            >
              <ImageIcon className="w-6 h-6 mb-1 text-[#0A1128]/60" />
              <span className="text-[10px] text-center font-medium">
                {imgError ? "Invalid URL" : "No image"}
              </span>
            </div>
          )}

          {value && !imgError && (
            <div className="absolute inset-0 bg-[#0A1128]/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setShowPreviewModal(true)}
                className="p-1.5 bg-[#0A1128]/5 text-[#0A1128] rounded-lg hover:bg-white shadow"
                title="View full preview"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex-1 w-full space-y-2">
          {/* URL Input */}
          <div className="flex items-center gap-2 bg-white border border-[#0A1128]/[0.15] rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-[#F4D03F] focus-within:border-transparent transition">
            <Link2 className="w-4 h-4 text-[#0A1128]/60 shrink-0" />
            <input
              type="text"
              value={value || ""}
              onChange={(e) => {
                setImgError(false);
                onChange(e.target.value);
              }}
              placeholder="Paste image URL (https://...)"
              className="w-full text-xs text-[#0A1128] outline-none bg-transparent"
            />
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="text-[#0A1128]/60 hover:text-[#0A1128]/60 p-0.5"
                title="Clear image"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Upload Button + Details */}
          <div className="flex items-center gap-2 flex-wrap">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F4D03F] hover:bg-[#F4D03F] text-[#0A1128] border border-[#F4D03F] rounded-xl text-xs font-bold transition shadow-sm active:scale-95"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload from Device
            </button>
            <span className="text-[11px] text-[#0A1128]/50">
              {helperText || "PNG, JPG, WebP or SVG"}
            </span>
          </div>
        </div>
      </div>

      {/* Full Preview Modal */}
      {showPreviewModal && (
        <div
          className="fixed inset-0 z-50 bg-[#0A1128]/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowPreviewModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl max-h-[85vh] overflow-hidden p-4 relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#0A1128]/[0.15] mb-3">
              <span className="text-sm font-bold text-[#0A1128]">
                {label || "Image Preview"}
              </span>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="p-1 rounded-lg hover:bg-[#0A1128]/10 text-[#0A1128]/50 hover:text-[#0A1128]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center justify-center max-h-[70vh] overflow-auto rounded-xl bg-white">
              <img
                src={value}
                alt="Full preview"
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}