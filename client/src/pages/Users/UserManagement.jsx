import { useState, useEffect, useCallback, useRef } from "react";
import {
  Search,
  PersonAdd,
  ChevronLeft,
  ChevronRight,
  FirstPage,
  LastPage,
} from "@mui/icons-material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import UserTable from "./components/UserTable";
import SearchModal from "./components/SearchModal";
import UserDetailModal from "./components/UserDetailModal";
import UserFormModal from "./components/UserFormModal";
import { useToast } from "../../context/ToastContext";
import userService from "../../services/userService";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { ITEMS_PER_PAGE } from "../../constants";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPower, setFilterPower] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(0); // API sử dụng 0-based indexing
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const toast = useToast();
  const abortControllerRef = useRef(null);

  const fetchUsers = useCallback(async () => {
    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null); // Clear previous errors

      const params = {
        page: currentPage,
        size: ITEMS_PER_PAGE,
        sortBy: "name",
        sortDirection: "asc",
      };

      // Thêm search parameter nếu có
      if (searchTerm && searchTerm.trim()) {
        params.search = searchTerm.trim();
      }

      // Thêm power filter nếu không phải "all"
      if (filterPower !== "all") {
        params.power = parseInt(filterPower);
      }

      // Thêm status filter nếu không phải "all"
      if (filterStatus !== "all") {
        params.status = filterStatus;
      }

      console.log("API Parameters:", params);

      const response = await userService.getAllUsers(params, {
        signal: abortControllerRef.current.signal,
      });

      // Only update state if request wasn't aborted
      if (!abortControllerRef.current.signal.aborted) {
        setUsers(response.users || []);
        setTotalPages(response.totalPages || 0);
        setTotalItems(response.totalItems || 0);
        setError(null);
      }
    } catch (error) {
      // Don't show error if request was aborted
      if (error.name === "AbortError") {
        console.log("Request was aborted");
        return;
      }

      console.error("Lỗi khi tải danh sách users:", error);

      // Only show toast once, not on every rerender
      if (!error.isShown) {
        setError(error.message || "Không thể kết nối đến server");
        error.isShown = true;
      }

      // Reset data on error
      setUsers([]);
      setTotalPages(0);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filterPower, filterStatus, searchTerm]);

  console.log({ users });

  // Effect để handle tất cả data fetching
  useEffect(() => {
    // Nếu có search term thì debounce, nếu không thì gọi ngay
    if (searchTerm.trim()) {
      const timeoutId = setTimeout(() => {
        fetchUsers();
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      // Không có search hoặc search rỗng -> gọi ngay lập tức
      fetchUsers();
    }
  }, [searchTerm, fetchUsers]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + users.length, totalItems);

  // Add retry function
  const handleRetry = () => {
    setError(null);
    fetchUsers();
  };

  // Handle search (với debounce nếu có search term)
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(0);
    setError(null); // Clear error when user types
  };

  const handleFilterChange = (value) => {
    setFilterPower(value);
    setCurrentPage(0);
    setError(null); // Clear error when filter changes

    if (searchTerm.trim()) {
      setSearchTerm("");
    }
  };

  const handleStatusFilterChange = (value) => {
    setFilterStatus(value);
    setCurrentPage(0);
    setError(null); // Clear error when filter changes
    // Clear search để trigger immediate API call
    if (searchTerm.trim()) {
      setSearchTerm("");
    }
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setDetailModalOpen(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormModalOpen(true);
  };

  const handleAdd = () => {
    setEditingUser(null);
    setFormModalOpen(true);
  };

  const handleSave = async (formData) => {
    try {
      setLoading(true);
      if (editingUser) {
        // TODO: Implement update user API call
        console.log("Update user with data:", formData);
        toast.success("Cập nhật người dùng thành công!");
      } else {
        // Tạo user mới
        await userService.createUser(formData);
        toast.success("Thêm người dùng thành công!");
      }
      fetchUsers(); // Refresh data
      return true; // Thành công
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error(
        error.response?.data?.message ||
          "Có lỗi xảy ra khi lưu thông tin người dùng"
      );
      return false; // Thất bại
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      try {
        setLoading(true);
        console.log("Delete user with id:", userId);
        toast.success("Xóa người dùng thành công!");
        fetchUsers(); // Refresh data
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Có lỗi xảy ra khi xóa người dùng");
      } finally {
        setLoading(false);
      }
    }
  };

  const goToPage = (page) => {
    setCurrentPage(page - 1); // Convert to 0-based for API
  };

  const goToFirstPage = () => {
    setCurrentPage(0);
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages - 1);
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const getPageNumbers = () => {
    const pages = [];
    const delta = 2;
    const displayCurrentPage = currentPage + 1; // Convert to 1-based for display

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let start = Math.max(2, displayCurrentPage - delta);
      let end = Math.min(totalPages - 1, displayCurrentPage + delta);

      if (displayCurrentPage <= delta + 2) {
        end = Math.min(5, totalPages - 1);
      }
      if (displayCurrentPage >= totalPages - delta - 1) {
        start = Math.max(totalPages - 4, 2);
      }

      if (start > 2) {
        pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h1>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-mainColor text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors text-sm"
        >
          <PersonAdd fontSize="sm" />
          Thêm người dùng
        </button>
      </div>

      {/* Search & Filter */}
      <div className="mb-4 flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 " />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, mã hoặc email..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-2/3 pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor"
            disabled={loading}
          />
        </div>
        <div className="flex items-center gap-2">
          <FilterAltIcon className="text-gray-400" />
          <select
            value={filterPower}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor"
            disabled={loading}
          >
            <option value="all">Tất cả vai trò</option>
            <option value="1">Trưởng khoa</option>
            <option value="2">Phó khoa</option>
            <option value="3">Cán bộ</option>
            <option value="4">Sinh viên</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => handleStatusFilterChange(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor"
            disabled={loading}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Không hoạt động</option>
            <option value="deleted">Đã xóa</option>
          </select>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">!</span>
              </div>
              <div>
                <p className="text-red-800 font-medium">
                  Không thể tải dữ liệu
                </p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
            <button
              onClick={handleRetry}
              className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
              disabled={loading}
            >
              {loading ? "Đang thử lại..." : "Thử lại"}
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <p className="text-lg font-medium mb-2">Không thể tải dữ liệu</p>
            <p className="text-sm mb-4">
              Vui lòng kiểm tra kết nối mạng hoặc liên hệ quản trị viên
            </p>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-mainColor text-white rounded-md hover:bg-opacity-90 transition-colors"
            >
              Thử lại
            </button>
          </div>
        ) : (
          <UserTable
            users={users}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            currentPage={currentPage}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        )}

        {!error && totalItems > 0 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Hiển thị <span className="font-medium">{startIndex + 1}</span>{" "}
                đến <span className="font-medium">{endIndex}</span> trong tổng
                số <span className="font-medium">{totalItems}</span> người dùng
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={goToFirstPage}
                  disabled={currentPage === 0}
                  className="min-w-[32px] h-8 flex items-center justify-center rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-600"
                  title="Trang đầu"
                >
                  <FirstPage fontSize="sm" />
                </button>

                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 0}
                  className="min-w-[32px] h-8 flex items-center justify-center rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-600"
                  title="Trang trước"
                >
                  <ChevronLeft fontSize="sm" />
                </button>

                <div className="flex gap-1 mx-2">
                  {getPageNumbers().map((page, index) =>
                    page === "..." ? (
                      <span
                        key={`ellipsis-${index}`}
                        className="min-w-[32px] h-8 flex items-center justify-center text-sm text-gray-500"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`min-w-[32px] h-8 px-3 text-sm rounded-md transition-colors ${
                          currentPage + 1 === page
                            ? "bg-blue-500 text-white font-medium shadow-sm"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages - 1}
                  className="min-w-[32px] h-8 flex items-center justify-center rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-600"
                  title="Trang sau"
                >
                  <ChevronRight fontSize="sm" />
                </button>

                <button
                  onClick={goToLastPage}
                  disabled={currentPage === totalPages - 1}
                  className="min-w-[32px] h-8 flex items-center justify-center rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-600"
                  title="Trang cuối"
                >
                  <LastPage fontSize="sm" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        users={users}
        onSelectUser={(user) => toast.success(`Đã chọn: ${user.name}`)}
      />

      <UserDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        user={selectedUser}
      />

      <UserFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSave={handleSave}
        user={editingUser}
      />
    </div>
  );
};

export default UserManagement;
