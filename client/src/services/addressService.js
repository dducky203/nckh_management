import api from "./api";

/** Cache tỉnh để tránh gọi API lặp (AddressSelector + AddressDisplay). */
let provincesCache = null;
let provincesPromise = null;
const wardsCache = new Map();

const unwrapList = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  return [];
};

const addressService = {
  getProvinces: async () => {
    if (provincesCache) return provincesCache;
    if (provincesPromise) return provincesPromise;

    provincesPromise = api
      .get("/address/provinces")
      .then((res) => {
        provincesCache = unwrapList(res);
        return provincesCache;
      })
      .finally(() => {
        provincesPromise = null;
      });

    return provincesPromise;
  },

  getWardsByProvince: async (provinceCode) => {
    if (!provinceCode) return [];

    const key = String(provinceCode);
    if (wardsCache.has(key)) return wardsCache.get(key);

    const res = await api.get(
      `/address/provinces/${encodeURIComponent(provinceCode)}/wards`,
    );
    const wards = unwrapList(res);
    wardsCache.set(key, wards);
    return wards;
  },

  /** Xóa cache khi cần reload danh mục địa chỉ. */
  clearCache: () => {
    provincesCache = null;
    provincesPromise = null;
    wardsCache.clear();
  },
};

export default addressService;
