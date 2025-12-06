import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowBack, AccessTime, Person, Newspaper } from "@mui/icons-material";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import newsService from "../../services/newsService";
import NewsComments from "./components/NewsComments";

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await newsService.getNewsById(id);
        console.log("News detail response:", response);
        setNews(response?.data);
      } catch (err) {
        console.error("Error fetching news detail:", err);
        setError(err.message || "Không thể tải chi tiết tin tức");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "Không có thông tin";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
            <Newspaper
              className="text-gray-300 mx-auto mb-4"
              sx={{ fontSize: 64 }}
            />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Không tìm thấy tin tức
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate("/news")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Quay lại danh sách tin tức
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <Link
            to="/news"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
          >
            <ArrowBack className="mr-2" fontSize="small" />
            Quay lại danh sách tin tức
          </Link>

          {/* News content */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {news.title}
            </h1>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6 pb-6 border-b">
              {news.author && (
                <div className="flex items-center">
                  <Person fontSize="small" className="mr-1" />
                  <span>{news.author}</span>
                </div>
              )}
              <div className="flex items-center">
                <AccessTime fontSize="small" className="mr-1" />
                <span>{formatDate(news.createdAt || news.time)}</span>
              </div>
            </div>

            <div className="prose max-w-none">
              <div
                className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: news.content }}
              />
            </div>
          </div>

          {/* Comments section */}
          <div className="mt-8">
            <NewsComments newsId={news.id} />
          </div>

          {/* Related news (optional - can be added later) */}
          <div className="mt-8">
            <Link
              to="/news"
              className="inline-flex items-center text-blue-600 hover:text-blue-700"
            >
              <ArrowBack className="mr-2" fontSize="small" />
              Xem thêm tin tức khác
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;
