/**
 * Activity Declaration Constants & Helpers
 * Centralized metadata for activity types, statuses, and related utilities
 */

// ─── Activity Types Metadata ───────────────────────────────────────────
export const TYPE_META = {
  SEMINAR: { label: "Seminar", color: "bg-blue-600 text-white" },
  CONFERENCE: { label: "Hội thảo", color: "bg-green-600 text-white" },
  INTL_PAPER: { label: "Bài báo Quốc tế", color: "bg-purple-600 text-white" },
  VN_PAPER: { label: "Bài báo Tiếng Việt", color: "bg-orange-600 text-white" },
  PROCEEDING: {
    label: "Bài tham luận kỷ yếu",
    color: "bg-indigo-600 text-white",
  },
  REVIEW_PAPER: {
    label: "Bài tổng quan lĩnh vực",
    color: "bg-teal-600 text-white",
  },
  TECH_CONSULT: { label: "Tư vấn kỹ thuật", color: "bg-amber-600 text-white" },
  TECH_PROCEDURE: {
    label: "Quy trình kỹ thuật",
    color: "bg-cyan-600 text-white",
  },
  PROPOSAL: { label: "Đề xuất tuyển chọn", color: "bg-pink-600 text-white" },
};

// ─── Status Metadata ──────────────────────────────────────────────────
export const STATUS_META = {
  DRAFT: { label: "Nháp", cls: "bg-gray-100 text-gray-700" },
  SUBMITTED: { label: "Chờ duyệt", cls: "bg-yellow-100 text-yellow-800" },
  APPROVED: { label: "Đã duyệt", cls: "bg-green-100 text-green-800" },
  REJECTED: { label: "Từ chối", cls: "bg-red-100 text-red-800" },
};

// ─── Status Tabs Configuration ────────────────────────────────────────
export const STATUS_TABS = [
  {
    value: "ALL",
    label: "Tất cả",
    icon: null,
    activeText: "text-mainColor",
    activeBorder: "border-mainColor",
    activeBg: "bg-blue-50",
    badgeBg: "bg-mainColor",
  },
  {
    value: "DRAFT",
    label: "Nháp",
    icon: null,
    activeText: "text-gray-700",
    activeBorder: "border-gray-500",
    activeBg: "bg-gray-50",
    badgeBg: "bg-gray-500",
  },
  {
    value: "SUBMITTED",
    label: "Chờ duyệt",
    icon: null,
    activeText: "text-yellow-700",
    activeBorder: "border-yellow-500",
    activeBg: "bg-yellow-50",
    badgeBg: "bg-yellow-500",
  },
  {
    value: "APPROVED",
    label: "Đã duyệt",
    icon: null,
    activeText: "text-green-700",
    activeBorder: "border-green-600",
    activeBg: "bg-green-50",
    badgeBg: "bg-green-600",
  },
  {
    value: "REJECTED",
    label: "Từ chối",
    icon: null,
    activeText: "text-red-600",
    activeBorder: "border-red-500",
    activeBg: "bg-red-50",
    badgeBg: "bg-red-500",
  },
];

// ─── Catalog Code to Activity Type Mapping ────────────────────────────
export const TYPE_BY_CATALOG_CODE = {
  SEMINAR_TRINH_BAY: "SEMINAR",
  SEMINAR_THAM_DU: "SEMINAR",
  HT_THAM_GIA: "CONFERENCE",
  HT_THAM_LUAN: "CONFERENCE",
  HT_TC_HV: "CONFERENCE",
  HT_TC_QUOCGIA: "CONFERENCE",
  HT_TC_QUOCTE: "CONFERENCE",
  BB_WOS_SCOPUS: "INTL_PAPER",
  BB_SCOPUS: "INTL_PAPER",
  BB_TA_HOCVIEN: "INTL_PAPER",
  BB_TV_HOCVIEN: "VN_PAPER",
  BTL_FULL_TEXT: "PROCEEDING",
  TONG_QUAN: "REVIEW_PAPER",
  TU_VAN_BAN_TIN: "TECH_CONSULT",
  DE_XUAT_BO: "PROPOSAL",
};

// ─── Detail Field Label Mapping ────────────────────────────────────────
export const DETAIL_KEY_LABELS = {
  conferenceRole: "Vai trò hội thảo",
  conferenceLevel: "Cấp độ hội thảo",
  intlPaperCategory: "Danh mục bài báo quốc tế",
  vnPaperCategory: "Danh mục bài báo tiếng Việt",
  proceedingLevel: "Cấp độ kỷ yếu",
  proposalLevel: "Cấp độ đề xuất",
  contractNo: "Số hợp đồng",
  contractDate: "Ngày hợp đồng",
  decisionNo: "Số quyết định",
  decisionDate: "Ngày quyết định",
  note: "Ghi chú",
  participantsN: "Số người tham gia",
};

// ─── Detail Value Label Mapping ───────────────────────────────────────
export const DETAIL_VALUE_LABELS = {
  conferenceRole: { ORG: "Tổ chức", PRES: "Trình bày" },
  conferenceLevel: { INTL: "Quốc tế", NAT: "Quốc gia", ACAD: "Học viện" },
  intlPaperCategory: {
    WOS: "WoS",
    SCOPUS: "Scopus",
    ENG_ACAD: "Tiếng Anh Học viện",
    OTHER: "Khác",
    CITATION: "Được trích dẫn",
  },
  vnPaperCategory: { ACADEMY: "Tạp chí Học viện", OTHER: "Tạp chí khác" },
  proceedingLevel: { INTL: "Quốc tế", NAT: "Quốc gia", ACAD: "Học viện" },
  proposalLevel: { NAT: "Quốc gia", MINISTRY: "Cấp Bộ/Tương đương" },
};

// ─── Helper Functions ─────────────────────────────────────────────────

/**
 * Resolve activity type from item (prefer explicit type, fallback to catalog code)
 */
export function resolveActivityType(item) {
  if (item?.activityType) return String(item.activityType).toUpperCase();
  if (!item?.catalogCode) return "";
  return TYPE_BY_CATALOG_CODE[item.catalogCode] || "";
}

/**
 * Check if status allows editing
 */
export function canEdit(status) {
  return status === "DRAFT" || status === "REJECTED";
}

/**
 * Format date value to locale string (DD/MM/YYYY)
 */
export function formatDateValue(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("vi-VN");
}

/**
 * Format date+time value to locale string (DD/MM/YYYY HH:mm)
 */
export function formatDateTimeValue(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Convert camelCase/snake_case keys to readable Vietnamese labels
 */
export function prettifyKey(rawKey) {
  if (!rawKey) return "Thông tin";
  if (DETAIL_KEY_LABELS[rawKey]) return DETAIL_KEY_LABELS[rawKey];

  const normalized = String(rawKey)
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[._-]+/g, " ")
    .trim();

  if (!normalized) return String(rawKey);
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

/**
 * Map detail value keys to readable Vietnamese labels
 * Handles mapped values, booleans, numbers, arrays, objects
 */
export function prettifyDetailValue(key, value) {
  if (value == null || value === "") return "-";

  const mapped = DETAIL_VALUE_LABELS[key]?.[String(value).toUpperCase()];
  if (mapped) return mapped;

  if (typeof value === "boolean") return value ? "Có" : "Không";
  if (typeof value === "number") return Number(value).toLocaleString("vi-VN");
  if (Array.isArray(value)) return value.join(", ") || "-";
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}

/**
 * Parse JSON from details field
 * Returns: { entries: [[key, value], ...], raw: string, isJson: boolean }
 */
export function parseDetailsJson(detailsJson) {
  const raw = String(detailsJson || "").trim();
  if (!raw) {
    return { entries: [], raw: "", isJson: false };
  }

  try {
    const parsed = JSON.parse(raw);

    if (Array.isArray(parsed)) {
      return {
        entries: parsed.map((value, index) => [String(index + 1), value]),
        raw,
        isJson: true,
      };
    }

    if (parsed && typeof parsed === "object") {
      return { entries: Object.entries(parsed), raw, isJson: true };
    }

    return { entries: [["Giá trị", parsed]], raw, isJson: true };
  } catch {
    return { entries: [], raw, isJson: false };
  }
}
