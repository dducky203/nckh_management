import api from "./api";

const eventService = {
  // Lấy danh sách events
  getEvents: async (params = {}) => {
    return await api.get("/events", { params });
  },

  // Lấy chi tiết event
  getEventById: async (eventId) => {
    return await api.get(`/api/public/events/${eventId}`);
  },

  // Tạo event mới (đăng ký tổ chức sự kiện) - Kết hợp upload banner
  createEvent: async (eventData) => {
    return await api.post("/api/public/events/create", eventData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Cập nhật event
  updateEvent: async (eventId, eventData) => {
    return await api.put(`/events/${eventId}`, eventData);
  },

  // Xóa event
  deleteEvent: async (eventId) => {
    return await api.delete(`/api/public/events/${eventId}`);
  },

  // Phê duyệt event
  approveEvent: async (eventId) => {
    return await api.post(`/api/public/events/${eventId}/approve`);
  },

  // Từ chối event
  rejectEvent: async (eventId, reason) => {
    return await api.post(`/api/public/events/${eventId}/reject`, { reason });
  },

  // === PUBLIC EVENT APIs ===
  // Lấy danh sách sự kiện công khai theo trạng thái (có phân trang)
  getPublicEvents: async (status = "upcoming", page = 0, size = 12) => {
    return await api.get(`/api/public/events`, {
      params: { status, page, size },
    });
  },

  // Lấy chi tiết sự kiện công khai
  getPublicEventById: async (eventId) => {
    return await api.get(`/api/public/events/${eventId}`);
  },

  // Tìm kiếm và lọc sự kiện công khai
  searchPublicEvents: async (status, type, searchTerm) => {
    return await api.get(`/api/public/events/search`, {
      params: {
        status: status || "upcoming",
        type: type || "all",
        search: searchTerm || "",
      },
    });
  },

  // Đếm số lượng sự kiện
  countPublicEvents: async (status = "all") => {
    return await api.get(`/api/public/events/count`, { params: { status } });
  },

  // Đăng ký tham gia sự kiện
  registerForEvent: async (eventId, userId, formData) => {
    return await api.post(
      `/api/public/events/${eventId}/register?userId=${userId}`,
      formData
    );
  },

  // Kiểm tra đã đăng ký chưa
  checkRegistration: async (eventId, userId) => {
    return await api.get(`/api/public/events/${eventId}/is-registered`, {
      params: { userId },
    });
  },

  // Hủy đăng ký
  unregisterEvent: async (eventId, userId) => {
    return await api.delete(`/api/public/events/${eventId}/register`, {
      params: { userId },
    });
  },
};

export default eventService;
