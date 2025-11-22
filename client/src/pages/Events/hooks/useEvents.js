import { useState, useEffect } from "react";
import eventService from "../../../services/eventService";
// import img from "../../../assets/banner.png";

export const useEvents = (activeTab, page = 0, size = 12) => {
  const [events, setEvents] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 12,
    hasNext: false,
    hasPrevious: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, page]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await eventService.getPublicEvents(
        activeTab,
        page,
        size
      );
      const responseData = response?.data || {};
      const eventsData = responseData.events || [];

      // Map backend data to frontend format
      const mappedEvents = eventsData.map((event) => ({
        id: event.id,
        eventName: event.eventName,
        dateOfEvent: event.dateOfEvent,
        endDate: event.dateOfEvent,
        location: event.location || "",
        organizer: event.organizer || "",
        type: event.type || "other",
        image: event.bannerImg ,
        description: event.description || "",
        contactEmail: event.contactEmail || "contact@vnua.edu.vn",
        contactPhone: event.contactPhone || "0243.827.6346",
        maxParticipants: event.maxParticipants || 100,
        status: event.status,
        startTime: event.startTime, // Tiết bắt đầu (1-10)
        endTime: event.endTime, // Tiết kết thúc (1-10)
        startTimeDetail: event.startTimeDetail, // Giờ chi tiết (VD: "07:00:00")
        endTimeDetail: event.endTimeDetail, // Giờ chi tiết (VD: "11:00:00")
        articleLink: event.articleLink,
      }));

      setEvents(mappedEvents);

      console.log({responseData});
      // Set pagination info từ backend
      setPagination({
        currentPage: responseData.currentPage || 0,
        totalPages: responseData.totalPages || 0,
        totalItems: responseData.totalItems || 0,
        itemsPerPage: responseData.itemsPerPage || 12,
        hasNext: responseData.hasNext || false,
        hasPrevious: responseData.hasPrevious || false,
      });
    } catch (error) {
      console.error("Error fetching events:", error);
      setError(error.message || "Không thể tải danh sách sự kiện");
    } finally {
      setLoading(false);
    }
  };

  
  

  return { events, pagination, loading, error, refetchEvents: fetchEvents };
};
