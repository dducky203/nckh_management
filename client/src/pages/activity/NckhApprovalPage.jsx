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

// ─── Constants ───────────────────────────────────────────────────────────────

const TYPE_META = {
  SEMINAR: { label: "Seminar", color: "bg-blue-600 text-white" },
  CONFERENCE: { label: "Hội thảo", color: "bg-green-600 text-white" },
  INTL_PAPER: { label: "Bài báo Quốc tế", color: "bg-purple-600 text-white" },
  VN_PAPER: { label: "Bài báo Tiếng Việt", color: "bg-orange-600 text-white" },
  PROCEEDING: {
    label: "Bài tham luận kỷ yếu",
    color: "bg-indigo-600 text-white",
  },
  REVIEW_PAPER: { label: "Bài tổng quan", color: "bg-teal-600 text-white" },
  TECH_CONSULT: { label: "Tư vấn kỹ thuật", color: "bg-amber-600 text-white" },
  TECH_PROCEDURE: {
    label: "Quy trình kỹ thuật",
    color: "bg-cyan-600 text-white",
  },
  PROPOSAL: { label: "Đề xuất tuyển chọn", color: "bg-pink-600 text-white" },
};

const ALL_TYPES = Object.keys(TYPE_META);

// ─── Sub-components ───────────────────────────────────────────────────────────

function TypeBadge({ type }) {
  const t = TYPE_META[type] || { label: type, color: "bg-gray-600 text-white" };
  return (
    <span
      className={`inline-block text-xs font-medium px-3 py-1 rounded ${t.color}`}
    >
      {t.label}
    </span>
  );
}

function PendingCard({ item, creatorName, onApprove, onReject, busy }) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all overflow-hidden flex flex-col">
      <div
        className={`h-1.5 w-full ${TYPE_META[item.activityType]?.color?.split(" ")[0] || "bg-gray-400"}`}
      />

      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-3">
          <TypeBadge type={item.activityType} />
        </div>

        <h3 className="text-base font-bold text-gray-800 mb-3 line-clamp-2 flex-1">
          {item.title}
        </h3>

        <div className="space-y-1.5 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-2">
            <Person
              sx={{ fontSize: 15 }}
              className="text-gray-400 flex-shrink-0"
            />
            <span className="line-clamp-1">{creatorName}</span>
          </div>
          {item.activityDate && (
            <div className="flex items-center gap-2">
              <CalendarToday
                sx={{ fontSize: 15 }}
                className="text-gray-400 flex-shrink-0"
              />
              <span>{item.activityDate}</span>
            </div>
          )}
          {item.publicationName && (
            <div className="flex items-center gap-2">
              <Article
                sx={{ fontSize: 15 }}
                className="text-gray-400 flex-shrink-0"
              />
              <span className="line-clamp-1">{item.publicationName}</span>
            </div>
          )}
          <div className="text-xs text-gray-400">
            Năm học: {item.academicYear}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <button
            type="button"
            disabled={busy}
            onClick={() => onReject(item)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition-colors text-sm disabled:opacity-50"
          >
            <Cancel sx={{ fontSize: 15 }} />
            Từ chối
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => onApprove(item)}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm disabled:opacity-50 ml-auto"
          >
            <CheckCircle sx={{ fontSize: 15 }} />
            Duyệt
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
      if (!Array.isArray(source) || source.length === 0) {
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
      if (Array.isArray(source)) {
        source.forEach((it) => {
          const id = Number(it.id ?? it.userId);
          if (!Number.isFinite(id)) return;
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

  const getName = (id) => userNameById[Number(id)] || `User #${id}`;

  const handleApprove = async (item) => {
    setProcessingId(item.id);
    try {
      await nckhActivityService.approveActivity(item.id, user.id);
      toast.success("Đã duyệt khai báo");
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
      toast.success("Đã từ chối khai báo");
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-mainColor to-[#154c6e] text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Duyệt khai báo NCKH
            </h1>
            <p className="text-lg text-white/80">
              Xét duyệt các khai báo hoạt động nghiên cứu khoa học đang chờ xử
              lý
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-6">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm mb-6 px-5 py-4 flex flex-wrap gap-4 items-end">
          <div className="flex items-center gap-2 text-gray-500 mr-2">
            <FilterList sx={{ fontSize: 18 }} />
            <span className="text-sm font-semibold">Lọc:</span>
          </div>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-bold text-gray-500 uppercase">
              Năm học
            </span>
            <input
              type="number"
              value={selectedYear}
              onChange={(e) =>
                setSelectedYear(Number(e.target.value || currentYear))
              }
              className="h-9 w-28 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:border-mainColor"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-bold text-gray-500 uppercase">
              Loại hoạt động
            </span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-9 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:border-mainColor"
            >
              <option value="ALL">Tất cả</option>
              {ALL_TYPES.map((t) => (
                <option key={t} value={t}>
                  {TYPE_META[t].label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-bold text-gray-500 uppercase">
              Tìm kiếm
            </span>
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tên hoạt động, tác giả..."
              className="h-9 w-52 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:border-mainColor"
            />
          </label>

          {filtered.length > 0 && (
            <div className="ml-auto self-end">
              <span className="bg-amber-100 text-amber-800 text-sm font-bold px-3 py-1.5 rounded-full border border-amber-200">
                {filtered.length} chờ duyệt
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-mainColor border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm">
            <CheckCircle
              sx={{ fontSize: 48 }}
              className="text-green-400 mb-3"
            />
            <p className="text-gray-500 text-base font-medium">
              Không có khai báo nào chờ duyệt
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Tất cả khai báo đã được xử lý
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
