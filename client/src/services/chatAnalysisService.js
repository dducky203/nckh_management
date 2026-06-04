import api from "./api";

const chatAnalysisService = {
  /**
   * Lấy danh sách người dùng đã chat với bot (phân trang, tìm kiếm).
   */
  getUsersWithChatHistory: async (search = "", page = 0, size = 10) => {
    return await api.get("/api/v1/admin/chat-analysis/users", {
      params: { search, page, size },
    });
  },

  /**
   * Lấy lịch sử chat của một người dùng cụ thể (phân trang).
   */
  getUserChatHistory: async (userId, page = 0, size = 20) => {
    return await api.get(`/api/v1/admin/chat-analysis/users/${userId}/history`, {
      params: { page, size },
    });
  },

  /**
   * Gọi AI phân tích toàn bộ lịch sử chat của người dùng.
   */
  analyzeUser: async (userId) => {
    return await api.post(`/api/v1/admin/chat-analysis/users/${userId}/analyze`);
  },

  /**
   * Gọi AI phân tích TỔNG QUAN toàn bộ hệ thống - đa số người dùng muốn gì.
   */
  analyzeAll: async () => {
    return await api.post("/api/v1/admin/chat-analysis/analyze-all");
  },
};

export default chatAnalysisService;
