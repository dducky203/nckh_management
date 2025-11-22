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

  // Tạo event mới
  createEvent: async (eventData) => {
    return await api.post("/events", eventData);
  },

  // Cập nhật event
  updateEvent: async (eventId, eventData) => {
    return await api.put(`/events/${eventId}`, eventData);
  },

  // Xóa event
  deleteEvent: async (eventId) => {
    return await api.delete(`/events/${eventId}`);
  },

  // Phê duyệt event
  approveEvent: async (eventId) => {
    return await api.post(`/events/${eventId}/approve`);
  },

  // Từ chối event
  rejectEvent: async (eventId, reason) => {
    return await api.post(`/events/${eventId}/reject`, { reason });
  },
};

export default eventService;