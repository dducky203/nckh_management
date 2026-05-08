import api from "./api";

const eventService = {
  // Lấy danh sách events
  getEvents: async (params = {}) => {
    return await api.get("/events", { params });
  },

  // Lấy chi tiết event
  getEventById: async (eventId) => {
    return await api.get(`/events/${eventId}`);
  },

  // Tạo event mới (đăng ký tổ chức sự kiện) - Kết hợp upload banner
  createEvent: async (eventData) => {
    return await api.post("/events/create", eventData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Cập nhật event
  updateEvent: async (eventId, eventData) => {
    return await api.put(`/events/${eventId}`, eventData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Xóa event
  deleteEvent: async (eventId) => {
    return await api.delete(`/events/delete/${eventId}`);
  },

  // Phê duyệt ,Từ chối event
  updateEventStatus: async (eventId, status, reason = "") => {
    return await api.post(
      `/events/${eventId}?status=${status}`,
      { reason }, // Body
    );
  },

  // === PUBLIC EVENT APIs ===
  // Lấy danh sách sự kiện công khai theo trạng thái 
  getPublicEvents: async (status = "upcoming", page = 0, size = 12) => {
    return await api.get(`/events`, {
      params: { status, page, size },
    });
  },

  // Lấy chi tiết sự kiện công khai
  getPublicEventById: async (eventId) => {
    return await api.get(`/events/${eventId}`);
  },

  // Tìm kiếm và lọc sự kiện công khai
  searchPublicEvents: async (status, type, searchTerm) => {
    return await api.get(`/events/search`, {
      params: {
        status: status || "upcoming",
        type: type || "all",
        search: searchTerm || "",
      },
    });
  },

  // Đếm số lượng sự kiện
  countPublicEvents: async (status = "all") => {
    return await api.get(`/events/count`, { params: { status } });
  },

  // Đăng ký tham gia sự kiện
  registerForEvent: async (eventId, userId, formData) => {
    return await api.post(
      `/events/${eventId}/register?userId=${userId}`,
      formData,
    );
  },

  // Kiểm tra đã đăng ký chưa
  checkRegistration: async (eventId, userId) => {
    return await api.get(`/events/${eventId}/is-registered`, {
      params: { userId },
    });
  },

  // Hủy đăng ký
  unregisterEvent: async (eventId, userId) => {
    return await api.delete(`/events/${eventId}/register`, {
      params: { userId },
    });
  },

  // Lấy danh sách đăng ký của sự kiện (chỉ creator/admin)
  getEventRegistrations: async (eventId, userId) => {
    return await api.get(`/events/${eventId}/registrations`, {
      params: { userId },
    });
  },

  // Lấy danh sách loại sự kiện
  getEventTypes: async () => {
    return await api.get("/events/get-types");
  },
};

export default eventService;
