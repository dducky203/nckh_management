import {
  Add,
  ArrowDownward,
  ArrowUpward,
  AutoAwesome,
  BarChart,
  CloudUpload,
  ContentPaste,
  Delete,
  DragIndicator,
  Event,
  GroupWork,
  Handshake,
  Laptop,
  Newspaper,
  Psychology,
  Publish,
  Restore,
  Save,
  Science,
  Slideshow,
  Smartphone,
  TabletMac,
  TouchApp,
  ViewCarousel,
  Visibility,
  VisibilityOff
} from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { CONFIRM_MESSAGES, ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../constants";
import { useToast } from "../../context/ToastContext";
import homePageService from "../../services/homePageService";
import DynamicHomePreview from "../Home/DynamicHome";

const SECTION_PRESETS = [
  {
    type: "HERO",
    name: "Hero Banner",
    icon: Slideshow,
    create: (order) => ({
      id: crypto.randomUUID(),
      type: "HERO",
      title: "Hệ thống Quản lý Nghiên cứu Khoa học",
      subtitle: "KHOA CÔNG NGHỆ THÔNG TIN - VNUA",
      description: "Nền tảng số hóa quản lý và tổ chức các hoạt động nghiên cứu khoa học hiện đại.",
      image: "",
      ctaLabel: "Khám phá ngay",
      ctaUrl: "/events",
      items: [],
      displayOrder: order,
      isVisible: true,
    }),
  },
  {
    type: "SLIDESHOW",
    name: "Slideshow Carousel",
    icon: ViewCarousel,
    create: (order) => ({
      id: crypto.randomUUID(),
      type: "SLIDESHOW",
      title: "Slideshow Trang chủ",
      subtitle: "",
      description: "",
      image: "",
      ctaLabel: "",
      ctaUrl: "",
      items: [
        {
          id: crypto.randomUUID(),
          title: "Hệ thống Quản lý Nghiên cứu Khoa học",
          subtitle: "KHOA CÔNG NGHỆ THÔNG TIN",
          description: "Kết nối tri thức, ươm mầm tài năng và đẩy mạnh hoạt động nghiên cứu khoa học.",
          image: "",
          ctaLabel: "Xem sự kiện",
          ctaUrl: "/events",
        },
        {
          id: crypto.randomUUID(),
          title: "Hội thảo & Sự kiện Học thuật",
          subtitle: "GIAO LƯU & HỌC HỎI",
          description: "Tham gia các sự kiện, hội thảo chuyên đề khoa học công nghệ hàng đầu.",
          image: "",
          ctaLabel: "Khám phá tin tức",
          ctaUrl: "/news",
        },
      ],
      displayOrder: order,
      isVisible: true,
    }),
  },
  {
    type: "STATS",
    name: "Lưới Thống kê (Stats)",
    icon: BarChart,
    create: (order) => ({
      id: crypto.randomUUID(),
      type: "STATS",
      title: "Thành tựu & Con số ấn tượng",
      subtitle: "CON SỐ NỔI BẬT",
      description: "Những kết quả nổi bật đạt được trong công tác nghiên cứu khoa học.",
      items: [
        { id: crypto.randomUUID(), title: "500+", description: "Đề tài NCKH đã thực hiện", icon: "science" },
        { id: crypto.randomUUID(), title: "120+", description: "Bài báo khoa học công bố", icon: "newspaper" },
        { id: crypto.randomUUID(), title: "50+", description: "Hội thảo & Event hàng năm", icon: "event" },
        { id: crypto.randomUUID(), title: "2000+", description: "Sinh viên & Giảng viên tham gia", icon: "groups" },
      ],
      displayOrder: order,
      isVisible: true,
    }),
  },
  {
    type: "EVENTS",
    name: "Sự kiện NCKH (Live)",
    icon: Event,
    create: (order) => ({
      id: crypto.randomUUID(),
      type: "EVENTS",
      title: "Sự kiện NCKH sắp diễn ra",
      subtitle: "LỊCH SỰ KIỆN",
      description: "Đừng bỏ lỡ các cơ hội học tập, chia sẻ và kết nối khoa học.",
      ctaLabel: "Xem tất cả sự kiện",
      ctaUrl: "/events",
      itemLimit: 3,
      displayOrder: order,
      isVisible: true,
    }),
  },
  {
    type: "NEWS",
    name: "Tin tức NCKH (Live)",
    icon: Newspaper,
    create: (order) => ({
      id: crypto.randomUUID(),
      type: "NEWS",
      title: "Tin tức & Thông báo mới nhất",
      subtitle: "TIN TỨC HOẠT ĐỘNG",
      description: "Cập nhật nhanh tin tức, quy định và thông báo học vụ.",
      ctaLabel: "Xem tất cả tin tức",
      ctaUrl: "/news",
      itemLimit: 4,
      displayOrder: order,
      isVisible: true,
    }),
  },
  {
    type: "RESEARCH",
    name: "Nhóm NCKH (Live)",
    icon: Science,
    create: (order) => ({
      id: crypto.randomUUID(),
      type: "RESEARCH",
      title: "Nhóm & Đề tài Nghiên cứu nổi bật",
      subtitle: "HOẠT ĐỘNG NCKH",
      description: "Không gian chia sẻ và phát triển các đề tài sáng tạo.",
      ctaLabel: "Xem danh sách nhóm",
      ctaUrl: "/research-groups",
      itemLimit: 3,
      displayOrder: order,
      isVisible: true,
    }),
  },
  {
    type: "CONTENT",
    name: "Giới thiệu (Content)",
    icon: ContentPaste,
    create: (order) => ({
      id: crypto.randomUUID(),
      type: "CONTENT",
      title: "Nền Tảng Kết Nối Tri Thức Khoa Học",
      subtitle: "VỀ HỆ THỐNG",
      description: "Hệ thống số hóa quản lý các hoạt động nghiên cứu khoa học cho giảng viên và sinh viên Khoa CNTT.",
      image: "",
      ctaLabel: "Tìm hiểu thêm",
      ctaUrl: "/about",
      displayOrder: order,
      isVisible: true,
    }),
  },
  {
    type: "CARDS",
    name: "Danh sách thẻ (Cards)",
    icon: GroupWork,
    create: (order) => ({
      id: crypto.randomUUID(),
      type: "CARDS",
      title: "Lĩnh vực nghiên cứu trọng điểm",
      subtitle: "ĐỊNH HƯỚNG NCKH",
      description: "Các hướng nghiên cứu ứng dụng công nghệ hàng đầu.",
      items: [
        { id: crypto.randomUUID(), title: "Trí tuệ nhân tạo (AI)", description: "Ứng dụng Machine Learning & Deep Learning vào giải quyết bài toán thực tế.", image: "", link: "/about" },
        { id: crypto.randomUUID(), title: "Internet of Things (IoT)", description: "Nghiên cứu hạ tầng cảm biến và điều khiển tự động trong nông nghiệp thông minh.", image: "", link: "/about" },
        { id: crypto.randomUUID(), title: "Công nghệ Phần mềm", description: "Xây dựng các hệ thống thông tin quy mô lớn và ứng dụng web/mobile.", image: "", link: "/about" },
      ],
      displayOrder: order,
      isVisible: true,
    }),
  },
  {
    type: "OFFERS",
    name: "Kêu gọi hành động (CTA)",
    icon: TouchApp,
    create: (order) => ({
      id: crypto.randomUUID(),
      type: "OFFERS",
      title: "Sẵn sàng khởi tạo đề tài nghiên cứu?",
      description: "Đăng nhập ngay hôm nay để tham gia các nhóm nghiên cứu và đăng ký đề tài khoa học.",
      ctaLabel: "Tham gia ngay",
      ctaUrl: "/login",
      displayOrder: order,
      isVisible: true,
    }),
  },
  {
    type: "TESTIMONIALS",
    name: "Đánh giá / Phản hồi",
    icon: Psychology,
    create: (order) => ({
      id: crypto.randomUUID(),
      type: "TESTIMONIALS",
      title: "Cảm nhận từ Giảng viên & Sinh viên",
      subtitle: "GÓC NHÌN NGƯỜI DÙNG",
      description: "Chia sẻ thực tế từ các nhà nghiên cứu trẻ.",
      items: [
        { id: crypto.randomUUID(), title: "Nguyễn Văn A", role: "Sinh viên NCKH", description: "Hệ thống giúp mình dễ dàng tìm kiếm giảng viên hướng dẫn và nộp báo cáo tiến độ trực tuyến.", image: "" },
      ],
      displayOrder: order,
      isVisible: true,
    }),
  },
  {
    type: "PARTNERS",
    name: "Đối tác / Logo",
    icon: Handshake,
    create: (order) => ({
      id: crypto.randomUUID(),
      type: "PARTNERS",
      title: "ĐỐI TÁC KHÁCH THỂ & DOANH NGHIỆP NCKH",
      items: [
        { id: crypto.randomUUID(), title: "Học viện Nông nghiệp Việt Nam", image: "" },
      ],
      displayOrder: order,
      isVisible: true,
    }),
  },
];

const ImageUploader = ({ value, onChange, label = "Hình ảnh" }) => {
  const handleFileSelect = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file hình ảnh (JPEG, PNG, WEBP...)");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    onChange(objectUrl, file);
  };

  return (
    <div className="block">
      <span className="block mb-1 text-xs font-semibold text-slate-700">{label}</span>
      <div className="flex gap-2">
        <input
          value={value || ""}
          onChange={(e) => onChange(e.target.value, null)}
          placeholder="Nhập URL ảnh hoặc bấm Chọn ảnh"
          className="flex-1 border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-mainColor outline-none"
        />
        <label
          className="flex items-center justify-center gap-1.5 px-3 py-2 border rounded-xl cursor-pointer transition-colors bg-white hover:bg-slate-50 text-mainColor border-mainColor/30"
          onClick={(e) => e.stopPropagation()}
        >
          <CloudUpload fontSize="small" />
          <span className="text-xs font-semibold">Chọn ảnh</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            onClick={(e) => e.stopPropagation()}
          />
        </label>
      </div>
      {value && (
        <img
          src={value}
          alt="Preview"
          className="mt-2 h-16 w-auto rounded-lg border border-slate-200 object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      )}
    </div>
  );
};

const HomePageManager = () => {
  const [sections, setSections] = useState([]);
  const [selected, setSelected] = useState(0);
  const [busy, setBusy] = useState(true);
  const [dirty, setDirty] = useState(false);
  const [previewMode, setPreviewMode] = useState("desktop");
  const [showPresets, setShowPresets] = useState(false);
  const toast = useToast();

  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  const pendingFilesRef = useRef(new Map());

  useEffect(() => {
    homePageService
      .getDraft()
      .then((data) => setSections((data?.data || data)?.sections || []))
      .catch((error) => toast.error(error.message || ERROR_MESSAGES.HOMEPAGE.LOAD_DRAFT_ERROR))
      .finally(() => setBusy(false));
  }, [toast]);

  useEffect(() => {
    const warn = (event) => {
      if (dirty) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const current = sections[selected];

  const change = (field, value) => {
    setSections((all) => all.map((s, i) => (i === selected ? { ...s, [field]: value } : s)));
    setDirty(true);
  };

  const handleSectionImageChange = (val, file) => {
    if (file && val) {
      pendingFilesRef.current.set(val, file);
    }
    change("image", val);
  };

  const handleItemImageChange = (idx, val, file) => {
    if (file && val) {
      pendingFilesRef.current.set(val, file);
    }
    const items = [...current.items];
    items[idx].image = val;
    change("items", items);
  };

  const uploadPendingFilesAndPreparePayload = async () => {
    const updatedSections = JSON.parse(JSON.stringify(sections));
    const pendingBlobUrls = new Set();

    const scanUrl = (url) => {
      if (url && (url.startsWith("blob:") || pendingFilesRef.current.has(url))) {
        pendingBlobUrls.add(url);
      }
    };

    updatedSections.forEach((s) => {
      scanUrl(s.image);
      (s.items || []).forEach((item) => scanUrl(item.image));
    });

    if (pendingBlobUrls.size > 0) {
      const uploadedMap = new Map();
      for (const blobUrl of pendingBlobUrls) {
        const file = pendingFilesRef.current.get(blobUrl);
        if (file) {
          const res = await homePageService.uploadImage(file);
          const realUrl = res?.data || res;
          uploadedMap.set(blobUrl, realUrl);
          pendingFilesRef.current.delete(blobUrl);
        }
      }

      const resolveUrl = (url) => (uploadedMap.has(url) ? uploadedMap.get(url) : url);

      updatedSections.forEach((s) => {
        if (s.image) s.image = resolveUrl(s.image);
        (s.items || []).forEach((item) => {
          if (item.image) item.image = resolveUrl(item.image);
        });
      });

      setSections(updatedSections);
    }

    return {
      sections: updatedSections.map((s, i) => ({ ...s, displayOrder: i })),
    };
  };

  const handleSort = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    let _sections = [...sections];
    const draggedItemContent = _sections.splice(dragItem.current, 1)[0];
    _sections.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setSections(_sections);
    setSelected(dragOverItem.current);
    setDirty(true);
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const newSecs = [...sections];
    const temp = newSecs[index - 1];
    newSecs[index - 1] = newSecs[index];
    newSecs[index] = temp;
    setSections(newSecs);
    setSelected(index - 1);
    setDirty(true);
  };

  const moveDown = (index) => {
    if (index === sections.length - 1) return;
    const newSecs = [...sections];
    const temp = newSecs[index + 1];
    newSecs[index + 1] = newSecs[index];
    newSecs[index] = temp;
    setSections(newSecs);
    setSelected(index + 1);
    setDirty(true);
  };

  const addPreset = (preset) => {
    const newSec = preset.create(sections.length);
    setSections((all) => [...all, newSec]);
    setSelected(sections.length);
    setDirty(true);
    setShowPresets(false);
  };

  const run = async (action, successMsg) => {
    try {
      setBusy(true);
      await action();
      setDirty(false);
      toast.success(successMsg);
    } catch (e) {
      toast.error(e.message || ERROR_MESSAGES.SYSTEM.SERVER);
    } finally {
      setBusy(false);
    }
  };

  if (busy && !sections.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse text-mainColor font-bold text-lg flex items-center gap-2">
          <AutoAwesome className="animate-spin" />
          Đang tải cấu hình trang chủ...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1650px] mx-auto px-4 py-8 bg-slate-50 min-h-screen font-sans">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <AutoAwesome className="text-mainColor" />
            Quản lý & Tùy biến Trang chủ
          </h1>
          <p className="text-xs font-semibold mt-1.5 flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${dirty ? "bg-amber-500 animate-ping" : "bg-emerald-500"}`}></span>
            {dirty ? "Có thay đổi chưa lưu (Vui lòng bấm Lưu nháp hoặc Xuất bản)" : "Tất cả thay đổi đã được xuất bản / lưu"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() =>
              run(
                () =>
                  homePageService.restore().then((data) => setSections((data?.data || data).sections || [])),
                SUCCESS_MESSAGES.HOMEPAGE.RESTORE
              )
            }
            className="px-4 py-2.5 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors text-xs font-bold flex items-center gap-1.5 text-slate-700 shadow-sm"
          >
            <Restore fontSize="small" /> Khôi phục
          </button>
          <button
            type="button"
            disabled={busy || !dirty}
            onClick={() =>
              run(async () => {
                const finalPayload = await uploadPendingFilesAndPreparePayload();
                await homePageService.saveDraft(finalPayload);
              }, SUCCESS_MESSAGES.HOMEPAGE.SAVE_DRAFT)
            }
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors ${dirty
                ? "bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300"
                : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
              }`}
          >
            <Save fontSize="small" /> Lưu nháp
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              if (window.confirm(CONFIRM_MESSAGES.HOMEPAGE_PUBLISH)) {
                run(async () => {
                  const finalPayload = await uploadPendingFilesAndPreparePayload();
                  await homePageService.publish(finalPayload);
                }, SUCCESS_MESSAGES.HOMEPAGE.PUBLISH);
              }
            }}
            className="px-5 py-2.5 rounded-xl bg-mainColor hover:bg-mainColor/90 text-white text-xs font-bold flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all"
          >
            <Publish fontSize="small" /> Xuất bản
          </button>
        </div>
      </div>

      {/* Top 2-Column Editor Layout */}
      <div className="grid lg:grid-cols-[340px_1fr] gap-6 items-start">
        {/* Sidebar: Danh sách Section */}
        <aside className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4 sticky top-20">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-slate-800 uppercase tracking-wider text-xs">Cấu trúc trang ({sections.length})</h2>
            <button
              type="button"
              onClick={() => setShowPresets(!showPresets)}
              className="text-xs font-bold text-mainColor hover:bg-mainColor/10 px-2 py-1 rounded-lg transition-colors"
            >
              {showPresets ? "Đóng danh mục" : "+ Thêm khu vực"}
            </button>
          </div>

          {/* Presets Grid Drawer */}
          {showPresets && (
            <div className="mb-4 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
              <p className="text-[11px] font-semibold text-slate-500 mb-2">Chọn mẫu section để thêm:</p>
              <div className="grid grid-cols-1 gap-1.5">
                {SECTION_PRESETS.map((preset) => {
                  const Icon = preset.icon || AutoAwesome;
                  return (
                    <button
                      key={preset.type}
                      type="button"
                      onClick={() => addPreset(preset)}
                      className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 hover:border-mainColor hover:bg-mainColor/5 text-left transition-all group"
                    >
                      {Icon && <Icon fontSize="small" className="text-mainColor group-hover:scale-110 transition-transform" />}
                      <span className="text-xs font-bold text-slate-700 group-hover:text-mainColor">{preset.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="space-y-2 mb-4 max-h-[62vh] overflow-y-auto pr-1 custom-scrollbar">
            {sections.map((section, index) => (
              <div
                key={section.id || index}
                draggable
                onDragStart={(e) => {
                  dragItem.current = index;
                  e.dataTransfer.effectAllowed = "move";
                }}
                onDragEnter={(e) => {
                  dragOverItem.current = index;
                  e.preventDefault();
                }}
                onDragEnd={handleSort}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => setSelected(index)}
                className={`group flex items-center gap-2 p-2.5 rounded-xl cursor-pointer transition-all border ${selected === index
                    ? "bg-mainColor/10 border-mainColor/40 shadow-sm"
                    : "bg-white border-slate-100 hover:border-mainColor/20 hover:bg-slate-50"
                  }`}
              >
                <div className="cursor-grab text-slate-400 group-hover:text-slate-600">
                  <DragIndicator fontSize="small" />
                </div>
                <div className="flex-1 min-w-0">
                  <span
                    className={`block text-xs font-bold truncate ${selected === index ? "text-mainColor" : "text-slate-700"
                      }`}
                  >
                    {section.title || "Khu vực không tên"}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">
                    {section.type} {section.isVisible === false ? "· ẨN" : ""}
                  </span>
                </div>
                <div className="flex items-center gap-0.5 opacity-80 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      moveUp(index);
                    }}
                    disabled={index === 0}
                    className="p-1 text-slate-400 hover:text-mainColor disabled:opacity-20"
                    title="Lên trên"
                  >
                    <ArrowUpward style={{ fontSize: 14 }} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      moveDown(index);
                    }}
                    disabled={index === sections.length - 1}
                    className="p-1 text-slate-400 hover:text-mainColor disabled:opacity-20"
                    title="Xuống dưới"
                  >
                    <ArrowDownward style={{ fontSize: 14 }} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowPresets(true)}
            className="w-full py-2.5 flex items-center justify-center gap-2 border-2 border-dashed border-mainColor/30 rounded-xl text-mainColor text-xs font-bold hover:bg-mainColor/10 transition-colors"
          >
            <Add fontSize="small" /> Thêm Khu vực mới
          </button>
        </aside>

        {/* Editor Center Panel */}
        <section className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 sticky top-20 max-h-[84vh] overflow-y-auto custom-scrollbar">
          {!current ? (
            <div className="text-center text-slate-400 py-20">
              <AutoAwesome sx={{ fontSize: 48 }} className="mb-2 text-slate-300" />
              <p className="font-semibold text-sm">Chưa chọn khu vực nào.</p>
              <p className="text-xs mt-1">Bấm nút "+ Thêm khu vực" ở cột trái để bắt đầu.</p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    Chỉnh sửa Khu vực: <span className="text-mainColor font-extrabold">{current.type}</span>
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(CONFIRM_MESSAGES.HOMEPAGE_DELETE_SECTION)) {
                      setSections((all) => all.filter((_, i) => i !== selected));
                      setSelected(Math.max(0, selected - 1));
                      setDirty(true);
                    }
                  }}
                  className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors text-xs font-bold flex items-center gap-1"
                >
                  <Delete fontSize="small" /> Xóa
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="block mb-1 text-xs font-semibold text-slate-700">Loại Section</span>
                  <select
                    value={current.type}
                    onChange={(e) => change("type", e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-semibold focus:ring-2 focus:ring-mainColor outline-none bg-slate-50"
                  >
                    {SECTION_PRESETS.map((p) => (
                      <option key={p.type} value={p.type}>
                        {p.name} ({p.type})
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors self-end">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={current.isVisible !== false}
                      onChange={(e) => change("isVisible", e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-mainColor"></div>
                  </div>
                  <span className="text-xs font-bold text-slate-700">
                    {current.isVisible !== false ? (
                      <span className="text-emerald-600 flex items-center gap-1"><Visibility style={{ fontSize: 14 }} /> Hiển thị</span>
                    ) : (
                      <span className="text-slate-400 flex items-center gap-1"><VisibilityOff style={{ fontSize: 14 }} /> Ẩn section</span>
                    )}
                  </span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="block mb-1 text-xs font-semibold text-slate-700">Tiêu đề chính</span>
                  <input
                    value={current.title || ""}
                    onChange={(e) => change("title", e.target.value)}
                    placeholder="VD: Sự kiện NCKH sắp diễn ra"
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-mainColor outline-none font-semibold"
                  />
                </label>
                <label className="block">
                  <span className="block mb-1 text-xs font-semibold text-slate-700">Tiêu đề phụ / Subtitle</span>
                  <input
                    value={current.subtitle || ""}
                    onChange={(e) => change("subtitle", e.target.value)}
                    placeholder="VD: HOẠT ĐỘNG KHOA HỌC"
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-mainColor outline-none"
                  />
                </label>
              </div>

              <label className="block">
                <span className="block mb-1 text-xs font-semibold text-slate-700">Mô tả ngắn / Chi tiết</span>
                <textarea
                  rows="2"
                  value={current.description || ""}
                  onChange={(e) => change("description", e.target.value)}
                  placeholder="Mô tả tóm tắt cho phần nội dung này..."
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-mainColor outline-none"
                />
              </label>

              {(current.type === "HERO" || current.type === "CONTENT") && (
                <ImageUploader
                  value={current.image}
                  onChange={(val, file) => handleSectionImageChange(val, file)}
                  label="Hình ảnh nền / Minh họa"
                />
              )}

              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="block mb-1 text-xs font-semibold text-slate-700">Tên nút CTA (Button)</span>
                  <input
                    value={current.ctaLabel || ""}
                    onChange={(e) => change("ctaLabel", e.target.value)}
                    placeholder="VD: Khám phá ngay"
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-mainColor outline-none"
                  />
                </label>
                <label className="block">
                  <span className="block mb-1 text-xs font-semibold text-slate-700">Đường dẫn nút (URL)</span>
                  <input
                    value={current.ctaUrl || ""}
                    onChange={(e) => change("ctaUrl", e.target.value)}
                    placeholder="VD: /events hoặc /news"
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-mainColor outline-none"
                  />
                </label>
              </div>

              {/* Items Management for SLIDESHOW, STATS, CARDS, TESTIMONIALS, PARTNERS */}
              {(current.type === "SLIDESHOW" ||
                current.type === "STATS" ||
                current.type === "CARDS" ||
                current.type === "TESTIMONIALS" ||
                current.type === "PARTNERS") && (
                  <div className="mt-6 border-t border-slate-200 pt-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                        Danh sách các mục con ({current.items?.length || 0})
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          const items = [
                            ...(current.items || []),
                            {
                              id: crypto.randomUUID(),
                              title: "Mục mới",
                              subtitle: "",
                              description: "",
                              image: "",
                              icon: "science",
                              ctaUrl: "",
                            },
                          ];
                          change("items", items);
                        }}
                        className="text-xs font-bold text-mainColor hover:bg-mainColor/10 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Add fontSize="small" /> Thêm mục con
                      </button>
                    </div>

                    <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-1 custom-scrollbar">
                      {(current.items || []).map((item, idx) => (
                        <div key={item.id || idx} className="p-3.5 border border-slate-200 rounded-xl bg-slate-50 relative group space-y-2">
                          <button
                            type="button"
                            onClick={() => {
                              const items = [...current.items];
                              items.splice(idx, 1);
                              change("items", items);
                            }}
                            className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                            title="Xóa mục"
                          >
                            <Delete fontSize="small" />
                          </button>

                          <div className="grid grid-cols-2 gap-2 pr-6">
                            <input
                              value={item.title || ""}
                              onChange={(e) => {
                                const items = [...current.items];
                                items[idx].title = e.target.value;
                                change("items", items);
                              }}
                              placeholder="Tiêu đề / Số liệu"
                              className="bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold outline-none focus:border-mainColor"
                            />
                            {current.type === "STATS" ? (
                              <select
                                value={item.icon || "science"}
                                onChange={(e) => {
                                  const items = [...current.items];
                                  items[idx].icon = e.target.value;
                                  change("items", items);
                                }}
                                className="bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold outline-none focus:border-mainColor"
                              >
                                <option value="science">Icon Khoa học (Science)</option>
                                <option value="newspaper">Icon Tin tức (Newspaper)</option>
                                <option value="event">Icon Sự kiện (Event)</option>
                                <option value="groups">Icon Nhóm (Groups)</option>
                                <option value="school">Icon Học thuật (School)</option>
                                <option value="trophy">Icon Cúp thưởng (Trophy)</option>
                                <option value="award">Icon Giải thưởng (Award)</option>
                                <option value="star">Icon Ngôi sao (Star)</option>
                              </select>
                            ) : (
                              <input
                                value={item.subtitle || item.role || ""}
                                onChange={(e) => {
                                  const items = [...current.items];
                                  if (current.type === "TESTIMONIALS") items[idx].role = e.target.value;
                                  else items[idx].subtitle = e.target.value;
                                  change("items", items);
                                }}
                                placeholder={current.type === "TESTIMONIALS" ? "Chức danh / Vai trò" : "Tiêu đề phụ"}
                                className="bg-white border border-slate-300 rounded-lg p-2 text-xs outline-none focus:border-mainColor"
                              />
                            )}
                          </div>

                          <textarea
                            value={item.description || ""}
                            onChange={(e) => {
                              const items = [...current.items];
                              items[idx].description = e.target.value;
                              change("items", items);
                            }}
                            placeholder="Mô tả chi tiết mục..."
                            rows="1"
                            className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs outline-none focus:border-mainColor resize-none"
                          />

                          {current.type !== "STATS" && (
                            <ImageUploader
                              value={item.image}
                              onChange={(val, file) => handleItemImageChange(idx, val, file)}
                              label="Ảnh đại diện / Minh họa"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          )}
        </section>
      </div>

      {/* Full-Width Live Preview Panel */}
      <section className="w-full mt-8 flex flex-col min-h-[85vh] bg-slate-800 border border-slate-700 shadow-2xl rounded-2xl overflow-hidden">
        <div className="bg-slate-900 text-slate-200 px-6 py-4 flex justify-between items-center border-b border-slate-700 z-10">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-sm font-extrabold uppercase tracking-widest text-slate-200">
              Live Preview (Xem trước trực tiếp - Full Screen Width)
            </span>
          </div>
          <div className="flex bg-slate-800 rounded-xl p-1 border border-slate-700 gap-1">
            <button
              type="button"
              onClick={() => setPreviewMode("desktop")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                previewMode === "desktop"
                  ? "bg-mainColor text-white shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-slate-700"
              }`}
              title="Xem giao diện Desktop"
            >
              <Laptop fontSize="small" /> Desktop (Wide)
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode("tablet")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                previewMode === "tablet"
                  ? "bg-mainColor text-white shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-slate-700"
              }`}
              title="Xem giao diện Tablet"
            >
              <TabletMac fontSize="small" /> Tablet (768px)
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode("mobile")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                previewMode === "mobile"
                  ? "bg-mainColor text-white shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-slate-700"
              }`}
              title="Xem giao diện Mobile"
            >
              <Smartphone fontSize="small" /> Mobile (375px)
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto flex justify-center custom-scrollbar p-6 bg-slate-900/60">
          <div
            className={`bg-white shadow-2xl rounded-2xl transition-all duration-300 overflow-hidden ${
              previewMode === "mobile"
                ? "w-[375px]"
                : previewMode === "tablet"
                ? "w-[768px]"
                : "w-full max-w-[1600px]"
            }`}
            style={{ minHeight: "100%" }}
          >
            {sections.length > 0 ? (
              <DynamicHomePreview
                previewConfig={{ sections: sections.map((s, i) => ({ ...s, displayOrder: i })) }}
              />
            ) : (
              <div className="p-20 text-center text-slate-400 my-auto">
                <AutoAwesome sx={{ fontSize: 56 }} className="mb-3 text-slate-300" />
                <p className="font-semibold text-base">Trang chủ hiện chưa có khu vực nào.</p>
                <p className="text-xs text-slate-500 mt-1">
                  Hãy thêm section từ thanh công cụ bên trên để xem trước tại đây.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePageManager;

