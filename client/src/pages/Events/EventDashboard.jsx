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
    ],
    []
  );

  // useEffect(() => {
  //   fetchEvents();
  // }, [fetchEvents]);

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

  const getTypeColor = (type) => {
    const colors = {
      "Hội thảo": "bg-blue-100 text-blue-800",
      Workshop: "bg-green-100 text-green-800",
      "Cuộc thi": "bg-red-100 text-red-800",
      Seminar: "bg-purple-100 text-purple-800",
      Khác: "bg-gray-100 text-gray-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
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
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Sự kiện đã duyệt
                  </h2>
                  <p className="text-gray-600">
                    Quản lý các sự kiện đã được phê duyệt
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingEvent(null);
                    setFormModalOpen(true);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Add className="mr-2" />
                  Thêm sự kiện
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-sm border">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Sự kiện
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Loại
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Ngày
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Tham gia
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {approvedEvents.map((event) => (
                        <tr key={event.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {event.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                {event.location}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(
                                event.type
                              )}`}
                            >
                              {event.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {new Date(event.date).toLocaleDateString("vi-VN")}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {event.participants}/{event.maxParticipants}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex justify-center space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedEvent(event);
                                  setDetailModalOpen(true);
                                }}
                                className="text-blue-600 hover:text-blue-800 p-1"
                                title="Xem chi tiết"
                              >
                                <Visibility fontSize="small" />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingEvent(event);
                                  setFormModalOpen(true);
                                }}
                                className="text-yellow-600 hover:text-yellow-800 p-1"
                                title="Chỉnh sửa"
                              >
                                <Edit fontSize="small" />
                              </button>
                              <button
                                onClick={() => handleDelete(event.id)}
                                className="text-red-600 hover:text-red-800 p-1"
                                title="Xóa"
                              >
                                <Delete fontSize="small" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Pending Events Tab */}
          {activeTab === "pending" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Sự kiện chờ duyệt
                </h2>
                <p className="text-gray-600">
                  Xem xét và phê duyệt các sự kiện mới
                </p>
              </div>

              {pendingEvents.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                  <PendingActions
                    className="mx-auto text-gray-400 mb-4"
                    style={{ fontSize: "4rem" }}
                  />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    Không có sự kiện chờ duyệt
                  </h3>
                  <p className="text-gray-600">Tất cả sự kiện đã được xử lý</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {pendingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="bg-white rounded-lg shadow-sm border p-6"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {event.title}
                          </h3>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p>
                              <span className="font-medium">Loại:</span>{" "}
                              {event.type}
                            </p>
                            <p>
                              <span className="font-medium">Ngày:</span>{" "}
                              {new Date(event.date).toLocaleDateString("vi-VN")}
                            </p>
                            <p>
                              <span className="font-medium">Địa điểm:</span>{" "}
                              {event.location}
                            </p>
                            <p>
                              <span className="font-medium">
                                Người tổ chức:
                              </span>{" "}
                              {event.organizer}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(
                            event.type
                          )}`}
                        >
                          {event.type}
                        </span>
                      </div>

                      <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                        {event.description}
                      </p>

                      <div className="flex justify-between items-center">
                        <div className="text-xs text-gray-500">
                          Tạo:{" "}
                          {new Date(event.createdAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedEvent(event);
                              setDetailModalOpen(true);
                            }}
                            className="px-3 py-1 text-blue-600 border border-blue-300 rounded hover:bg-blue-50 transition-colors text-sm"
                          >
                            Chi tiết
                          </button>
                          <button
                            onClick={() => {
                              setSelectedEvent(event);
                              setApprovalModalOpen(true);
                            }}
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                          >
                            Duyệt
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
