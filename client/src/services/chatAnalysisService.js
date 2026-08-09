import api from "./api";

const chatAnalysisService = {
  getUsersWithChatHistory: async (search = "", page = 0, size = 10) => {
    return await api.get("/v1/admin/chat-analysis/users", {
      params: { search, page, size },
    });
  },

  getUserChatHistory: async (userId, page = 0, size = 20) => {
    return await api.get(`/v1/admin/chat-analysis/users/${userId}/history`, {
      params: { page, size },
    });
  },

  analyzeUser: async (userId) => {
    return await api.post(`/v1/admin/chat-analysis/users/${userId}/analyze`);
  },

  analyzeAll: async () => {
    return await api.post("/v1/admin/chat-analysis/analyze-all");
  },
};

export default chatAnalysisService;
