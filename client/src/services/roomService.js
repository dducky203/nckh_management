import api from './api';

const roomService = {
  // Lấy danh sách rooms cho public
  getPublicRooms: async () => {
    try {
      console.log('roomService.getPublicRooms called');
      const response = await api.get('/api/rooms/public');
      console.log('roomService.getPublicRooms response:', response);
      return response.data;
    } catch (error) {
      console.error('Error fetching rooms:', error);
      throw error;
    }
  }
};

export default roomService;