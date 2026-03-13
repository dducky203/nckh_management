import api from "./api";

const nckhTieuChiDinhMucService = {
  getByPlan: async (phuongAn, chucDanh) => {
    return await api.get("/nckh/tieu-chi-dinh-muc", { params: { phuongAn, chucDanh } });
  },
};

export default nckhTieuChiDinhMucService;
