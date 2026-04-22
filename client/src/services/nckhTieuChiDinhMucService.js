import api from "./api";

const nckhTieuChiDinhMucService = {
  getByPlan: async (phuongAn, chucDanh, year = null) => {
    return await api.get("/nckh/tieu-chi-dinh-muc", { params: { phuongAn, chucDanh, year } });
  },

  getAll: async (phuongAn = null, chucDanh = null, year = null) => {
    return await api.get("/nckh/tieu-chi-dinh-muc", {
      params: { phuongAn, chucDanh, year },
    });
  },

  downloadImportTemplate: async ({ phuongAn = null, chucDanh = null, year = null } = {}) => {
    return await api.get("/nckh/tieu-chi-dinh-muc/export-template", {
      params: { phuongAn, chucDanh, year },
      responseType: "blob",
    });
  },

  importFromExcel: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return await api.post("/nckh/tieu-chi-dinh-muc/import", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      responseType: "blob",
    });
  },
};

export default nckhTieuChiDinhMucService;
