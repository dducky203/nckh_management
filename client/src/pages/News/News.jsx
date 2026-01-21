import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  AccessTime,
  Person,
  ArrowForward,
  NotificationsActive,
  Campaign,
  PushPin,
  CalendarToday,
  Label,
  School,
  Description,
} from "@mui/icons-material";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Pagination from "../../components/common/Pagination";
import newsService from "../../services/newsService";
import { usePagination } from "../../hooks/usePagination";

// Helper function to strip HTML tags and get plain text
const stripHtml = (html) => {
  if (!html) return "";
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'academic', 'activity'

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
  } = usePagination(0, 10); // Trường học thường hiển thị list dài hơn (10-15 item)

  const fetchNews = useCallback(
    async (search = "", page = 0) => {
      try {
        setLoading(true);
        const response = await newsService.getNews(search, page, 10);
        const data = response?.data;
        setNews(data?.news || []);
        updatePaginationData(data);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    },
    [updatePaginationData],
  );

  useEffect(() => {
    fetchNews(searchTerm, currentPage);
  }, [currentPage, searchTerm, fetchNews]);

  const handleSearch = (e) => {
    e.preventDefault();
    resetPagination();
    fetchNews(searchTerm, 0);
  };

  // Helper để tách ngày tháng hiển thị kiểu lịch
  const getDateDisplay = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: `Th${date.getMonth() + 1}`,
      year: date.getFullYear(),
      full: date.toLocaleDateString("vi-VN"),
    };
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans text-gray-800">
      {/* 1. Header: Kiểu hành chính, gọn gàng */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-mainColor/10 rounded-lg text-mainColor hidden sm:block">
              <Campaign sx={{ fontSize: 32 }} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 uppercase tracking-wide">
                Bảng tin & Thông báo
              </h1>
              <p className="text-gray-500 mt-1 text-sm sm:text-base">
                Cập nhật các thông báo học vụ, sự kiện và tin tức hoạt động
                khoa.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 2. Main Column: Danh sách thông báo */}
          <div className="flex-1">
            {/* Filter Tabs & Search Bar */}
            <div className="bg-white p-4 rounded-t-xl border border-gray-200 border-b-0 flex flex-col sm:flex-row justify-between items-center gap-4">
              {/* Giả lập Tabs lọc danh mục */}
              <div className="flex gap-2 text-sm font-medium w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${activeTab === "all" ? "bg-mainColor text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >
                  Tất cả
                </button>
                <button
                  onClick={() => setActiveTab("academic")}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${activeTab === "academic" ? "bg-mainColor text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >
                  Học vụ
                </button>
                <button
                  onClick={() => setActiveTab("activity")}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${activeTab === "activity" ? "bg-mainColor text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >
                  Hoạt động
                </button>
              </div>

              <form onSubmit={handleSearch} className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Tìm kiếm thông báo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-mainColor focus:border-mainColor outline-none"
                />
                <Search
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                  sx={{ fontSize: 18 }}
                />
              </form>
            </div>

            {/* Content List */}
            <div className="bg-white rounded-b-xl border border-gray-200 shadow-sm min-h-[500px]">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <LoadingSpinner />
                </div>
              ) : news.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <NotificationsActive
                    className="text-gray-300 mb-3"
                    sx={{ fontSize: 48 }}
                  />
                  <p className="text-gray-500">
                    Không tìm thấy thông báo nào phù hợp.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {news.map((item, index) => {
                    const dateObj = getDateDisplay(item.createdAt || item.time);
                    const isPinned =
                      index === 0 && currentPage === 0 && !searchTerm; // Giả lập tin ghim

                    return (
                      <div
                        key={item.id}
                        className={`group p-5 hover:bg-gray-50 transition-colors flex gap-4 sm:gap-6 items-start ${isPinned ? "bg-blue-50/50" : ""}`}
                      >
                        {/* Cột Ngày tháng (Signature của web trường học) */}
                        <div className="hidden sm:flex flex-col items-center justify-center w-16 h-16 bg-white border border-gray-200 rounded-lg shadow-sm shrink-0 group-hover:border-mainColor/50 transition-colors">
                          <span className="text-xs font-bold text-red-500 uppercase tracking-wider">
                            {dateObj.month}
                          </span>
                          <span className="text-2xl font-bold text-gray-800 leading-none">
                            {dateObj.day}
                          </span>
                        </div>

                        {/* Nội dung chính */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            {isPinned && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 text-red-600">
                                <PushPin sx={{ fontSize: 12 }} /> Quan trọng
                              </span>
                            )}
                            <span className="sm:hidden text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded">
                              {dateObj.full}
                            </span>
                            {/* Giả lập tag loại tin */}
                            <span className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                              <School sx={{ fontSize: 12 }} /> Đào tạo
                            </span>
                          </div>

                          <Link
                            to={`/news/details/${item.id}`}
                            className="block"
                          >
                            <h3
                              className={`font-bold text-gray-800 mb-2 group-hover:text-mainColor transition-colors ${isPinned ? "text-lg" : "text-base"}`}
                            >
                              {item.title}
                            </h3>
                          </Link>

                          <p className="text-sm text-gray-600 line-clamp-2 mb-3 leading-relaxed">
                            {stripHtml(item.summary || item.content)}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-xs text-gray-400">
                              <span className="flex items-center gap-1">
                                <Person sx={{ fontSize: 14 }} />
                                {item.author || "Phòng Đào tạo"}
                              </span>
                              <span className="hidden sm:flex items-center gap-1">
                                <AccessTime sx={{ fontSize: 14 }} />
                                {dateObj.year}
                              </span>
                            </div>

                            <Link
                              to={`/news/details/${item.id}`}
                              className="text-xs font-semibold text-mainColor flex items-center gap-1 hover:underline"
                            >
                              Xem chi tiết{" "}
                              <ArrowForward sx={{ fontSize: 12 }} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="mt-6 w-full bg-white rounded-md justify-center sm:justify-end">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                startIndex={currentPage * itemsPerPage}
                endIndex={Math.min(
                  (currentPage + 1) * itemsPerPage,
                  totalItems,
                )}
                onPageChange={goToPage}
                onFirstPage={goToFirstPage}
                onLastPage={() => goToLastPage(totalPages)}
                onPreviousPage={goToPreviousPage}
                onNextPage={() => goToNextPage(totalPages)}
                getPageNumbers={getPageNumbers}
                itemName="bản tin"
              />
            </div>
          </div>

          {/* 3. Sidebar: Thông tin bổ trợ (Style Widget) */}
          <div className="w-full lg:w-80 shrink-0 space-y-6">
            {/* Widget: Thông báo nhanh (Text only list) */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center gap-2">
                <NotificationsActive
                  className="text-red-500"
                  sx={{ fontSize: 20 }}
                />
                <h3 className="font-bold text-gray-800 text-sm uppercase">
                  Thông báo mới
                </h3>
              </div>
              <ul className="divide-y divide-gray-100">
                {[1, 2, 3, 4, 5].map((i) => (
                  <li
                    key={i}
                    className="p-3 hover:bg-gray-50 transition-colors"
                  >
                    <Link to="#" className="block group">
                      <span className="text-xs font-bold text-gray-400 mb-1 block">
                        1{i}/01/2026
                      </span>
                      <p className="text-sm text-gray-700 font-medium group-hover:text-mainColor line-clamp-2">
                        Thông báo về việc đăng ký tín chỉ học kỳ 2 năm học
                        2025-2026 (Đợt {i})
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="p-3 bg-gray-50 border-t border-gray-200 text-center">
                <Link
                  to="#"
                  className="text-xs font-bold text-mainColor hover:underline"
                >
                  Xem tất cả
                </Link>
              </div>
            </div>

            {/* Widget: Liên kết hữu ích */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <h3 className="font-bold text-gray-800 text-sm uppercase mb-4 flex items-center gap-2">
                <Description className="text-blue-500" sx={{ fontSize: 20 }} />
                Biểu mẫu & Quy định
              </h3>
              <div className="space-y-2">
                {[
                  "Quy định đào tạo",
                  "Biểu mẫu sinh viên",
                  "Lịch thi học kỳ",
                  "Quy chế học vụ",
                ].map((link, idx) => (
                  <button
                    key={idx}
                    className="flex items-center w-full p-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-mainColor transition-all text-left group"
                  >
                    <Label
                      className="text-gray-300 group-hover:text-mainColor mr-2"
                      sx={{ fontSize: 16 }}
                    />
                    {link}
                  </button>
                ))}
              </div>
            </div>

            {/* Banner nhỏ (nếu có) */}
            <div className="rounded-xl bg-gradient-to-br from-mainColor to-blue-800 p-5 text-center text-white shadow-lg">
              <CalendarToday className="mb-2 opacity-80" />
              <h4 className="font-bold mb-1">Lịch năm học</h4>
              <p className="text-xs opacity-80 mb-3">
                Tra cứu kế hoạch đào tạo toàn trường
              </p>
              <button className="text-xs bg-white text-mainColor px-3 py-1.5 rounded font-bold hover:bg-gray-100 transition-colors">
                Xem ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;
