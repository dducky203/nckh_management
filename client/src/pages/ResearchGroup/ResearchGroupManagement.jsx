import { useState, useEffect, useContext } from "react";
import {
  Search,
  Add,
  Group,
  Menu,
  ChevronLeft,
} from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import researchGroupService from "../../services/researchGroupService";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Pagination from "../../components/common/Pagination";
import Modal from "../../components/common/Modal";
import {
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
  getResearchGroupStatusBadge,
  RESEARCH_GROUP_STATUS_FILTER_OPTIONS,
} from "../../constants";
import GroupTable from "./components/GroupTable";
import { canViewAllGroups, canAccessQuotaPages } from "../../utils/permissions";
import GroupFormModal from "./components/GroupFormModal";
import GroupDetailModal from "./components/GroupDetailModal";
import MemberManagementModal from "./components/MemberManagementModal";
import ProductManagementModal from "./components/ProductManagementModal";
import { usePagination } from "../../hooks/usePagination";
import Button from "../../components/common/Button";
import Statistic from "./components/Statistic";

import { useNavigate } from "react-router-dom";

const ResearchGroupManagement = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const toast = useToast();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [activeTab, setActiveTab] = useState("my-groups"); // my-groups, student, or lecturer
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedSemester, setSelectedSemester] = useState("ALL");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [managementGroup, setManagementGroup] = useState(null);
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

  const isAdmin = canViewAllGroups(user);
  const canBrowseCatalog = canAccessQuotaPages(user);

  useEffect(() => {
    if (!canBrowseCatalog && activeTab !== "my-groups") {
      setActiveTab("my-groups");
      resetPagination();
    }
  }, [canBrowseCatalog, activeTab, resetPagination]);

  useEffect(() => {
    fetchGroups();
    if (isAdmin) {
      fetchStatistics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, statusFilter, activeTab, selectedYear, selectedSemester]);

  const fetchGroups = async () => {
    try {
      setLoading(true);

      if (activeTab === "my-groups") {
        // Call my-groups API endpoint
        const response = await researchGroupService.getMyGroups();
        const responseData = response.data || response;
        const myGroups = responseData || [];
        setGroups(myGroups);
        // No pagination for my-groups
        updatePaginationData({
          totalItems: myGroups.length,
          totalPages: 1,
          currentPage: 0,
        });
      } else {
        // Calculate startDate and endDate for student groups
        let startDate = null;
        let endDate = null;

        if (activeTab === "student" && selectedYear) {
          const year = parseInt(selectedYear, 10);
          if (selectedSemester === "1") {
            startDate = new Date(year, 7, 1).toISOString(); // Tháng 8 năm đó
            endDate = new Date(year + 1, 0, 31, 23, 59, 59).toISOString(); // Tháng 1 năm sau
          } else if (selectedSemester === "2") {
            startDate = new Date(year + 1, 1, 1).toISOString(); // Tháng 2 năm sau
            endDate = new Date(year + 1, 6, 31, 23, 59, 59).toISOString(); // Tháng 7 năm sau
          } else {
             // ALL semesters in that year
             startDate = new Date(year, 7, 1).toISOString();
             endDate = new Date(year + 1, 6, 31, 23, 59, 59).toISOString();
          }
        }

        // Admin: mọi trạng thái. Cán bộ/GV: chỉ nhóm đã duyệt (API công khai).
        if (isAdmin) {
          const response = await researchGroupService.getAllGroups(
            searchTerm,
            statusFilter,
            activeTab,
            currentPage,
            9,
            startDate,
            endDate
          );
          const responseData = response.data || response;
          setGroups(responseData?.groups || []);
          updatePaginationData(responseData);
        } else {
          const response = await researchGroupService.getAllGroupPublic(
            searchTerm,
            activeTab,
            currentPage,
            9,
            startDate,
            endDate
          );
          const responseData = response.data || response;
          setGroups(responseData?.groups || []);
          updatePaginationData(responseData);
        }
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
      toast.error(error.message || ERROR_MESSAGES.DATA.LOAD_ERROR);
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

  const handleManageMembers = (group) => {
    setManagementGroup(group);
    setMemberModalOpen(true);
  };

  const handleManageProductsAndCompletion = (group) => {
    if (group.type !== "student") {
      navigate("/activity/group-quota");
    } else {
      setManagementGroup(group);
      setProductModalOpen(true);
    }
  };

  const handleApprove = (groupId) => {
    setConfirmModal({ isOpen: true, type: "approve", groupId });
  };

  const confirmApprove = async () => {
    try {
      await researchGroupService.approveGroup(confirmModal.groupId);
      toast.success(SUCCESS_MESSAGES.GROUP.APPROVED);
      setConfirmModal({ isOpen: false, type: "", groupId: null });
      fetchGroups();
      if (isAdmin) fetchStatistics();
    } catch (error) {
      toast.error(error.message || ERROR_MESSAGES.SYSTEM.SERVER);
    }
  };

  const handleReject = (groupId) => {
    setConfirmModal({ isOpen: true, type: "reject", groupId, reason: "" });
  };

  const confirmReject = async () => {
    try {
      await researchGroupService.rejectGroup(
        confirmModal.groupId,
        confirmModal.reason,
      );
      toast.success(SUCCESS_MESSAGES.GROUP.REJECTED);
      setConfirmModal({ isOpen: false, type: "", groupId: null, reason: "" });
      fetchGroups();
      if (isAdmin) fetchStatistics();
    } catch (error) {
      toast.error(error.message || ERROR_MESSAGES.SYSTEM.SERVER);
    }
  };

  const handleDelete = (groupId) => {
    setConfirmModal({ isOpen: true, type: "delete", groupId });
  };

  const confirmDelete = async () => {
    try {
      await researchGroupService.deleteGroup(confirmModal.groupId);
      toast.success(SUCCESS_MESSAGES.COMMON.DELETE);
      setConfirmModal({ isOpen: false, type: "", groupId: null });
      fetchGroups();
      if (isAdmin) fetchStatistics();
    } catch (error) {
      toast.error(error.message || ERROR_MESSAGES.SYSTEM.SERVER);
    }
  };

  const handleSaveGroup = async (groupData) => {
    try {
      if (selectedGroup) {
        await researchGroupService.updateGroup(selectedGroup.id, groupData);
        toast.success(SUCCESS_MESSAGES.GROUP.UPDATED);
      } else {
        await researchGroupService.createGroup(groupData);
        toast.success(SUCCESS_MESSAGES.GROUP.CREATED);
      }
      setFormModalOpen(false);
      fetchGroups();
      if (isAdmin) fetchStatistics();
      return true;
    } catch (error) {
      toast.error(error.message || ERROR_MESSAGES.SYSTEM.SERVER);
      throw error;
    }
  };

  const getStatusBadge = getResearchGroupStatusBadge;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Group className="text-blue-600" />
            Quản lý Nhóm NCKH
          </h1>
        </div>

        <div className="flex gap-3">
          {/* Sidebar Navigation */}
          {canBrowseCatalog && (
            <div
              className={`bg-white rounded-lg shadow-sm transition-all duration-300 ${
                sidebarOpen ? "w-48" : "w-0 overflow-hidden"
              }`}
            >
              {sidebarOpen && (
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-700">Loại nhóm</h3>
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <ChevronLeft />
                    </button>
                  </div>
                  <nav className="space-y-2">
                    <button
                      onClick={() => {
                        setActiveTab("my-groups");
                        resetPagination();
                      }}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                        activeTab === "my-groups"
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Nhóm của tôi
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("lecturer");
                        resetPagination();
                      }}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                        activeTab === "lecturer"
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Nhóm Giảng viên
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("student");
                        resetPagination();
                      }}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                        activeTab === "student"
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Nhóm Sinh viên
                    </button>
                  </nav>
                </div>
              )}
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {/* Toggle Button when sidebar is closed */}
            {canBrowseCatalog && !sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="mb-4 p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-gray-600 hover:text-gray-900"
              >
                <Menu />
              </button>
            )}

            {/* Statistics Cards - Admin Only */}
            {isAdmin && statistics && <Statistic statistics={statistics} />}

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-100">
              <div className="flex flex-col gap-4">
                {/* Top Row: Search and Actions */}
                <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
                  <form onSubmit={handleSearch} className="flex-1 w-full md:max-w-md flex gap-2">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Tìm kiếm nhóm, đề tài..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Tìm kiếm
                    </Button>
                  </form>

                  <button
                    onClick={handleCreateGroup}
                    className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium whitespace-nowrap shadow-sm"
                  >
                    <Add fontSize="small" />
                    Tạo nhóm mới
                  </button>
                </div>

                {/* Bottom Row: Filters */}
                <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-gray-100">
                  <span className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    Bộ lọc:
                  </span>
                  
                  {isAdmin && (
                    <select
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value);
                        resetPagination();
                      }}
                      className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                      <option value="ALL">Tất cả trạng thái</option>
                      {RESEARCH_GROUP_STATUS_FILTER_OPTIONS.map(({ value, label }) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  )}

                  {activeTab === "student" && (
                    <>
                      <select
                        value={selectedYear}
                        onChange={(e) => {
                          setSelectedYear(e.target.value);
                          resetPagination();
                        }}
                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      >
                        {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                          <option key={year} value={year}>
                            Năm học {year}-{year + 1}
                          </option>
                        ))}
                      </select>
                      <select
                        value={selectedSemester}
                        onChange={(e) => {
                          setSelectedSemester(e.target.value);
                          resetPagination();
                        }}
                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      >
                        <option value="ALL">Tất cả học kỳ</option>
                        <option value="1">Học kỳ 1</option>
                        <option value="2">Học kỳ 2</option>
                      </select>
                    </>
                  )}
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
                  currentUser={user}
                  onViewDetail={handleViewDetail}
                  onEdit={handleEditGroup}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onDelete={handleDelete}
                  getStatusBadge={getStatusBadge}
                  onManageMembers={handleManageMembers}
                  onManageProductsAndCompletion={
                    handleManageProductsAndCompletion
                  }
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
        </div>
      </div>

      {/* Modals */}
      {formModalOpen && (
        <GroupFormModal
          isOpen={formModalOpen}
          onClose={() => setFormModalOpen(false)}
          onSave={handleSaveGroup}
          group={selectedGroup}
          currentUserId={user?.id}
          defaultType={
            activeTab === "student" || activeTab === "lecturer"
              ? activeTab
              : "student"
          }
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

      {memberModalOpen && managementGroup && (
        <MemberManagementModal
          isOpen={memberModalOpen}
          onClose={() => {
            setMemberModalOpen(false);
            setManagementGroup(null);
          }}
          group={managementGroup}
          onRefresh={fetchGroups}
          currentUserId={user?.id}
        />
      )}

      {productModalOpen && (
        <ProductManagementModal
          isOpen={productModalOpen}
          group={managementGroup}
          onClose={() => {
            setProductModalOpen(false);
            setManagementGroup(null);
          }}
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
