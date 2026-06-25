import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "../../constants";
import Pagination from "../../components/common/Pagination";
import EventDetailModal from "./components/EventDetailModal";
import EventRegistrationModal from "./components/EventRegistrationModal";
import EventHero from "./components/EventsPublic/EventHero";
import EventTabs from "./components/EventsPublic/EventTabs";
import EventFilters from "./components/EventsPublic/EventFilters";
import EventCard from "./components/EventsPublic/EventCard";
import EventEmptyState from "./components/EventsPublic/EventEmptyState";
import EventCTA from "./components/EventsPublic/EventCTA";
import { useEvents } from "./hooks/useEvents";
import { useEventFilters } from "./hooks/useEventFilters";
import { getTabConfig } from "./utils/eventHelpers";
import eventService from "../../services/eventService";
import { isAdmin } from "../../utils/permissions";

const EventsPublic = () => {
  const { user } = useContext(AuthContext);
  const toast = useToast();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [eventToRegister, setEventToRegister] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registeredMap, setRegisteredMap] = useState({});
  const [registrations, setRegistrations] = useState([]);
  const [registrationsLoading, setRegistrationsLoading] = useState(false);
  const navigate = useNavigate();

  // Custom hooks - backend pagination
  const { eventSize, events, pagination, loading, error, refetchEvents } = useEvents(
    activeTab,
    currentPage,
    12
  );

  
  // Client-side filtering
  const {
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    filteredEvents,
  } = useEventFilters(events);

  useEffect(() => {
    if (!user || filteredEvents.length === 0) {
      setRegisteredMap({});
      return;
    }

    let cancelled = false;

    const loadRegistrationStatuses = async () => {
      try {
        const results = await Promise.all(
          filteredEvents.map((event) =>
            eventService
              .checkRegistration(event.id, user.id)
              .then((res) => ({
                id: event.id,
                isRegistered: res?.data ?? false,
              }))
              .catch(() => ({ id: event.id, isRegistered: false }))
          )
        );

        if (cancelled) return;
        const nextMap = results.reduce((acc, item) => {
          acc[item.id] = item.isRegistered;
          return acc;
        }, {});
        setRegisteredMap(nextMap);
      } catch {
        if (!cancelled) setRegisteredMap({});
      }
    };

    loadRegistrationStatuses();
    return () => {
      cancelled = true;
    };
  }, [user, filteredEvents]);

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page - 1); // Convert 1-based to 0-based
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFirstPage = () => {
    setCurrentPage(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLastPage = () => {
    setCurrentPage(pagination.totalPages - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePreviousPage = () => {
    if (pagination.hasPrevious) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextPage = () => {
    if (pagination.hasNext) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const delta = 2;
    const displayCurrentPage = currentPage + 1;

    if (pagination.totalPages <= 7) {
      for (let i = 1; i <= pagination.totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      let start = Math.max(2, displayCurrentPage - delta);
      let end = Math.min(pagination.totalPages - 1, displayCurrentPage + delta);

      if (start > 2) pages.push("...");
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (end < pagination.totalPages - 1) pages.push("...");
      pages.push(pagination.totalPages);
    }
    return pages;
  };

  // Reset to first page when changing tabs or filters
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(0);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (value) => {
    setFilterType(value);
  };

  const handleViewDetail = async (event) => {
    try {
      const eventResponse = await eventService.getEventById(event.id);
      const eventData = eventResponse.data?.data || eventResponse.data;

      let isUserRegistered = false;
      if (user) {
        const registrationResponse = await eventService.checkRegistration(
          event.id,
          user.id,
        );
        isUserRegistered = registrationResponse?.data ?? false;
      }

      setSelectedEvent(eventData);
      setIsRegistered(isUserRegistered);
      setDetailModalOpen(true);

      if (user && (isAdmin(user) || eventData?.creator === user.id)) {
        setRegistrationsLoading(true);
        try {
          const regResponse = await eventService.getEventRegistrations(
            event.id,
            user.id,
          );
          setRegistrations(regResponse.data?.data || regResponse.data || []);
        } catch (regError) {
          console.error("Error loading registrations:", regError);
          setRegistrations([]);
        } finally {
          setRegistrationsLoading(false);
        }
      } else {
        setRegistrations([]);
      }
    } catch (error) {
      console.error("Error fetching event details:", error);
      toast.error(ERROR_MESSAGES.LOAD_EVENT_ERROR);
    }
  };

  const handleRegister = async (event, e) => {
    e.stopPropagation();
    if (!user) {
      navigate("/login");
      return;
    }

    // Kiểm tra trạng thái sự kiện
    if (activeTab === "completed") {
      toast.error(ERROR_MESSAGES.EVENT_ENDED);
      return;
    }

    if (activeTab === "ongoing") {
      toast.warning(
        "Sự kiện đang diễn ra, bạn có thể tham gia trực tiếp tại địa điểm!"
      );
      return;
    }

    // Mở modal đăng ký
    setEventToRegister(event);
    setRegisterModalOpen(true);
  };

  const handleConfirmRegister = async (formData) => {
    try {
      await eventService.registerForEvent(
        eventToRegister.id,
        user.id,
        formData
      );
      toast.success(SUCCESS_MESSAGES.REGISTRATION_SUCCESS);
      setRegisterModalOpen(false);
      setEventToRegister(null);
      setIsRegistered(true); // Update registration status
      setRegisteredMap((prev) => ({
        ...prev,
        [eventToRegister.id]: true,
      }));
      refetchEvents(); // Refresh events list
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Đăng ký thất bại";
      toast.error(message);
      throw error; // Throw để modal xử lý loading state
    }
  };

  const tabConfig = getTabConfig(activeTab);

 
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <EventHero user={user} />

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8">
        {/* Tabs & Filters */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <EventTabs
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            eventCount={eventSize}
          />
          <EventFilters
            searchTerm={searchTerm}
            setSearchTerm={handleSearchChange}
            filterType={filterType}
            setFilterType={handleFilterChange}
          />
        </div>

        {/* Events List */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <ErrorState onRetry={refetchEvents} />
        ) : (
          <>
            {/* Results count */}
            {filteredEvents.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Tìm thấy{" "}
                  <span className="font-semibold">{filteredEvents.length}</span>{" "}
                  sự kiện
                </p>
              </div>
            )}

            {/* Events Grid */}
            {filteredEvents.length === 0 ? (
              <EventEmptyState
                message={tabConfig.emptyMessage}
                searchTerm={searchTerm}
              />
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                  {filteredEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      activeTab={activeTab}
                      user={user}
                      onViewDetail={handleViewDetail}
                      onRegister={handleRegister}
                      isRegistered={registeredMap[event.id]}
                    />
                  ))}
                </div>

                {/* Pagination - từ backend */}
                {pagination.totalPages > 1 && (
                  <div className="bg-white rounded-lg shadow-sm">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={pagination.totalPages}
                      totalItems={pagination.totalItems}
                      itemsPerPage={pagination.itemsPerPage}
                      startIndex={currentPage * pagination.itemsPerPage}
                      endIndex={Math.min(
                        (currentPage + 1) * pagination.itemsPerPage,
                        pagination.totalItems
                      )}
                      onPageChange={handlePageChange}
                      onFirstPage={handleFirstPage}
                      onLastPage={handleLastPage}
                      onPreviousPage={handlePreviousPage}
                      onNextPage={handleNextPage}
                      getPageNumbers={getPageNumbers}
                      itemName="sự kiện"
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </section>

      {/* CTA Section */}
      {!user && <EventCTA />}

      {/* Event Detail Modal */}
      {selectedEvent && (
        <EventDetailModal
          isOpen={detailModalOpen}
          onClose={() => {
            setDetailModalOpen(false);
            setSelectedEvent(null);
            setIsRegistered(false);
            setRegistrations([]);
          }}
          event={selectedEvent}
          onRegister={handleRegister}
          isRegistered={isRegistered}
          registrations={registrations}
          registrationsLoading={registrationsLoading}
        />
      )}

      {/* Event Registration Modal */}
      {eventToRegister && (
        <EventRegistrationModal
          isOpen={registerModalOpen}
          onClose={() => {
            setRegisterModalOpen(false);
            setEventToRegister(null);
          }}
          event={eventToRegister}
          user={user}
          onConfirm={handleConfirmRegister}
        />
      )}
    </div>
  );
};

export default EventsPublic;
