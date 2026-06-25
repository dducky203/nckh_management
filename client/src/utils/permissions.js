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

/** Trợ lí NCKH (assistant) hoặc idRole = 3. */
export const isAssistantRole = (user) =>
  !!user &&
  (normalizeRoleName(user.role) === "assistant" || Number(user.idRole) === 3);

/** Xem thống kê định mức nhóm (admin / trợ lí NCKH / trưởng nhóm GV). */
export const canViewAdminGroupQuotaStats = (user) =>
  hasNckhStaffAccess(user) || canAccessQuotaPages(user);

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

/** Trưởng nhóm / thư ký nhóm (role trong nhóm) hoặc cán bộ NCKH — tạo seminar/hội thảo. */
export const canCreateSeminarEvent = (permissions) =>
  !!permissions?.canCreateSeminar;

export const isGroupLeader = (user, group) => {
  if (!user || !group) return false;
  const leaderId = group.leaderId ?? group.leader?.id;
  return leaderId != null && Number(leaderId) === Number(user.id);
};

export const canEditGroup = (user, group) => {
  return isAdmin(user) || isGroupLeader(user, group);
};

export const canViewAllGroups = (user) => hasNckhStaffAccess(user);

/** Sinh viên: power = 4 hoặc chức danh "Sinh viên" (đồng bộ backend). */
export const isStudent = (user) => {
  if (!user) return false;
  if (user.power != null && Number(user.power) === 4) return true;
  if (user.title && String(user.title).trim().toLowerCase() === "sinh viên") {
    return true;
  }
  return false;
};

/** Định mức cá nhân (/activity/standards) và định mức nhóm (/activity/group-quota). */
export const canAccessQuotaPages = (user) => !!user && !isStudent(user);
