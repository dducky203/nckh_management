import { useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import {
  Edit,
  Delete,
  Visibility,
  ArrowUpward,
  ArrowDownward,
  UnfoldMore,
  Restore,
} from "@mui/icons-material";
import Modal from "../../../components/common/Modal";

const UserTable = ({
  users,
  onEdit,
  onDelete,
  onView,
  currentPage,
  itemsPerPage,
  sortBy,
  sortDirection,
  onSort,
}) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  // Lấy thông tin người dùng và các hàm từ AuthContext
  const { user: currentUser } = useContext(AuthContext);


  const getRoleLabel = (power) => {
    const roles = {
      1: "Trưởng khoa",
      2: "Phó khoa",
      3: "Cán bộ khoa",
      4: "Sinh viên",
    };
    return roles[power] || "Không xác định";
  };

  const getRoleBadgeColor = (power) => {
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
      return {
        label: "Đã xóa",
        className: "bg-red-100 text-red-800",
      };
    }
    if (user.inActive) {
      return {
        label: "Không hoạt động",
        className: "bg-yellow-100 text-yellow-800",
      };
    }
    return {
      label: "Đang hoạt động",
      className: "bg-green-100 text-green-800",
    };
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      onDelete(userToDelete.id);
      setDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  // Helper function để render sort icon
  const getSortIcon = (field) => {
    if (sortBy !== field) {
      return <UnfoldMore fontSize="small" className="text-gray-400" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUpward fontSize="small" className="text-blue-500" />
    ) : (
      <ArrowDownward fontSize="small" className="text-blue-500" />
    );
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {/* STT */}
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase w-16">
                STT
              </th>

              {/* Người dùng - Sortable */}
              <th
                onClick={() => onSort("name")}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Người dùng</span>
                  {getSortIcon("name")}
                </div>
              </th>

              {/* Mã - Sortable */}
              <th
                onClick={() => onSort("username")}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Mã</span>
                  {getSortIcon("username")}
                </div>
              </th>

              {/* Email - Sortable */}
              <th
                onClick={() => onSort("email")}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Email</span>
                  {getSortIcon("email")}
                </div>
              </th>

              {/* Vai trò - Sortable */}
              <th
                onClick={() => onSort("power")}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Vai trò</span>
                  {getSortIcon("power")}
                </div>
              </th>

              {/* Số điện thoại */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Số điện thoại
              </th>

              {/* Trạng thái */}
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                Trạng thái
              </th>

              {/* Thao tác */}
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase w-32">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y text-sm divide-gray-200">
            {users.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                  Không tìm thấy người dùng nào
                </td>
              </tr>
            ) : (
              users.map((user, index) => {
                const stt = currentPage * itemsPerPage + index + 1;
                return (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* STT */}
                    <td className="px-4 py-3 text-center text-sm text-gray-900 font-medium">
                      {stt}
                    </td>

                    {/* Người dùng */}
                    <td className="px-6 py-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-mainColor text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Mã */}
                    <td className="px-6 py-3 text-sm text-gray-900">
                      {user.username}
                    </td>

                    {/* Email */}
                    <td className="px-6 py-3 text-sm text-gray-500">
                      {user.email}
                    </td>

                    {/* Vai trò */}
                    <td className="px-6 py-3">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${getRoleBadgeColor(
                          user.power
                        )}`}
                      >
                        {getRoleLabel(user.power)}
                      </span>
                    </td>

                    {/* Số điện thoại */}
                    <td className="px-6 py-3  text-sm text-gray-500">
                      {user.phone || "NaN"}
                    </td>

                    {/* Trạng thái */}
                    <td className="px-6 py-3 text-center">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          getStatusBadge(user).className
                        }`}
                      >
                        {getStatusBadge(user).label}
                      </span>
                    </td>

                    {/* Thao tác */}
                    <td className="px-6 py-3">
                      <div className="flex gap-1 justify-center">
                        <button
                          onClick={() => onView(user)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Xem chi tiết"
                        >
                          <Visibility fontSize="small" />
                        </button>

                        {!user.isDeleted ? (
                          <>
                            <button
                              onClick={() => onEdit(user)}
                              className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
                              title="Chỉnh sửa"
                            >
                              <Edit fontSize="small" />
                            </button>
                            {user.username === "admin" ||
                            user.username === currentUser.username ? null : (
                              <button
                                onClick={() => handleDeleteClick(user)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Xóa"
                              >
                                <Delete fontSize="small" />
                              </button>
                            )}
                          </>
                        ) : (
                          <button
                            onClick={() => handleDeleteClick(user)}
                            className="p-1.5 text-mainColor hover:bg-red-50 rounded transition-colors"
                            title="Khôi phục"
                          >
                            <Restore fontSize="small" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Xác nhận xóa người dùng"
        message={`Bạn có chắc chắn muốn xóa người dùng "${userToDelete?.name}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        type="delete"
      />
    </>
  );
};

export default UserTable;
