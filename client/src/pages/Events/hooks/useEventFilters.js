import { useState, useEffect } from "react";

export const useEventFilters = (events) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    let filtered = [...events];

    // Search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (event) =>
          event.eventName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.organizer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (filterType !== "all") {
      filtered = filtered.filter((event) => event.type === filterType);
    }

    setFilteredEvents(filtered);
  }, [searchTerm, filterType, events]);

  return {
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    filteredEvents,
  };
};
