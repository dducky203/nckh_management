// Application constants
// Activity Declaration constants
export * from "./activityConstants.js";

/** Đồng bộ với `Constants.CHAT_ASSISTANT_DISPLAY_NAME` (server). */
export const CHAT_ASSISTANT_DISPLAY_NAME = "Trợ lí NCKH";
/** Đồng bộ với `Constants.CHAT_ASSISTANT_ROLE` (server). */
export const CHAT_ASSISTANT_ROLE = "assistant";

export const API_BASE_URL = import.meta.env.VITE_API_URL;
export const BASE_IMG_URL = `${API_BASE_URL}/file/`;
export const JWT_EXPIRATION_DAYS =
  Number(import.meta.env.VITE_JWT_EXPIRATION_DAYS) || 1;
export const ITEMS_PER_PAGE = 15;

/**
 * Helper để lấy URL hình ảnh
 * Nếu đã là URL Cloudinary thì return luôn
 * Nếu là path cũ (local) thì convert sang API URL
 */
export const getImageUrl = (url) => {
  if (!url) return null;
  
  // Nếu đã là URL đầy đủ (Cloudinary hoặc external), return luôn
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  
  // Nếu là path cũ (local), convert sang API URL
  return `${API_BASE_URL}/file/${url}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return "Không có thông tin";

  try {
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Ngày không hợp lệ";
    }

    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Lỗi định dạng ngày";
  }
};

export const formatDateTime = (dateString) => {
  if (!dateString) return "Không có thông tin";

  try {
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Ngày giờ không hợp lệ";
    }

    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.error("Error formatting datetime:", error);
    return "Lỗi định dạng ngày giờ";
  }
};

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
  },
  USER: {
    PROFILE: "/user/profile",
    AVATAR: "/user/avatar",
    CHANGE_PASSWORD: "/user/change-password",
  },
};

// Local storage keys
export const STORAGE_KEYS = {
  USER: "user",
  TOKEN: "token",
  THEME: "theme",
  PRIMARY_COLOR: "primaryColor",
  LANGUAGE: "language",
};

// Navigation routes
export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  CONTACT: "/contact",
  LOGIN: "/login",
  REGISTER: "/register",
  PROFILE: "/profile",
  SETTINGS: "/settings",
  NOT_FOUND: "/404",
};

// Form validation rules
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  PHONE: /^[0-9]{10,11}$/,
};

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
};

// File upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: {
    IMAGES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    DOCUMENTS: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
  },
};

// Date formats
export const DATE_FORMATS = {
  DISPLAY: "DD/MM/YYYY",
  DISPLAY_WITH_TIME: "DD/MM/YYYY HH:mm",
  API: "YYYY-MM-DD",
  API_WITH_TIME: "YYYY-MM-DDTHH:mm:ss",
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Lỗi kết nối mạng. Vui lòng thử lại.",
  UNAUTHORIZED: "Bạn không có quyền truy cập. Vui lòng đăng nhập lại.",
  SERVER_ERROR: "Lỗi server. Vui lòng thử lại sau.",
  VALIDATION_ERROR: "Dữ liệu không hợp lệ.",
  NOT_FOUND: "Không tìm thấy dữ liệu.",
  LOAD_DATA_ERROR: "Không thể tải dữ liệu",
  LOAD_EVENT_ERROR: "Không thể tải chi tiết sự kiện",
  LOAD_ROOM_ERROR: "Không thể tải danh sách phòng",
  EVENT_ENDED: "Sự kiện đã kết thúc, không thể đăng ký!",
  SAVE_EVENT_ERROR: "Có lỗi xảy ra khi lưu sự kiện",
  FILE_TYPE_ERROR: "Chỉ chấp nhận file ảnh (JPG, PNG, GIF)",
  FILE_SIZE_ERROR: "Kích thước file không được vượt quá 5MB",
  FORM: {
    REQUIRED: "Trường này là bắt buộc",
    EMAIL_INVALID: "Email không hợp lệ",
    PASSWORD_TOO_SHORT: `Mật khẩu phải có ít nhất ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} ký tự`,
    PASSWORDS_NOT_MATCH: "Mật khẩu không khớp",
    NAME_TOO_SHORT: `Tên phải có ít nhất ${VALIDATION_RULES.NAME_MIN_LENGTH} ký tự`,
    PHONE_INVALID: "Số điện thoại không hợp lệ",
    CHECK_INFO: "Vui lòng kiểm tra lại thông tin!",
  },
};

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN: "Đăng nhập thành công!",
  REGISTER: "Đăng ký thành công!",
  LOGOUT: "Đăng xuất thành công!",
  UPDATE_PROFILE: "Cập nhật thông tin thành công!",
  CHANGE_PASSWORD: "Đổi mật khẩu thành công!",
  RESET_PASSWORD: "Đặt lại mật khẩu thành công!",
  SEND_EMAIL: "Gửi email thành công!",
  UPLOAD_SUCCESS: "Tải lên thành công!",
  DELETE_SUCCESS: "Xóa thành công!",
  SAVE_SUCCESS: "Lưu thành công!",
  REGISTRATION_SUCCESS: "Đăng ký tham gia sự kiện thành công!",
  EVENT_APPROVED: "Duyệt sự kiện thành công!",
  EVENT_CREATED: "Tạo sự kiện thành công! Chờ phê duyệt.",
  EVENT_UPDATED: "Cập nhật sự kiện thành công!",
  GROUP_CREATED: "Tạo nhóm thành công! Chờ admin duyệt.",
  GROUP_APPROVED: "Duyệt nhóm thành công!",
  GROUP_REJECTED: "Từ chối nhóm thành công!",
  GROUP_UPDATED: "Cập nhật nhóm thành công!",
  MEMBER_ADDED: "Thêm thành viên thành công!",
  MEMBER_REMOVED: "Xóa thành viên thành công!",
};

export default {
  API_ENDPOINTS,
  STORAGE_KEYS,
  ROUTES,
  VALIDATION_RULES,
  HTTP_STATUS,
  PAGINATION,
  DATE_FORMATS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  API_BASE_URL,
};
