import api from "./api";

const addressService = {
  getProvinces: async () => {
    return await api.get("/address/provinces");
  },

  getWardsByProvince: async (provinceCode) => {
    if (!provinceCode) return [];
    return await api.get(`/address/provinces/${encodeURIComponent(provinceCode)}/wards`);
  },
};

export default addressService;
