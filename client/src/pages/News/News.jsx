import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Newspaper,
  AccessTime,
  Person,
  ArrowForward,
} from "@mui/icons-material";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Pagination from "../../components/common/Pagination";
import newsService from "../../services/newsService";
import Button from "../../components/common/Button";
import { formatDate, formatDateTime } from "../../constants";
import { formatDateForInput } from "../../utils";

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pagination, setPagination] = useState({
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 12,
    hasNext: false,
    hasPrevious: false,
  });

  const fetchNews = async (search = "", page = 0) => {
    try {
      setLoading(true);
      const response = await newsService.getNews(search, page, 12);

      const data = response?.data;
      setNews(data?.news || []);
      setPagination({
        totalPages: data?.totalPages || 0,
        totalItems: data?.totalItems || 0,
        itemsPerPage: data?.itemsPerPage || 12,
        hasNext: data?.hasNext || false,
        hasPrevious: data?.hasPrevious || false,
      });
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(searchTerm, currentPage);
  }, [currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchNews(searchTerm, 0);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFirstPage = () => {
    setCurrentPage(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLastPage = () => {
    setCurrentPage(pagination.totalPages - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePreviousPage = () => {
    if (pagination.hasPrevious) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextPage = () => {
    if (pagination.hasNext) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const delta = 2;
    const displayCurrentPage = currentPage + 1;

    if (pagination.totalPages <= 7) {
      for (let i = 1; i <= pagination.totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      let start = Math.max(2, displayCurrentPage - delta);
      let end = Math.min(pagination.totalPages - 1, displayCurrentPage + delta);

      if (start > 2) pages.push("...");
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (end < pagination.totalPages - 1) pages.push("...");
      pages.push(pagination.totalPages);
    }
    return pages;
  };

 

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <Newspaper sx={{ fontSize: 64 }} className="mb-4 mx-auto" />
          <h1 className="text-4xl font-bold mb-4">Tin tức & Thông báo</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Cập nhật những tin tức mới nhất về hoạt động của Khoa Công nghệ
            Thông tin
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm tin tức theo tiêu đề hoặc nội dung..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <Button type="submit">Tìm kiếm</Button>
          </form>
        </div>

        {/* Results count */}
        {!loading && news.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Tìm thấy{" "}
              <span className="font-semibold">{pagination.totalItems}</span> tin
              tức
            </p>
          </div>
        )}

        {/* News List */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <LoadingSpinner />
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <Newspaper
              className="text-gray-300 mx-auto mb-4"
              sx={{ fontSize: 64 }}
            />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy tin tức
            </h3>
            <p className="text-gray-500">
              {searchTerm
                ? "Thử thay đổi từ khóa tìm kiếm"
                : "Chưa có tin tức nào được đăng tải"}
            </p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {news.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden group"
                >
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <AccessTime fontSize="small" className="mr-1" />
                      <span>{formatDateTime(item.createdAt || item.time)}</span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {item.summary || item.content}
                    </p>

                    {item.author && (
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <Person fontSize="small" className="mr-1" />
                        <span>{item.author}</span>
                      </div>
                    )}

                    <Link
                      to={`/news/${item.id}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Đọc thêm
                      <ArrowForward className="ml-1" fontSize="small" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}

            <div className="bg-white rounded-lg shadow-sm">
              <Pagination
                currentPage={currentPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalItems}
                itemsPerPage={pagination.itemsPerPage}
                startIndex={currentPage * pagination.itemsPerPage}
                endIndex={Math.min(
                  (currentPage + 1) * pagination.itemsPerPage,
                  pagination.totalItems
                )}
                onPageChange={handlePageChange}
                onFirstPage={handleFirstPage}
                onLastPage={handleLastPage}
                onPreviousPage={handlePreviousPage}
                onNextPage={handleNextPage}
                getPageNumbers={getPageNumbers}
                itemName="tin tức"
              />
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default News;
