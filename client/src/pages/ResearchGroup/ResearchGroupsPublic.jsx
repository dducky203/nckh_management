import { useState, useEffect, useContext } from "react";
import {
  Search,
  Add,
  Group,
  Person,
  SupervisorAccount,
  CheckCircle,
  Visibility,
  School,
} from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import researchGroupService from "../../services/researchGroupService";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Pagination from "../../components/common/Pagination";
import { ERROR_MESSAGES, formatDate } from "../../constants";
import GroupFormModal from "./components/GroupFormModal";
import GroupDetailModal from "./components/GroupDetailModal";
import { usePagination } from "../../hooks/usePagination";

const ResearchGroupsPublic = () => {
  const { user } = useContext(AuthContext);
  const toast = useToast();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    goToPage,
    goToFirstPage,
    goToLastPage,
    goToPreviousPage,
    goToNextPage,
    getPageNumbers,
    updatePaginationData,
    resetPagination,
  } = usePagination(0, 12);

  useEffect(() => {
    fetchGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await researchGroupService.getAllGroups(
        searchTerm,
        "APPROVED", // Chỉ lấy nhóm đã duyệt
        currentPage,
        12
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

  const handleSearch = (e) => {
    e.preventDefault();
    resetPagination();
    fetchGroups();
  };

  const handleCreateGroup = () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để tạo nhóm nghiên cứu");
      return;
    }
    setFormModalOpen(true);
  };

  const handleViewDetail = (group) => {
    setSelectedGroup(group);
    setDetailModalOpen(true);
  };

  const handleSaveGroup = async (groupData) => {
    try {
      await researchGroupService.createGroup(groupData);
      toast.success("Đăng ký nhóm thành công");
      setFormModalOpen(false);
      return true;
    } catch (error) {
      toast.error(error.message || ERROR_MESSAGES.SERVER_ERROR);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <School className="text-blue-600" />
            Nhóm Nghiên Cứu Khoa Học
          </h1>
          <p className="mt-2 text-gray-600">
            Khám phá và tham gia các nhóm nghiên cứu khoa học tại trường
          </p>
        </div>

        {/* Search Bar */}
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
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Tìm kiếm
              </button>
            </form>

            <button
              onClick={handleCreateGroup}
              className="flex items-center justify-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
            >
              <Add />
              Đăng ký nhóm mới
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-6 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 mb-1">Tổng số nhóm nghiên cứu</p>
              <p className="text-4xl font-bold">{totalItems}</p>
            </div>
            <Group sx={{ fontSize: 64, opacity: 0.3 }} />
          </div>
        </div>

        {/* Groups Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner />
          </div>
        ) : groups.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <School
              className="mx-auto text-gray-300 mb-4"
              sx={{ fontSize: 64 }}
            />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Chưa có nhóm nào
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm
                ? "Không tìm thấy nhóm phù hợp"
                : "Hãy là người đầu tiên đăng ký nhóm nghiên cứu"}
            </p>
            <button
              onClick={handleCreateGroup}
              className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Add />
              Đăng ký nhóm mới
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {groups.map((group) => (
                <div
                  key={group.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-bold text-white line-clamp-2 flex-1">
                        {group.groupName}
                      </h3>
                     
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4">
                    {/* Topic */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-1">Đề tài:</p>
                      <p className="text-gray-900 font-medium line-clamp-2">
                        {group.topicName}
                      </p>
                    </div>

                    {/* Description */}
                    {group.description && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {group.description}
                        </p>
                      </div>
                    )}

                    {/* Leader */}
                    <div className="mb-3 flex items-center gap-2 text-sm">
                      <Person className="text-blue-600" fontSize="small" />
                      <span className="text-gray-500">Trưởng nhóm:</span>
                      <span className="font-medium text-gray-900">
                        {group.leader?.name || "N/A"}
                      </span>
                    </div>

                    {/* Advisor */}
                    <div className="mb-3 flex items-center gap-2 text-sm">
                      <SupervisorAccount
                        className="text-purple-600"
                        fontSize="small"
                      />
                      <span className="text-gray-500">GVHD:</span>
                      <span className="font-medium text-gray-900">
                        {group.advisor?.name || "N/A"}
                      </span>
                    </div>

                    {/* Members Count */}
                    <div className="mb-4 flex items-center gap-2 text-sm">
                      <Group className="text-green-600" fontSize="small" />
                      <span className="text-gray-500">Thành viên:</span>
                      <span className="font-medium text-gray-900">
                        {group.members?.length || 0} người
                      </span>
                    </div>

                    {/* Created Date */}
                    <div className="pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        Ngày thành lập: {formatDate(group.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-4 pb-4">
                    <button
                      onClick={() => handleViewDetail(group)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                    >
                      <Visibility fontSize="small" />
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={12}
                startIndex={currentPage * 12}
                endIndex={Math.min((currentPage + 1) * 12, totalItems)}
                onPageChange={goToPage}
                onFirstPage={goToFirstPage}
                onLastPage={() => goToLastPage(totalPages)}
                onPreviousPage={goToPreviousPage}
                onNextPage={() => goToNextPage(totalPages)}
                getPageNumbers={getPageNumbers}
                itemName="nhóm"
              />
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {formModalOpen && (
        <GroupFormModal
          isOpen={formModalOpen}
          onClose={() => setFormModalOpen(false)}
          onSave={handleSaveGroup}
          group={null}
          currentUserId={user?.id}
        />
      )}

      {detailModalOpen && selectedGroup && (
        <GroupDetailModal
          isOpen={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          group={selectedGroup}
          isAdmin={false}
          currentUserId={user?.id}
          onApprove={() => {}}
          onReject={() => {}}
          onEdit={() => {}}
          getStatusBadge={() => ({
            label: "Đã duyệt",
            color: "bg-green-100 text-green-800",
            icon: CheckCircle,
          })}
        />
      )}
    </div>
  );
};

export default ResearchGroupsPublic;
