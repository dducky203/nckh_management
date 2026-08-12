import { useState, useEffect, useContext } from "react";
import {
  Search,
  Add,
  Group,
  Person,
  SupervisorAccount,
  Visibility,
  School,
  Topic,
} from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import researchGroupService from "../../services/researchGroupService";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Pagination from "../../components/common/Pagination";
import { ERROR_MESSAGES, getResearchGroupStatusBadge, SUCCESS_MESSAGES } from "../../constants";
import { getSemesterFromDate } from "../../utils/dateHelpers";
import { isStudent } from "../../utils/permissions";
import GroupFormModal from "./components/GroupFormModal";
import GroupDetailModal from "./components/GroupDetailModal";
import { usePagination } from "../../hooks/usePagination";
import Button from "../../components/common/Button";

const ResearchGroupsPublic = () => {
  const { user } = useContext(AuthContext);
  const toast = useToast();
  const userIsStudent = isStudent(user);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("student");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedSemester, setSelectedSemester] = useState("ALL");
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

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
  } = usePagination(0, 12);

  useEffect(() => {
    if (userIsStudent && activeTab === "lecturer") {
      setActiveTab("student");
      resetPagination();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userIsStudent, activeTab]);

  useEffect(() => {
    fetchGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, activeTab, selectedYear, selectedSemester]);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      let startDate = null;
      let endDate = null;

      if (activeTab === "student" && selectedYear) {
        const year = parseInt(selectedYear, 10);
        if (selectedSemester === "1") {
          startDate = new Date(year, 7, 1).toISOString();
          endDate = new Date(year + 1, 0, 31, 23, 59, 59).toISOString();
        } else if (selectedSemester === "2") {
          startDate = new Date(year + 1, 1, 1).toISOString();
          endDate = new Date(year + 1, 6, 31, 23, 59, 59).toISOString();
        } else {
          // ALL semesters in that year
          startDate = new Date(year, 7, 1).toISOString();
          endDate = new Date(year + 1, 6, 31, 23, 59, 59).toISOString();
        }
      }

      const response = await researchGroupService.getAllGroupPublic(
        searchTerm,
        activeTab,
        currentPage,
        12,
        startDate,
        endDate
      );
      const responseData = response.data || response;
      setGroups(responseData?.groups || []);
      updatePaginationData(responseData);
    } catch (error) {
      console.error("Error fetching groups:", error);
      toast.error(error.message || ERROR_MESSAGES.DATA.LOAD_ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    resetPagination();
    fetchGroups();
  };

  const handleTabChange = (tab) => {
    if (userIsStudent && tab === "lecturer") return;
    setActiveTab(tab);
    resetPagination();
  };

  const handleCreateGroup = () => {
    if (!user) {
      toast.error(ERROR_MESSAGES.AUTH.LOGIN_REQUIRED);
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
      toast.success(SUCCESS_MESSAGES.AUTH.REGISTER_GROUP_SUCCESS);
      setFormModalOpen(false);
      return true;
    } catch (error) {
      toast.error(error.message || ERROR_MESSAGES.SYSTEM.SERVER);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center sm:justify-start gap-3">
            <div className="p-2 bg-mainColor rounded-lg text-white">
              <School fontSize="large" />
            </div>
            Nhóm Nghiên Cứu Khoa Học
          </h1>
          <p className="mt-3 text-gray-600 text-lg">
            Khám phá và tham gia các đề tài nghiên cứu khoa học tại trường
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-8">
          <div className="flex flex-col gap-4">
            {/* Top Row: Tabs and Actions */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex bg-gray-100 p-1.5 rounded-lg w-full lg:w-auto">
                <button
                  onClick={() => handleTabChange("student")}
                  className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-md text-sm font-semibold transition-all duration-200 ${
                    activeTab === "student"
                      ? "bg-white text-mainColor shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <School fontSize="small" />
                  Nhóm Sinh viên
                </button>
                {!userIsStudent && (
                <button
                  onClick={() => handleTabChange("lecturer")}
                  className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-md text-sm font-semibold transition-all duration-200 ${
                    activeTab === "lecturer"
                      ? "bg-white text-mainColor shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <SupervisorAccount fontSize="small" />
                  Nhóm Giảng viên
                </button>
                )}
              </div>

              <div className="flex w-full lg:w-auto gap-3 items-center">
                <form
                  onSubmit={handleSearch}
                  className="relative flex-1 sm:w-80 group flex gap-2"
                >
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-mainColor" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm đề tài..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-mainColor focus:border-mainColor focus:bg-white transition-all outline-none text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-mainColor text-white rounded-lg hover:bg-mainColor/90 transition-colors text-sm font-medium"
                  >
                    Tìm kiếm
                  </button>
                </form>

                <button
                  onClick={handleCreateGroup}
                  className="flex items-center justify-center gap-2 px-5 py-2 bg-mainColor text-white font-medium rounded-lg hover:bg-mainColor/90 active:bg-mainColor transition-colors shadow-sm text-sm whitespace-nowrap"
                >
                  <Add fontSize="small" />
                  <span className="hidden sm:inline">Đăng ký mới</span>
                </button>
              </div>
            </div>

            {activeTab === "lecturer" && (
              <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-gray-100">
                <p className="text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                  Giảng viên tham gia nhóm bằng cách bấm <strong>Đăng ký tham gia</strong> trên từng nhóm.
                  Trưởng nhóm duyệt trong mục <strong>Quản lý nhóm NCKH</strong>.
                </p>
              </div>
            )}

            {/* Bottom Row: Filters */}
            {activeTab === "student" && (
              <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-gray-100">
                <span className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  Bộ lọc:
                </span>
                <select
                  value={selectedYear}
                  onChange={(e) => {
                    setSelectedYear(e.target.value);
                    resetPagination();
                  }}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-mainColor focus:border-mainColor focus:bg-white transition-all outline-none"
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
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-mainColor focus:border-mainColor focus:bg-white transition-all outline-none"
                >
                  <option value="ALL">Tất cả học kỳ</option>
                  <option value="1">Học kỳ 1</option>
                  <option value="2">Học kỳ 2</option>
                </select>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500 px-1">
            <span className="font-semibold text-mainColor bg-mainColor/10 px-3 py-1 rounded-full">
              Tổng: {totalItems} nhóm
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <LoadingSpinner />
            <p className="mt-4 text-gray-500">Đang tải dữ liệu...</p>
          </div>
        ) : groups.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-16 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <School className="text-gray-300" sx={{ fontSize: 40 }} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Chưa có nhóm nào
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {searchTerm
                ? `Không tìm thấy kết quả cho từ khóa "${searchTerm}"`
                : "Hiện tại chưa có nhóm nghiên cứu nào trong danh sách này."}
            </p>
            {searchTerm && (
              <Button
                onClick={() => {
                  setSearchTerm("");
                  resetPagination();
                  fetchGroups();
                }}
                className="bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Xóa bộ lọc
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {groups.map((group) => (
                <div
                  key={group.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-mainColor/50 transition-all duration-300 flex flex-col group overflow-hidden"
                >
                  <div className="p-5 flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wide bg-mainColor/10 text-mainColor">
                        {activeTab === "student" ? "Sinh viên" : "Giảng viên"}
                      </div>
                      <span className="text-xs text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded">
                        {activeTab === "student" ? getSemesterFromDate(group.createdAt) : getSemesterFromDate(group.createdAt)}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-mainColor transition-colors h-14">
                      {group.groupName}
                    </h3>

                    <div className="space-y-3">
                      {activeTab === "student" && (
                        <div className="flex items-start gap-3">
                          <Topic
                            className="text-gray-400 mt-0.5"
                            fontSize="small"
                          />
                          <div>
                            <p className="text-xs text-gray-500 mb-0.5">
                              Đề tài
                            </p>
                            <p className="text-sm text-gray-900 font-medium line-clamp-2">
                              {group.topicName}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="w-full h-px bg-gray-100 my-2"></div>

                      <div className="flex items-center gap-3">
                        <Person className="text-gray-400" fontSize="small" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500">Trưởng nhóm</p>
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {group.leader?.name || "N/A"}
                          </p>
                        </div>
                      </div>

                      {activeTab === "student" && (
                        <div className="flex items-center gap-3">
                          <SupervisorAccount
                            className="text-gray-400"
                            fontSize="small"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500">GVHD</p>
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {group.advisor?.name || "N/A"}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Group fontSize="small" className="text-mainColor" />
                      <span className="text-sm font-medium">
                        {group.members?.length || 0} thành viên
                      </span>
                    </div>
                    <button
                      onClick={() => handleViewDetail(group)}
                      className="text-mainColor hover:opacity-80 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      Chi tiết <Visibility fontSize="small" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

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

      {formModalOpen && (
        <GroupFormModal
          isOpen={formModalOpen}
          onClose={() => setFormModalOpen(false)}
          onSave={handleSaveGroup}
          group={null}
          currentUserId={user?.id}
          defaultType={userIsStudent ? "student" : activeTab}
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
          getStatusBadge={() => getResearchGroupStatusBadge("APPROVED")}
          userIsStudent={userIsStudent}
        />
      )}
    </div>
  );
};

export default ResearchGroupsPublic;
