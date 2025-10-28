import { createContext, useState, useEffect } from "react";
import { getUserInfo } from "../utils/cookieUtils";
import authService from "../services/authService";

const AuthContext = createContext();

// Mock user data for demo
// const mockUsers = {
//   admin: {
//     id: 1,
//     name: "Admin User",
//     email: "admin@fita.com",
//     power: 1, // Admin
//     avatar: "/avatars/admin.jpg",
//   },
//   manager: {
//     id: 2,
//     name: "Manager User",
//     email: "manager@fita.com",
//     power: 2, // Manager
//     avatar: "/avatars/manager.jpg",
//   },
//   member: {
//     id: 3,
//     name: "Member User",
//     email: "member@fita.com",
//     power: 3, // Member
//     avatar: "/avatars/member.jpg",
//   },
//   guest: {
//     id: 4,
//     name: "Guest User",
//     email: "guest@fita.com",
//     power: 4, // Guest
//     avatar: "/avatars/guest.jpg",
//   },
// };

// Mock NCM (Nhóm Công Tác Member) data
const mockNcmData = {
  1: {
    // Admin
    id: 1,
    idUser: 1,
    roleOfTeam: 1, // Team Leader
    year: 2024,
  },
  2: {
    // Manager
    id: 2,
    idUser: 2,
    roleOfTeam: 2, // Secretary
    year: 2024,
  },
  3: {
    // Member
    id: 3,
    idUser: 3,
    roleOfTeam: 3, // Member
    year: 2024,
  },
  // Guest không có NCM
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [ncm, setNcm] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const currentYear = new Date().getFullYear();

  // Initialize auth state from cookies
  useEffect(() => {
    const userData = getUserInfo();
    if (userData) {
      setUser(userData);
      if (mockNcmData[userData.id]) {
        setNcm(mockNcmData[userData.id]);
      }
    }
  }, []);

  const login = async (username, password) => {
    setIsLoading(true);
    try {
      // Gọi service để đăng nhập
      const response = await authService.login(username, password);

      if (response && response.userData) {
        // Lưu thông tin người dùng vào state
        setUser(response.userData);

        // Set NCM data if exists
        if (mockNcmData[response.userData.id]) {
          setNcm(mockNcmData[response.userData.id]);
        }

        return { success: true, user: response.userData };
      } else {
        throw new Error("Phản hồi từ server không hợp lệ");
      }
    } catch (error) {
      console.error("Login error:", error);
      
      // ✅ QUAN TRỌNG: Trả về object với success: false
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
    currentYear,
    login,
    logout,
    updateUser,
    isAuthenticated: () => !!user,
    hasPermission: (requiredPower) => {
      if (!user) return false;
      return user.power <= requiredPower;
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };
