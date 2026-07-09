import { useState, useEffect } from "react";
import eventService from "../../../services/eventService";
// import img from "../../../assets/banner.png";

export const useEvents = (activeTab, page = 0, size = 12) => {
  const [events, setEvents] = useState([]);
  const [eventSize, setEventSize] = useState(0);
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
        image: event.bannerImg,
        description: event.description || "",
        contactEmail: event.contactEmail || "contact@vnua.edu.vn",
        contactPhone: event.contactPhone || "0243.827.6346",
        maxParticipants: event.maxParticipants || 100,
        status: event.status,
        startTime: event.startTime, 
        endTime: event.endTime, 
        startTimeDetail: event.startTimeDetail, 
        endTimeDetail: event.endTimeDetail, 
      }));

      setEvents(mappedEvents);
      setEventSize(responseData?.totalItems || 0);
    
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

  
  

  return { eventSize, events, pagination, loading, error, refetchEvents: fetchEvents };
};
