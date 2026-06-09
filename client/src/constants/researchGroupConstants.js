import { Pending, CheckCircle, Cancel, HourglassTop, AdminPanelSettings } from "@mui/icons-material";

/** Trạng thái nhóm NCKH — đồng bộ backend `ResearchGroup.GroupStatus`. */
export const RESEARCH_GROUP_STATUS = {
  PENDING: {
    label: "Chờ duyệt",
    cls: "bg-amber-50 text-amber-800 border-amber-200",
    color: "bg-yellow-100 text-yellow-800",
    Icon: Pending,
  },
  PENDING_ADVISOR: {
    label: "Chờ GV duyệt",
    cls: "bg-orange-50 text-orange-800 border-orange-200",
    color: "bg-orange-100 text-orange-800",
    Icon: HourglassTop,
  },
  PENDING_ADMIN: {
    label: "Chờ Admin duyệt",
    cls: "bg-blue-50 text-blue-800 border-blue-200",
    color: "bg-blue-100 text-blue-800",
    Icon: AdminPanelSettings,
  },
  APPROVED: {
    label: "Đã duyệt",
    cls: "bg-emerald-50 text-emerald-800 border-emerald-200",
    color: "bg-green-100 text-green-800",
    Icon: CheckCircle,
  },
  REJECTED: {
    label: "Từ chối",
    cls: "bg-rose-50 text-rose-800 border-rose-200",
    color: "bg-red-100 text-red-800",
    Icon: Cancel,
  },
};

export const RESEARCH_GROUP_STATUS_FILTER_OPTIONS = Object.entries(
  RESEARCH_GROUP_STATUS
).map(([value, { label }]) => ({ value, label }));

export function getResearchGroupStatus(status) {
  return RESEARCH_GROUP_STATUS[status] ?? RESEARCH_GROUP_STATUS.PENDING;
}

/** Badge đầy đủ (label, cls, color, icon) cho bảng / modal. */
export function getResearchGroupStatusBadge(status) {
  const meta = getResearchGroupStatus(status);
  return {
    label: meta.label,
    cls: meta.cls,
    color: meta.color,
    icon: meta.Icon,
  };
}
