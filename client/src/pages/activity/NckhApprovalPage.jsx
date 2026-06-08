import { useEffect, useState } from "react";
import {
  CheckCircle,
  Cancel,
  CalendarToday,
  Article,
  Person,
  FilterList,
} from "@mui/icons-material";
import { useAuth } from "../../context/useAuth";
import { useToast } from "../../context/ToastContext";
import nckhActivityService from "../../services/nckhActivityService";
import userService from "../../services/userService";
import { TYPE_META } from "../../constants/activityConstants";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { getBadgeColorStyles } from "../../utils/helpers";

// ─── Sub-components ───────────────────────────────────────────────────────────

const ALL_TYPES = Object.keys(TYPE_META);

function TypeBadge({ type }) {
  const t = TYPE_META[type] || { label: type };
  const styleClass = getBadgeColorStyles(t.color);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border tracking-wide uppercase ${styleClass}`}
    >
      {t.label}
    </span>
  );
}

function PendingCard({ item, creatorName, onApprove, onReject, busy }) {
  return (
    <div className="group bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Indicator line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-mainColor/80 to-blue-400/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-4 gap-3">
          <TypeBadge type={item.activityType} />
          <div className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-extrabold px-2 py-0.5 rounded-md whitespace-nowrap">
            Chờ duyệt
          </div>
        </div>

        <h3 className="text-[15px] font-extrabold text-slate-800 mb-4 line-clamp-2 leading-snug flex-1 group-hover:text-mainColor transition-colors">
          {item.title}
        </h3>

        <div className="space-y-2.5 text-[13px] text-slate-500 mb-6 bg-slate-50/50 rounded-xl p-3 border border-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Person sx={{ fontSize: 14 }} />
            </div>
            <span className="font-semibold text-slate-700 line-clamp-1">{creatorName}</span>
          </div>
          {item.activityDate && (
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <CalendarToday sx={{ fontSize: 13 }} />
              </div>
              <span className="font-medium">{item.activityDate}</span>
            </div>
          )}
          {item.publicationName && (
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center flex-shrink-0">
                <Article sx={{ fontSize: 13 }} />
              </div>
              <span className="font-medium line-clamp-1" title={item.publicationName}>{item.publicationName}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-auto pt-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => onReject(item)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-rose-600 bg-rose-50 border border-rose-100 rounded-xl hover:bg-rose-100 hover:border-rose-200 transition-colors font-bold text-[13px] disabled:opacity-50"
          >
            <Cancel sx={{ fontSize: 16 }} />
            Từ chối
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => onApprove(item)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-mainColor text-white rounded-xl hover:brightness-110 hover:-translate-y-0.5 shadow-sm transition-all font-bold text-[13px] disabled:opacity-50"
          >
            <CheckCircle sx={{ fontSize: 16 }} />
            Phê duyệt
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function NckhApprovalPage() {
  const { user } = useAuth();
  const toast = useToast();
  const currentYear = new Date().getFullYear();

  const [pendingItems, setPendingItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userNameById, setUserNameById] = useState({});
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [keyword, setKeyword] = useState("");
  const [processingId, setProcessingId] = useState(null);

  const loadUserDirectory = async () => {
    try {
      let source = [];
      try {
        const res = await userService.getUsers({ page: 0, size: 500 });
        source =
          res?.data?.result ||
          res?.data?.content ||
          res?.data ||
          res?.result ||
          res?.content ||
          res ||
          [];
      } catch {
        source = [];
      }
      if (!source || source.length === 0) {
        try {
          const res2 = await userService.getAllUsers({ page: 0, size: 500 });
          source =
            res2?.data?.result ||
            res2?.data?.content ||
            res2?.data ||
            res2?.result ||
            res2?.content ||
            res2 ||
            [];
        } catch {
          source = [];
        }
      }
      const map = {};
      if (source && typeof source === "object" && typeof source.length === "number") {
        source.forEach((it) => {
          const id = it.id ?? it.userId;
          if (!id || isNaN(id)) return;
          map[id] = it.name || it.fullName || it.username || `User #${id}`;
        });
      }
      setUserNameById(map);
    } catch {
      /* silent */
    }
  };

  const loadPending = async () => {
    setLoading(true);
    try {
      const res = await nckhActivityService.getPendingActivities({
        year: selectedYear,
        activityType: typeFilter === "ALL" ? undefined : typeFilter,
      });
      setPendingItems(res?.data || res || []);
    } catch (err) {
      toast.error(err?.message || "Không tải được danh sách chờ duyệt");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserDirectory();
  }, []);
  useEffect(() => {
    loadPending();
  }, [selectedYear, typeFilter]);

  const getName = (id) => userNameById[id] || `User #${id}`;

  const handleApprove = async (item) => {
    setProcessingId(item.id);
    try {
      await nckhActivityService.approveActivity(item.id, user.id);
      toast.success("Đã duyệt khai báo thành công!");
      await loadPending();
    } catch (err) {
      toast.error(err?.message || "Duyệt thất bại");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (item) => {
    if (!window.confirm(`Từ chối khai báo "${item.title}"?`)) return;
    setProcessingId(item.id);
    try {
      await nckhActivityService.rejectActivity(item.id, user.id);
      toast.success("Đã từ chối khai báo!");
      await loadPending();
    } catch (err) {
      toast.error(err?.message || "Từ chối thất bại");
    } finally {
      setProcessingId(null);
    }
  };

  const normalizedKw = keyword.trim().toLowerCase();
  const filtered = pendingItems.filter((item) => {
    if (!normalizedKw) return true;
    const name = getName(item.createdByUserId).toLowerCase();
    return (
      name.includes(normalizedKw) ||
      (item.title || "").toLowerCase().includes(normalizedKw)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 font-sans">
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-[#0f2027] to-mainColor text-white py-16">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-mainColor/30 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-widest mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Quản trị viên
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight tracking-tight">
              Phê duyệt <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-teal-200">Khai báo</span>
            </h1>
            <p className="text-lg text-slate-300 font-medium max-w-2xl leading-relaxed">
              Kiểm tra và xử lý các hoạt động nghiên cứu khoa học của giảng viên đang chờ được phê duyệt vào hệ thống.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
        {/* Sleek Filter Bar */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-5 mb-8 flex flex-col md:flex-row md:items-end gap-5">
          <div className="flex items-center gap-2 text-slate-400 mb-1 md:mb-0 hidden md:flex">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
              <FilterList sx={{ fontSize: 18 }} className="text-slate-500" />
            </div>
          </div>

          <label className="flex flex-col gap-1.5 flex-1 md:flex-none">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1">
              Năm học
            </span>
            <input
              type="number"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value || currentYear)}
              className="h-11 w-full md:w-32 bg-slate-50 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all"
            />
          </label>

          <label className="flex flex-col gap-1.5 flex-1 md:flex-none">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1">
              Loại hoạt động
            </span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-11 w-full md:w-56 bg-slate-50 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all appearance-none cursor-pointer"
            >
              <option value="ALL">Tất cả hoạt động</option>
              {ALL_TYPES.map((t) => (
                <option key={t} value={t}>
                  {TYPE_META[t].label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 flex-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1">
              Tìm kiếm
            </span>
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Nhập tên hoạt động, tác giả..."
              className="h-11 w-full bg-slate-50 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor transition-all"
            />
          </label>

          {filtered.length > 0 && (
            <div className="md:ml-auto self-end flex items-center h-11">
              <span className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 text-sm font-extrabold px-4 py-2 rounded-xl border border-amber-200 shadow-sm flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                </span>
                {filtered.length} khai báo chờ duyệt
              </span>
            </div>
          )}
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-32 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <LoadingSpinner size="lg" />
            <p className="text-slate-400 font-medium animate-pulse mt-4">Đang tải dữ liệu khai báo...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <div className="w-24 h-24 rounded-full bg-emerald-50 flex items-center justify-center mb-6">
              <CheckCircle sx={{ fontSize: 48 }} className="text-emerald-400" />
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2">Đã xử lý xong!</h3>
            <p className="text-slate-500 font-medium">Không có khai báo nào đang chờ duyệt lúc này.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <PendingCard
                key={item.id}
                item={item}
                creatorName={getName(item.createdByUserId)}
                onApprove={handleApprove}
                onReject={handleReject}
                busy={processingId === item.id}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
