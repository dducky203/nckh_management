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

    // Xử lý các lỗi khác nhau từ backend
    let errorMessage = "Có lỗi xảy ra";

    if (error.response?.data) {
      // Nếu backend trả về string trực tiếp
      if (typeof error.response.data === "string") {
        errorMessage = error.response.data;
      }
      // Nếu backend trả về object với message
      else if (error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      // Nếu backend trả về object với error
      else if (error.response.data.error) {
        errorMessage = error.response.data.error;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    return Promise.reject(new Error(errorMessage));
  }
);

export default api;
