import { useState } from "react";
import EventCard from "./EventCard";
import {
  Add,
  Search,
  FilterList,
  Event as EventIcon,
  PendingActions,
} from "@mui/icons-material";

const EventList = ({
  events = [],
  type = "approved", // 'approved' hoặc 'pending'
  title,
  onViewDetails,
  onApprove,
  onReject,
  onEdit,
  onDelete,
  onCreateNew,
  showCreateButton = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Filter events
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || event.type === filterType;
    return matchesSearch && matchesType;
  });

  // Get unique event types for filter
  const eventTypes = [...new Set(events.map((e) => e.type))];

  const EmptyState = () => (
    <div className="text-center py-12">
      {type === "pending" ? (
        <PendingActions className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      ) : (
        <EventIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      )}
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {filteredEvents.length === 0 && (searchTerm || filterType !== "all")
          ? "Không tìm thấy sự kiện phù hợp"
          : `Không có ${
              type === "pending" ? "sự kiện chờ duyệt" : "sự kiện đã duyệt"
            }`}
      </h3>
      <p className="text-gray-500">
        {filteredEvents.length === 0 && (searchTerm || filterType !== "all")
          ? "Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc"
          : `${
              type === "pending"
                ? "Các sự kiện mới sẽ hiển thị ở đây khi được gửi"
                : "Tạo sự kiện mới để bắt đầu"
            }`}
      </p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600 mt-1">
            {type === "pending"
              ? "Xem xét và phê duyệt các sự kiện mới"
              : "Quản lý các sự kiện đã được phê duyệt"}
          </p>
        </div>

        {showCreateButton && (
          <button
            onClick={onCreateNew}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Add className="w-5 h-5 mr-2" />
            Tạo sự kiện mới
          </button>
        )}
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên sự kiện hoặc địa điểm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filter */}
          <div className="sm:w-48">
            <div className="relative">
              <FilterList className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
              >
                <option value="all">Tất cả loại</option>
                {eventTypes.map((eventType) => (
                  <option key={eventType} value={eventType}>
                    {eventType}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-3 text-sm text-gray-600">
          Hiển thị {filteredEvents.length} / {events.length} sự kiện
          {type === "pending" && events.length > 0 && (
            <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
              {events.length} chờ xử lý
            </span>
          )}
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200">
          <EmptyState />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              type={type}
              onViewDetails={onViewDetails}
              onApprove={onApprove}
              onReject={onReject}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {filteredEvents.length > 0 && (
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {filteredEvents.length}
              </div>
              <div className="text-sm text-gray-600">
                {type === "pending" ? "Chờ duyệt" : "Đã duyệt"}
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {filteredEvents.reduce(
                  (sum, e) => sum + (e.participants || 0),
                  0
                )}
              </div>
              <div className="text-sm text-gray-600">Người tham gia</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {filteredEvents.reduce(
                  (sum, e) => sum + (e.maxParticipants || 0),
                  0
                )}
              </div>
              <div className="text-sm text-gray-600">Tổng chỗ ngồi</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventList;
