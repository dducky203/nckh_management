import api from "./api";

const userService = {
  // Lấy danh sách users với phân trang
  getAllUsers: async (params = {}) => {
    return await api.get("/dashboard/manage-users/get-all-user", { params });
  },

  getUsers: async (params = {}) => {
    return await api.get("/users", { params });
  },

  // Lấy thông tin user
  getUserById: async (userId) => {
    return await api.get(`/users/${userId}`);
  },

  // Tạo user mới
  createUser: async (userData) => {
    return await api.post("/dashboard/manage-users/create", userData);
  },

  // Cập nhật user
  updateUserByAdmin: async (userData) => {
    return await api.post("/dashboard/manage-users/update", userData);
  },

  // Xóa user
  deleteUser: async (username, force = false) => {
    return await api.delete(
      `/dashboard/manage-users/delete?username=${username}&force=${force}`
    );
  },

  // Đặt lại mật khẩu
  resetPassword: async (username) => {
    return await api.patch(
      `/dashboard/manage-users/reset-password?username=${username}`
    );
  },

  // Lấy profile
  getProfile: async () => {
    return await api.get("/users/profile");
  },

  // Cập nhật profile
  updateProfile: async (data) => {
    return await api.post(`/users/update-profile`, data);
  },

  // Đổi mật khẩu
  changePassword: async (username, data) => {
    return await api.put(`/users/change-password?username=${username}`, data);
  },

  // Xuất danh sách người dùng ra file Excel
  exportUsers: async (userIds) => {
    return await api.post("/dashboard/manage-users/export-excel", userIds, { 
      responseType: "blob" 
    });
  },
};

export default userService;
