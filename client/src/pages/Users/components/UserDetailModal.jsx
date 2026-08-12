import { useState } from "react";
import {
  Close,
  Person,
  Email,
  Phone,
  Badge,
  School,
  LocationOn,
  Cake,
  AccessTime,
  CheckCircle,
  Cancel,
  Delete,
  DeleteForever,
} from "@mui/icons-material";
import { formatDate, formatDateTime } from "../../../utils/dateHelpers";
import Modal from "../../../components/common/Modal";

const UserDetailModal = ({ isOpen, onClose, user, onForceDelete }) => {
  const [showForceDeleteModal, setShowForceDeleteModal] = useState(false);

  if (!isOpen || !user) return null;

  const handleForceDeleteClick = () => {
    setShowForceDeleteModal(true);
  };

  const handleConfirmForceDelete = () => {
    if (onForceDelete) {
      onForceDelete(user.username, true);
    }
    setShowForceDeleteModal(false);
    onClose();
  };

  const getRoleLabel = (power, systemRole) => {
    const r = (systemRole ?? "").toString().trim().toLowerCase();
    if (r === "assistant") return "Trợ lí NCKH";
    const roles = {
      1: "Trưởng khoa",
      2: "Phó khoa",
      3: "Cán bộ khoa",
      4: "Sinh viên",
    };
    return roles[power] || "Không xác định";
  };

  const getRoleBadgeColor = (power, systemRole) => {
    const r = (systemRole ?? "").toString().trim().toLowerCase();
    if (r === "assistant") return "bg-sky-100 text-sky-800";
    const colors = {
      1: "bg-red-100 text-red-800",
      2: "bg-orange-100 text-orange-800",
      3: "bg-blue-100 text-blue-800",
      4: "bg-green-100 text-green-800",
    };
    return colors[power] || "bg-gray-100 text-gray-800";
  };

  const getStatusBadge = (user) => {
    if (user.isDeleted) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-800">
          <Delete className="w-3 h-3" />
          Đã xóa
        </span>
      );
    }

    if (user.inActive) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded bg-yellow-100 text-yellow-800">
          <Cancel className="w-3 h-3" />
          Không hoạt động
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800">
        <CheckCircle className="w-3 h-3" />
        Hoạt động
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[85vh]">
        <div className="flex items-center justify-between p-4 border-b bg-white rounded-t-lg">
          <h3 className="text-lg font-semibold text-gray-900">
            Chi tiết người dùng
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100"
          >
            <Close className="w-5 h-5" />
          </button>
        </div>

        <div
          className="p-4 overflow-y-auto"
          style={{ maxHeight: "calc(85vh - 8rem)" }}
        >
          {/* Avatar & Status - Compact */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded bg-mainColor text-white flex items-center justify-center text-xl font-bold shadow-md">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900">
                {user.name || "Không có tên"}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                {getStatusBadge(user)}
                <span className={`px-2 py-1 text-xs font-medium rounded ${getRoleBadgeColor(user.power, user.role)}`}>
                  {getRoleLabel(user.power, user.role)}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg">
                <Badge className="text-gray-400 w-4 h-4 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500">Mã người dùng</p>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.username || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg">
                <School className="text-gray-400 w-4 h-4 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500">Chức danh</p>
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.title || "Chưa có"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg">
              <Email className="text-gray-400 w-4 h-4 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-medium text-gray-900 break-all">
                  {user.email || "Không có thông tin"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg">
              <Phone className="text-gray-400 w-4 h-4 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">Số điện thoại</p>
                <p className="text-sm font-medium text-gray-900">
                  {user.phone}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg">
              <LocationOn className="text-gray-400 w-4 h-4 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">Địa chỉ</p>
                <p className="text-sm font-medium text-gray-900">
                  {user.address}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg">
                <Cake className="text-gray-400 w-4 h-4 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500">Ngày sinh</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(user.birthday)}
                  </p>
                </div>
              </div>

              <div className="border-l-4 border-blue-500 bg-blue-50 rounded-lg flex items-center gap-2 p-3 border ">
                <Badge className="text-blue-600 w-4 h-4" />
                <span className="text-xs font-medium text-blue-800">
                  Role hệ thống (id {user.idRole ?? "—"}):{" "}
                  {user.role === "assistant" || user.role === "ASSISTANT"
                    ? "Trợ lí NCKH"
                    : user.role}
                </span>
              </div>

              <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <AccessTime className="text-gray-400 w-4 h-4 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500">
                    Thời gian chỉnh sửa gần nhất
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDateTime(user.updatedAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <AccessTime className="text-gray-400 w-4 h-4 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500">
                    Thời gian tạo tài khoản
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDateTime(user.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center p-4 border-t bg-gray-50 rounded-b-lg">
         
          {user.isDeleted && (
            <button
              onClick={handleForceDeleteClick}
              className="flex items-center gap-1 px-2 py-1 text-sm font-medium text-white bg-red-600 border border-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              <DeleteForever size="small" />
              Xóa người dùng
            </button>
          )}

        
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-mainColor hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainColor transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>

      
      <Modal
        isOpen={showForceDeleteModal}
        onClose={() => setShowForceDeleteModal(false)}
        onConfirm={handleConfirmForceDelete}
        title="Xác nhận xóa người dùng"
        message={`Bạn có chắc chắn muốn xóa người dùng "${user?.name}"? Hành động này sẽ xóa vĩnh viễn và không thể khôi phục.`}
        confirmText="Xóa"
        cancelText="Hủy"
        type="delete"
      />
    </div>
  );
};

export default UserDetailModal;
