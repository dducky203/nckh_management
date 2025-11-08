import { useState } from "react";
import { Close, CheckCircle, Cancel } from "@mui/icons-material";

const EventApprovalModal = ({
  isOpen,
  onClose,
  onApprove,
  onReject,
  event,
}) => {
  const [action, setAction] = useState(""); // 'approve' or 'reject'
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !event) return null;

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      await onApprove(reason);
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!reason.trim()) {
      alert("Vui lòng nhập lý do từ chối");
      return;
    }

    setIsSubmitting(true);
    try {
      await onReject(reason);
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setAction("");
    setReason("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-900">Duyệt sự kiện</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Close />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Event Info */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h4 className="font-semibold text-gray-900 mb-2">{event.title}</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <span className="font-medium">Loại:</span> {event.type}
              </p>
              <p>
                <span className="font-medium">Ngày:</span> {event.date}
              </p>
              <p>
                <span className="font-medium">Địa điểm:</span> {event.location}
              </p>
              <p>
                <span className="font-medium">Người tổ chức:</span>{" "}
                {event.organizer}
              </p>
            </div>
          </div>

          {/* Action Selection */}
          {!action && (
            <div className="space-y-4">
              <p className="text-gray-700 mb-4">
                Bạn muốn thực hiện hành động gì với sự kiện này?
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setAction("approve")}
                  className="flex items-center justify-center p-4 border-2 border-green-300 rounded-lg hover:bg-green-50 transition-colors group"
                >
                  <CheckCircle className="text-green-600 mr-3" />
                  <div className="text-left">
                    <div className="font-medium text-green-800">
                      Duyệt sự kiện
                    </div>
                    <div className="text-sm text-green-600">
                      Cho phép sự kiện được tổ chức
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setAction("reject")}
                  className="flex items-center justify-center p-4 border-2 border-red-300 rounded-lg hover:bg-red-50 transition-colors group"
                >
                  <Cancel className="text-red-600 mr-3" />
                  <div className="text-left">
                    <div className="font-medium text-red-800">
                      Từ chối sự kiện
                    </div>
                    <div className="text-sm text-red-600">
                      Không cho phép sự kiện được tổ chức
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Approval Form */}
          {action === "approve" && (
            <div className="space-y-4">
              <div className="flex items-center text-green-600 mb-4">
                <CheckCircle className="mr-2" />
                <span className="font-medium">Duyệt sự kiện</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi chú (tùy chọn)
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Nhập ghi chú về việc duyệt sự kiện..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setAction("")}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Quay lại
                </button>
                <button
                  onClick={handleApprove}
                  disabled={isSubmitting}
                  className={`px-6 py-2 rounded-md transition-colors ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  } text-white`}
                >
                  {isSubmitting ? "Đang xử lý..." : "Duyệt sự kiện"}
                </button>
              </div>
            </div>
          )}

          {/* Rejection Form */}
          {action === "reject" && (
            <div className="space-y-4">
              <div className="flex items-center text-red-600 mb-4">
                <Cancel className="mr-2" />
                <span className="font-medium">Từ chối sự kiện</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lý do từ chối <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Nhập lý do tại sao sự kiện bị từ chối..."
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Lý do từ chối sẽ được gửi đến người tổ chức sự kiện
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setAction("")}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Quay lại
                </button>
                <button
                  onClick={handleReject}
                  disabled={isSubmitting || !reason.trim()}
                  className={`px-6 py-2 rounded-md transition-colors ${
                    isSubmitting || !reason.trim()
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  } text-white`}
                >
                  {isSubmitting ? "Đang xử lý..." : "Từ chối sự kiện"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventApprovalModal;
