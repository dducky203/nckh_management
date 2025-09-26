import { authAPI, userAPI } from "./apiService";
import {
  setAuthToken,
  removeAuthToken,
  setUserInfo,
  removeUserInfo,
} from "../utils/cookieUtils";

// Service xử lý authentication
const authService = {
  // Đăng nhập
  login: async (username, password) => {
    try {
      const response = await authAPI.login({ username, password });

      // Xử lý cấu trúc phản hồi từ backend: { userData: {...}, token: "..." }
      if (response && response.token) {
        // Lưu token vào cookie
        setAuthToken(response.token);

        // Lưu thông tin người dùng vào cookie
        if (response.userData) {
          setUserInfo(response.userData);
        }

        return response;
      } else {
        throw new Error("Phản hồi từ server không hợp lệ");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw new Error(error.message || "Đăng nhập thất bại");
    }
  },

  // Đăng xuất
  logout: async () => {
    try {
      // Gọi API đăng xuất
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Xóa token và thông tin người dùng khỏi cookie bất kể API có thành công hay không
      removeAuthToken();
      removeUserInfo();
    }
  },

  // Lấy thông tin người dùng hiện tại
  getCurrentUser: async () => {
    try {
      const response = await userAPI.getProfile();
      return response;
    } catch (error) {
      console.error("Get current user error:", error);
      throw error;
    }
  },

  // Quên mật khẩu
  forgotPassword: async (email) => {
    try {
      const response = await authAPI.forgotPassword(email);
      return response;
    } catch (error) {
      console.error("Forgot password error:", error);
      throw new Error(
        error.message || "Không thể gửi yêu cầu đặt lại mật khẩu"
      );
    }
  },

  // Đặt lại mật khẩu
  resetPassword: async (token, newPassword) => {
    try {
      const response = await authAPI.resetPassword({ token, newPassword });
      return response;
    } catch (error) {
      console.error("Reset password error:", error);
      throw new Error(error.message || "Không thể đặt lại mật khẩu");
    }
  },
};

export default authService;
