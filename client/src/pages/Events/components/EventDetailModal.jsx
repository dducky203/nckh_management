import {
  Close,
  CalendarToday,
  LocationOn,
  AccessTime,
  Person,
  CheckCircle,
  Email,
  Phone,
} from "@mui/icons-material";

const formatDate = (dateString) => {
  if (!dateString) return "Chưa xác định";
  return new Date(dateString).toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const EventDetailModal = ({
  isOpen,
  onClose,
  event,
  onRegister,
  isRegistered = false,
}) => {
  if (!isOpen || !event) return null;

  const isUpcoming = () => {
    const eventDate = new Date(event.dateOfEvent);
    return eventDate > new Date();
  };

  const getStatusBadge = (status) => {
    const config = {
      pending: {
        label: "Chờ duyệt",
        className: "bg-yellow-100 text-yellow-800",
      },
      upcoming: {
        label: "Sắp diễn ra",
        className: "bg-green-100 text-green-800",
      },
      completed: {
        label: "Đã kết thúc",
        className: "bg-gray-100 text-gray-800",
      },
      rejected: { label: "Đã hủy", className: "bg-red-100 text-red-800" },
    };
    return (
      config[status] || {
        label: "Không xác định",
        className: "bg-gray-100 text-gray-800",
      }
    );
  };

  const statusInfo = getStatusBadge(event.status);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Chi tiết sự kiện
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Close />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <div className="mb-6">
            <img
              src={
                event?.bannerImg ||
                "https://via.placeholder.com/800x400?text=No+Image"
              }
              alt={event?.eventName}
              className="w-full h-64 object-cover rounded-lg border border-gray-100"
            />
          </div>

          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full uppercase">
                {event.type}
              </span>
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full uppercase ${statusInfo.className}`}
              >
                {statusInfo.label}
              </span>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {event.eventName}
            </h1>

            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <Person fontSize="small" className="text-gray-400" />
              <span>
                Tổ chức bởi:{" "}
                <span className="font-semibold text-gray-800">
                  {event.organizer || "BTC"}
                </span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-700 font-medium text-sm">
                <CalendarToday fontSize="small" className="text-blue-500" />
                Thời gian
              </div>
              <p className="text-sm text-gray-600 pl-7">
                {formatDate(event.dateOfEvent)}
              </p>
              <p className="text-sm text-gray-600 pl-7 flex items-center gap-1">
                <AccessTime style={{ fontSize: 14 }} />
                {event.startTime ? event.startTime.slice(0, 5) : "--:--"} -{" "}
                {event.endTime ? event.endTime.slice(0, 5) : "--:--"}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-700 font-medium text-sm">
                <LocationOn fontSize="small" className="text-red-500" />
                Địa điểm
              </div>
              <p className="text-sm text-gray-600 pl-7 line-clamp-2">
                {event.location || "Online / Chưa cập nhật"}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-700 font-medium text-sm">
                <Email fontSize="small" className="text-green-500" />
                Liên hệ
              </div>
              <div className="pl-7 text-sm text-gray-600">
                {event.contactEmail ? (
                  <div className="truncate" title={event.contactEmail}>
                    {event.contactEmail}
                  </div>
                ) : (
                  <span className="italic text-gray-400">Không có email</span>
                )}
                {event.contactPhone && (
                  <div className="flex items-center gap-1 mt-1">
                    <Phone style={{ fontSize: 12 }} /> {event.contactPhone}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-800 border-l-4 border-blue-500 pl-3">
              Nội dung chi tiết
            </h3>
            <div
              className="prose prose-sm max-w-none text-gray-600 bg-white"
              dangerouslySetInnerHTML={{
                __html:
                  event.description ||
                  "<p class='italic text-gray-400'>Chưa có mô tả chi tiết.</p>",
              }}
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center sticky bottom-0 z-10">
          <span className="text-xs text-gray-400 hidden sm:block">
            Cập nhật:{" "}
            {new Date(event.updatedAt || Date.now()).toLocaleDateString(
              "vi-VN",
            )}
          </span>

          <div className="flex gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg text-gray-700 font-medium bg-white border border-gray-300 hover:bg-gray-100 transition-colors"
            >
              Đóng
            </button>

            {onRegister &&
              isUpcoming() &&
              (isRegistered ? (
                <button
                  disabled
                  className="px-5 py-2 bg-gray-200 text-gray-500 font-medium rounded-lg flex items-center gap-2 cursor-not-allowed"
                >
                  <CheckCircle fontSize="small" />
                  Đã đăng ký
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    onClose();
                    onRegister(event, e);
                  }}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors"
                >
                  Đăng ký tham gia
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;
