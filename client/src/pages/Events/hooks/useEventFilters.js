import { useState, useEffect } from "react";

export const useEventFilters = (events) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    let filtered = [...events];

    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (event) =>
          event.eventName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.organizer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  }, [searchTerm, events]);

  return {
    searchTerm,
    setSearchTerm,
    filteredEvents,
  };
};
