export const normalizeRoleName = (role) =>
  (role == null ? "" : String(role)).trim().toLowerCase();

/**
 * Admin theo nghiệp vụ: role admin HOẶC chức danh lãnh đạo/Thư ký (đồng bộ backend SecurityUtils.isAdmin).
 */
export const isAdmin = (user) => {
  if (!user) return false;

  if (normalizeRoleName(user.role) === "admin") return true;

  const adminTitles = ["Thư ký", "Trưởng khoa", "Phó khoa"];
  if (user.title && adminTitles.includes(user.title)) {
    return true;
  }

  return false;
};

/** Role hệ thống Trợ lí NCKH — cao hơn user thường, chỉ sau admin. */
export const isAssistantRole = (user) =>
  !!user && normalizeRoleName(user.role) === "assistant";

/** Truy cập các màn vận hành NCKH (duyệt, định mức năm, thống kê PA, tạo SK admin…). */
export const hasNckhStaffAccess = (user) =>
  isAdmin(user) || isAssistantRole(user);

/**
 * Chỉ quản trị viên "đầy đủ": admin/lãnh đạo nhưng không phải riêng role assistant.
 * Dùng cho /user/manager (quản lý tài khoản).
 */
export const isStrictAdminPortalUser = (user) =>
  isAdmin(user) && !isAssistantRole(user);

export const isLeadership = (user) => {
  if (!user) return false;
  const leadershipTitles = ["Trưởng khoa", "Phó khoa"];
  return user.title && leadershipTitles.includes(user.title);
};

export const isGroupLeader = (user, group) => {
  if (!user || !group) return false;
  return group.leaderId === user.id;
};

export const canEditGroup = (user, group) => {
  return isAdmin(user) || isGroupLeader(user, group);
};

export const canViewAllGroups = (user) => {
  return isAdmin(user);
};
