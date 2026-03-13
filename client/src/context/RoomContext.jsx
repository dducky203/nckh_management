import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import roomService from "../services/roomService";
import { useToast } from "./ToastContext";
import { ERROR_MESSAGES } from "../constants";

const RoomContext = createContext();

export const useRooms = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error("useRooms must be used within RoomProvider");
  }
  return context;
};

export const RoomProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const toast = useToast();

  const fetchRooms = useCallback(async () => {
    if (loading || initialized) {
      console.log("fetchRooms skipped:", { loading, initialized });
      return;
    }

    console.log("fetchRooms starting...");
    try {
      setLoading(true);
      setError(null);
      const roomsData = await roomService.getPublicRooms();
      console.log("fetchRooms API response:", roomsData);
      console.log("Setting rooms to:", roomsData || []);
      setRooms(roomsData || []);
      setInitialized(true);
      console.log("fetchRooms completed - initialized set to true");
    } catch (error) {
      console.error("Error fetching rooms:", error);
      setError(error);
      setRooms([]);
      if (toast) {
        toast.error(ERROR_MESSAGES.LOAD_ROOM_ERROR);
      }
    } finally {
      setLoading(false);
      console.log("fetchRooms finally - loading set to false");
    }
  }, []); // Empty deps để tránh infinite loop

  const refreshRooms = useCallback(() => {
    setInitialized(false);
    setLoading(false);
    setTimeout(fetchRooms, 100); // Delay to ensure state update
  }, [fetchRooms]);

  useEffect(() => {
    console.log("RoomProvider useEffect triggered");
    if (!initialized && !loading) {
      fetchRooms();
    }
  }, []); // Chỉ run 1 lần khi mount

  // Track rooms state changes
  useEffect(() => {
    console.log("Rooms state changed:", {
      roomsLength: rooms.length,
      rooms: rooms,
      loading,
      initialized,
    });
  }, [rooms, loading, initialized]);

  const value = {
    rooms,
    loading,
    error,
    initialized,
    refreshRooms,
    fetchRooms,
  };

  console.log("RoomProvider value:", value);

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};

export default RoomContext;
