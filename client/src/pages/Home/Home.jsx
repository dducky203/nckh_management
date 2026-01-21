import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import {
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
import researchGroupService from "../../services/researchGroupService";
import Button from "../../components/common/Button";
import Slideshow from "./components/Slideshow";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { formatDateTime } from "../../constants";
import bannerImg from "../../assets/Banner.png";
import logoFitaImg from "../../assets/logo_fita.png";
import banner2 from "../../assets/gt.jpg";
// import noAvatarImg from '../../assets/no-avatar-user.png';

// Helper function to strip HTML tags and get plain text
const stripHtml = (html) => {
  if (!html) return "";
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

// Helper function để lấy màu tag cho event type
const getEventTypeColor = (type) => {
  if (!type) return "bg-slate-100 text-slate-700";

  const lowerType = type.toLowerCase();

  if (lowerType.includes("seminar") || lowerType.includes("hội thảo")) {
    return "bg-blue-100 text-blue-700";
  } else if (
    lowerType.includes("hội nghị") ||
    lowerType.includes("conference")
  ) {
    return "bg-green-100 text-green-700";
  } else if (
    lowerType.includes("bài báo quốc tế") ||
    lowerType.includes("international")
  ) {
    return "bg-purple-100 text-purple-700";
  } else if (
    lowerType.includes("bài báo tiếng việt") ||
    lowerType.includes("vietnamese")
  ) {
    return "bg-orange-100 text-orange-700";
  } else if (
    lowerType.includes("workshop") ||
    lowerType.includes("chuyên đề")
  ) {
    return "bg-pink-100 text-pink-700";
  } else if (lowerType.includes("tham dự") || lowerType.includes("advisory")) {
    return "bg-indigo-100 text-indigo-700";
  } else if (
    lowerType.includes("tổng quan") ||
    lowerType.includes("overview")
  ) {
    return "bg-teal-100 text-teal-700";
  } else {
    return "bg-slate-100 text-slate-700";
  }
};

const Home = () => {
  const { user } = useContext(AuthContext);

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [researchActivities, setResearchActivities] = useState([]);
  const [teacherResearchActivities, setTeacherResearchActivities] = useState(
    [],
  );
  const [latestNews, setLatestNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const bannerSlides = [
    {
      id: 1,
      image: bannerImg,
      // title: "Hệ thống Quản lý Nghiên cứu Khoa học",
      // subtitle: "Khoa Công nghệ Thông tin - Học viện Nông nghiệp Việt Nam",
      // description:
      //   "Nền tảng số hóa quản lý và tổ chức các hoạt động nghiên cứu khoa học",
    },
    {
      id: 2,
      image: logoFitaImg,
      // title: "Đổi mới sáng tạo trong nghiên cứu",
      // subtitle: "Ứng dụng công nghệ thông tin vào nông nghiệp",
      // description:
      //   "Tiên phong trong việc ứng dụng AI, IoT, Big Data vào lĩnh vực nông nghiệp",
    },
    {
      id: 3,
      image: banner2,
      // title: "Hội thảo & Sự kiện học thuật",
      // subtitle: "Kết nối - Chia sẻ - Phát triển",
      // description:
      //   "Tham gia các hội thảo, workshop và sự kiện học thuật hàng đầu",
    },
    // {
    //   id: 4,
    //   image: noAvatarImg,
    //   // title: "Hợp tác & Phát triển",
    //   // subtitle: "Mở rộng mạng lưới nghiên cứu",
    //   // description: "Kết nối với các đối tác doanh nghiệp và tổ chức quốc tế",
    // },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [eventsRes, studentGroupsRes, teacherGroupsRes, newsRes] =
          await Promise.all([
            eventService.getPublicEvents("upcoming", 0, 6),
            researchGroupService.getAllGroupPublic("", "student", 0, 3),
            researchGroupService.getAllGroupPublic("", "lecturer", 0, 3),
            newsService.getNews("", 0, 4),
          ]);

        const eventsData = eventsRes?.data || eventsRes;
        setUpcomingEvents(eventsData?.events || []);

        const studentGroupsData = studentGroupsRes?.data || studentGroupsRes;
        setResearchActivities(studentGroupsData?.groups || []);

        const teacherGroupsData = teacherGroupsRes?.data || teacherGroupsRes;
        setTeacherResearchActivities(teacherGroupsData?.groups || []);

        const newsData = newsRes?.data || newsRes;
        setLatestNews(newsData?.news || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner size="md" />;
  }

  return (
    <div className="bg-white min-h-screen font-sans text-slate-800">
      <div className="relative shadow-lg z-10">
        <Slideshow slides={bannerSlides} autoPlayInterval={8} user={user} />
      </div>

      {/* --- INTRO SECTION --- */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-2 block">
              Về hệ thống
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">
              Nền Tảng Kết Nối Tri Thức
            </h2>
            <p className="text-lg text-slate-500 max-w-3xl mx-auto leading-relaxed">
              Hệ thống quản lý nghiên cứu khoa học hiện đại, kết nối giảng viên,
              sinh viên và các nhà nghiên cứu để kiến tạo tương lai.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-2xl bg-white border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                <Event
                  className="text-blue-600 group-hover:text-white transition-colors"
                  sx={{ fontSize: 28 }}
                />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">
                Quản lý Sự kiện
              </h3>
              <p className="text-slate-500 leading-relaxed">
                Tổ chức và tham gia các hội thảo, seminar chuyên đề. Check-in tự
                động và quản lý người tham dự thông minh.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-white border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-green-100/50 transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors duration-300">
                <Science
                  className="text-green-600 group-hover:text-white transition-colors"
                  sx={{ fontSize: 28 }}
                />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">
                Hoạt động NCKH
              </h3>
              <p className="text-slate-500 leading-relaxed">
                Không gian chia sẻ các đề tài, dự án nghiên cứu. Kết nối mentor
                và sinh viên đam mê khoa học công nghệ.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-white border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-purple-100/50 transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors duration-300">
                <Newspaper
                  className="text-purple-600 group-hover:text-white transition-colors"
                  sx={{ fontSize: 28 }}
                />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">
                Tin tức & Thông báo
              </h3>
              <p className="text-slate-500 leading-relaxed">
                Cập nhật nhanh chóng các tin tức công nghệ mới nhất, thông báo
                học vụ và các cơ hội học bổng.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- EVENTS SECTION --- */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                Sự kiện sắp diễn ra
              </h2>
              <p className="text-slate-500">
                Đừng bỏ lỡ các cơ hội học tập và kết nối quan trọng
              </p>
            </div>
            <Link to="/events/upcoming">
              <Button
                variant="outline"
                className="hidden md:flex bg-white border-slate-200 hover:border-blue-500 hover:text-blue-600"
              >
                Xem tất cả <ArrowForward className="ml-2" fontSize="small" />
              </Button>
            </Link>
          </div>

          {upcomingEvents.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
              <CalendarMonth
                className="text-slate-300 mx-auto mb-4"
                sx={{ fontSize: 64 }}
              />
              <p className="text-slate-500">
                Hiện chưa có sự kiện nào sắp diễn ra
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 overflow-hidden flex flex-col h-full border border-slate-100"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={event.image || "/src/assets/default-event.jpg"}
                      alt={event.eventName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                    <div
                      className={`absolute top-4 right-4 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold shadow-sm uppercase tracking-wide ${getEventTypeColor(event.type)}`}
                    >
                      {event.type || "Sự kiện"}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-slate-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {event.eventName}
                    </h3>

                    <div className="space-y-3 mb-6 flex-1">
                      <div className="flex items-center text-sm text-slate-500">
                        <AccessTime
                          className="mr-2 text-blue-500"
                          fontSize="small"
                        />
                        <span>{formatDateTime(event.dateOfEvent)}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center text-sm text-slate-500">
                          <LocationOn
                            className="mr-2 text-red-500"
                            fontSize="small"
                          />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                      )}
                      {event.organizer && (
                        <div className="flex items-center text-sm text-slate-500">
                          <Person
                            className="mr-2 text-purple-500"
                            fontSize="small"
                          />
                          <span className="line-clamp-1">
                            {event.organizer}
                          </span>
                        </div>
                      )}
                    </div>

                    <Link to={`/event/detail/${event.id}`} className="mt-auto">
                      <Button
                        variant="outline"
                        className="w-full justify-center border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                      >
                        Chi tiết
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-8 md:hidden">
            <Link to="/events/upcoming">
              <Button variant="outline" className="w-full justify-center">
                Xem tất cả <ArrowForward className="ml-2" fontSize="small" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* --- RESEARCH SECTION - SINH VIÊN --- */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-green-600 rounded-full block"></span>
                Hoạt động NCKH Sinh viên
              </h2>
              <p className="text-slate-500">
                Các đề tài, nhóm nghiên cứu của sinh viên
              </p>
            </div>
            <Link to="/research-groups">
              <Button
                variant="outline"
                className="hidden md:flex bg-white border-slate-200 hover:border-green-600 hover:text-green-700"
              >
                Xem tất cả <ArrowForward className="ml-2" fontSize="small" />
              </Button>
            </Link>
          </div>

          {researchActivities.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
              <Science
                className="text-slate-300 mx-auto mb-4"
                sx={{ fontSize: 64 }}
              />
              <p className="text-slate-500 mb-6">
                Hiện chưa có hoạt động nghiên cứu mới của sinh viên
              </p>
              <Link to="/research-groups">
                <Button
                  variant="outline"
                  className="border-slate-200 hover:border-green-600 hover:text-green-700"
                >
                  Xem danh sách nhóm nghiên cứu
                  <ArrowForward className="ml-2" fontSize="small" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {researchActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-green-500/10 hover:border-green-200 transition-all duration-300 overflow-hidden flex flex-col"
                >
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                        <Science sx={{ fontSize: 14 }} />
                        Sinh viên
                      </span>
                      <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                        {formatDateTime(
                          activity.createdAt || activity.createDate,
                        )}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-800 mb-3 line-clamp-2 group-hover:text-green-700 transition-colors">
                      {activity.topicName || activity.groupName}
                    </h3>

                    <p className="text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
                      {activity.description ||
                        "Mô tả chi tiết về hoạt động nghiên cứu này..."}
                    </p>

                    <Link to="/research-groups" className="mt-auto">
                      <Button
                        variant="outline"
                        className="w-full justify-center border-slate-200 text-slate-600 hover:bg-green-50 hover:text-green-700 hover:border-green-200"
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
            <Link to="/research-groups">
              <Button variant="outline" className="w-full justify-center">
                Xem tất cả <ArrowForward className="ml-2" fontSize="small" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* --- RESEARCH SECTION - GIẢNG VIÊN --- */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-blue-600 rounded-full block"></span>
                Hoạt động NCKH Giảng viên
              </h2>
              <p className="text-slate-500">
                Các đề tài, nhóm nghiên cứu của giảng viên
              </p>
            </div>
            <Link to="/research-groups">
              <Button
                variant="outline"
                className="hidden md:flex bg-white border-slate-200 hover:border-blue-600 hover:text-blue-700"
              >
                Xem tất cả <ArrowForward className="ml-2" fontSize="small" />
              </Button>
            </Link>
          </div>

          {teacherResearchActivities.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
              <Science
                className="text-slate-300 mx-auto mb-4"
                sx={{ fontSize: 64 }}
              />
              <p className="text-slate-500 mb-6">
                Hiện chưa có hoạt động nghiên cứu mới của giảng viên
              </p>
              <Link to="/research-groups">
                <Button
                  variant="outline"
                  className="border-slate-200 hover:border-blue-600 hover:text-blue-700"
                >
                  Xem danh sách nhóm nghiên cứu
                  <ArrowForward className="ml-2" fontSize="small" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teacherResearchActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-200 transition-all duration-300 overflow-hidden flex flex-col"
                >
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                        <Science sx={{ fontSize: 14 }} />
                        Giảng viên
                      </span>
                      <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                        {formatDateTime(
                          activity.createdAt || activity.createDate,
                        )}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-800 mb-3 line-clamp-2 group-hover:text-blue-700 transition-colors">
                      {activity.topicName || activity.groupName}
                    </h3>

                    <p className="text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
                      {activity.description ||
                        "Mô tả chi tiết về hoạt động nghiên cứu này..."}
                    </p>

                    <Link to="/research-groups" className="mt-auto">
                      <Button
                        variant="outline"
                        className="w-full justify-center border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
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
            <Link to="/research-groups">
              <Button variant="outline" className="w-full justify-center">
                Xem tất cả <ArrowForward className="ml-2" fontSize="small" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* --- NEWS SECTION (TÁCH RIÊNG) --- */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between mb-12 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-blue-600 rounded-full block"></span>
                Tin tức mới nhất
              </h2>
              <p className="text-slate-500">
                Thông tin cập nhật từ khoa và nhà trường
              </p>
            </div>
            <Link
              to="/news"
              className="text-blue-600 hover:text-blue-800 font-medium hidden md:flex items-center transition-colors"
            >
              Xem tất cả <ArrowForward fontSize="small" className="ml-1" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {latestNews.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Newspaper
                  className="text-slate-300 mb-3"
                  sx={{ fontSize: 48 }}
                />
                <p className="text-slate-500">Hiện chưa có tin tức nào</p>
              </div>
            ) : (
              latestNews.map((news) => (
                <Link
                  to={`/news/details/${news.id}`}
                  key={news.id}
                  className="group block h-full"
                >
                  <div className="flex flex-col sm:flex-row gap-5 bg-white p-5 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 h-full">
                    <div className="sm:w-48 h-48 sm:h-auto flex-shrink-0 rounded-xl overflow-hidden bg-slate-200 relative">
                      {news.image ? (
                        <img
                          src={news.image}
                          alt={news.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <Newspaper fontSize="large" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                        <span className="flex items-center bg-slate-50 px-2 py-1 rounded-md">
                          <CalendarMonth
                            fontSize="inherit"
                            className="mr-1.5 text-slate-400"
                          />
                          {formatDateTime(news.createdAt)}
                        </span>
                        {news.author && (
                          <span className="flex items-center text-blue-600 font-medium">
                            <Person fontSize="inherit" className="mr-1" />
                            {news.author}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                        {news.title}
                      </h3>
                      <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4">
                        {stripHtml(news.summary || news.content)}
                      </p>
                      <span className="text-sm font-semibold text-blue-500 group-hover:underline mt-auto">
                        Đọc tiếp
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Link to="/news">
              <Button variant="outline" className="w-full justify-center">
                Xem tất cả tin tức{" "}
                <ArrowForward className="ml-2" fontSize="small" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 z-0"></div>
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:20px_20px] z-0"></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Sẵn sàng kiến tạo tương lai?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Đăng ký tài khoản ngay hôm nay để truy cập kho tàng tri thức và tham
            gia vào cộng đồng nghiên cứu khoa học sôi động.
          </p>

          {!user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button className="bg-white text-blue-900 hover:bg-blue-50 border-transparent px-8 py-3 h-auto text-base font-bold shadow-lg shadow-blue-900/50">
                  Đăng nhập ngay <ArrowForward className="ml-2" />
                </Button>
              </Link>
              <Link to="/about">
                <Button
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 px-8 py-3 h-auto text-base"
                >
                  Tìm hiểu thêm
                </Button>
              </Link>
            </div>
          ) : (
            <Link to="/events/dashboard">
              <Button className="hover:bg-blue-50 border-transparent px-8 py-3 h-auto text-base font-bold shadow-lg">
                Khám phá ngay <ArrowForward className="ml-2" />
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
