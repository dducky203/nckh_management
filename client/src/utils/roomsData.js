import roomService from "../services/roomService";

// Global rooms data
let roomsData = [];
let isLoading = false;
let isLoaded = false;

// Fetch rooms from API and store in memory
export const fetchRoomsData = async () => {
  if (isLoading || isLoaded) {
    return roomsData;
  }

  try {
    isLoading = true;
    console.log("Fetching rooms data...");
    const response = await roomService.getPublicRooms();
    roomsData = response || [];
    isLoaded = true;
    console.log("Rooms data loaded:", roomsData);
    return roomsData;
  } catch (error) {
    console.error("Error fetching rooms data:", error);
    roomsData = [];
    return [];
  } finally {
    isLoading = false;
  }
};

// Get rooms data (fetch if not loaded)
export const getRoomsData = async () => {
  if (!isLoaded && !isLoading) {
    await fetchRoomsData();
  }
  return roomsData;
};

// Get rooms synchronously (only if already loaded)
export const getRoomsDataSync = () => {
  return roomsData;
};

// Get room options for dropdown
export const getRoomOptions = () => {
  return roomsData.map((room) => ({
    value: room.id,
    label: room.displayName,
    room: room,
  }));
};

// Get room by ID
export const getRoomById = (id) => {
  return roomsData.find((room) => room.id === id);
};

// Get room display name
export const getRoomDisplayName = (id) => {
  const room = getRoomById(id);
  return room ? room.displayName : "";
};

// Check if rooms are loaded
export const isRoomsLoaded = () => isLoaded;

// Force refresh rooms data
export const refreshRoomsData = async () => {
  isLoaded = false;
  isLoading = false;
  return await fetchRoomsData();
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
