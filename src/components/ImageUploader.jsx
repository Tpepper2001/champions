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

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 5MB for localStorage safety)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image is larger than 5MB. Please choose a smaller image.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (typeof dataUrl === "string") {
        setImgError(false);
        onChange(dataUrl);
      }
    };
    reader.readAsDataURL(file);
    // Reset file input so same file can be selected again
    e.target.value = "";
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
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 transition hover:border-slate-300">
      {label && (
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            {label}
          </label>
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="text-xs font-semibold text-slate-500 hover:text-amber-600 transition"
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
        <div className="relative group shrink-0 border border-slate-200 bg-slate-200 rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
          {value && !imgError ? (
            <img
              src={value}
              alt={label || "Preview"}
              className={getAspectClass()}
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              className={`flex flex-col items-center justify-center text-slate-400 p-4 ${
                aspect === "avatar"
                  ? "w-20 h-20 rounded-full"
                  : aspect === "square"
                  ? "w-24 h-24"
                  : "w-36 h-24"
              }`}
            >
              <ImageIcon className="w-6 h-6 mb-1 text-slate-400" />
              <span className="text-[10px] text-center font-medium">
                {imgError ? "Invalid URL" : "No image"}
              </span>
            </div>
          )}

          {value && !imgError && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setShowPreviewModal(true)}
                className="p-1.5 bg-white/90 text-slate-800 rounded-lg hover:bg-white shadow"
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
          <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-amber-400 focus-within:border-transparent transition">
            <Link2 className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={value || ""}
              onChange={(e) => {
                setImgError(false);
                onChange(e.target.value);
              }}
              placeholder="Paste image URL (https://...)"
              className="w-full text-xs text-slate-800 outline-none bg-transparent"
            />
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="text-slate-400 hover:text-slate-600 p-0.5"
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/80 rounded-xl text-xs font-bold transition shadow-sm active:scale-95"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload from Device
            </button>
            <span className="text-[11px] text-slate-500">
              {helperText || "PNG, JPG, WebP or SVG"}
            </span>
          </div>
        </div>
      </div>

      {/* Full Preview Modal */}
      {showPreviewModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowPreviewModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl max-h-[85vh] overflow-hidden p-4 relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <span className="text-sm font-bold text-slate-800">
                {label || "Image Preview"}
              </span>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center justify-center max-h-[70vh] overflow-auto rounded-xl bg-slate-900">
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
