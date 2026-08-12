// Application constants
// Activity Declaration constants
export * from "./activityConstants.js";
export * from "./researchGroupConstants.js";
export * from "./nckhTieuChiConstants.js";

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
  SYSTEM: {
    NETWORK: "Lỗi kết nối mạng. Vui lòng thử lại.",
    SERVER: "Lỗi server. Vui lòng thử lại sau.",
  },
  AUTH: {
    UNAUTHORIZED: "Bạn không có quyền truy cập. Vui lòng đăng nhập lại.",
    LOGIN_REQUIRED: "Vui lòng đăng nhập để tạo nhóm nghiên cứu",
    ACCESS_DENIED: "Bạn không có quyền truy cập trang này",
  },
  EVENT: {
    LOAD_ERROR: "Không thể tải chi tiết sự kiện",
    LOAD_LIST_ERROR: "Không thể tải dữ liệu sự kiện",
    ENDED: "Sự kiện đã kết thúc, không thể đăng ký!",
    SAVE_ERROR: "Có lỗi xảy ra khi lưu sự kiện",
  },
  FILE: {
    TYPE_ERROR: "Chỉ chấp nhận file ảnh (JPG, PNG, GIF)",
    SIZE_ERROR: "Kích thước file không được vượt quá 5MB",
    SIZE_ERROR_LIMIT: "Kích thước ảnh không được vượt quá 5MB",
    SELECT_IMAGE: "Vui lòng chọn file hình ảnh",
    SELECT_FILE: "Vui lòng chọn file",
    NO_DOWNLOAD_LINK: "Không có liên kết tải file",
  },
  HOMEPAGE: {
    LOAD_DRAFT_ERROR: "Lỗi khi lấy cấu hình bản nháp",
    UPLOAD_IMAGE_ERROR: "Lỗi khi tải ảnh minh họa",
  },
  GROUP: {
    SELECT_GROUP: "Vui lòng chọn nhóm nghiên cứu",
    CANNOT_APPROVE_REGISTRATION: "Không thể duyệt đăng ký",
    CANNOT_REJECT_REGISTRATION: "Không thể từ chối đăng ký",
    NOT_FOUND: "Không tìm thấy thông tin nhóm",
  },
  NEWS: {
    LOAD_ERROR: "Không thể tải danh sách tin tức",
  },
  USER: {
    CANNOT_IDENTIFY: "Không xác định được người dùng",
  },
  DATA: {
    NOT_FOUND: "Không tìm thấy dữ liệu.",
    LOAD_ERROR: "Không thể tải dữ liệu",
    LOAD_ROOM_ERROR: "Không thể tải danh sách phòng",
  },
  FORM: {
    REQUIRED: "Trường này là bắt buộc",
    REQUIRED_FIELDS: "Vui lòng điền đầy đủ thông tin bắt buộc",
    VALIDATION_ERROR: "Dữ liệu không hợp lệ.",
    INVALID_DATA_FORMAT: "Định dạng dữ liệu không hợp lệ",
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
  COMMON: {
    DELETE: "Xóa thành công!",
    SAVE: "Lưu thành công!",
    SAVE_CHANGES: "Đã lưu thay đổi.",
  },
  AUTH: {
    LOGIN: "Đăng nhập thành công!",
    REGISTER: "Đăng ký thành công!",
    LOGOUT: "Đăng xuất thành công!",
  },
  USER: {
    UPDATE_PROFILE: "Cập nhật thông tin thành công!",
    CHANGE_PASSWORD: "Đổi mật khẩu thành công!",
    RESET_PASSWORD: "Đặt lại mật khẩu thành công!",
    SEND_EMAIL: "Gửi email thành công!",
  },
  EVENT: {
    CREATED: "Tạo sự kiện thành công! Chờ phê duyệt.",
    UPDATED: "Cập nhật sự kiện thành công!",
    DELETED: "Xóa sự kiện thành công",
    APPROVED: "Duyệt sự kiện thành công!",
    REGISTRATION: "Đăng ký tham gia sự kiện thành công!",
  },
  GROUP: {
    CREATED: "Tạo nhóm thành công! Chờ admin duyệt.",
    APPROVED: "Duyệt nhóm thành công!",
    REJECTED: "Từ chối nhóm thành công!",
    UPDATED: "Cập nhật nhóm thành công!",
    REGISTERED: "Đăng ký nhóm thành công",
    APPROVE_REGISTRATION: "Đã duyệt đăng ký tham gia nhóm",
    REJECT_REGISTRATION: "Đã từ chối đăng ký",
    SEND_REGISTRATION: "Đã gửi đăng ký tham gia nhóm. Chờ trưởng nhóm duyệt.",
    MEMBER_ADDED: "Thêm thành viên thành công!",
    MEMBER_REMOVED: "Xóa thành viên thành công!",
    UPDATE_MEMBER_INFO: "Cập nhật thông tin thành viên thành công",
  },
  FILE: {
    UPLOAD: "Tải lên thành công!",
    ADD_DOCUMENT: "Thêm văn bản thành công",
    IMPORT_EXCEL: "Import thành viên từ Excel thành công",
    DOWNLOAD_TEMPLATE: "Tải file mẫu thành công",
    DOWNLOAD_TEMPLATE_QUOTA: "Đã tải file mẫu.",
    EXPORT_WORD: "Xuất Word thành công",
    EXPORT_EXCEL_STATS: "Đã xuất Excel thống kê phương án",
  },
  HOMEPAGE: {
    SAVE_DRAFT: "Đã lưu bản nháp Home Page thành công!",
    PUBLISH: "Đã xuất bản nội dung lên Trang chủ!",
    RESTORE: "Đã khôi phục phiên bản xuất bản thành công!",
    IMAGE_UPLOAD: "Tải ảnh lên thành công!",
  },
  NEWS: {
    CREATED: "Tạo tin tức mới thành công",
    UPDATED: "Cập nhật tin tức thành công",
    DELETED: "Xóa tin tức thành công",
  },
  DECLARATION: {
    APPROVED: "Đã duyệt khai báo thành công!",
    REJECTED: "Đã từ chối khai báo!",
    DELETED: "Đã xóa khai báo",
  },
  PLAN: {
    LOCKED: "Đã khóa phương án",
  },
  QUOTA: {
    DELETED: "Đã xóa định mức.",
  },
  DATA: {
    IMPORT_ROWS: "Import thành công",
  },
  AI: {
    SAVE_SCAN: "Đã lưu dòng từ AI scan thành công!",
  }
};

export const INFO_MESSAGES = {
  REJECTED_EVENT: "Đã từ chối sự kiện",
  AI_ANALYZING: "Đang gửi dữ liệu cho AI phân tích, vui lòng chờ...",
};

export const WARNING_MESSAGES = {
  AI_NO_VALID_DATA: "AI không tìm thấy dữ liệu định mức hợp lệ trong các file này.",
};

// Confirm dialog messages
export const CONFIRM_MESSAGES = {
  HOMEPAGE_PUBLISH: "Bạn có chắc chắn muốn xuất bản nội dung này ra trang chủ chính?",
  HOMEPAGE_DELETE_SECTION: "Bạn có chắc chắn muốn xóa khu vực này khỏi trang chủ?",
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
