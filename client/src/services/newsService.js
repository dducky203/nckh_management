import api from "./api";

const newsService = {
  // Lấy danh sách tin tức với phân trang và tìm kiếm
  getNews: async (search = "", page = 0, size = 12) => {
    return await api.get("/public/news", {
      params: { search, page, size },
    });
  },

  // Lấy chi tiết tin tức
  getNewsById: async (newsId) => {
    return await api.get(`/public/news/${newsId}`);
  },

  // Comment APIs
  getComments: async (newsId) => {
    return await api.get(`/public/news/${newsId}/comments`);
  },

  createComment: async (newsId, content) => {
    const payload = {
      newsId: newsId,
      content: content,
    };
    console.log("Creating comment with payload:", payload);
    return await api.post(`/public/news/${newsId}/comments`, payload);
  },

  updateComment: async (commentId, content) => {
    const payload = {
      content: content,
    };
    return await api.put(`/public/news/comments/${commentId}`, payload);
  },

  deleteComment: async (commentId) => {
    return await api.delete(`/public/news/comments/${commentId}`);
  },

  // Admin News CRUD APIs
  createNews: async (newsData) => {
    return await api.post("/admin/news", newsData);
  },

  updateNews: async (newsId, newsData) => {
    return await api.put(`/admin/news/${newsId}`, newsData);
  },

  deleteNews: async (newsId) => {
    return await api.delete(`/admin/news/${newsId}`);
  },
};

export default newsService;
