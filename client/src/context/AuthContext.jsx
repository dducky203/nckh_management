import { createContext, useState, useEffect } from "react";
import { getUserInfo, getAuthToken } from "../utils/cookieUtils";
import authService from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [ncm, setNcm] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true); // Thêm state này
  const currentYear = new Date().getFullYear();

  // Initialize auth state from cookies
  useEffect(() => {
    const token = getAuthToken();
    const userInfo = getUserInfo();

    if (token && userInfo) {
      setIsLoggedIn(true);
      setUser(userInfo);
    }
    
    setIsInitializing(false); // Đánh dấu đã khởi tạo xong
  }, []);

  const login = async (username, password) => {
    setIsLoading(true);

    try {
      const response = await authService.login(username, password);

      if (response && response.userData) {
        setUser(response.userData);
        setIsLoggedIn(true);
        return { success: true };
      } else {
        throw new Error("Phản hồi từ server không hợp lệ");
      }
    } catch (error) {
      console.error("Login error:", error);

      return {
        success: false,
        error: error.message || "Tài khoản hoặc mật khẩu không chính xác",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setNcm(null);
      setIsLoggedIn(false);
    }
  };

  const updateUser = (updatedData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...updatedData,
    }));
  };

  const value = {
    user,
    ncm,
    isLoading,
    isInitializing, // Thêm vào context
    currentYear,
    login,
    logout,
    updateUser,
    isAuthenticated: () => !!user,
    hasPermission: (requiredPower) => {
      if (!user) return false;
      return user.role <= requiredPower;
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };