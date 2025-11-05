import axios from "axios";
import { API_BASE_URL } from "../constants";
import {
  getAuthToken,
  removeAuthToken,
  removeUserInfo,
} from "../utils/cookieUtils";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor -  Xử lý lỗi chuẩn
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Xử lý lỗi 401 - Unauthorized
    if (error.response?.status === 401) {
      // Chỉ xóa cookie và redirect nếu KHÔNG phải là request login
      if (!error.config.url?.includes("/auth/login")) {
        removeAuthToken();
        removeUserInfo();
        window.location.href = "/login";
      }
    }

    const errorMessage =
      error.response?.data?.message || error.message || "Có lỗi xảy ra";

    return Promise.reject(new Error(errorMessage));
  }
);

export default api;
