import roomService from "../services/roomService";

let roomsData = [];
let isLoading = false;
let isLoaded = false;

export const fetchRoomsData = async () => {
  if (isLoading || isLoaded) {
    return roomsData;
  }

  try {
    isLoading = true;
    const response = await roomService.getPublicRooms();
    roomsData = response || [];
    isLoaded = true;
    return roomsData;
  } catch {
    roomsData = [];
    return [];
  } finally {
    isLoading = false;
  }
};

export const getRoomsData = async () => {
  if (!isLoaded && !isLoading) {
    await fetchRoomsData();
  }
  return roomsData;
};

export const getRoomsDataSync = () => roomsData;

export const getRoomOptions = () =>
  roomsData.map((room) => ({
    value: room.id,
    label: room.displayName,
    room,
  }));

export const getRoomById = (id) => roomsData.find((room) => room.id === id);

export const getRoomDisplayName = (id) => {
  const room = getRoomById(id);
  return room ? room.displayName : "";
};

export const isRoomsLoaded = () => isLoaded;

export const refreshRoomsData = async () => {
  isLoaded = false;
  isLoading = false;
  return fetchRoomsData();
};

export default {
  fetchRoomsData,
  getRoomsData,
  getRoomsDataSync,
  getRoomOptions,
  getRoomById,
  getRoomDisplayName,
  isRoomsLoaded,
  refreshRoomsData,
};
