import Cookies from "js-cookie";

// Thời gian hết hạn mặc định (7 ngày)
const DEFAULT_EXPIRATION = 7;

/**
 * Lưu token vào cookie với các tùy chọn bảo mật
 * @param {string} token - Token cần lưu
 * @param {number} expiration - Số ngày trước khi hết hạn
 */
export const setAuthToken = (token, expiration = DEFAULT_EXPIRATION) => {
  Cookies.set("auth_token", token, {
    expires: expiration,
    secure: window.location.protocol === "https:",
    sameSite: "strict",
    path: "/",
  });
};

/**
 * Lấy token xác thực từ cookie
 * @returns {string|undefined} Token xác thực hoặc undefined nếu không có
 */
export const getAuthToken = () => {
  return Cookies.get("auth_token");
};

/**
 * Xóa token xác thực khỏi cookie
 */
export const removeAuthToken = () => {
  Cookies.remove("auth_token", { path: "/" });
};

/**
 * Lưu thông tin người dùng vào cookie
 * @param {Object} user - Thông tin người dùng
 * @param {number} expiration - Số ngày trước khi hết hạn
 */
export const setUserInfo = (user, expiration = DEFAULT_EXPIRATION) => {
  Cookies.set("user_info", JSON.stringify(user), {
    expires: expiration,
    secure: window.location.protocol === "https:",
    sameSite: "strict",
    path: "/",
  });
};

/**
 * Lấy thông tin người dùng từ cookie
 * @returns {Object|null} Thông tin người dùng hoặc null nếu không có
 */
export const getUserInfo = () => {
  const userInfo = Cookies.get("user_info");
  return userInfo ? JSON.parse(userInfo) : null;
};

/**
 * Xóa thông tin người dùng khỏi cookie
 */
export const removeUserInfo = () => {
  Cookies.remove("user_info", { path: "/" });
};

/**
 * Kiểm tra xem người dùng đã đăng nhập hay chưa
 * @returns {boolean} True nếu đã đăng nhập, ngược lại là false
 */
export const isAuthenticated = () => {
  return !!getAuthToken();
};

/**
 * Đăng xuất người dùng bằng cách xóa tất cả cookie liên quan đến xác thực
 */
export const logout = () => {
  removeAuthToken();
  removeUserInfo();
};
