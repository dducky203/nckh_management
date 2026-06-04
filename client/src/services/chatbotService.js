import api from "./api";

const chatbotService = {
  sendMessage: async (message, conversationId = null) => {
    try {
      const response = await api.post("/chatbot/chat", {
        message,
        conversationId,
      });
      return response;
    } catch (error) {
      console.error("Error sending message to chatbot:", error);
      throw error;
    }
  },

  clearConversation: async (conversationId) => {
    try {
      await api.delete(`/chatbot/conversation/${conversationId}`);
    } catch (error) {
      console.error("Error clearing conversation:", error);
      throw error;
    }
  },

  healthCheck: async () => {
    try {
      const response = await api.get("/chatbot/health");
      return response;
    } catch (error) {
      console.error("Error checking chatbot health:", error);
      throw error;
    }
  },
};

export default chatbotService;
