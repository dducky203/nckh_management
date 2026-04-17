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
};

export default nckhTieuChiDinhMucService;
