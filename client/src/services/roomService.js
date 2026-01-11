import api from "./api";

const roomService = {
  // Lấy danh sách rooms cho public
  getPublicRooms: async () => {
      try {
     
      const data = await api.get("/api/rooms/public");
    
      return data;
    } catch (error) {
      console.error("Error fetching rooms:", error);
      throw error;
    }
  },
};

export default roomService;
