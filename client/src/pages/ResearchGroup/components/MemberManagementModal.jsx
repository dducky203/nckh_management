import { useState, useEffect } from "react";
import {
  Close,
  Add,
  Delete,
  Search,
  Person,
  Email,
  School,
  People,
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
      const users = response.data?.content || response.data || [];
      
      // Lọc bỏ những user đã là thành viên
      const existingMemberIds = members.map((m) => m.id);
      const filteredUsers = users.filter(
        (user) => !existingMemberIds.includes(user.id)
      );
      
      setSearchResults(filteredUsers);
    } catch (error) {
      console.error("Error searching users:", error);
      toast.error("Không thể tìm kiếm người dùng");
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

  if (!isOpen || !group) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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
            <div className="mb-6">
              <button
                onClick={() => setShowAddMember(!showAddMember)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Add />
                Thêm thành viên
              </button>

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

            {/* Members List */}
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
                <div className="space-y-3">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <Person className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {member.name || member.username}
                            {group.leader?.id === member.id && (
                              <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded">
                                Trưởng nhóm
                              </span>
                            )}
                          </p>
                          <div className="flex items-center gap-4 mt-1">
                            {member.email && (
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Email fontSize="small" />
                                {member.email}
                              </div>
                            )}
                            {member.title && (
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <School fontSize="small" />
                                {member.title}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      {group.leader?.id !== member.id && (
                        <button
                          onClick={() => handleDeleteMember(member)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa thành viên"
                        >
                          <Delete />
                        </button>
                      )}
                    </div>
                  ))}
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

