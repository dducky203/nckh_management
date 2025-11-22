import { useState, useEffect, useContext, useCallback, useMemo } from "react";
import {
  Add,
  Edit,
  Delete,
  Visibility,
  PendingActions,
} from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import EventFormModal from "./components/EventFormModal";
import EventDetailModal from "./components/EventDetailModal";
import EventApprovalModal from "./components/EventApprovalModal";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EventList from "./components/EventList";
import eventService from "../../services/eventService";

// Dashboard Components
import DashboardSidebar from "./components/Management/DashboardSidebar";
import DashboardOverview from "./components/Management/DashboardOverview";

const EventDashboard = () => {
  const { user } = useContext(AuthContext);
  const toast = useToast();

  // Sidebar state
  const [activeTab, setActiveTab] = useState("dashboard");

  // Data states
  const [events, setEvents] = useState([]);
  const [pendingEvents, setPendingEvents] = useState([]);
  const [approvedEvents, setApprovedEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Modal states
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);

  const EVENT_TYPES = useMemo(
    () => ["Hội thảo", "Workshop", "Cuộc thi", "Seminar", "Khác"],
    []
  );
  const YEARS = useMemo(() => [2023, 2024, 2025, 2026], []);

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  // Remove mock data - using real API now

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch all events (upcoming, completed, pending, rejected)
      const [upcomingRes, completedRes, pendingRes, rejectedRes] =
        await Promise.all([
          eventService.getPublicEvents("upcoming", 0, 100),
          eventService.getPublicEvents("completed", 0, 100),
          eventService.getPublicEvents("pending", 0, 100),
          eventService.getPublicEvents("rejected", 0, 100),
        ]);

      console.log("API Responses:", {
        upcoming: upcomingRes.data,
        completed: completedRes.data,
        pending: pendingRes.data,
        rejected: rejectedRes.data,
      });

      // Map events inline to avoid dependency issues
      const mapEvent = (event) => {
        return {
          id: event.id,
          title: event.eventName,
          type: event.type || "Khác",
          date: event.dateOfEvent,
          time: `${event.startTimeDetail || ""} - ${event.endTimeDetail || ""}`,
          location: event.location,
          description: event.description,
          organizer: event.organizer,
          status: event.status, // Giữ nguyên string status: "upcoming", "pending", "completed", "rejected"
          participants: 0,
          maxParticipants: event.maxParticipants || 0,
          createdAt: event.createdAt,
          approvalStatus: event.status,
          bannerUrl: event.image,
        };
      };

      const upcomingEvents = (upcomingRes.data?.events || []).map(mapEvent);
      const completedEvents = (completedRes.data?.events || []).map(mapEvent);
      const pendingEventsData = (pendingRes.data?.events || []).map(mapEvent);
      const rejectedEvents = (rejectedRes.data?.events || []).map(mapEvent);

      // Combine all events
      const allEvents = [
        ...upcomingEvents,
        ...completedEvents,
        ...pendingEventsData,
        ...rejectedEvents,
      ];

      // Separate by status
      const pending = allEvents.filter((e) => e.status === "pending");
      const approved = allEvents.filter(
        (e) => e.status === "upcoming" || e.status === "completed"
      );

      setEvents(allEvents);
      setPendingEvents(pending);
      setApprovedEvents(approved);
    } catch (err) {
      console.error("Error loading events:", err);
      toast.error("Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependencies - only create once

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleApprove = async (eventId) => {
    try {
      await eventService.approveEvent(eventId);
      toast.success("Duyệt sự kiện thành công");
      setApprovalModalOpen(false);
      fetchEvents();
    } catch (err) {
      console.error("Error approving event:", err);
      toast.error(
        "Lỗi khi duyệt sự kiện: " + (err.response?.data?.message || err.message)
      );
    }
  };

  const handleReject = async (eventId, reason) => {
    try {
      await eventService.rejectEvent(eventId, reason);
      toast.info("Đã từ chối sự kiện");
      setApprovalModalOpen(false);
      fetchEvents();
    } catch (err) {
      console.error("Error rejecting event:", err);
      toast.error(
        "Lỗi khi từ chối sự kiện: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  const handleDelete = async (eventId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sự kiện này?")) {
      try {
        await eventService.deleteEvent(eventId);
        toast.success("Xóa sự kiện thành công");
        fetchEvents();
      } catch (err) {
        console.error("Error deleting event:", err);
        toast.error(
          "Lỗi khi xóa sự kiện: " + (err.response?.data?.message || err.message)
        );
      }
    }
  };

  const handleViewDetails = async (event) => {
    try {
      console.log("Fetching details for event:", event);
      // Gọi API để lấy chi tiết đầy đủ của event
      const response = await eventService.getEventById(event.id);
      console.log("API response:", response);
      console.log("Event data:", response.data);
      
      // Backend trả về {data: {data: eventDTO, message: ...}}
      const eventData = response.data?.data || response.data;
      console.log("Setting selected event:", eventData);
      
      setSelectedEvent(eventData);
      setDetailModalOpen(true);
    } catch (error) {
      console.error("Error fetching event details:", error);
      toast.error("Không thể tải chi tiết sự kiện");
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingEvent) {
        // TODO: Implement update event API
        toast.success("Cập nhật sự kiện thành công");
      } else {
        // Tạo FormData để gửi file và data
        const submitData = new FormData();

        // Thêm file banner nếu có
        if (formData.image) {
          submitData.append("banner", formData.image);
        }

        // Thêm các trường dữ liệu
        submitData.append("eventName", formData.title);
        submitData.append("dateOfEvent", formData.date);
        submitData.append("startTime", formData.startTime || 1);
        submitData.append("endTime", formData.endTime || 5);
        submitData.append("location", formData.location);
        submitData.append("type", formData.type);
        submitData.append("description", formData.description);
        submitData.append("creator", user.id);

        // Gọi API tạo event
        await eventService.createEvent(submitData);
        toast.success("Tạo sự kiện thành công! Chờ phê duyệt.");
      }
      setFormModalOpen(false);
      setEditingEvent(null);
      fetchEvents();
    } catch (err) {
      console.error("Error saving event:", err);
      toast.error(
        "Lỗi khi lưu sự kiện: " + (err.response?.data?.message || err.message)
      );
      throw err; // Throw để EventFormModal xử lý loading state
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <DashboardSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingEvents={pendingEvents}
        events={events}
        approvedEvents={approvedEvents}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-6">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <DashboardOverview
              events={events}
              approvedEvents={approvedEvents}
              pendingEvents={pendingEvents}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              years={YEARS}
              eventTypes={EVENT_TYPES}
              colors={COLORS}
              setEditingEvent={setEditingEvent}
              setFormModalOpen={setFormModalOpen}
              onViewDetails={handleViewDetails}
              onApprove={(event) => {
                setSelectedEvent(event);
                setApprovalModalOpen(true);
              }}
              onReject={(event) => {
                setSelectedEvent(event);
                setApprovalModalOpen(true);
              }}
              onEdit={(event) => {
                setEditingEvent(event);
                setFormModalOpen(true);
              }}
              onDelete={handleDelete}
            />
          )}

          {/* Approved Events Tab */}
          {activeTab === "approved" && (
            <EventList
              events={approvedEvents}
              type="approved"
              title="Sự kiện đã duyệt"
              onViewDetails={handleViewDetails}
              onEdit={(event) => {
                setEditingEvent(event);
                setFormModalOpen(true);
              }}
              onDelete={handleDelete}
              onCreateNew={() => {
                setEditingEvent(null);
                setFormModalOpen(true);
              }}
              showCreateButton={true}
              isAdmin={true}
            />
          )}

          {/* Pending Events Tab */}
          {activeTab === "pending" && (
            <EventList
              events={pendingEvents}
              type="pending"
              title="Sự kiện chờ duyệt"
              onViewDetails={handleViewDetails}
              onApprove={(event) => {
                setSelectedEvent(event);
                setApprovalModalOpen(true);
              }}
              onReject={(event) => {
                setSelectedEvent(event);
                setApprovalModalOpen(true);
              }}
              showCreateButton={false}
              isAdmin={true}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <EventFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSave={handleSave}
        event={editingEvent}
        currentUser={user}
      />

      <EventDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        event={selectedEvent}
      />

      <EventApprovalModal
        isOpen={approvalModalOpen}
        onClose={() => setApprovalModalOpen(false)}
        onApprove={(reason) => handleApprove(selectedEvent?.id, reason)}
        onReject={(reason) => handleReject(selectedEvent?.id, reason)}
        event={selectedEvent}
      />
    </div>
  );
};

export default EventDashboard;
