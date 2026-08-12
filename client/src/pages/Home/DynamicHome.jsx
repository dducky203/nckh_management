import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarMonth,
  Science,
  Newspaper,
  ArrowForward,
  AccessTime,
  LocationOn,
  Person,
  School,
  EmojiEvents,
  Groups,
  WorkspacePremium,
  AutoAwesome,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Star,
  FormatQuote,
} from "@mui/icons-material";
import homePageService from "../../services/homePageService";
import eventService from "../../services/eventService";
import newsService from "../../services/newsService";
import researchGroupService from "../../services/researchGroupService";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Home from "./Home";
import { formatDateTime } from "../../utils/dateHelpers";
import { safeUrl, stripHtml } from "../../utils/helpers";

// Map string icon names to MUI Icon components
const ICON_MAP = {
  science: Science,
  newspaper: Newspaper,
  event: CalendarMonth,
  school: School,
  trophy: EmojiEvents,
  groups: Groups,
  award: WorkspacePremium,
  star: Star,
  sparkle: AutoAwesome,
  check: CheckCircle,
};

const RenderIcon = ({ name, className = "", fontSize = "medium" }) => {
  const IconComponent = ICON_MAP[name?.toLowerCase()] || AutoAwesome;
  return <IconComponent className={className} fontSize={fontSize} />;
};

// Sub-component for Slideshow Section
const SlideshowSection = ({ section }) => {
  const slides = section.items?.length ? section.items : [
    {
      id: 1,
      title: section.title || "Hệ thống Quản lý Nghiên cứu Khoa học",
      subtitle: section.subtitle || "KHOA CÔNG NGHỆ THÔNG TIN - VNUA",
      description: section.description || "Nền tảng số hóa quản lý và tổ chức các hoạt động nghiên cứu khoa học hiện đại.",
      image: section.image,
      ctaLabel: section.ctaLabel || "Khám phá ngay",
      ctaUrl: section.ctaUrl || "/events",
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const currentSlide = slides[currentIndex] || slides[0];
  const bgImg = safeUrl(currentSlide.image);

  return (
    <section className="relative min-h-[60vh] lg:min-h-[75vh] flex items-center justify-center overflow-hidden bg-slate-900 group">
      {bgImg ? (
        <img
          src={bgImg}
          alt={currentSlide.title || "Banner"}
          className="absolute inset-0 w-full h-full object-cover opacity-50 transition-all duration-1000 ease-out"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#034657] via-[#206c9e] to-slate-900 opacity-90" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

      <div className="relative container mx-auto max-w-5xl px-6 py-20 text-center z-10 flex flex-col items-center animate-fade-in-up">
        {currentSlide.subtitle && (
          <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-mainColor/30 border border-mainColor/40 text-blue-200 font-semibold text-xs tracking-widest uppercase mb-6 backdrop-blur-md shadow-lg">
            <AutoAwesome sx={{ fontSize: 14 }} />
            {currentSlide.subtitle}
          </span>
        )}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight drop-shadow-md">
          {currentSlide.title}
        </h1>
        {currentSlide.description && (
          <p className="text-base md:text-xl text-slate-200 max-w-3xl mt-6 font-normal leading-relaxed drop-shadow">
            {currentSlide.description}
          </p>
        )}
        {safeUrl(currentSlide.ctaUrl || section.ctaUrl) && (
          <Link
            to={currentSlide.ctaUrl || section.ctaUrl}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-mainColor px-8 py-3.5 font-bold text-white shadow-xl shadow-mainColor/40 hover:bg-mainColor/90 hover:shadow-mainColor/60 hover:-translate-y-0.5 transition-all duration-300 text-base"
          >
            {currentSlide.ctaLabel || section.ctaLabel || "Khám phá ngay"}
            <ArrowForward fontSize="small" />
          </Link>
        )}
      </div>

      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-slate-900/60 text-white flex items-center justify-center backdrop-blur-md border border-white/20 hover:bg-mainColor transition-colors opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next Slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-slate-900/60 text-white flex items-center justify-center backdrop-blur-md border border-white/20 hover:bg-mainColor transition-colors opacity-0 group-hover:opacity-100"
          >
            <ChevronRight />
          </button>

          <div className="absolute bottom-6 inset-x-0 z-20 flex justify-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? "w-8 bg-mainColor" : "w-2.5 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

// Sub-component for Live Events Widget
const LiveEventsSection = ({ section }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventService
      .getPublicEvents("upcoming", 0, section.itemLimit || 3)
      .then((res) => {
        const data = res?.data || res;
        setEvents(data?.events || []);
      })
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, [section.itemLimit]);

  return (
    <section className="py-20 bg-slate-50 border-y border-slate-100">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-4">
          <div>
            {section.subtitle && (
              <span className="text-mainColor font-bold tracking-wider uppercase text-xs mb-2 block">
                {section.subtitle}
              </span>
            )}
            <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <span className="w-1.5 h-8 bg-mainColor rounded-full block"></span>
              {section.title || "Sự kiện NCKH sắp diễn ra"}
            </h2>
            {section.description && <p className="text-slate-500 mt-2">{section.description}</p>}
          </div>
          <Link
            to={section.ctaUrl || "/events"}
            className="hidden md:inline-flex items-center gap-1 text-sm font-bold text-mainColor hover:text-mainColor/80 transition-colors"
          >
            {section.ctaLabel || "Xem tất cả sự kiện"} <ArrowForward fontSize="small" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <LoadingSpinner size="md" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
            <CalendarMonth className="text-slate-300 mx-auto mb-3" sx={{ fontSize: 56 }} />
            <p className="text-slate-500 font-medium">Hiện chưa có sự kiện nào sắp diễn ra</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div
                key={event.id}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl hover:shadow-mainColor/10 transition-all duration-300 overflow-hidden flex flex-col h-full border border-slate-100"
              >
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={event.bannerImg || "/src/assets/default-event.jpg"}
                    alt={event.eventName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-slate-800 mb-3 line-clamp-2 group-hover:text-mainColor transition-colors">
                    {event.eventName}
                  </h3>

                  <div className="space-y-2.5 mb-6 flex-1 text-sm text-slate-500">
                    <div className="flex items-center">
                      <AccessTime className="mr-2 text-mainColor" fontSize="small" />
                      <span>{formatDateTime(event.dateOfEvent)}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center">
                        <LocationOn className="mr-2 text-red-500" fontSize="small" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                    )}
                    {event.organizer && (
                      <div className="flex items-center">
                        <Person className="mr-2 text-amber-500" fontSize="small" />
                        <span className="line-clamp-1">{event.organizer}</span>
                      </div>
                    )}
                  </div>

                  <Link to={`/event/detail/${event.id}`} className="mt-auto">
                    <button className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-mainColor/10 hover:text-mainColor hover:border-mainColor/30 transition-all text-sm">
                      Chi tiết sự kiện
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-8 md:hidden">
          <Link
            to={section.ctaUrl || "/events"}
            className="inline-flex items-center justify-center w-full py-3 rounded-xl border border-mainColor text-mainColor font-bold text-sm"
          >
            {section.ctaLabel || "Xem tất cả sự kiện"} <ArrowForward className="ml-2" fontSize="small" />
          </Link>
        </div>
      </div>
    </section>
  );
};

// Sub-component for Live News Widget
const LiveNewsSection = ({ section }) => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    newsService
      .getNews("", 0, section.itemLimit || 4)
      .then((res) => {
        const data = res?.data || res;
        setNewsList(data?.news || []);
      })
      .catch(() => setNewsList([]))
      .finally(() => setLoading(false));
  }, [section.itemLimit]);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between mb-12 pb-4 border-b border-slate-100">
          <div>
            {section.subtitle && (
              <span className="text-mainColor font-bold tracking-wider uppercase text-xs mb-2 block">
                {section.subtitle}
              </span>
            )}
            <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <span className="w-1.5 h-8 bg-mainColor rounded-full block"></span>
              {section.title || "Tin tức & Thông báo NCKH"}
            </h2>
            {section.description && <p className="text-slate-500 mt-1">{section.description}</p>}
          </div>
          <Link
            to={section.ctaUrl || "/news"}
            className="hidden md:inline-flex items-center text-sm font-bold text-mainColor hover:text-mainColor/80 transition-colors"
          >
            {section.ctaLabel || "Xem tất cả tin tức"} <ArrowForward fontSize="small" className="ml-1" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <LoadingSpinner size="md" />
          </div>
        ) : newsList.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <Newspaper className="text-slate-300 mx-auto mb-3" sx={{ fontSize: 56 }} />
            <p className="text-slate-500 font-medium">Hiện chưa có tin tức mới</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {newsList.map((news) => (
              <Link to={`/news/details/${news.id}`} key={news.id} className="group block h-full">
                <div className="flex flex-col sm:flex-row gap-5 bg-white p-5 rounded-2xl border border-slate-100 hover:border-mainColor/30 hover:shadow-xl hover:shadow-mainColor/5 transition-all duration-300 h-full">
                  <div className="sm:w-48 h-48 sm:h-auto flex-shrink-0 rounded-xl overflow-hidden bg-slate-100 relative">
                    {news.image ? (
                      <img
                        src={news.image}
                        alt={news.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <Newspaper fontSize="large" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                      <span className="flex items-center bg-slate-100 px-2 py-1 rounded-md font-medium">
                        <CalendarMonth fontSize="inherit" className="mr-1.5 text-slate-400" />
                        {formatDateTime(news.createdAt)}
                      </span>
                      {news.author && (
                        <span className="flex items-center text-mainColor font-medium">
                          <Person fontSize="inherit" className="mr-1" />
                          {news.author}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-mainColor transition-colors line-clamp-2 leading-snug">
                      {news.title}
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4">
                      {stripHtml(news.summary || news.content)}
                    </p>
                    <span className="text-sm font-bold text-mainColor group-hover:underline mt-auto flex items-center gap-1">
                      Đọc tiếp <ArrowForward fontSize="inherit" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

// Sub-component for Live Research Groups Widget
const LiveResearchSection = ({ section }) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    researchGroupService
      .getAllGroupPublic("", "student", 0, section.itemLimit || 3)
      .then((res) => {
        const data = res?.data || res;
        setGroups(data?.groups || []);
      })
      .catch(() => setGroups([]))
      .finally(() => setLoading(false));
  }, [section.itemLimit]);

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-100">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-4">
          <div>
            {section.subtitle && (
              <span className="text-emerald-600 font-bold tracking-wider uppercase text-xs mb-2 block">
                {section.subtitle}
              </span>
            )}
            <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <span className="w-1.5 h-8 bg-emerald-600 rounded-full block"></span>
              {section.title || "Nhóm & Đề tài Nghiên cứu nổi bật"}
            </h2>
            {section.description && <p className="text-slate-500 mt-2">{section.description}</p>}
          </div>
          <Link
            to={section.ctaUrl || "/research-groups"}
            className="hidden md:inline-flex items-center gap-1 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            {section.ctaLabel || "Xem danh sách nhóm"} <ArrowForward fontSize="small" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <LoadingSpinner size="md" />
          </div>
        ) : groups.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
            <Science className="text-slate-300 mx-auto mb-3" sx={{ fontSize: 56 }} />
            <p className="text-slate-500 font-medium">Hiện chưa có nhóm nghiên cứu mới</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {groups.map((group) => (
              <div
                key={group.id}
                className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-200 transition-all duration-300 overflow-hidden flex flex-col p-6"
              >
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                    <Science sx={{ fontSize: 14 }} />
                    Sinh viên
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {formatDateTime(group.createdAt || group.createDate)}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-800 mb-3 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                  {group.topicName || group.groupName}
                </h3>

                <p className="text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
                  {group.description || "Mô tả nhóm nghiên cứu khoa học và định hướng đề tài thực hiện..."}
                </p>

                <Link to="/research-groups" className="mt-auto">
                  <button className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-all text-sm flex items-center justify-center gap-1">
                    Xem thông tin nhóm <ArrowForward fontSize="small" />
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

// Sub-component for Impressive Stats Grid
const StatsSection = ({ section }) => {
  const items = section.items?.length
    ? section.items
    : [
        { title: "500+", description: "Đề tài NCKH đã thực hiện", icon: "science" },
        { title: "120+", description: "Bài báo khoa học công bố", icon: "newspaper" },
        { title: "50+", description: "Hội thảo & Event hàng năm", icon: "event" },
        { title: "2000+", description: "Sinh viên & Giảng viên tham gia", icon: "groups" },
      ];

  return (
    <section className="py-16 bg-gradient-to-br from-[#034657] to-[#206c9e] text-white relative overflow-hidden shadow-inner">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <div className="container mx-auto max-w-7xl px-6 relative z-10">
        {(section.title || section.subtitle) && (
          <div className="text-center max-w-3xl mx-auto mb-12">
            {section.subtitle && (
              <span className="text-blue-200 font-bold uppercase tracking-widest text-xs mb-2 block">
                {section.subtitle}
              </span>
            )}
            {section.title && <h2 className="text-3xl lg:text-4xl font-extrabold">{section.title}</h2>}
            {section.description && <p className="text-blue-100 mt-3">{section.description}</p>}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {items.map((item, idx) => (
            <div
              key={item.id || idx}
              className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/20 transition-all duration-300 flex flex-col items-center justify-center group"
            >
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <RenderIcon name={item.icon} className="text-white" fontSize="medium" />
              </div>
              <span className="text-3xl md:text-5xl font-black text-white drop-shadow mb-2">{item.title}</span>
              <p className="text-xs md:text-sm font-medium text-blue-100">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Main DynamicHome Component
const DynamicHome = ({ previewConfig }) => {
  const [config, setConfig] = useState(previewConfig || null);
  const [resolved, setResolved] = useState(!!previewConfig);

  useEffect(() => {
    if (previewConfig) {
      setConfig(previewConfig);
      setResolved(true);
      return;
    }

    homePageService
      .getPublished()
      .then((data) => setConfig(data?.data || data))
      .catch(() => setConfig(null))
      .finally(() => setResolved(true));
  }, [previewConfig]);

  if (!resolved) {
    return (
      <div className="min-h-[70vh] grid place-items-center bg-slate-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Fallback to original default Home page if dynamic configuration is empty
  if (!config?.sections?.length && !previewConfig) {
    return <Home />;
  }

  const sections = [...(config?.sections || [])]
    .filter((section) => section.isVisible !== false)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  if (!sections.length && previewConfig) {
    return (
      <div className="p-16 text-center text-slate-400 mt-10">
        <AutoAwesome sx={{ fontSize: 48 }} className="mb-3 text-slate-300" />
        <p className="font-semibold">Trang chủ trống (Xem trước Live Preview)</p>
      </div>
    );
  }

  return (
    <main className="bg-white min-h-screen text-slate-800 font-sans selection:bg-mainColor selection:text-white">
      {sections.map((section, sectionIdx) => {
        const image = safeUrl(section.image);

        switch (section.type) {
          case "SLIDESHOW":
            return <SlideshowSection key={section.id || sectionIdx} section={section} />;

          case "EVENTS":
            return <LiveEventsSection key={section.id || sectionIdx} section={section} />;

          case "NEWS":
            return <LiveNewsSection key={section.id || sectionIdx} section={section} />;

          case "RESEARCH":
            return <LiveResearchSection key={section.id || sectionIdx} section={section} />;

          case "STATS":
            return <StatsSection key={section.id || sectionIdx} section={section} />;

          case "HERO":
            return (
              <section
                key={section.id || sectionIdx}
                className="relative min-h-[60vh] lg:min-h-[75vh] flex items-center justify-center overflow-hidden bg-slate-900 group"
              >
                {image ? (
                  <img
                    src={image}
                    alt={section.title || "Banner"}
                    className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-[10s] ease-out"
                    loading="eager"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#034657] via-mainColor to-slate-900 opacity-90" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                <div className="relative container mx-auto max-w-5xl px-6 py-24 text-center z-10 flex flex-col items-center animate-fade-in-up">
                  {section.subtitle && (
                    <span className="inline-block py-1.5 px-4 rounded-full bg-mainColor/30 border border-mainColor/40 text-blue-200 font-semibold text-xs tracking-widest uppercase mb-6 backdrop-blur-sm">
                      {section.subtitle}
                    </span>
                  )}
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight drop-shadow-md">
                    {section.title}
                  </h1>
                  {section.description && (
                    <p className="text-base md:text-xl text-slate-200 max-w-3xl mt-6 font-normal leading-relaxed drop-shadow">
                      {section.description}
                    </p>
                  )}
                  {safeUrl(section.ctaUrl) && (
                    <Link
                      to={section.ctaUrl}
                      className="mt-8 inline-flex items-center gap-2 rounded-full bg-mainColor px-8 py-3.5 font-bold text-white shadow-xl shadow-mainColor/30 hover:bg-mainColor/90 hover:shadow-mainColor/50 hover:-translate-y-0.5 transition-all duration-300 text-base"
                    >
                      {section.ctaLabel || "Khám phá ngay"} <ArrowForward fontSize="small" />
                    </Link>
                  )}
                </div>
              </section>
            );

          case "CONTENT":
            return (
              <section
                key={section.id || sectionIdx}
                className={`py-20 lg:py-24 ${sectionIdx % 2 !== 0 ? "bg-slate-50" : "bg-white"}`}
              >
                <div className="container mx-auto max-w-7xl px-6">
                  <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    <div className={sectionIdx % 2 === 0 ? "order-2 lg:order-1" : "order-2"}>
                      {section.subtitle && (
                        <p className="text-mainColor font-bold uppercase tracking-wider text-xs mb-2">
                          {section.subtitle}
                        </p>
                      )}
                      <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight mb-6">
                        {section.title}
                      </h2>
                      {section.description && (
                        <p className="text-base text-slate-600 leading-relaxed mb-8 whitespace-pre-line">
                          {section.description}
                        </p>
                      )}
                      {safeUrl(section.ctaUrl) && (
                        <Link
                          to={section.ctaUrl}
                          className="inline-flex items-center font-bold text-mainColor hover:text-mainColor/80 gap-1.5 transition-all text-base"
                        >
                          {section.ctaLabel || "Tìm hiểu thêm"} <ArrowForward fontSize="small" />
                        </Link>
                      )}
                    </div>
                    {image && (
                      <div className={`order-1 ${sectionIdx % 2 === 0 ? "lg:order-2" : ""}`}>
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl group border border-slate-100">
                          <img
                            src={image}
                            alt={section.title || ""}
                            loading="lazy"
                            className="w-full h-auto aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            );

          case "CARDS":
            return (
              <section
                key={section.id || sectionIdx}
                className={`py-20 lg:py-24 ${sectionIdx % 2 !== 0 ? "bg-slate-50" : "bg-white"}`}
              >
                <div className="container mx-auto max-w-7xl px-6">
                  {(section.title || section.subtitle) && (
                    <div className="text-center max-w-3xl mx-auto mb-14">
                      {section.subtitle && (
                        <p className="text-mainColor font-bold uppercase tracking-wider text-xs mb-2">
                          {section.subtitle}
                        </p>
                      )}
                      {section.title && (
                        <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight">
                          {section.title}
                        </h2>
                      )}
                      {section.description && <p className="text-base text-slate-600 mt-4">{section.description}</p>}
                    </div>
                  )}

                  {!!section.items?.length && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {section.items.map((item, index) => (
                        <article
                          key={item.id || index}
                          className="group rounded-2xl bg-white border border-slate-100 p-3 shadow-sm hover:shadow-xl hover:border-mainColor/30 transition-all duration-300 flex flex-col h-full"
                        >
                          {safeUrl(item.image) && (
                            <div className="overflow-hidden rounded-xl mb-5 h-48 bg-slate-100">
                              <img
                                src={item.image}
                                alt={item.title || ""}
                                loading="lazy"
                                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                          )}
                          <div className="p-4 flex-1 flex flex-col">
                            <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-mainColor transition-colors">
                              {item.title}
                            </h3>
                            {item.description && (
                              <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
                                {item.description}
                              </p>
                            )}
                            {safeUrl(item.link || item.url) && (
                              <Link
                                to={item.link || item.url}
                                className="inline-flex items-center text-xs font-bold text-mainColor hover:underline gap-1 mt-auto"
                              >
                                Xem chi tiết <ArrowForward fontSize="inherit" />
                              </Link>
                            )}
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                  {safeUrl(section.ctaUrl) && (
                    <div className="mt-12 text-center">
                      <Link
                        to={section.ctaUrl}
                        className="inline-flex items-center gap-2 rounded-full border-2 border-slate-200 hover:border-mainColor px-8 py-3 font-semibold text-slate-700 hover:text-mainColor hover:shadow-lg transition-all"
                      >
                        {section.ctaLabel || "Xem tất cả"} <ArrowForward fontSize="small" />
                      </Link>
                    </div>
                  )}
                </div>
              </section>
            );

          case "TESTIMONIALS":
            return (
              <section key={section.id || sectionIdx} className="py-20 bg-slate-900 text-white relative overflow-hidden">
                <div className="container mx-auto max-w-7xl px-6 relative z-10">
                  <div className="text-center max-w-3xl mx-auto mb-14">
                    {section.subtitle && (
                      <p className="text-blue-300 font-bold uppercase tracking-wider text-xs mb-2">
                        {section.subtitle}
                      </p>
                    )}
                    <h2 className="text-3xl lg:text-4xl font-extrabold">{section.title || "Góc nhìn người dùng"}</h2>
                    {section.description && <p className="text-slate-300 mt-3 text-base">{section.description}</p>}
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {section.items?.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/80 p-6 rounded-2xl hover:bg-slate-800 transition-colors flex flex-col justify-between"
                      >
                        <div>
                          <FormatQuote className="text-mainColor opacity-60 mb-4" sx={{ fontSize: 40 }} />
                          <p className="text-slate-200 text-base leading-relaxed mb-6 italic">
                            "{item.description}"
                          </p>
                        </div>
                        <div className="flex items-center gap-3 pt-4 border-t border-slate-700">
                          {safeUrl(item.image) ? (
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-11 h-11 rounded-full object-cover border-2 border-mainColor"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-full bg-mainColor flex items-center justify-center font-bold text-white text-base">
                              {item.title?.charAt(0) || "U"}
                            </div>
                          )}
                          <div>
                            <h4 className="font-bold text-white text-sm">{item.title}</h4>
                            {item.role && <p className="text-xs text-slate-400">{item.role}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );

          case "PARTNERS":
            return (
              <section key={section.id || sectionIdx} className="py-14 border-y border-slate-100 bg-white">
                <div className="container mx-auto max-w-7xl px-6">
                  {section.title && (
                    <h2 className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">
                      {section.title}
                    </h2>
                  )}
                  <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 opacity-75 hover:opacity-100 transition-opacity">
                    {section.items?.map((item, idx) =>
                      safeUrl(item.image) ? (
                        <img
                          key={item.id || idx}
                          src={item.image}
                          alt={item.title || `Partner ${idx}`}
                          className="h-10 md:h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                          title={item.title}
                        />
                      ) : (
                        <div key={item.id || idx} className="text-lg font-extrabold text-slate-400">
                          {item.title}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </section>
            );

          case "OFFERS":
            return (
              <section key={section.id || sectionIdx} className="py-16 px-6">
                <div className="container mx-auto max-w-5xl bg-gradient-to-r from-[#034657] to-[#206c9e] rounded-3xl p-10 md:p-14 text-center text-white shadow-2xl relative overflow-hidden">
                  <div className="relative z-10">
                    <h2 className="text-3xl md:text-4xl font-extrabold mb-4">{section.title}</h2>
                    {section.description && (
                      <p className="text-base md:text-lg text-blue-100 max-w-2xl mx-auto mb-8 font-normal">
                        {section.description}
                      </p>
                    )}
                    {safeUrl(section.ctaUrl) && (
                      <Link
                        to={section.ctaUrl}
                        className="inline-flex items-center gap-2 rounded-full bg-white text-[#034657] font-bold px-8 py-3.5 shadow-lg hover:bg-slate-100 transition-all text-base"
                      >
                        {section.ctaLabel || "Tham gia ngay"} <ArrowForward fontSize="small" />
                      </Link>
                    )}
                  </div>
                </div>
              </section>
            );

          default:
            return null;
        }
      })}
    </main>
  );
};

export default DynamicHome;

