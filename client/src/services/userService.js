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

  // Cập nhật profile với avatar
  updateProfile: async (data, avatarFile = null) => {
    const formData = new FormData();
    
    // Thêm các trường thông tin
    formData.append('username', data.username);
    if (data.name) formData.append('name', data.name);
    if (data.email) formData.append('email', data.email);
    if (data.title) formData.append('title', data.title);
    if (data.phone) formData.append('phone', data.phone);
    if (data.address) formData.append('address', data.address);
    if (data.birthday) formData.append('birthday', data.birthday);
    
    // Thêm file avatar nếu có
    if (avatarFile) {
      formData.append('file', avatarFile);
    }
    
    return await api.post('/users/update-profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },


  // Đổi mật khẩu
  changePassword: async (username, data) => {
    return await api.put(`/users/change-password?username=${username}`, data);
  },

  // Xuất danh sách người dùng ra file Excel
  exportUsers: async (userIds) => {
    return await api.post("/dashboard/manage-users/export-excel", userIds, {
      responseType: "blob",
    });
  },

  /** Danh sách role hệ thống (admin, user, assistant, …) cho form quản lý user. */
  getRoles: async () => {
    return await api.get("/dashboard/manage-users/roles");
  },

  // Tìm kiếm users theo username hoặc email
  searchUsers: async (keyword,type = 'ALL', page = 0, size = 10) => {
    return await api.get("/users/search", {
      params: { keyword, type, page, size },
    });
  },
};

export default userService;
