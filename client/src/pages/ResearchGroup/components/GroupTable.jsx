import {
  Visibility,
  Edit,
  Delete,
  CheckCircle,
  Cancel,
  People,
} from "@mui/icons-material";

const GroupTable = ({
  groups,
  isAdmin,
  currentUserId,
  onViewDetail,
  onEdit,
  onApprove,
  onReject,
  onDelete,
  getStatusBadge,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên nhóm
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Đề tài
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trưởng nhóm
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giảng viên hướng dẫn
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thành viên
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {groups.map((group) => {
              const statusBadge = getStatusBadge(group.status);
              const StatusIcon = statusBadge.icon;
              const isLeader = group.leader?.id === currentUserId;

              return (
                <tr key={group.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4" title={group.groupName }>
                    <div className="font-medium text-gray-900">
                      {group.groupName}
                    </div>
                  </td>
                  <td className="px-6 py-4" title={group.topicName}>
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {group.topicName}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {group.leader?.name || "N/A"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {group.leader?.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {group.advisor?.name || "Chưa có"}
                    </div>
                    {group.advisor && (
                      <div className="text-xs text-gray-500">
                        {group.advisor.email}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center gap-1 text-sm text-gray-900">
                      <People fontSize="small" />
                      {group.members?.length || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium ${statusBadge.color}`}
                    >
                      <StatusIcon fontSize="small" />
                      {statusBadge.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onViewDetail(group)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="Xem chi tiết"
                      >
                        <Visibility fontSize="small" />
                      </button>

                
                      {isAdmin && (
                        <button
                          onClick={() => onDelete(group.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Xóa nhóm"
                        >
                          <Delete fontSize="small" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GroupTable;
