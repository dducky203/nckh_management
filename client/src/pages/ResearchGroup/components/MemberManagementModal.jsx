import { useState, useEffect, useRef } from "react";
import {
  Close,
  Add,
  Delete,
  Search,
  Person,
  Email,
  School,
  People,
  Edit,
  Save,
  UploadFile,
} from "@mui/icons-material";
import researchGroupService from "../../../services/researchGroupService";
import userService from "../../../services/userService";
import { useToast } from "../../../context/ToastContext";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "../../../constants";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import Modal from "../../../components/common/Modal";

const MemberManagementModal = ({ isOpen, onClose, group, onRefresh }) => {
  const toast = useToast();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    memberId: null,
    memberName: "",
  });
  const [editingMember, setEditingMember] = useState(null);
  const [editRole, setEditRole] = useState("");
  const [editParticipationRate, setEditParticipationRate] = useState(100);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && group) {
      fetchMembers();
    }
  }, [isOpen, group]);

  const fetchMembers = async () => {
    if (!group?.id) return;

    try {
      setLoading(true);
      const response = await researchGroupService.getGroupById(group.id);
      const groupData = response.data || response;
      setMembers(groupData.members || []);
    } catch (error) {
      console.error("Error fetching members:", error);
      toast.error(error.message || ERROR_MESSAGES.LOAD_DATA_ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchUsers = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearching(true);
      const response = await userService.searchUsers(searchTerm, 0, 10);
      
      // Backend trả về SuccessResponseDTO: { success: true, data: { users: [...], totalItems, ... }, message: "..." }
      // API interceptor đã unwrap response.data, nên response = SuccessResponseDTO
      // Vậy cần lấy: response.data.users
      const responseData = response?.data || response;
      const users = responseData?.users || [];
      
      if (!Array.isArray(users)) {
        console.error("Invalid response format:", response);
        toast.error("Định dạng dữ liệu không hợp lệ");
        return;
      }
      
      // Lọc bỏ những user đã là thành viên
      const existingMemberIds = members.map((m) => m.id);
      const filteredUsers = users.filter(
        (user) => !existingMemberIds.includes(user.id)
      );
      
      setSearchResults(filteredUsers);
    } catch (error) {
      console.error("Error searching users:", error);
      toast.error(error.message || "Không thể tìm kiếm người dùng");
    } finally {
      setSearching(false);
    }
  };

  const handleAddMember = async (userId) => {
    try {
      await researchGroupService.addMember(group.id, userId);
      toast.success(SUCCESS_MESSAGES.MEMBER_ADDED);
      setShowAddMember(false);
      setSearchTerm("");
      setSearchResults([]);
      fetchMembers();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error adding member:", error);
      toast.error(error.message || "Không thể thêm thành viên");
    }
  };

  const handleDeleteMember = (member) => {
    setDeleteConfirm({
      isOpen: true,
      memberId: member.id,
      memberName: member.name || member.username,
    });
  };

  const confirmDeleteMember = async () => {
    try {
      await researchGroupService.removeMember(
        group.id,
        deleteConfirm.memberId
      );
      toast.success(SUCCESS_MESSAGES.MEMBER_REMOVED);
      setDeleteConfirm({ isOpen: false, memberId: null, memberName: "" });
      fetchMembers();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error removing member:", error);
      toast.error(error.message || "Không thể xóa thành viên");
    }
  };

  const handleEditMember = (member) => {
    setEditingMember(member.id);
    setEditRole(member.role || "Thành viên");
    setEditParticipationRate(member.participationRate || 100);
  };

  const handleSaveMember = async (memberId) => {
    try {
      await researchGroupService.updateMemberInfo(
        group.id,
        memberId,
        editRole,
        editParticipationRate
      );
      toast.success("Cập nhật thông tin thành viên thành công");
      setEditingMember(null);
      fetchMembers();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error updating member:", error);
      toast.error(error.message || "Không thể cập nhật thông tin thành viên");
    }
  };

  const handleCancelEdit = () => {
    setEditingMember(null);
    setEditRole("");
    setEditParticipationRate(100);
  };

  const handleImportExcel = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    if (!validTypes.includes(file.type)) {
      toast.error("Vui lòng chọn file Excel (.xlsx hoặc .xls)");
      return;
    }

    try {
      setLoading(true);
      await researchGroupService.importMembersFromExcel(group.id, file);
      toast.success("Import thành viên từ Excel thành công");
      fetchMembers();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error importing members:", error);
      toast.error(error.message || "Không thể import thành viên từ Excel");
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  if (!isOpen || !group) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Quản lý thành viên
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Nhóm: {group.groupName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Close />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Add Member Section */}
            <div className="mb-6 flex gap-3">
              <button
                onClick={() => setShowAddMember(!showAddMember)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Add />
                Thêm thành viên
              </button>
              <label className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
                <UploadFile />
                Import từ Excel
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleImportExcel}
                  className="hidden"
                />
              </label>

            </div>

              {showAddMember && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex gap-2 mb-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Tìm kiếm theo tên, email, username..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") handleSearchUsers();
                        }}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <button
                      onClick={handleSearchUsers}
                      disabled={searching}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                    >
                      {searching ? "Đang tìm..." : "Tìm kiếm"}
                    </button>
                  </div>

                  {searchResults.length > 0 && (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {searchResults.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <Person />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {user.name || user.username}
                              </p>
                              <p className="text-sm text-gray-500">
                                {user.email}
                              </p>
                              {user.title && (
                                <p className="text-xs text-gray-400">
                                  {user.title}
                                </p>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => handleAddMember(user.id)}
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                          >
                            Thêm
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {searchTerm && searchResults.length === 0 && !searching && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      Không tìm thấy người dùng nào
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Members List - Table Format */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Danh sách thành viên ({members.length})
              </h3>

              {loading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : members.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <People className="mx-auto mb-2 text-gray-300" />
                  <p>Chưa có thành viên nào</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                          TT
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                          Họ và tên
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                          Mã cán bộ
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                          Email
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                          Đơn vị
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                          Nhiệm vụ
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                          Tỷ lệ tham gia (%)
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {members.map((member, index) => {
                        // Xác định nhiệm vụ từ member.role hoặc dựa trên leader/advisor
                        let role = member.role || "Thành viên";
                        if (group.leader?.id === member.id) {
                          role = "Trưởng nhóm";
                        } else if (group.advisor?.id === member.id && !member.role) {
                          role = "Thư ký";
                        }

                        const participationRate = member.participationRate || 100;
                        const isEditing = editingMember === member.id;

                        return (
                          <tr
                            key={member.id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              {index + 1}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              <div className="flex items-center gap-2">
                                {member.title && (
                                  <span className="text-xs text-gray-500">
                                    {member.title}
                                  </span>
                                )}
                                <span className="font-medium">
                                  {member.name || member.username}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              {member.username || "N/A"}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {member.email || "N/A"}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {member.address || "N/A"}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              {isEditing ? (
                                <select
                                  value={editRole}
                                  onChange={(e) => setEditRole(e.target.value)}
                                  className="px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  disabled={group.leader?.id === member.id}
                                >
                                  <option value="Trưởng nhóm">Trưởng nhóm</option>
                                  <option value="Thư ký">Thư ký</option>
                                  <option value="Thành viên">Thành viên</option>
                                </select>
                              ) : (
                                <span
                                  className={`px-2 py-1 text-xs font-semibold rounded ${
                                    role === "Trưởng nhóm"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : role === "Thư ký"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {role}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-900">
                              {isEditing ? (
                                <div className="flex items-center gap-2 justify-center">
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={editParticipationRate}
                                    onChange={(e) =>
                                      setEditParticipationRate(
                                        parseInt(e.target.value) || 0
                                      )
                                    }
                                    className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  />
                                  <span className="text-xs">%</span>
                                </div>
                              ) : (
                                `${participationRate}%`
                              )}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-center">
                              <div className="flex items-center justify-center gap-1">
                                {isEditing ? (
                                  <>
                                    <button
                                      onClick={() => handleSaveMember(member.id)}
                                      className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                                      title="Lưu"
                                    >
                                      <Save fontSize="small" />
                                    </button>
                                    <button
                                      onClick={handleCancelEdit}
                                      className="p-1 text-gray-600 hover:bg-gray-50 rounded transition-colors"
                                      title="Hủy"
                                    >
                                      <Close fontSize="small" />
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    {group.leader?.id !== member.id && (
                                      <button
                                        onClick={() => handleEditMember(member)}
                                        className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                        title="Chỉnh sửa"
                                      >
                                        <Edit fontSize="small" />
                                      </button>
                                    )}
                                    {group.leader?.id !== member.id && (
                                      <button
                                        onClick={() => handleDeleteMember(member)}
                                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                        title="Xóa thành viên"
                                      >
                                        <Delete fontSize="small" />
                                      </button>
                                    )}
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <div className="bg-gray-50 px-4 py-2 text-sm text-gray-600 border-t">
                    Danh sách này có {members.length} thành viên
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirm.isOpen}
        onClose={() =>
          setDeleteConfirm({ isOpen: false, memberId: null, memberName: "" })
        }
        onConfirm={confirmDeleteMember}
        title="Xác nhận xóa thành viên"
        message={`Bạn có chắc chắn muốn xóa thành viên "${deleteConfirm.memberName}" khỏi nhóm?`}
        confirmText="Xóa"
        cancelText="Hủy"
        type="delete"
      />
    </>
  );
};

export default MemberManagementModal;

