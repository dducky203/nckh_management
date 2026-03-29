export default function ProofFileSection({
  requiresProofFile,
  setProofFile,
  setProofImage,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <label className="flex flex-col gap-1">
        <span className="text-xs font-bold text-slate-500">
          File minh chứng {requiresProofFile ? "(bắt buộc)" : ""}
        </span>
        <input
          type="file"
          onChange={(e) => setProofFile(e.target.files?.[0] || null)}
          className="h-10 rounded-lg border border-slate-200 px-3 text-sm file:mr-3 file:border-0 file:bg-slate-100 file:px-2 file:py-1"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-xs font-bold text-slate-500">Hình minh chứng</span>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setProofImage(e.target.files?.[0] || null)}
          className="h-10 rounded-lg border border-slate-200 px-3 text-sm file:mr-3 file:border-0 file:bg-slate-100 file:px-2 file:py-1"
        />
      </label>
    </div>
  );
}