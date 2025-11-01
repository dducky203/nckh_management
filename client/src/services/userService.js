import api from "./api";

const userService = {
  // Lấy danh sách users với phân trang
  getAllUsers: async (params = {}) => {
    return await api.get("/dashboard/manage-users/get-all-user", { params });
  },

  // Lấy danh sách users (method cũ để tương thích)
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

  // // Cập nhật user
  // updateUser: async (userId, userData) => {
  //   return await api.put(`/users/${userId}`, userData);
  // },

  // Xóa user
  deleteUser: async (userId) => {
    return await api.delete(`/users/${userId}`);
  },

  // Lấy profile
  getProfile: async () => {
    return await api.get("/users/profile");
  },

  // Cập nhật profile
  updateProfile: async (data) => {
    return await api.post("/users/update-profile", data);
  },

  // Đổi mật khẩu
  changePassword: async (data) => {
    return await api.post("/user/change-password", data);
  },
};

export default userService;
