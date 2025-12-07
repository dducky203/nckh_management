import { Close, Edit, CheckCircle, Cancel, People } from "@mui/icons-material";
import { formatDateTime } from "../../../constants";

const GroupDetailModal = ({
  isOpen,
  onClose,
  group,
  isAdmin,
  currentUserId,
  onApprove,
  onReject,
  onEdit,
  getStatusBadge,
}) => {
  if (!isOpen || !group) return null;

  const statusBadge = getStatusBadge(group.status);
  const StatusIcon = statusBadge.icon;
  const isLeader = group.leader?.id === currentUserId;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {group.groupName}
            </h2>
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium ${statusBadge.color}`}
            >
              <StatusIcon fontSize="small" />
              {statusBadge.label}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <Close />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Topic */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Đề tài</h3>
            <p className="text-gray-900">{group.topicName}</p>
          </div>

          {/* Description */}
          {group.description && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Mô tả</h3>
              <p className="text-gray-900 whitespace-pre-wrap">
                {group.description}
              </p>
            </div>
          )}

          {/* Leader */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Trưởng nhóm
            </h3>
            <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                {group.leader?.name?.charAt(0) || "?"}
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {group.leader?.name || "N/A"}
                </p>
                <p className="text-sm text-gray-500">
                  {group.leader?.email || ""}
                </p>
              </div>
            </div>
          </div>

          {/* Advisor */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Giảng viên hướng dẫn
            </h3>

            <div className="flex items-center gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                {group.advisor.name?.charAt(0) || "?"}
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {group.advisor.name}
                </p>
                <p className="text-sm text-gray-500">{group.advisor.email}</p>
              </div>
            </div>
          </div>

          {/* Members */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
              <People fontSize="small" />
              Thành viên ({group.members?.length || 0})
            </h3>
            <div className=" grid grid-cols-2 gap-3">
              {group.members && group.members.length > 0 ? (
                group.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                      {member.name?.charAt(0) || "?"}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {member.name}
                        {member.id === group.leader?.id && (
                          <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-0.5 rounded">
                            Trưởng nhóm
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-500">{member.email}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">Chưa có thành viên nào</p>
              )}
            </div>
          </div>

          {/* Rejection Reason (if rejected) */}
          {group.status === "REJECTED" && group.rejectionReason && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Lý do từ chối
              </h3>
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">{group.rejectionReason}</p>
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Ngày tạo
              </h3>
              <p className="text-gray-900">
                {group.createdAt ? formatDateTime(group.createdAt) : "N/A"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Cập nhật lần cuối
              </h3>
              <p className="text-gray-900">
                {group.updatedAt ? formatDateTime(group.createdAt) : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 p-6 border-t bg-gray-50">
          {(isAdmin || isLeader) && (
            <button
              onClick={() => {
                onClose();
                onEdit(group);
              }}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Edit fontSize="small" />
              Chỉnh sửa
            </button>
          )}

          {isAdmin && group.status === "PENDING" && (
            <>
              <button
                onClick={() => {
                  onClose();
                  onApprove(group.id);
                }}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <CheckCircle fontSize="small" />
                Duyệt nhóm
              </button>
              <button
                onClick={() => {
                  onClose();
                  onReject(group.id);
                }}
                className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Cancel fontSize="small" />
                Từ chối
              </button>
            </>
          )}

          <button
            onClick={onClose}
            className="ml-auto px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupDetailModal;
