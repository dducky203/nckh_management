import { useState, useEffect, useContext } from "react";
import {
  Search,
  Add,
  Group,
  CheckCircle,
  Cancel,
  Pending,
} from "@mui/icons-material";
import { AuthContext } from "../../../../context/AuthContext";
import { useToast } from "../../../../context/ToastContext";
import researchGroupService from "../../../../services/researchGroupService";
import LoadingSpinner from "../../../../components/common/LoadingSpinner";
import Pagination from "../../../../components/common/Pagination";
import Modal from "../../../../components/common/Modal";
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from "../../../../constants";
import GroupTable from "../../../ResearchGroup/components/GroupTable";
import GroupFormModal from "../../../ResearchGroup/components/GroupFormModal";
import GroupDetailModal from "../../../ResearchGroup/components/GroupDetailModal";
import { usePagination } from "../../../../hooks/usePagination";
import Button from "../../../../components/common/Button";

const ResearchGroupManagement = () => {
  const { user } = useContext(AuthContext);
  const toast = useToast();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: "",
    groupId: null,
    reason: "",
  });

  const {
    currentPage,
    totalPages,
    totalItems,
    goToPage,
    goToFirstPage,
    goToLastPage,
    goToPreviousPage,
    goToNextPage,
    getPageNumbers,
    updatePaginationData,
    resetPagination,
  } = usePagination(0, 9);

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    fetchGroups();
    if (isAdmin) {
      fetchStatistics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, statusFilter]);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await researchGroupService.getAllGroups(
        searchTerm,
        statusFilter,
        currentPage,
        9
      );
      const responseData = response.data || response;
      setGroups(responseData?.groups || []);
      updatePaginationData(responseData);
    } catch (error) {
      console.error("Error fetching groups:", error);
      toast.error(error.message || ERROR_MESSAGES.LOAD_DATA_ERROR);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await researchGroupService.getStatistics();
      setStatistics(response.data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    resetPagination();
    fetchGroups();
  };

  const handleCreateGroup = () => {
    setSelectedGroup(null);
    setFormModalOpen(true);
  };

  const handleEditGroup = (group) => {
    setSelectedGroup(group);
    setFormModalOpen(true);
  };

  const handleViewDetail = (group) => {
    setSelectedGroup(group);
    setDetailModalOpen(true);
  };

  const handleApprove = (groupId) => {
    setConfirmModal({ isOpen: true, type: "approve", groupId });
  };

  const confirmApprove = async () => {
    try {
      await researchGroupService.approveGroup(confirmModal.groupId);
      toast.success(SUCCESS_MESSAGES.GROUP_APPROVED);
      setConfirmModal({ isOpen: false, type: "", groupId: null });
      fetchGroups();
      if (isAdmin) fetchStatistics();
    } catch (error) {
      toast.error(error.message || ERROR_MESSAGES.SERVER_ERROR);
    }
  };

  const handleReject = (groupId) => {
    setConfirmModal({ isOpen: true, type: "reject", groupId, reason: "" });
  };

  const confirmReject = async () => {
    try {
      await researchGroupService.rejectGroup(
        confirmModal.groupId,
        confirmModal.reason
      );
      toast.success(SUCCESS_MESSAGES.GROUP_REJECTED);
      setConfirmModal({ isOpen: false, type: "", groupId: null, reason: "" });
      fetchGroups();
      if (isAdmin) fetchStatistics();
    } catch (error) {
      toast.error(error.message || ERROR_MESSAGES.SERVER_ERROR);
    }
  };

  const handleDelete = (groupId) => {
    setConfirmModal({ isOpen: true, type: "delete", groupId });
  };
  const confirmDelete = async () => {
    try {
      await researchGroupService.deleteGroup(confirmModal.groupId);
      toast.success(SUCCESS_MESSAGES.DELETE_SUCCESS);
      setConfirmModal({ isOpen: false, type: "", groupId: null });
      fetchGroups();
      if (isAdmin) fetchStatistics();
    } catch (error) {
      toast.error(error.message || ERROR_MESSAGES.SERVER_ERROR);
    }
  };

  const handleSaveGroup = async (groupData) => {
    try {
      if (selectedGroup) {
        await researchGroupService.updateGroup(selectedGroup.id, groupData);
        toast.success(SUCCESS_MESSAGES.GROUP_UPDATED);
      } else {
        await researchGroupService.createGroup(groupData);
        toast.success(SUCCESS_MESSAGES.GROUP_CREATED);
      }
      setFormModalOpen(false);
      fetchGroups();
      if (isAdmin) fetchStatistics();
      return true;
    } catch (error) {
      toast.error(error.message || ERROR_MESSAGES.SERVER_ERROR);
      throw error;
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: {
        label: "Chờ duyệt",
        color: "bg-yellow-100 text-yellow-800",
        icon: Pending,
      },
      APPROVED: {
        label: "Đã duyệt",
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
      },
      REJECTED: {
        label: "Từ chối",
        color: "bg-red-100 text-red-800",
        icon: Cancel,
      },
    };
    return statusConfig[status] || statusConfig.PENDING;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Group className="text-blue-600" />
            Quản lý Nhóm NCKH
          </h1>
          
        </div>

        {/* Statistics Cards - Admin Only */}
        {isAdmin && statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tổng nhóm</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statistics.totalGroups}
                  </p>
                </div>
                <Group className="text-blue-600" fontSize="large" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Chờ duyệt</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {statistics.pendingGroups}
                  </p>
                </div>
                <Pending className="text-yellow-600" fontSize="large" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Đã duyệt</p>
                  <p className="text-2xl font-bold text-green-600">
                    {statistics.approvedGroups}
                  </p>
                </div>
                <CheckCircle className="text-green-600" fontSize="large" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Từ chối</p>
                  <p className="text-2xl font-bold text-red-600">
                    {statistics.rejectedGroups}
                  </p>
                </div>
                <Cancel className="text-red-600" fontSize="large" />
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1 flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên nhóm hoặc đề tài..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <Button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Tìm kiếm
              </Button>
            </form>

            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  resetPagination();
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value="PENDING">Chờ duyệt</option>
                <option value="APPROVED">Đã duyệt</option>
                <option value="REJECTED">Từ chối</option>
              </select>

              <button
                onClick={handleCreateGroup}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Add />
                Tạo nhóm mới
              </button>
            </div>
          </div>
        </div>

        {/* Groups Table */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner />
          </div>
        ) : groups.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Group
              className="mx-auto text-gray-300 mb-4"
              sx={{ fontSize: 64 }}
            />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Chưa có nhóm nào
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm
                ? "Không tìm thấy nhóm phù hợp"
                : "Hãy tạo nhóm NCKH đầu tiên"}
            </p>
            <button
              onClick={handleCreateGroup}
              className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Add />
              Tạo nhóm mới
            </button>
          </div>
        ) : (
          <>
            <GroupTable
              groups={groups}
              isAdmin={isAdmin}
              currentUserId={user?.id}
              onViewDetail={handleViewDetail}
              onEdit={handleEditGroup}
              onApprove={handleApprove}
              onReject={handleReject}
              onDelete={handleDelete}
              getStatusBadge={getStatusBadge}
            />

            {/* Pagination */}
            <div className="bg-white rounded-lg shadow-sm">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={9}
                startIndex={0}
                endIndex={groups.length}
                onPageChange={goToPage}
                onFirstPage={goToFirstPage}
                onLastPage={() => goToLastPage(totalPages)}
                onPreviousPage={goToPreviousPage}
                onNextPage={() => goToNextPage(totalPages)}
                getPageNumbers={getPageNumbers}
                itemName="nhóm"
              />
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      {formModalOpen && (
        <GroupFormModal
          isOpen={formModalOpen}
          onClose={() => setFormModalOpen(false)}
          onSave={handleSaveGroup}
          group={selectedGroup}
          currentUserId={user?.id}
        />
      )}

      {detailModalOpen && selectedGroup && (
        <GroupDetailModal
          isOpen={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          group={selectedGroup}
          isAdmin={isAdmin}
          currentUserId={user?.id}
          onApprove={handleApprove}
          onReject={handleReject}
          onEdit={handleEditGroup}
          getStatusBadge={getStatusBadge}
        />
      )}

      {/* Confirm Modals */}
      {confirmModal.type === "approve" && (
        <Modal
          isOpen={confirmModal.isOpen}
          onClose={() =>
            setConfirmModal({ isOpen: false, type: "", groupId: null })
          }
          onConfirm={confirmApprove}
          title="Xác nhận duyệt nhóm"
          message="Bạn có chắc chắn muốn duyệt nhóm nghiên cứu này?"
          confirmText="Duyệt"
          cancelText="Hủy"
          type="info"
        />
      )}

      {confirmModal.type === "reject" && (
        <Modal
          isOpen={confirmModal.isOpen}
          onClose={() =>
            setConfirmModal({
              isOpen: false,
              type: "",
              groupId: null,
              reason: "",
            })
          }
          onConfirm={confirmReject}
          title="Xác nhận từ chối nhóm"
          message={
            <div>
              <p className="mb-4">
                Bạn có chắc chắn muốn từ chối nhóm nghiên cứu này?
              </p>
              <textarea
                placeholder="Nhập lý do từ chối (tùy chọn)..."
                value={confirmModal.reason}
                onChange={(e) =>
                  setConfirmModal({ ...confirmModal, reason: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                rows="3"
              />
            </div>
          }
          confirmText="Từ chối"
          cancelText="Hủy"
          type="warning"
        />
      )}

      {confirmModal.type === "delete" && (
        <Modal
          isOpen={confirmModal.isOpen}
          onClose={() =>
            setConfirmModal({ isOpen: false, type: "", groupId: null })
          }
          onConfirm={confirmDelete}
          title="Xác nhận xóa nhóm"
          message="Bạn có chắc chắn muốn xóa nhóm nghiên cứu này? Hành động này không thể hoàn tác!"
          confirmText="Xóa"
          cancelText="Hủy"
          type="delete"
        />
      )}
    </div>
  );
};

export default ResearchGroupManagement;