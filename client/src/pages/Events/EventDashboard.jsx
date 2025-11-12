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

  // Mock data
  const mockEvents = useMemo(
    () => [
      {
        id: 1,
        title: "Hội thảo khoa học quốc gia về AI 2024",
        type: "Hội thảo",
        date: "2024-12-15",
        time: "08:00 - 17:00",
        location: "Hội trường A1, FITA",
        description: "Hội thảo quy tụ các chuyên gia hàng đầu về AI",
        organizer: "Nguyễn Văn A",
        status: "approved",
        participants: 150,
        maxParticipants: 250,
        createdAt: "2024-11-01",
        approvedAt: "2024-11-02",
      },
      {
        id: 2,
        title: "Workshop: Blockchain thực tế",
        type: "Workshop",
        date: "2024-12-22",
        time: "14:00 - 17:00",
        location: "Phòng Lab B2",
        description: "Workshop về blockchain",
        organizer: "Trần Thị B",
        status: "pending",
        participants: 0,
        maxParticipants: 50,
        createdAt: "2024-11-05",
      },
      {
        id: 3,
        title: "Cuộc thi lập trình 2024",
        type: "Cuộc thi",
        date: "2024-12-05",
        time: "09:00 - 14:00",
        location: "Phòng máy tính C1-C3",
        description: "Cuộc thi lập trình cho sinh viên",
        organizer: "Lê Văn C",
        status: "rejected",
        participants: 0,
        maxParticipants: 120,
        createdAt: "2024-10-20",
        rejectedReason: "Trùng thời gian",
      },
      {
        id: 4,
        title: "Seminar: Xu hướng công nghệ 2025",
        type: "Seminar",
        date: "2025-01-12",
        time: "19:00 - 21:00",
        location: "Online",
        description: "Thảo luận xu hướng công nghệ",
        organizer: "Phạm Văn D",
        status: "approved",
        participants: 200,
        maxParticipants: 500,
        createdAt: "2024-10-15",
        approvedAt: "2024-10-20",
      },
      {
        id: 5,
        title:
          "Mô hình hóa xu hướng phát triển sử dụng đất/lớp phủ khu vực đô thị sử dụng dữ liệu viễn thám và các mô hình trí tuệ nhân tạo",
        type: "Hội thảo",
        date: "2024-12-24",
        time: "08:00 - 17:00",
        location: "Hội trường A",
        description:
          "Nghiên cứu về ứng dụng AI trong phân tích dữ liệu viễn thám cho quy hoạch đô thị",
        organizer: "TS. Nguyễn Văn Khoa",
        status: "pending",
        participants: 0,
        maxParticipants: 100,
        createdAt: "2024-11-07",
      },
      {
        id: 6,
        title: "test vietnamese paper",
        type: "Hội thảo",
        date: "2025-09-19",
        time: "14:00 - 18:00",
        location: "Hội trường A",
        description: "Hội thảo thử nghiệm về nghiên cứu khoa học",
        organizer: "GS. Trần Thị Mai",
        status: "pending",
        participants: 0,
        maxParticipants: 80,
        createdAt: "2024-11-06",
      },
      {
        id: 7,
        title: "Workshop React Advanced - Từ cơ bản đến chuyên sâu",
        type: "Workshop",
        date: "2024-11-25",
        time: "09:00 - 17:00",
        location: "Phòng Lab C3",
        description:
          "Workshop intensive về React hooks, context, performance optimization",
        organizer: "Nguyễn Văn Frontend",
        status: "approved",
        participants: 45,
        maxParticipants: 60,
        createdAt: "2024-10-28",
        approvedAt: "2024-10-30",
      },
      {
        id: 8,
        title: "Cuộc thi Hackathon AI Innovation 2024",
        type: "Cuộc thi",
        date: "2024-12-14",
        time: "08:00 - 20:00",
        location: "Toàn bộ tòa nhà FITA",
        description: "Cuộc thi phát triển ứng dụng AI trong 48 giờ liên tục",
        organizer: "CLB Lập trình",
        status: "pending",
        participants: 0,
        maxParticipants: 200,
        createdAt: "2024-11-08",
      },
      {
        id: 9,
        title: "Seminar: Cybersecurity trong thời đại Digital",
        type: "Seminar",
        date: "2024-11-20",
        time: "14:00 - 17:00",
        location: "Hội trường B1",
        description:
          "Chia sẻ về các xu hướng tấn công mạng và cách phòng chống",
        organizer: "TS. Lê Thanh Security",
        status: "approved",
        participants: 120,
        maxParticipants: 150,
        createdAt: "2024-10-25",
        approvedAt: "2024-10-28",
      },
      {
        id: 10,
        title: "Workshop: Machine Learning cơ bản với Python",
        type: "Workshop",
        date: "2024-12-01",
        time: "08:30 - 16:30",
        location: "Phòng Lab B1-B2",
        description: "Hands-on workshop về ML algorithms, scikit-learn, pandas",
        organizer: "ThS. Hoàng Văn Data",
        status: "pending",
        participants: 0,
        maxParticipants: 40,
        createdAt: "2024-11-07",
      },
      {
        id: 11,
        title: "Hội thảo: Startup và Đổi mới sáng tạo",
        type: "Hội thảo",
        date: "2024-11-30",
        time: "13:00 - 17:00",
        location: "Audi A2",
        description:
          "Gặp gỡ các founder thành công, chia sẻ kinh nghiệm khởi nghiệp",
        organizer: "Trung tâm Khởi nghiệp",
        status: "approved",
        participants: 180,
        maxParticipants: 200,
        createdAt: "2024-10-20",
        approvedAt: "2024-10-22",
      },
      {
        id: 12,
        title: "Cuộc thi thiết kế UI/UX Design Challenge",
        type: "Cuộc thi",
        date: "2024-12-10",
        time: "09:00 - 18:00",
        location: "Phòng Design Studio",
        description:
          "Thử thách thiết kế interface cho ứng dụng mobile trong 8 giờ",
        organizer: "CLB Design",
        status: "pending",
        participants: 0,
        maxParticipants: 50,
        createdAt: "2024-11-05",
      },
      {
        id: 13,
        title: "Seminar: DevOps và Cloud Computing",
        type: "Seminar",
        date: "2025-01-15",
        time: "14:00 - 18:00",
        location: "Online + Hội trường C1",
        description: "Docker, Kubernetes, AWS, CI/CD pipelines trong thực tế",
        organizer: "Cộng đồng DevOps VN",
        status: "pending",
        participants: 0,
        maxParticipants: 300,
        createdAt: "2024-11-08",
      },
      {
        id: 14,
        title: "Workshop: Game Development với Unity",
        type: "Workshop",
        date: "2024-12-28",
        time: "09:00 - 17:00",
        location: "Phòng Game Lab",
        description: "Tạo game 2D hoàn chỉnh từ ý tưởng đến deploy",
        organizer: "Game Studio UIT",
        status: "approved",
        participants: 25,
        maxParticipants: 30,
        createdAt: "2024-11-01",
        approvedAt: "2024-11-03",
      },
    ],
    []
  );

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setEvents(mockEvents);
      setPendingEvents(mockEvents.filter((e) => e.status === "pending"));
      setApprovedEvents(mockEvents.filter((e) => e.status === "approved"));
    } catch (err) {
      console.error("Error loading events:", err);
      toast.error("Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  }, [toast, mockEvents]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // const generateStatistics = useCallback(() => {
  //   // Yearly statistics
  //   const yearData = YEARS.map((year) => ({
  //     year,
  //     events: mockEvents.filter((e) => new Date(e.date).getFullYear() === year)
  //       .length,
  //     approved: mockEvents.filter(
  //       (e) =>
  //         new Date(e.date).getFullYear() === year && e.status === "approved"
  //     ).length,
  //   }));
  //   setYearlyStats(yearData);

  //   // Type statistics for selected year
  //   const typeData = EVENT_TYPES.map((type) => ({
  //     name: type,
  //     value: mockEvents.filter(
  //       (e) =>
  //         e.type === type && new Date(e.date).getFullYear() === selectedYear
  //     ).length,
  //   })).filter((item) => item.value > 0);
  //   setTypeStats(typeData);

  //   // Monthly statistics for selected year
  //   const monthData = [];
  //   for (let month = 1; month <= 12; month++) {
  //     const monthEvents = mockEvents.filter((e) => {
  //       const eventDate = new Date(e.date);
  //       return (
  //         eventDate.getFullYear() === selectedYear &&
  //         eventDate.getMonth() + 1 === month
  //       );
  //     });

  //     if (monthEvents.length > 0) {
  //       monthData.push({
  //         month: `Tháng ${month}`,
  //         events: monthEvents.length,
  //         participants: monthEvents.reduce((sum, e) => sum + e.participants, 0),
  //       });
  //     }
  //   }
  //   setMonthlyStats(monthData);
  // }, [selectedYear, mockEvents, EVENT_TYPES, YEARS]);

  const handleApprove = async (eventId, reason) => {
    console.log("Approving event:", eventId, reason);
    try {
      toast.success("Duyệt sự kiện thành công");
      fetchEvents();
    } catch (err) {
      console.error("Error approving event:", err);
      toast.error("Lỗi khi duyệt sự kiện");
    }
  };

  const handleReject = async (eventId, reason) => {
    console.log("Rejecting event:", eventId, reason);
    try {
      toast.success("Từ chối sự kiện thành công");
      fetchEvents();
    } catch (err) {
      console.error("Error rejecting event:", err);
      toast.error("Lỗi khi từ chối sự kiện");
    }
  };

  const handleDelete = async (eventId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sự kiện này?")) {
      try {
        console.log("Deleting event:", eventId);
        toast.success("Xóa sự kiện thành công");
        fetchEvents();
      } catch (err) {
        console.error("Error deleting event:", err);
        toast.error("Lỗi khi xóa sự kiện");
      }
    }
  };

  const handleSave = async (eventData) => {
    try {
      console.log("Saving event:", eventData);
      if (editingEvent) {
        toast.success("Cập nhật sự kiện thành công");
      } else {
        toast.success("Tạo sự kiện thành công");
      }
      setFormModalOpen(false);
      fetchEvents();
    } catch (err) {
      console.error("Error saving event:", err);
      toast.error("Lỗi khi lưu sự kiện");
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
            />
          )}

          {/* Approved Events Tab */}
          {activeTab === "approved" && (
            <EventList
              events={approvedEvents}
              type="approved"
              title="Sự kiện đã duyệt"
              onViewDetails={(event) => {
                setSelectedEvent(event);
                setDetailModalOpen(true);
              }}
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
            />
          )}

          {/* Pending Events Tab */}
          {activeTab === "pending" && (
            <EventList
              events={pendingEvents}
              type="pending"
              title="Sự kiện chờ duyệt"
              onViewDetails={(event) => {
                setSelectedEvent(event);
                setDetailModalOpen(true);
              }}
              onApprove={(event) => {
                setSelectedEvent(event);
                setApprovalModalOpen(true);
              }}
              onReject={(event) => {
                setSelectedEvent(event);
                setApprovalModalOpen(true);
              }}
              showCreateButton={false}
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
