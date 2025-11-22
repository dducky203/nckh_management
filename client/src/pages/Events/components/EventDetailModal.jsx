import {
  Close,
  CalendarToday,
  LocationOn,
  CheckCircle,
} from "@mui/icons-material";
import {API_BASE_URL} from "../../../constants/index.js";

const EventDetailModal = ({ isOpen, onClose, event, onRegister, isRegistered = false }) => {
  console.log("EventDetailModal render:", { isOpen, event, isRegistered });
  
  if (!isOpen || !event) {
    console.log("Modal not rendering - isOpen:", isOpen, "event:", event);
    return null;
  }

  const isUpcoming = () => {
    const eventDate = new Date(event.dateOfEvent);
    return eventDate > new Date();
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        label: "Chờ duyệt",
        className: "bg-yellow-100 text-yellow-800",
      },
      upcoming: {
        label: "Sắp diễn ra",
        className: "bg-green-100 text-green-800",
      },
      completed: {
        label: "Đã hoàn thành",
        className: "bg-blue-100 text-blue-800",
      },
      rejected: { label: "Từ chối", className: "bg-red-100 text-red-800" },
    };
    return (
      statusConfig[status] || {
        label: "Không xác định",
        className: "bg-gray-100 text-gray-800",
      }
    );
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

  const statusBadge = getStatusBadge(event.status);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-900">
            Chi tiết sự kiện
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Close />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Event Image */}
          {event.image && (
            <div className="mb-6">
              <img
                src={`${API_BASE_URL}`+event.image}
                alt={event.eventName}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Title and Badges */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span
                className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(
                  event.type
                )}`}
              >
                {event.type}
              </span>
              <span
                className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${statusBadge.className}`}
              >
                {statusBadge.label}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {event.eventName}
            </h1>
            <p className="text-gray-600">
              Tổ chức bởi:{" "}
              <span className="font-medium">{event.organizer || "Chưa cập nhật"}</span>
            </p>
          </div>

          {/* Event Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Date & Time */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center text-gray-700 mb-2">
                <CalendarToday className="w-5 h-5 mr-2" />
                <span className="font-medium">Thời gian</span>
              </div>
              <div className="text-sm text-gray-600">
                <div className="font-medium">
                  {event.dateOfEvent ? new Date(event.dateOfEvent).toLocaleDateString('vi-VN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'Chưa xác định'}
                </div>
                <div className="mt-1">
                  {event.startTimeDetail && event.endTimeDetail 
                    ? `${event.startTimeDetail.slice(0, 5)} - ${event.endTimeDetail.slice(0, 5)}`
                    : 'Chưa xác định giờ'}
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center text-gray-700 mb-2">
                <LocationOn className="w-5 h-5 mr-2" />
                <span className="font-medium">Địa điểm</span>
              </div>
              <p className="text-sm text-gray-600">{event.location || 'Chưa xác định'}</p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Mô tả sự kiện
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">
                {event.description || 'Chưa có mô tả'}
              </p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Thông tin liên hệ
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              {event.contactEmail && (
                <p className="text-gray-700">
                  <span className="font-medium">Email:</span> {event.contactEmail}
                </p>
              )}
              {event.contactPhone && (
                <p className="text-gray-700">
                  <span className="font-medium">Điện thoại:</span> {event.contactPhone}
                </p>
              )}
              {!event.contactEmail && !event.contactPhone && (
                <p className="text-gray-700">Chưa có thông tin liên hệ</p>
              )}
            </div>
          </div>

          {/* Created Date */}
          <div className="text-sm text-gray-500 border-t pt-4">
            <p>Tạo ngày: {event.createdAt ? new Date(event.createdAt).toLocaleDateString("vi-VN") : 'Chưa xác định'}</p>
            {event.updatedAt && (
              <p className="mt-1">Cập nhật lần cuối: {new Date(event.updatedAt).toLocaleDateString("vi-VN")}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Đóng
            </button>
            {onRegister && isUpcoming() && (
              <>
                {isRegistered ? (
                  <button
                    disabled
                    className="px-6 py-2 bg-gray-400 text-white rounded-md cursor-not-allowed flex items-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Đã đăng ký
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      onClose();
                      onRegister(event, e);
                    }}
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Đăng ký tham gia
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;
