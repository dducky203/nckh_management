import { DATE_FORMATS } from "../constants";


export const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0]; 
    } catch {
      return "";
    }
  };

export const targetDate = (dateString) => new Date(Date.now() + dateString * 24 * 60 * 60 * 1000);

export const formatDate = (date, format = DATE_FORMATS.DISPLAY) => {
  if (!date) return "";

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return "";

  const day = dateObj.getDate().toString().padStart(2, "0");
  const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
  const year = dateObj.getFullYear();
  const hours = dateObj.getHours().toString().padStart(2, "0");
  const minutes = dateObj.getMinutes().toString().padStart(2, "0");
  const seconds = dateObj.getSeconds().toString().padStart(2, "0");

  switch (format) {
    case DATE_FORMATS.DISPLAY:
      return `${day}/${month}/${year}`;
    case DATE_FORMATS.DISPLAY_WITH_TIME:
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    case DATE_FORMATS.API:
      return `${year}-${month}-${day}`;
    case DATE_FORMATS.API_WITH_TIME:
      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    default:
      return dateObj.toLocaleDateString("vi-VN");
  }
};

// Get relative time (e.g., "2 hours ago")
export const getRelativeTime = (date) => {
  if (!date) return "";

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return "";

  const now = new Date();
  const diffInSeconds = Math.floor((now - dateObj) / 1000);

  if (diffInSeconds < 60) {
    return "Vừa xong";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} giờ trước`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} ngày trước`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} tháng trước`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} năm trước`;
};

// Check if date is today
export const isToday = (date) => {
  if (!date) return false;

  const dateObj = new Date(date);
  const today = new Date();

  return dateObj.toDateString() === today.toDateString();
};

// Check if date is this week
export const isThisWeek = (date) => {
  if (!date) return false;

  const dateObj = new Date(date);
  const today = new Date();
  const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  return dateObj >= oneWeekAgo && dateObj <= today;
};

// Get start of day
export const getStartOfDay = (date = new Date()) => {
  const dateObj = new Date(date);
  dateObj.setHours(0, 0, 0, 0);
  return dateObj;
};

// Get end of day
export const getEndOfDay = (date = new Date()) => {
  const dateObj = new Date(date);
  dateObj.setHours(23, 59, 59, 999);
  return dateObj;
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

export const getSemesterFromDate = (dateString) => {
  if (!dateString) return "Không có thông tin";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Ngày không hợp lệ";
    
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 1-12
    
    // Học kỳ 1: Tháng 8 -> Tháng 1 năm sau
    // Học kỳ 2: Tháng 2 -> Tháng 7 năm đó
    if (month >= 8) {
      return `Học kỳ 1 / ${year}-${year + 1}`;
    } else if (month === 1) {
      return `Học kỳ 1 / ${year - 1}-${year}`;
    } else {
      return `Học kỳ 2 / ${year - 1}-${year}`;
    }
  } catch (error) {
    return "Lỗi định dạng";
  }
};
