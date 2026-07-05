import { useRef } from "react";
import { AttachFile, Image, Close } from "@mui/icons-material";

export default function ProofFileSection({
  requiresProofFile,
  proofFiles,
  addProofFiles,
  removeProofFile,
  proofImages,
  addProofImages,
  removeProofImage,
  error,
}) {
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const handleFilesChange = (e) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length > 0) addProofFiles(selected);
    e.target.value = "";
  };

  const handleImagesChange = (e) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length > 0) addProofImages(selected);
    e.target.value = "";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {/* File minh chứng */}
      <div className="flex flex-col gap-1">
        <span className="text-xs font-bold text-slate-500">
          File minh chứng {requiresProofFile ? "(bắt buộc)" : ""}
        </span>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`flex items-center gap-2 h-10 rounded-lg border border-dashed px-3 text-sm transition-colors ${
            error
              ? "border-red-400 bg-red-50 text-red-600 hover:border-red-500"
              : "border-slate-300 bg-slate-50 text-slate-500 hover:border-mainColor hover:text-mainColor"
          }`}
        >
          <AttachFile sx={{ fontSize: 16 }} />
          Chọn file 
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFilesChange}
        />

        {proofFiles.length > 0 && (
          <ul className="mt-1 space-y-1">
            {proofFiles.map((f, i) => (
              <li
                key={i}
                className="flex items-center justify-between gap-2 rounded-md bg-blue-50 border border-blue-100 px-2 py-1 text-xs text-blue-700"
              >
                <span className="truncate max-w-[200px]" title={f.name}>
                  <AttachFile sx={{ fontSize: 12, mr: 0.5 }} />
                  {f.name}
                </span>
                <button
                  type="button"
                  onClick={() => removeProofFile(i)}
                  className="flex-shrink-0 text-blue-400 hover:text-red-500 transition-colors"
                >
                  <Close sx={{ fontSize: 14 }} />
                </button>
              </li>
            ))}
          </ul>
        )}
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>

      {/* Hình minh chứng */}
      <div className="flex flex-col gap-1">
        <span className="text-xs font-bold text-slate-500">Hình minh chứng</span>

        <button
          type="button"
          onClick={() => imageInputRef.current?.click()}
          className="flex items-center gap-2 h-10 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 text-sm text-slate-500 hover:border-mainColor hover:text-mainColor transition-colors"
        >
          <Image sx={{ fontSize: 16 }} />
          Chọn ảnh
        </button>
        <input
          ref={imageInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleImagesChange}
        />

        {proofImages.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-2">
            {proofImages.map((f, i) => (
              <div key={i} className="relative group">
                <img
                  src={URL.createObjectURL(f)}
                  alt={f.name}
                  className="h-16 w-16 object-cover rounded-md border border-slate-200"
                />
                <button
                  type="button"
                  onClick={() => removeProofImage(i)}
                  className="absolute -top-1.5 -right-1.5 hidden group-hover:flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white shadow"
                >
                  <Close sx={{ fontSize: 10 }} />
                </button>
                <span className="absolute bottom-0 left-0 right-0 text-[9px] text-center text-white bg-black/40 rounded-b-md truncate px-0.5">
                  {f.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
