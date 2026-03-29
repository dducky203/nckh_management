import {
  CONFERENCE_ROLE_LABELS,
  INTL_CATEGORY_LABELS,
  LEVEL_LABELS,
  PROPOSAL_LEVEL_LABELS,
  VN_CATEGORY_LABELS,
} from "./constants";

export default function ActivityTypeFields({ form, options, onFormChange }) {
  if (form.activityType === "CONFERENCE") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-bold text-slate-500">
            Vai trò hội thảo
          </span>
          <select
            value={form.conferenceRole}
            onChange={(e) => onFormChange("conferenceRole", e.target.value)}
            className="h-10 rounded-lg border border-slate-200 px-3 text-sm"
          >
            {(options.conferenceRoles || []).map((it) => (
              <option key={it} value={it}>
                {CONFERENCE_ROLE_LABELS[it] || it}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-bold text-slate-500">
            Cấp độ hội thảo
          </span>
          <select
            value={form.conferenceLevel}
            onChange={(e) => onFormChange("conferenceLevel", e.target.value)}
            className="h-10 rounded-lg border border-slate-200 px-3 text-sm"
          >
            {(options.conferenceLevels || []).map((it) => (
              <option key={it} value={it}>
                {LEVEL_LABELS[it] || it}
              </option>
            ))}
          </select>
        </label>
      </div>
    );
  }

  if (form.activityType === "INTL_PAPER") {
    return (
      <label className="flex flex-col gap-1">
        <span className="text-xs font-bold text-slate-500">
          Danh mục bài báo quốc tế
        </span>
        <select
          value={form.intlPaperCategory}
          onChange={(e) => onFormChange("intlPaperCategory", e.target.value)}
          className="h-10 rounded-lg border border-slate-200 px-3 text-sm"
        >
          {(options.intlPaperCategories || []).map((it) => (
            <option key={it} value={it}>
              {INTL_CATEGORY_LABELS[it] || it}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (form.activityType === "VN_PAPER") {
    return (
      <label className="flex flex-col gap-1">
        <span className="text-xs font-bold text-slate-500">
          Danh mục bài báo tiếng Việt
        </span>
        <select
          value={form.vnPaperCategory}
          onChange={(e) => onFormChange("vnPaperCategory", e.target.value)}
          className="h-10 rounded-lg border border-slate-200 px-3 text-sm"
        >
          {(options.vnPaperCategories || []).map((it) => (
            <option key={it} value={it}>
              {VN_CATEGORY_LABELS[it] || it}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (form.activityType === "PROCEEDING") {
    return (
      <label className="flex flex-col gap-1">
        <span className="text-xs font-bold text-slate-500">Cấp độ kỷ yếu</span>
        <select
          value={form.proceedingLevel}
          onChange={(e) => onFormChange("proceedingLevel", e.target.value)}
          className="h-10 rounded-lg border border-slate-200 px-3 text-sm"
        >
          {(options.proceedingLevels || []).map((it) => (
            <option key={it} value={it}>
              {LEVEL_LABELS[it] || it}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (form.activityType === "PROPOSAL") {
    return (
      <label className="flex flex-col gap-1">
        <span className="text-xs font-bold text-slate-500">Cấp độ đề xuất</span>
        <select
          value={form.proposalLevel}
          onChange={(e) => onFormChange("proposalLevel", e.target.value)}
          className="h-10 rounded-lg border border-slate-200 px-3 text-sm"
        >
          {(options.proposalLevels || []).map((it) => (
            <option key={it} value={it}>
              {PROPOSAL_LEVEL_LABELS[it] || it}
            </option>
          ))}
        </select>
      </label>
    );
  }

  return null;
}
