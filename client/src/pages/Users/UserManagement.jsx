import { useState, useEffect, useCallback, useRef } from "react";
import { Search, PersonAdd } from "@mui/icons-material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import UserTable from "./components/UserTable";
import SearchModal from "./components/SearchModal";
import UserDetailModal from "./components/UserDetailModal";
import UserFormModal from "./components/UserFormModal";
import { useToast } from "../../context/ToastContext";
import userService from "../../services/userService";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { ITEMS_PER_PAGE } from "../../constants";
import ErrorState from "../../components/common/ErrorState";
import Pagination from "../../components/common/Pagination";
import { usePagination } from "../../hooks";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPower, setFilterPower] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const toast = useToast();
  const abortControllerRef = useRef(null);

  // Use pagination hook
  const pagination = usePagination(0, ITEMS_PER_PAGE);
  const { currentPage, updatePaginationData } = pagination;

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
        updatePaginationData({
          totalPages: response.totalPages || 0,
          totalItems: response.totalItems || 0,
        });
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
      updatePaginationData({ totalPages: 0, totalItems: 0 });
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    updatePaginationData,
    filterPower,
    filterStatus,
    searchTerm,
  ]);

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

  // Add retry function
  const handleRetry = () => {
    setError(null);
    fetchUsers();
  };

  // Handle search (với debounce nếu có search term)
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    pagination.resetPagination();
    setError(null); // Clear error when user types
  };

  const handleFilterChange = (value) => {
    setFilterPower(value);
    pagination.resetPagination();
    setError(null); // Clear error when filter changes

    if (searchTerm.trim()) {
      setSearchTerm("");
    }
  };

  const handleStatusFilterChange = (value) => {
    setFilterStatus(value);
    pagination.resetPagination();
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
        await userService.updateUserByAdmin(formData);
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
      // Throw error để UserFormModal có thể catch và hiển thị lỗi trong input
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (username) => {
    try {
      setLoading(true);
      await userService.deleteUser(username);
      toast.success("Xóa người dùng thành công!");
      fetchUsers(); // Refresh data
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(error.message || "Có lỗi xảy ra khi xóa người dùng");
    } finally {
      setLoading(false);
    }
  };

  const handleForceDelete = async (username, force = true) => {
    try {
      setLoading(true);
      await userService.deleteUser(username, force);
      toast.success("Xóa cứng người dùng thành công!");
      fetchUsers(); // Refresh data
    } catch (error) {
      console.error("Error force deleting user:", error);
      toast.error(error.message || "Có lỗi xảy ra khi xóa cứng người dùng");
    } finally {
      setLoading(false);
    }
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

      {/* Table */}
      <div className="bg-white rounded  border-2 shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <ErrorState onRetry={handleRetry} />
        ) : (
          <UserTable
            users={users}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            currentPage={pagination.currentPage}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        )}

        {!error && pagination.totalItems > 0 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            itemsPerPage={ITEMS_PER_PAGE}
            startIndex={pagination.startIndex}
            endIndex={pagination.endIndex(users)}
            onPageChange={pagination.goToPage}
            onFirstPage={pagination.goToFirstPage}
            onLastPage={pagination.goToLastPage}
            onPreviousPage={pagination.goToPreviousPage}
            onNextPage={pagination.goToNextPage}
            getPageNumbers={pagination.getPageNumbers}
            itemName="người dùng"
          />
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
        onForceDelete={handleForceDelete}
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
