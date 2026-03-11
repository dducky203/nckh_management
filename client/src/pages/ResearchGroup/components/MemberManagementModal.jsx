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
  Download,
} from "@mui/icons-material";
import researchGroupService from "../../../services/researchGroupService";
import userService from "../../../services/userService";
import { useToast } from "../../../context/ToastContext";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "../../../constants";
import { downloadFileFromResponse } from "../../../utils";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import Modal from "../../../components/common/Modal";
import Button from "../../../components/common/Button";

const MemberManagementModal = ({
  isOpen,
  onClose,
  group,
  onRefresh,
  currentUserId,
}) => {
  const SEARCH_PAGE_SIZE = 5;

  const toast = useToast();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchPage, setSearchPage] = useState(0);
  const [searchHasMore, setSearchHasMore] = useState(false);
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
  const searchContainerRef = useRef(null);

  useEffect(() => {
    if (isOpen && group) {
      fetchMembers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, group]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setShowAddMember(false);
        setSearchTerm("");
        setSearchResults([]);
      }
    };

    if (showAddMember) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAddMember]);

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
      setSearchPage(0);
      setSearchHasMore(false);
      return;
    }

    try {
      setSearching(true);
      const memberType = group?.type === "student" ? "Sinh viên" : "OTHERS";
      const response = await userService.searchUsers(
        searchTerm,
        memberType,
        0,
        SEARCH_PAGE_SIZE,
      );

      const responseData = response?.data || response;
      const users = responseData?.users || [];
      const totalPages = responseData?.totalPages ?? 0;

      if (!Array.isArray(users)) {
        console.error("Invalid response format:", response);
        toast.error("Định dạng dữ liệu không hợp lệ");
        return;
      }

      // Lọc bỏ những user đã là thành viên
      const existingMemberIds = members.map((m) => m.id);
      const filteredUsers = users.filter(
        (user) => !existingMemberIds.includes(user.id),
      );

      setSearchResults(filteredUsers);
      setSearchPage(0);
      setSearchHasMore(1 < totalPages);
    } catch (error) {
      console.error("Error searching users:", error);
      toast.error(error.message || "Không thể tìm kiếm người dùng");
    } finally {
      setSearching(false);
    }
  };

  const mergeUniqueUsersById = (prevUsers, nextUsers) => {
    const map = new Map();
    [...prevUsers, ...nextUsers].forEach((u) => {
      if (u?.id != null) map.set(u.id, u);
    });
    return Array.from(map.values());
  };

  const handleShowMoreUsers = async () => {
    if (!searchHasMore || searching) return;
    if (!searchTerm.trim()) return;

    const memberType = group?.type === "student" ? "Sinh viên" : "OTHERS";
    const nextPage = searchPage + 1;

    try {
      setSearching(true);
      const response = await userService.searchUsers(
        searchTerm,
        memberType,
        nextPage,
        SEARCH_PAGE_SIZE,
      );

      const responseData = response?.data || response;
      const users = responseData?.users || [];
      const totalPages = responseData?.totalPages ?? 0;

      const existingMemberIds = members.map((m) => m.id);
      const filteredUsers = users.filter(
        (user) => !existingMemberIds.includes(user.id),
      );

      setSearchResults((prev) => mergeUniqueUsersById(prev, filteredUsers));
      setSearchPage(nextPage);
      setSearchHasMore(nextPage + 1 < totalPages);
    } catch (error) {
      console.error("Error loading more users:", error);
      toast.error(error.message || "Không thể tải thêm người dùng");
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
      setSearchPage(0);
      setSearchHasMore(false);
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
      await researchGroupService.removeMember(group.id, deleteConfirm.memberId);
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
        editParticipationRate,
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

    // // Validate file type
    // const validTypes = [
    //   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    //   "application/vnd.ms-excel",
    // ];
    // if (!validTypes.includes(file.type)) {
    //   toast.error("Vui lòng chọn file Excel (.xlsx hoặc .xls)");
    //   return;
    // }

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

  const handleDownloadTemplate = async () => {
    try {
      setLoading(true);
      const response =
        await researchGroupService.downloadMemberImportTemplate();

      downloadFileFromResponse(response, "template_import_user_research.xlsx");

      toast.success("Tải file mẫu thành công");
    } catch (error) {
      console.error("Error downloading template:", error);
      toast.error(error.message || "Không thể tải file mẫu");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !group) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-7xl w-full max-h-[90vh] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Quản lý thành viên
              </h2>
              <p className="text-sm text-gray-500">
                Nhóm:{" "}
                <span className="font-medium text-gray-700">
                  {group.groupName}
                </span>
              </p>
            </div>
            <Button
              variant="danger"
              onClick={onClose}
              className=" transition-colors !px-2 !py-1  !rounded-lg"
              aria-label="Đóng"
            >
              <Close />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
            <div className="max-w-full mx-auto">
              {/* Add Member Section */}
              <div className="mb-4 flex gap-2">
                <button
                  onClick={() => setShowAddMember(!showAddMember)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all shadow-sm hover:shadow-md text-sm font-medium"
                >
                  <Add fontSize="small" />
                  Thêm thành viên
                </button>

                <label className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all shadow-sm hover:shadow-md cursor-pointer text-sm font-medium">
                  <UploadFile fontSize="small" />
                  Import từ Excel
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx"
                    onChange={handleImportExcel}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  title="Tải xuống file mẫu"
                  onClick={handleDownloadTemplate}
                  disabled={loading}
                  className="flex items-center justify-center p-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Download fontSize="small" />
                </button>
              </div>

              {showAddMember && (
                <div
                  ref={searchContainerRef}
                  className="mt-4 p-5 bg-white rounded-xl border border-gray-200 shadow-sm relative"
                >
                  <div className="flex gap-3 mb-4">
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
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <button
                      onClick={handleSearchUsers}
                      disabled={searching}
                      className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md font-medium"
                    >
                      {searching ? "Đang tìm..." : "Tìm kiếm"}
                    </button>
                  </div>

                  {searchResults.length > 0 && (
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                      {searchResults.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                              {user.name?.charAt(0)?.toUpperCase() || (
                                <Person />
                              )}
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
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-sm font-medium shadow-sm hover:shadow-md"
                          >
                            Thêm
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {searchResults.length > 0 && searchHasMore && (
                    <button
                      type="button"
                      onClick={handleShowMoreUsers}
                      disabled={searching}
                      className="w-full mt-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50"
                    >
                      {searching ? "Đang tải..." : "Xem thêm"}
                    </button>
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">
                  Danh sách thành viên
                  <span className="ml-2 px-2.5 py-0.5 text-sm bg-blue-100 text-blue-700 rounded-full font-medium">
                    {members.length}
                  </span>
                </h3>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner />
                </div>
              ) : members.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <People
                    className="mx-auto mb-3 text-gray-300"
                    sx={{ fontSize: 48 }}
                  />
                  <p className="text-base">Chưa có thành viên nào</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-200">
                      <tr>
                        <th className="pl-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          STT
                        </th>
                        <th className="px-2 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Họ và tên
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Mã cán bộ
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Đơn vị
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Nhiệm vụ
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Tỷ lệ tham gia
                        </th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
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
                        } else if (
                          group.advisor?.id === member.id &&
                          !member.role
                        ) {
                          role = "Thư ký";
                        }

                        const participationRate =
                          member.participationRate || 100;
                        const isEditing = editingMember === member.id;

                        return (
                          <tr
                            key={member.id}
                            className={`transition-all border-b border-gray-100 last:border-0 ${
                              member.id === currentUserId
                                ? "border-2 border-blue-500 bg-blue-100/50 "
                                : "hover:bg-blue-50"
                            }`}
                          >
                            <td className="pl-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {index + 1}
                            </td>
                            <td className="px-1 py-4">
                              <div className="flex items-center gap-3">
                                <div>
                                  <div className="text-sm font-semibold text-gray-900">
                                    {member.name || member.username}
                                  </div>
                                  {member.title && (
                                    <div className="text-xs text-gray-500">
                                      {member.title}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {member.username || "N/A"}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {member.email || "N/A"}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {member.address || "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {isEditing ? (
                                <select
                                  value={editRole}
                                  onChange={(e) => setEditRole(e.target.value)}
                                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                  disabled={group.leader?.id === member.id}
                                >
                                  <option value="Trưởng nhóm">
                                    Trưởng nhóm
                                  </option>
                                  <option value="Thư ký">Thư ký</option>
                                  <option value="Thành viên">Thành viên</option>
                                </select>
                              ) : (
                                <span
                                  className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-md ${
                                    role === "Trưởng nhóm"
                                      ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                      : role === "Thư ký"
                                        ? "bg-blue-100 text-blue-800 border border-blue-200"
                                        : "bg-gray-100 text-gray-800 border border-gray-200"
                                  }`}
                                >
                                  {role}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              {isEditing ? (
                                <div className="flex items-center gap-2 justify-center">
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={editParticipationRate}
                                    onChange={(e) =>
                                      setEditParticipationRate(
                                        parseInt(e.target.value) || 0,
                                      )
                                    }
                                    className="w-20 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
                                  />
                                  <span className="text-sm font-medium text-gray-600">
                                    %
                                  </span>
                                </div>
                              ) : (
                                <span className="inline-flex items-center px-3 py-1 text-sm font-semibold text-gray-700 bg-gray-100 rounded-md">
                                  {participationRate}%
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <div className="flex items-center justify-center gap-2">
                                {isEditing ? (
                                  <>
                                    <button
                                      onClick={() =>
                                        handleSaveMember(member.id)
                                      }
                                      className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-all hover:shadow-sm"
                                      title="Lưu"
                                    >
                                      <Save fontSize="small" />
                                    </button>
                                    <button
                                      onClick={handleCancelEdit}
                                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all hover:shadow-sm"
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
                                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all hover:shadow-sm"
                                        title="Chỉnh sửa"
                                      >
                                        <Edit fontSize="small" />
                                      </button>
                                    )}
                                    {group.leader?.id !== member.id && (
                                      <button
                                        onClick={() =>
                                          handleDeleteMember(member)
                                        }
                                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all hover:shadow-sm"
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
                </div>
              )}
            </div>
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
