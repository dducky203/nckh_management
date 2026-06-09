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

  /**
   * Quét nhiều ảnh/PDF bằng Gemini AI → trả về mảng dòng định mức để preview.
   * @param {File[]} files
   */
  aiScan: async (files, year = null) => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }
    const params = year ? { year } : {};
    const res = await api.post("/nckh/tieu-chi-dinh-muc/ai-scan", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      params,
      timeout: 300000,
    });
    return res?.data ?? res ?? [];
  },

  /**
   * Lưu hàng loạt sau khi đã preview/chỉnh sửa.
   * @param {Array} rows
   */
  batchSave: async (rows) => {
    const res = await api.post("/nckh/tieu-chi-dinh-muc/batch-save", rows);
    return res?.data ?? res;
  },

  /**
   * Cập nhật một tiêu chí định mức theo ID.
   * @param {number} id
   * @param {object} data
   */
  update: async (id, data) => {
    const res = await api.put(`/nckh/tieu-chi-dinh-muc/${id}`, data);
    return res?.data ?? res;
  },

  /**
   * Xóa một tiêu chí định mức.
   * @param {number} id
   */
  delete: async (id) => {
    const res = await api.delete(`/nckh/tieu-chi-dinh-muc/${id}`);
    return res?.data ?? res;
  },
};


export default nckhTieuChiDinhMucService;
