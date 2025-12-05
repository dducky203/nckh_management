import { useRooms } from '../context/RoomContext';

export const useRoomOptions = () => {
  const { rooms, loading, error } = useRooms();

  const getRoomOptions = () => {
    return rooms.map(room => ({
      value: room.id,
      label: room.displayName,
      room: room
    }));
  };

  const getRoomById = (id) => {
    return rooms.find(room => room.id === id);
  };

  const getRoomDisplayName = (id) => {
    const room = getRoomById(id);
    return room ? room.displayName : '';
  };

  return {
    rooms,
    loading,
    error,
    getRoomOptions,
    getRoomById,
    getRoomDisplayName
  };
};