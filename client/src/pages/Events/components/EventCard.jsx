import {
  LocationOn,
  Schedule,
  Visibility,
  CheckCircle,
  Cancel,
  Edit,
  Delete,
} from "@mui/icons-material";

const EventCard = ({
  event,
  type = "approved", // 'approved' hoặc 'pending'
  onViewDetails,
  onApprove,
  onReject,
  onEdit,
  onDelete,
  isAdmin = false, // Admin có quyền approve/reject/delete
}) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming":
        return "text-green-600 bg-green-50";
      case "completed":
        return "text-blue-600 bg-blue-50";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      case "rejected":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
      {/* Event Title */}
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {event.title}
        </h3>

        {/* Event Details */}
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <LocationOn className="w-4 h-4 mr-2 text-gray-400" />
            <span>Địa điểm: {event.location}</span>
          </div>
          <div className="flex items-center">
            <Schedule className="w-4 h-4 mr-2 text-gray-400" />
            <span>Thời gian diễn ra: {formatDate(event.date)}</span>
          </div>
        </div>

        {/* Status Badge */}
        {type === "approved" && (
          <div className="mt-3">
            <span
              className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(
                event.status
              )}`}
            >
              {event.status === "upcoming"
                ? "Sắp diễn ra"
                : event.status === "completed"
                ? "Đã hoàn thành"
                : "Đã duyệt"}
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          {/* View Details Button - Always present */}
          <button
            onClick={() => onViewDetails(event)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"
          >
            xem thêm
          </button>

          {/* Action Buttons based on type and admin status */}
          <div className="flex space-x-2">
            {type === "pending" && isAdmin ? (
              // Admin actions for pending events
              <>
                <button
                  onClick={() => onReject(event)}
                  className="flex items-center px-3 py-1.5 text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition-colors text-sm"
                >
                  <Cancel className="w-4 h-4 mr-1" />
                  Từ chối
                </button>
                <button
                  onClick={() => onApprove(event)}
                  className="flex items-center px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Chấp nhận
                </button>
              </>
            ) : type === "approved" && isAdmin ? (
              // Admin actions for approved events
              <>
                <button
                  onClick={() => onEdit(event)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Chỉnh sửa"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(event)}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Xóa"
                >
                  <Delete className="w-4 h-4" />
                </button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
