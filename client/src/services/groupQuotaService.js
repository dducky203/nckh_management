import api from "./api";

/** API trả về SuccessResponseDTO { success, message, data } */
function unwrap(res) {
  if (res == null) return null;
  if (res.data !== undefined && (res.success === true || res.success === undefined)) {
    return res.data;
  }
  return res;
}

const groupQuotaService = {
  /** Kiểm tra có thuộc nhóm NCM / Xuất sắc / Tinh hoa không (+ lý do nếu không) */
  getMyMembership: async () => unwrap(await api.get("/research-groups/quota/my-membership")),

  getMembershipByUserId: async (userId) =>
    unwrap(await api.get("/research-groups/quota/membership", { params: { userId } })),

  /** Định mức + tiêu chí của user hiện tại trong nhóm */
  getMyQuota: async () => unwrap(await api.get("/research-groups/quota/my-quota")),

  /** Tính giờ quy đổi từ số lượng nhập */
  calculateMyGroup: async (quantities) =>
    unwrap(
      await api.post("/research-groups/quota/my-calculate", { quantities })
    ),

  /** Thống kê & đánh giá đạt/chưa đạt theo năm */
  getMyGroupStats: async (year) =>
    unwrap(
      await api.get("/research-groups/quota/my-stats", {
        params: year ? { year } : {},
      })
    ),

  /** Ma trận hệ số theo chức danh */
  getCriteriaMatrix: async (groupType) =>
    unwrap(
      await api.get("/research-groups/quota/criteria-matrix", {
        params: groupType ? { groupType } : {},
      })
    ),

  /** Danh sách thành viên + định mức từng người */
  getGroupMembers: async (groupId) =>
    unwrap(
      await api.get("/research-groups/quota/group-members", {
        params: groupId ? { groupId } : {},
      })
    ),
};

export default groupQuotaService;
