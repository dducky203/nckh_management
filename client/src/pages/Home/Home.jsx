import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  CalendarMonth,
  Event,
  Science,
  Newspaper,
  ArrowForward,
  AccessTime,
  LocationOn,
  Person,
} from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import eventService from "../../services/eventService";
import newsService from "../../services/newsService";
import Button from "../../components/common/Button";
import Slideshow from "./components/Slideshow";

const Home = () => {
  const { user } = useContext(AuthContext);

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [researchActivities, setResearchActivities] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Banner slides data
  const bannerSlides = [
    {
      id: 1,
      image: "/src/assets/banner.png",
      title: "Hệ thống Quản lý Nghiên cứu Khoa học",
      subtitle: "Khoa Công nghệ Thông tin - Học viện Nông nghiệp Việt Nam",
      description:
        "Nền tảng số hóa quản lý và tổ chức các hoạt động nghiên cứu khoa học",
    },
    {
      id: 2,
      image: "/src/assets/logo_fita.png",
      title: "Đổi mới sáng tạo trong nghiên cứu",
      subtitle: "Ứng dụng công nghệ thông tin vào nông nghiệp",
      description:
        "Tiên phong trong việc ứng dụng AI, IoT, Big Data vào lĩnh vực nông nghiệp",
    },
    {
      id: 3,
      image: "/src/assets/no-avatar-user.png",
      title: "Hội thảo & Sự kiện học thuật",
      subtitle: "Kết nối - Chia sẻ - Phát triển",
      description:
        "Tham gia các hội thảo, workshop và sự kiện học thuật hàng đầu",
    },
    {
      id: 4,
      image: "/src/assets/no-avatar-user.png",
      title: "Hội thảo & Sự kiện học thuật",
      subtitle: "Kết nối - Chia sẻ - Phát triển",
      description:
        "Tham gia các hội thảo, workshop và sự kiện học thuật hàng đầu",
    },
  ];

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch upcoming events (top 6) - sử dụng API có sẵn
        const eventsResponse = await eventService.getPublicEvents(
          "upcoming",
          0,
          6
        );
        console.log("Events response:", eventsResponse);

        const eventsData = eventsResponse?.data?.events || [];
        setUpcomingEvents(eventsData);

        // Fetch latest news (top 6)
        const newsResponse = await newsService.getNews("", 0, 6);
        console.log("News response:", newsResponse);

        const newsData = newsResponse?.data?.news || [];
        setLatestNews(newsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mainColor"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      {/* Banner Slideshow */}
      <Slideshow slides={bannerSlides} autoPlayInterval={8} user={user} />

      {/* Introduction Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Chào mừng đến với Hệ thống NCKH
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Nền tảng quản lý và tổ chức các hoạt động nghiên cứu khoa học của
              Khoa Công nghệ Thông tin. Kết nối giảng viên, sinh viên và các nhà
              nghiên cứu trong việc chia sẻ kiến thức, tổ chức sự kiện và phát
              triển nghiên cứu.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Event className="text-blue-600 mb-4" fontSize="large" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Quản lý Sự kiện
              </h3>
              <p className="text-gray-600">
                Tạo, quản lý và tham gia các sự kiện học thuật, hội thảo,
                workshop một cách dễ dàng và hiệu quả.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Science className="text-green-600 mb-4" fontSize="large" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Hoạt động NCKH
              </h3>
              <p className="text-gray-600">
                Theo dõi và tham gia các hoạt động nghiên cứu khoa học, đăng bài
                báo và chia sẻ kết quả nghiên cứu.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Newspaper className="text-purple-600 mb-4" fontSize="large" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Tin tức & Thông báo
              </h3>
              <p className="text-gray-600">
                Cập nhật các tin tức, thông báo mới nhất về hoạt động của khoa
                và các sự kiện sắp diễn ra.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Sự kiện sắp diễn ra
              </h2>
              <p className="text-gray-600">
                Đừng bỏ lỡ các sự kiện học thuật hấp dẫn
              </p>
            </div>
            <Link to="/events/upcoming">
              <Button variant="outline" className="hidden md:flex">
                Xem tất cả
                <ArrowForward className="ml-2" fontSize="small" />
              </Button>
            </Link>
          </div>

          {upcomingEvents.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <CalendarMonth
                className="text-gray-300 mx-auto mb-4"
                sx={{ fontSize: 64 }}
              />
              <p className="text-gray-500">
                Hiện chưa có sự kiện nào sắp diễn ra
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={event.image || "/src/assets/default-event.jpg"}
                      alt={event.eventName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-mainColor text-white px-3 py-1 rounded-full text-sm font-medium">
                      {event.type || "Sự kiện"}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-mainColor transition-colors">
                      {event.eventName}
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <AccessTime fontSize="small" className="mr-2" />
                        <span>{formatDate(event.dateOfEvent)}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center">
                          <LocationOn fontSize="small" className="mr-2" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                      )}
                      {event.organizer && (
                        <div className="flex items-center">
                          <Person fontSize="small" className="mr-2" />
                          <span className="line-clamp-1">
                            {event.organizer}
                          </span>
                        </div>
                      )}
                    </div>
                    <Link to={`/event/detail/${event.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full group-hover:bg-mainColor group-hover:text-white group-hover:border-mainColor transition-all"
                      >
                        Xem chi tiết
                        <ArrowForward className="ml-2" fontSize="small" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-8 md:hidden">
            <Link to="/events/upcoming">
              <Button variant="outline">
                Xem tất cả sự kiện
                <ArrowForward className="ml-2" fontSize="small" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Research Activities Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Hoạt động NCKH nổi bật
              </h2>
              <p className="text-gray-600">
                Các nghiên cứu và hoạt động khoa học tiêu biểu
              </p>
            </div>
            <Link to="/research/projects">
              <Button variant="outline" className="hidden md:flex">
                Xem tất cả
                <ArrowForward className="ml-2" fontSize="small" />
              </Button>
            </Link>
          </div>

          {researchActivities.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Science
                className="text-gray-300 mx-auto mb-4"
                sx={{ fontSize: 64 }}
              />
              <p className="text-gray-500">
                Hiện chưa có hoạt động NCKH nào được đăng tải
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {researchActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="bg-gray-50 rounded-lg shadow-md hover:shadow-xl transition-all p-6 group border-l-4 border-mainColor"
                >
                  <div className="flex items-start justify-between mb-4">
                    <Science className="text-mainColor" fontSize="large" />
                    <span className="text-xs text-gray-500">
                      {formatDate(activity.createDate)}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-mainColor transition-colors">
                    {activity.eventName}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {activity.description || "Mô tả chi tiết sẽ được cập nhật"}
                  </p>
                  <Link to={`/event/detail/${activity.id}`}>
                    <Button
                      variant="text"
                      size="sm"
                      className="text-mainColor hover:underline p-0"
                    >
                      Tìm hiểu thêm
                      <ArrowForward className="ml-1" fontSize="small" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-8 md:hidden">
            <Link to="/research/projects">
              <Button variant="outline">
                Xem tất cả NCKH
                <ArrowForward className="ml-2" fontSize="small" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Tin tức mới nhất
              </h2>
              <p className="text-gray-600">
                Cập nhật thông tin và hoạt động của khoa
              </p>
            </div>
            <Link to="/news">
              <Button variant="outline" className="hidden md:flex">
                Xem tất cả
                <ArrowForward className="ml-2" fontSize="small" />
              </Button>
            </Link>
          </div>

          {latestNews.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <Newspaper
                className="text-gray-300 mx-auto mb-4"
                sx={{ fontSize: 64 }}
              />
              <p className="text-gray-500">Hiện chưa có tin tức nào</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {latestNews.map((news) => (
                <div
                  key={news.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden group flex"
                >
                  {news.image && (
                    <div className="w-1/3 relative overflow-hidden">
                      <img
                        src={news.image}
                        alt={news.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className={`${news.image ? "w-2/3" : "w-full"} p-6`}>
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <CalendarMonth fontSize="small" className="mr-1" />
                      <span>{formatDate(news.createDate)}</span>
                      {news.author && (
                        <>
                          <span className="mx-2">•</span>
                          <Person fontSize="small" className="mr-1" />
                          <span>{news.author}</span>
                        </>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-mainColor transition-colors">
                      {news.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {news.summary || news.content}
                    </p>
                    <Link to={`/news/detail/${news.id}`}>
                      <Button
                        variant="text"
                        size="sm"
                        className="text-mainColor hover:underline p-0"
                      >
                        Đọc thêm
                        <ArrowForward className="ml-1" fontSize="small" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-8 md:hidden">
            <Link to="/news">
              <Button variant="outline">
                Xem tất cả tin tức
                <ArrowForward className="ml-2" fontSize="small" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-mainColor to-[#154c6e] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Sẵn sàng tham gia cùng chúng tôi?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Đăng ký tài khoản để truy cập đầy đủ tính năng và tham gia các hoạt
            động nghiên cứu khoa học
          </p>
          {!user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button className="bg-white text-mainColor hover:bg-gray-100">
                  Đăng nhập ngay
                  <ArrowForward className="ml-2" fontSize="small" />
                </Button>
              </Link>
              <Link to="/about">
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  Tìm hiểu thêm
                </Button>
              </Link>
            </div>
          ) : (
            <Link to="/events/dashboard">
              <Button className="bg-gray-400 text-mainColor hover:bg-gray-100">
                Khám phá sự kiện
                <ArrowForward className="ml-2" fontSize="small" />
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
