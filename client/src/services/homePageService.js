import api from "./api";

const homePageService = {
  getPublished: () => api.get("/api/homepage/public"),
  getDraft: () => api.get("/api/homepage/admin/draft"),
  saveDraft: (configuration) => api.post("/api/homepage/admin/draft", configuration),
  publish: (configuration) => api.post("/api/homepage/admin/publish", configuration),
  restore: () => api.post("/api/homepage/admin/restore"),
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/api/homepage/admin/upload-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export default homePageService;
