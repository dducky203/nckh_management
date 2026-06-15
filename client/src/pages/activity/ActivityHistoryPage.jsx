import { useEffect, useState, useMemo, useCallback } from "react";
import {
  CalendarToday,
  FilterList,
  Search,
  OpenInNew,
  Article,
  Badge,
  LocationOn,
  CheckCircle,
  HourglassEmpty,
  Block,
  Edit,
  ChevronLeft,
  ChevronRight,
  HistoryEdu,
} from "@mui/icons-material";
import { useAuth } from "../../context/useAuth";
import { useToast } from "../../context/ToastContext";
import nckhActivityService from "../../services/nckhActivityService";
import {
  TYPE_META,
  STATUS_META,
  resolveActivityType,
  formatDateValue,
} from "../../constants/activityConstants";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { getBadgeColorStyles } from "../../utils/helpers";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function TypeBadge({ type }) {
  const t = TYPE_META[type] || { label: type || "Chưa phân loại", color: "" };
  const styleClass = getBadgeColorStyles(t.color);
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border tracking-wide uppercase whitespace-nowrap ${styleClass}`}
    >
      {t.label}
    </span>
  );
}

function StatusBadge({ status }) {
  const s = STATUS_META[status] || {
    label: status,
    cls: "bg-slate-100 text-slate-600 border-slate-200",
  };
  const icons = {
    APPROVED: <CheckCircle sx={{ fontSize: 11 }} />,
    SUBMITTED: <HourglassEmpty sx={{ fontSize: 11 }} />,
    REJECTED: <Block sx={{ fontSize: 11 }} />,
    DRAFT: <Edit sx={{ fontSize: 11 }} />,
  };
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${s.cls}`}
    >
      {icons[status]}
      {s.label}
    </span>
  );
}

const ACTIVITY_TYPE_OPTIONS = [
  { value: "", label: "Tất cả loại" },
  { value: "SEMINAR", label: "Seminar" },
  { value: "CONFERENCE", label: "Hội thảo" },
  { value: "INTL_PAPER", label: "Bài báo Quốc tế" },
  { value: "VN_PAPER", label: "Bài báo Tiếng Việt" },
  { value: "PROCEEDING", label: "Bài tham luận kỷ yếu" },
  { value: "REVIEW_PAPER", label: "Bài tổng quan" },
  { value: "TECH_CONSULT", label: "Tư vấn kỹ thuật" },
  { value: "TECH_PROCEDURE", label: "Quy trình kỹ thuật" },
  { value: "PROPOSAL", label: "Đề xuất tuyển chọn" },
  { value: "APPROVED_TASK", label: "Nhiệm vụ KH&CN" },
  { value: "COUNCIL", label: "Hội đồng tư vấn" },
  { value: "EXPERT_INVITE", label: "Mời chuyên gia" },
  { value: "OTHER_ACTIVITY", label: "Hoạt động KH&CN khác" },
];

const STATUS_OPTIONS = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "DRAFT", label: "Nháp" },
  { value: "SUBMITTED", label: "Chờ duyệt" },
  { value: "APPROVED", label: "Đã duyệt" },
  { value: "REJECTED", label: "Từ chối" },
];

const CATALOG_TO_DECL_PATH = {
  SEMINAR_TRINH_BAY: "/activity/declarations/seminar",
  SEMINAR_THAM_DU: "/activity/declarations/seminar",
  HT_THAM_GIA: "/activity/declarations/conference",
  HT_THAM_LUAN: "/activity/declarations/conference",
  HT_TC_HV: "/activity/declarations/conference",
  HT_TC_QUOCGIA: "/activity/declarations/conference",
  HT_TC_QUOCTE: "/activity/declarations/conference",
  BB_WOS_SCOPUS: "/activity/declarations/international-paper",
  BB_SCOPUS: "/activity/declarations/international-paper",
  BB_TA_HOCVIEN: "/activity/declarations/international-paper",
  BB_TV_HOCVIEN: "/activity/declarations/vietnamese-paper",
  BTL_FULL_TEXT: "/activity/declarations/proceeding",
  TONG_QUAN: "/activity/declarations/review-paper",
  TU_VAN_BAN_TIN: "/activity/declarations/tech-consult",
  DE_XUAT_BO: "/activity/declarations/proposal",
  NHIEM_VU_QG_CHU: "/activity/declarations/approved-task",
  NHIEM_VU_QG_TK: "/activity/declarations/approved-task",
  NHIEM_VU_QG_TG: "/activity/declarations/approved-task",
  NHIEM_VU_BO_CHU: "/activity/declarations/approved-task",
  NHIEM_VU_BO_TK: "/activity/declarations/approved-task",
  NHIEM_VU_BO_TG: "/activity/declarations/approved-task",
  NHIEM_VU_HV_CHU: "/activity/declarations/approved-task",
  NHIEM_VU_HV_TG: "/activity/declarations/approved-task",
  HD_SVNCKH: "/activity/declarations/approved-task",
  HOI_DONG_TV: "/activity/declarations/council",
  MOI_CHUYEN_GIA: "/activity/declarations/expert-invite",
  CHUONG_SACH: "/activity/declarations/other-activity",
  GIAO_TRINH: "/activity/declarations/other-activity",
  SACH_CHUYEN_KHAO: "/activity/declarations/other-activity",
  SACH_THAM_KHAO: "/activity/declarations/other-activity",
  HOP_DONG_KHCN: "/activity/declarations/other-activity",
  DE_AN_HV: "/activity/declarations/other-activity",
  BAI_QUANG_BA: "/activity/declarations/other-activity",
};

const PAGE_SIZE = 15;

// ─── Activity Card ────────────────────────────────────────────────────────────
function ActivityHistoryCard({ item }) {
  const resolvedType = resolveActivityType(item);
  const declPath = CATALOG_TO_DECL_PATH[item.catalogCode] || "/activity/user";

  return (
    <div className="group bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col">
      {/* Top color stripe */}
      <div className="h-1 bg-gradient-to-r from-mainColor/70 to-blue-400/60 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="p-5 flex-1 flex flex-col">
        {/* Badges row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <TypeBadge type={resolvedType} />
          <StatusBadge status={item.status} />
        </div>

        {/* Title */}
        <h3
          className="text-[14px] font-bold text-slate-800 leading-snug line-clamp-2 mb-3 group-hover:text-mainColor transition-colors flex-1"
          title={item.title}
        >
          {item.title || `Hoạt động #${item.id}`}
        </h3>

        {/* Meta info */}
        <div className="space-y-1.5 text-[12px] text-slate-500 mb-4">
          {item.activityDate && (
            <div className="flex items-center gap-2">
              <CalendarToday sx={{ fontSize: 13 }} className="text-blue-400 flex-shrink-0" />
              <span>{formatDateValue(item.activityDate)}</span>
            </div>
          )}
          {item.publicationName && (
            <div className="flex items-center gap-2">
              <Article sx={{ fontSize: 13 }} className="text-purple-400 flex-shrink-0" />
              <span className="truncate">{item.publicationName}</span>
            </div>
          )}
          {item.venue && (
            <div className="flex items-center gap-2">
              <LocationOn sx={{ fontSize: 13 }} className="text-rose-400 flex-shrink-0" />
              <span className="truncate">{item.venue}</span>
            </div>
          )}
          {item.quotaHoursSnapshot != null && (
            <div className="flex items-center gap-2">
              <Badge sx={{ fontSize: 13 }} className="text-amber-500 flex-shrink-0" />
              <span className="font-semibold text-amber-700">
                {item.quotaHoursSnapshot} giờ NCKH
              </span>
            </div>
          )}
        </div>

        {/* Catalog code chip */}
        <div className="mb-4">
          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
            {item.catalogCode || "—"}
          </span>
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between">
          <span className="text-[10px] text-slate-400 font-medium">#{item.id}</span>
          <a
            href={declPath}
            onClick={(e) => {
              e.preventDefault();
              window.location.href = declPath;
            }}
            className="flex items-center gap-1.5 text-[11px] font-bold text-mainColor border border-mainColor/20 bg-mainColor/5 hover:bg-mainColor/10 px-3 py-1.5 rounded-lg transition-colors"
          >
            Đến trang khai báo
            <OpenInNew sx={{ fontSize: 12 }} />
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ActivityHistoryPage() {
  const { user } = useAuth();
  const toast = useToast();
  const currentYear = new Date().getFullYear();

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [activityType, setActivityType] = useState("");
  const [status, setStatus] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [page, setPage] = useState(1);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchActivities = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await nckhActivityService.getMyActivities({
        userId: user.id,
        year: selectedYear,
        activityType: activityType || undefined,
        status: status || undefined,
      });
      setItems(res?.data ?? res ?? []);
      setPage(1);
    } catch (err) {
      toast.error(err?.message || "Không tải được danh sách hoạt động");
    } finally {
      setLoading(false);
    }
  }, [user?.id, selectedYear, activityType, status]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  // Client-side search filter
  const filteredItems = useMemo(() => {
    const kw = searchKeyword.trim().toLowerCase();
    if (!kw) return items;
    return items.filter(
      (it) =>
        it.title?.toLowerCase().includes(kw) ||
        it.publicationName?.toLowerCase().includes(kw) ||
        it.catalogCode?.toLowerCase().includes(kw)
    );
  }, [items, searchKeyword]);

  // Stats
  const stats = useMemo(() => {
    const approved = items.filter((i) => i.status === "APPROVED").length;
    const submitted = items.filter((i) => i.status === "SUBMITTED").length;
    const draft = items.filter((i) => i.status === "DRAFT").length;
    const rejected = items.filter((i) => i.status === "REJECTED").length;
    const totalHours = items
      .filter((i) => i.status === "APPROVED")
      .reduce((sum, i) => sum + (i.quotaHoursSnapshot || 0), 0);
    return { approved, submitted, draft, rejected, totalHours };
  }, [items]);

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / PAGE_SIZE);
  const paginatedItems = filteredItems.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const availableYears = useMemo(() => {
    const years = [];
    for (let y = currentYear; y >= 2020; y--) years.push(y);
    return years;
  }, [currentYear]);

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-[#0f2040] to-mainColor text-white py-14">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-mainColor/30 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <HistoryEdu sx={{ fontSize: 22 }} />
            </div>
            <div>
              <p className="text-xs text-white/60 font-semibold uppercase tracking-widest">
                NCKH Cá nhân
              </p>
              <h1 className="text-3xl md:text-4xl font-black leading-tight">
                Lịch sử hoạt động
              </h1>
            </div>
          </div>
          <p className="text-slate-300 text-sm max-w-xl mt-2">
            Xem toàn bộ hoạt động NCKH của bạn qua từng năm học — tất cả loại,
            tất cả trạng thái.
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-3 mt-6">
            {[
              { label: "Tổng", value: items.length, color: "bg-white/10" },
              { label: "Đã duyệt", value: stats.approved, color: "bg-emerald-500/20 border border-emerald-400/20" },
              { label: "Chờ duyệt", value: stats.submitted, color: "bg-amber-500/20 border border-amber-400/20" },
              { label: "Giờ quy đổi", value: `${Math.round(stats.totalHours * 10) / 10}h`, color: "bg-blue-500/20 border border-blue-400/20" },
            ].map((s) => (
              <div key={s.label} className={`rounded-xl px-4 py-2 ${s.color}`}>
                <p className="text-[10px] text-white/60 font-bold uppercase tracking-wide">{s.label}</p>
                <p className="text-xl font-black">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="max-w-7xl mx-auto px-6 -mt-6 relative z-10">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white/40 shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-5">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                sx={{ fontSize: 17 }}
              />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => { setSearchKeyword(e.target.value); setPage(1); }}
                placeholder="Tìm theo tiêu đề, tạp chí, mã..."
                className="w-full pl-10 pr-4 h-11 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor text-sm font-semibold text-slate-700 transition-all"
              />
            </div>

            {/* Year selector */}
            <div className="relative flex-shrink-0">
              <FilterList
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                sx={{ fontSize: 16 }}
              />
              <select
                value={selectedYear}
                onChange={(e) => { setSelectedYear(Number(e.target.value)); setPage(1); }}
                className="pl-9 pr-4 h-11 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor text-sm font-bold text-slate-800 appearance-none cursor-pointer transition-all min-w-[120px]"
              >
                {availableYears.map((y) => (
                  <option key={y} value={y}>
                    Năm {y}{y === currentYear ? " (nay)" : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Type filter */}
            <select
              value={activityType}
              onChange={(e) => { setActivityType(e.target.value); setPage(1); }}
              className="h-11 px-4 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor text-sm font-bold text-slate-700 appearance-none cursor-pointer transition-all md:w-52"
            >
              {ACTIVITY_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            {/* Status filter */}
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="h-11 px-4 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor text-sm font-bold text-slate-700 appearance-none cursor-pointer transition-all md:w-44"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Active filters info */}
          {(activityType || status || searchKeyword) && (
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-500 font-semibold">Bộ lọc:</span>
              {activityType && (
                <span className="text-[11px] bg-mainColor/10 text-mainColor font-bold px-2 py-0.5 rounded-full">
                  {ACTIVITY_TYPE_OPTIONS.find(o => o.value === activityType)?.label}
                </span>
              )}
              {status && (
                <span className="text-[11px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
                  {STATUS_OPTIONS.find(o => o.value === status)?.label}
                </span>
              )}
              {searchKeyword && (
                <span className="text-[11px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full">
                  "{searchKeyword}"
                </span>
              )}
              <button
                onClick={() => { setActivityType(""); setStatus(""); setSearchKeyword(""); }}
                className="text-[11px] text-slate-400 hover:text-rose-500 font-bold underline transition-colors"
              >
                Xoá bộ lọc
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-6 mt-6">
        {/* Result count */}
        {!loading && (
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-500 font-semibold">
              {filteredItems.length > 0 ? (
                <>
                  Hiển thị{" "}
                  <span className="text-slate-800 font-bold">
                    {Math.min((page - 1) * PAGE_SIZE + 1, filteredItems.length)}–
                    {Math.min(page * PAGE_SIZE, filteredItems.length)}
                  </span>{" "}
                  / <span className="text-slate-800 font-bold">{filteredItems.length}</span> hoạt động
                </>
              ) : (
                "Không có kết quả"
              )}
            </p>
            {selectedYear < currentYear && (
              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                📅 Dữ liệu lịch sử năm {selectedYear}
              </span>
            )}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <LoadingSpinner size="lg" />
            <p className="text-slate-400 font-medium animate-pulse mt-4">
              Đang tải hoạt động...
            </p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-slate-100 shadow-sm text-center px-4">
            <div className="text-6xl mb-4">📂</div>
            <h3 className="text-lg font-bold text-slate-700 mb-2">
              Không có hoạt động nào
            </h3>
            <p className="text-sm text-slate-400 max-w-xs">
              {selectedYear < currentYear
                ? `Không tìm thấy hoạt động nào trong năm ${selectedYear} với bộ lọc hiện tại.`
                : "Bạn chưa khai báo hoạt động nào trong năm này. Hãy tạo khai báo mới!"}
            </p>
            {selectedYear < currentYear && (
              <button
                onClick={() => setSelectedYear(currentYear)}
                className="mt-4 text-sm font-bold text-mainColor border border-mainColor/30 px-4 py-2 rounded-lg hover:bg-mainColor/5 transition-colors"
              >
                Xem năm hiện tại
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedItems.map((item) => (
                <ActivityHistoryCard key={item.id} item={item} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft sx={{ fontSize: 20 }} />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                  const p = start + i;
                  if (p > totalPages) return null;
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-10 h-10 flex items-center justify-center rounded-xl border font-bold text-sm transition-colors ${
                        p === page
                          ? "bg-mainColor text-white border-mainColor shadow-sm"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight sx={{ fontSize: 20 }} />
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
