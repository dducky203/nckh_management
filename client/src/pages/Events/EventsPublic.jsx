import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
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

const EventsPublic = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [eventToRegister, setEventToRegister] = useState(null);
  const navigate = useNavigate();

  // Custom hooks
  const { events, loading, error, refetchEvents } = useEvents(activeTab);
  const {
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    filteredEvents,
  } = useEventFilters(events);

  const handleViewDetail = (event) => {
    if (!user) {
      navigate("/login");
      return;
    }
    setSelectedEvent(event);
    setDetailModalOpen(true);
  };

  const handleRegister = (event, e) => {
    e.stopPropagation();
    if (!user) {
      navigate("/login");
      return;
    }
    setEventToRegister(event);
    setRegisterModalOpen(true);
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
            setActiveTab={setActiveTab}
            eventCount={events.length}
          />
          <EventFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterType={filterType}
            setFilterType={setFilterType}
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
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    activeTab={activeTab}
                    user={user}
                    onViewDetail={handleViewDetail}
                    onRegister={handleRegister}
                  />
                ))}
              </div>
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
          }}
          event={selectedEvent}
          onRegister={(event) => {
            setEventToRegister(event);
            setRegisterModalOpen(true);
          }}
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
        />
      )}
    </div>
  );
};

export default EventsPublic;
