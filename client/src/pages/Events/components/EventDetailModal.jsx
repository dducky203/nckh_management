import {
  Close,
  CalendarToday,
  LocationOn,
  People,
  Schedule,
} from "@mui/icons-material";

const EventDetailModal = ({ isOpen, onClose, event, onRegister }) => {
  if (!isOpen || !event) return null;

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
      approved: { label: "Đã duyệt", className: "bg-green-100 text-green-800" },
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
                src={event.image}
                alt={event.title}
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
              {event.title}
            </h1>
            <p className="text-gray-600">
              Tổ chức bởi:{" "}
              <span className="font-medium">{event.organizer}</span>
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
              <p className="text-sm text-gray-600">
                <div className="font-medium">{event.date}</div>
                <div>{event.time}</div>
              </p>
            </div>

            {/* Location */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center text-gray-700 mb-2">
                <LocationOn className="w-5 h-5 mr-2" />
                <span className="font-medium">Địa điểm</span>
              </div>
              <p className="text-sm text-gray-600">{event.location}</p>
            </div>

            {/* Participants */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center text-gray-700 mb-2">
                <People className="w-5 h-5 mr-2" />
                <span className="font-medium">Số lượng tham gia</span>
              </div>
              <p className="text-sm text-gray-600">
                {event.participants}/{event.maxParticipants} người
              </p>
              <div className="mt-2 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width: `${Math.min(
                      (event.participants / event.maxParticipants) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Registration Deadline */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center text-gray-700 mb-2">
                <Schedule className="w-5 h-5 mr-2" />
                <span className="font-medium">Hạn đăng ký</span>
              </div>
              <p className="text-sm text-gray-600">
                {event.registrationDeadline}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Mô tả sự kiện
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">
                {event.description}
              </p>
            </div>
          </div>

          {/* Requirements */}
          {event.requirements && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Yêu cầu tham gia
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {event.requirements}
                </p>
              </div>
            </div>
          )}

          {/* Agenda */}
          {event.agenda && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Chương trình sự kiện
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {event.agenda}
                </p>
              </div>
            </div>
          )}

          {/* Speakers */}
          {event.speakers && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Diễn giả/Người hướng dẫn
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {event.speakers}
                </p>
              </div>
            </div>
          )}

          {/* Contact Info */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Thông tin liên hệ
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">{event.contact}</p>
            </div>
          </div>

          {/* Approval/Rejection Info */}
          {event.status === "approved" && event.approvedBy && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Thông tin duyệt
              </h3>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-green-800">
                  Đã được duyệt bởi{" "}
                  <span className="font-medium">{event.approvedBy}</span>
                  {event.approvedAt && (
                    <span>
                      {" "}
                      vào ngày{" "}
                      {new Date(event.approvedAt).toLocaleDateString("vi-VN")}
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}

          {event.status === "rejected" && event.rejectedBy && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Thông tin từ chối
              </h3>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <p className="text-red-800 mb-2">
                  Đã bị từ chối bởi{" "}
                  <span className="font-medium">{event.rejectedBy}</span>
                  {event.rejectedAt && (
                    <span>
                      {" "}
                      vào ngày{" "}
                      {new Date(event.rejectedAt).toLocaleDateString("vi-VN")}
                    </span>
                  )}
                </p>
                {event.rejectionReason && (
                  <div>
                    <p className="text-red-700 font-medium mb-1">
                      Lý do từ chối:
                    </p>
                    <p className="text-red-700">{event.rejectionReason}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Created Date */}
          <div className="text-sm text-gray-500 border-t pt-4">
            Tạo ngày: {new Date(event.createdAt).toLocaleDateString("vi-VN")}
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
              <button
                onClick={() => {
                  onClose();
                  onRegister(event);
                }}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Đăng ký tham gia
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;
