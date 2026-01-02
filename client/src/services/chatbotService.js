import api from "./api";

/**
 * Service xử lý các request liên quan đến Chatbot
 */
const chatbotService = {
  /**
   * Gửi tin nhắn đến chatbot và nhận phản hồi
   * @param {string} message - Nội dung tin nhắn từ người dùng
   * @param {string|null} conversationId - ID của cuộc hội thoại (optional, null nếu là tin nhắn đầu tiên)
   * @returns {Promise<Object>} - Response object chứa { response, conversationId, timestamp }
   */
  sendMessage: async (message, conversationId = null) => {
    try {
      const response = await api.post("/public/chatbot/chat", {
        message,
        conversationId,
      });
      // api.js interceptor đã return response.data rồi
      return response;
    } catch (error) {
      console.error("Error sending message to chatbot:", error);
      throw error;
    }
  },

  /**
   * Xóa lịch sử hội thoại
   * @param {string} conversationId - ID của cuộc hội thoại cần xóa
   * @returns {Promise<void>}
   */
  clearConversation: async (conversationId) => {
    try {
      await api.delete(`/public/chatbot/conversation/${conversationId}`);
    } catch (error) {
      console.error("Error clearing conversation:", error);
      throw error;
    }
  },

  /**
   * Kiểm tra trạng thái hoạt động của chatbot service
   * @returns {Promise<string>} - Thông báo trạng thái
   */
  healthCheck: async () => {
    try {
      const response = await api.get("/public/chatbot/health");
      // api.js interceptor đã return response.data rồi
      return response;
    } catch (error) {
      console.error("Error checking chatbot health:", error);
      throw error;
    }
  },
};

export default chatbotService;
