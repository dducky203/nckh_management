import { useState, useEffect } from "react";
import { getMockEvents } from "../data/mockEvents";

export const useEvents = (activeTab) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const mockEvents = getMockEvents();
      const now = new Date();

      // Filter based on tab
      let filteredByTab = [];
      if (activeTab === "upcoming") {
        filteredByTab = mockEvents.filter((event) => {
          const eventDate = new Date(event.dateOfEvent);
          return eventDate > now;
        });
      } else if (activeTab === "ongoing") {
        filteredByTab = mockEvents.filter((event) => {
          const eventDate = new Date(event.dateOfEvent);
          const endDate = event.endDate ? new Date(event.endDate) : eventDate;
          return eventDate <= now && endDate >= now;
        });
      } else if (activeTab === "completed") {
        filteredByTab = mockEvents.filter((event) => {
          const endDate = event.endDate
            ? new Date(event.endDate)
            : new Date(event.dateOfEvent);
          return endDate < now;
        });
      }

      setEvents(filteredByTab);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError(error.message || "Không thể tải danh sách sự kiện");
    } finally {
      setLoading(false);
    }
  };

  return { events, loading, error, refetchEvents: fetchEvents };
};
