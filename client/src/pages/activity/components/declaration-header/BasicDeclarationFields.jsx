import { TYPE_LABELS } from "./constants";

export default function BasicDeclarationFields({
  form,
  options,
  lockActivityType,
  onFormChange,
}) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {lockActivityType ? (
          <label className="flex flex-col gap-1">
            <span className="text-xs font-bold text-slate-500">Loại hoạt động</span>
            <input
              readOnly
              value={TYPE_LABELS[form.activityType] || form.activityType}
              className="h-10 rounded-lg border border-slate-200 bg-slate-100 px-3 text-sm text-slate-700"
            />
          </label>
        ) : (
          <label className="flex flex-col gap-1">
            <span className="text-xs font-bold text-slate-500">Loại hoạt động</span>
            <select
              value={form.activityType}
              onChange={(e) => onFormChange("activityType", e.target.value)}
              className="h-10 rounded-lg border border-slate-200 px-3 text-sm"
            >
              {(options.activityTypes || []).map((type) => (
                <option key={type} value={type}>
                  {TYPE_LABELS[type] || type}
                </option>
              ))}
            </select>
          </label>
        )}

        <label className="flex flex-col gap-1">
          <span className="text-xs font-bold text-slate-500">Năm học</span>
          <input
            type="number"
            value={form.academicYear}
            onChange={(e) => onFormChange("academicYear", e.target.value)}
            className="h-10 rounded-lg border border-slate-200 px-3 text-sm"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-bold text-slate-500">Số lượng</span>
          <input
            type="number"
            min="1"
            value={form.qty}
            onChange={(e) => onFormChange("qty", e.target.value)}
            className="h-10 rounded-lg border border-slate-200 px-3 text-sm"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-bold text-slate-500">Ngày hoạt động</span>
          <input
            type="date"
            value={form.activityDate}
            onChange={(e) => onFormChange("activityDate", e.target.value)}
            className="h-10 rounded-lg border border-slate-200 px-3 text-sm"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-bold text-slate-500">Tên hoạt động</span>
          <input
            value={form.title}
            onChange={(e) => onFormChange("title", e.target.value)}
            className="h-10 rounded-lg border border-slate-200 px-3 text-sm"
            placeholder="Nhập tên bài/seminar/đề xuất..."
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-bold text-slate-500">
            Tên tạp chí/kỷ yếu/nơi công bố
          </span>
          <input
            value={form.publicationName}
            onChange={(e) => onFormChange("publicationName", e.target.value)}
            className="h-10 rounded-lg border border-slate-200 px-3 text-sm"
            placeholder="Nếu có"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-bold text-slate-500">
            Địa điểm / Cơ quan / Đơn vị thụ hưởng
          </span>
          <input
            value={form.venue}
            onChange={(e) => onFormChange("venue", e.target.value)}
            className="h-10 rounded-lg border border-slate-200 px-3 text-sm"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-bold text-slate-500">ISSN/DOI/ISBN/Số quyết định</span>
          <input
            value={form.identifierCode}
            onChange={(e) => onFormChange("identifierCode", e.target.value)}
            className="h-10 rounded-lg border border-slate-200 px-3 text-sm"
          />
        </label>

        <label className="flex flex-col gap-1 md:col-span-2">
          <span className="text-xs font-bold text-slate-500">Link bài báo / minh chứng</span>
          <input
            value={form.externalLink}
            onChange={(e) => onFormChange("externalLink", e.target.value)}
            className="h-10 rounded-lg border border-slate-200 px-3 text-sm"
            placeholder="https://..."
          />
        </label>

        <label className="flex flex-col gap-1 md:col-span-2">
          <span className="text-xs font-bold text-slate-500">Mô tả thêm</span>
          <textarea
            value={form.description}
            onChange={(e) => onFormChange("description", e.target.value)}
            rows={2}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-xs font-bold text-slate-500">
          Chi tiết mở rộng (JSON, không bắt buộc)
        </span>
        <textarea
          value={form.detailsJson}
          onChange={(e) => onFormChange("detailsJson", e.target.value)}
          rows={2}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          placeholder='Ví dụ: {"contractNo":"HD-2026-01"}'
        />
      </label>
    </>
  );
}