import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
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
  const loadingRef = useRef(false);

  const fetchRooms = useCallback(async (force = false) => {
    if (loadingRef.current) return;
    if (initialized && !force) return;

    loadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const roomsData = await roomService.getPublicRooms();
      setRooms(roomsData || []);
      setInitialized(true);
    } catch (err) {
      setError(err);
      setRooms([]);
      toast?.error(ERROR_MESSAGES.LOAD_ROOM_ERROR);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [initialized, toast]);

  const refreshRooms = useCallback(() => {
    fetchRooms(true);
  }, [fetchRooms]);

  useEffect(() => {
    fetchRooms(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once on mount
  }, []);

  const value = {
    rooms,
    loading,
    error,
    initialized,
    refreshRooms,
    fetchRooms,
  };

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};

export default RoomContext;
