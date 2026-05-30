import { Close, CloudUpload } from "@mui/icons-material";
import Button from "../../../components/common/Button";

const DOCUMENT_TYPES = [
  "Thông báo",
  "Hồ Sơ Thanh Toán",
  "Quyết Định",
  "Công Văn",
  "Tài liệu khác",
];

export default function DocumentFormModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  selectedDocument,
  saving = false,
}) {
  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setFormData((prev) => ({ ...prev, file }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div
        className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">
            {selectedDocument ? "Chỉnh sửa văn bản" : "Thêm văn bản mới"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <Close />
          </button>
        </div>

        <form
          onSubmit={onSubmit}
          className="p-5 space-y-4"
        >
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
              Tên văn bản <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.documentName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, documentName: e.target.value }))
              }
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-mainColor/30 focus:border-mainColor outline-none"
              placeholder="VD: Quyết định thành lập nhóm..."
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
              Loại văn bản <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.documentType}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, documentType: e.target.value }))
              }
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-mainColor/30 focus:border-mainColor outline-none bg-white"
              required
            >
              <option value="">Chọn loại văn bản</option>
              {DOCUMENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
              Mô tả
            </label>
            <textarea
              value={formData.description || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              rows={2}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-mainColor/30 focus:border-mainColor outline-none resize-none"
              placeholder="Ghi chú thêm (tùy chọn)"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
              Tệp đính kèm {!selectedDocument && <span className="text-rose-500">*</span>}
            </label>
            <label className="flex flex-col items-center justify-center gap-2 px-4 py-6 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-mainColor/50 hover:bg-mainColor/5 transition-colors">
              <CloudUpload className="text-mainColor" />
              <span className="text-sm font-medium text-slate-600 text-center">
                {formData.file
                  ? formData.file.name
                  : "Chọn hoặc kéo thả file (PDF, Word, ảnh...)"}
              </span>
              <span className="text-[11px] text-slate-400">Lưu trên Cloudinary</span>
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                required={!selectedDocument}
              />
            </label>
            {selectedDocument && (
              <p className="text-xs text-slate-400 mt-1.5">
                Để trống nếu không đổi file hiện tại
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={onClose} disabled={saving}>
              Hủy
            </Button>
            <Button type="submit" variant="primary" loading={saving}>
              {selectedDocument ? "Cập nhật" : "Thêm văn bản"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export { DOCUMENT_TYPES };
