import api from "./api";
import {
  setAuthToken,
  setUserInfo,
  removeAuthToken,
  removeUserInfo,
} from "../utils/cookieUtils";

const authService = {
  // Đăng nhập
  login: async (username, password) => {
    try {
      const response = await api.post("/auth/login", { username, password });

      if (response.token) {
        setAuthToken(response.token);
        if (response.userData) {
          setUserInfo(response.userData);
        }
        return response;
      }

      throw new Error("Phản hồi từ server không hợp lệ");
    } catch (error) {
      throw new Error(error.message || "Đăng nhập thất bại");
    }
  },

  // Đăng xuất
  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      removeAuthToken();
      removeUserInfo();
    }
  },

  // Quên mật khẩu
  forgotPassword: async (email) => {
    try {
      return await api.post("/auth/forgot-password", { email });
    } catch (error) {
      throw new Error(error.message || "Không thể gửi yêu cầu");
    }
  },

  // Đặt lại mật khẩu
  resetPassword: async (token, newPassword) => {
    try {
      return await api.post("/auth/reset-password", {
        token,
        newPassword,
      });
    } catch (error) {
      throw new Error(error.message || "Không thể đặt lại mật khẩu");
    }
  },
};

export default authService;
