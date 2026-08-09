import api from "./api";

const roomService = {
  getPublicRooms: async () => {
    const response = await api.get("/rooms/public");
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    return [];
  },
};

export default roomService;
