import { GROUP_TYPE_CONFIG } from "./constants";

export function round2(x) {
  return Math.round((x ?? 0) * 100) / 100;
}

export function getTypeConfig(type) {
  if (!type) return null;
  const up = type.toUpperCase();
  if (up.includes("TINH_HOA")) return GROUP_TYPE_CONFIG.TINH_HOA;
  if (up.includes("XUAT_SAC")) return GROUP_TYPE_CONFIG.XUAT_SAC;
  if (up.includes("NCM")) return GROUP_TYPE_CONFIG.NCM;
  return null;
}

export function resolveTypeKey(type) {
  const up = (type ?? "").toUpperCase();
  if (up.includes("TINH_HOA")) return "TINH_HOA";
  if (up.includes("XUAT_SAC")) return "XUAT_SAC";
  if (up.includes("NCM")) return "NCM";
  return null;
}

export function mapChucDanhToKey(chucDanh) {
  if (!chucDanh) return "KS_CN";
  const up = chucDanh.toUpperCase().replace(/\s/g, "");
  if (up.includes("GS") || up.includes("PGS")) return "GS_PGS";
  if (up.includes("TS") || up.includes("TIẾNSĨ")) return "TS";
  if (up.includes("THS") || up.includes("THẠCSĨ")) return "THS";
  return "KS_CN";
}

/** Phương án định mức: NCM / XUAT_SAC / TINH_HOA (trường groupType). */
export function isQuotaGroupType(groupType) {
  return !!resolveTypeKey(groupType);
}

/** Nhóm GV đã cấu hình phương án định mức. */
export function isQuotaGroup(group) {
  if (!group) return false;
  if ((group.type ?? "").toLowerCase() !== "lecturer") return false;
  return isQuotaGroupType(group.groupType);
}
