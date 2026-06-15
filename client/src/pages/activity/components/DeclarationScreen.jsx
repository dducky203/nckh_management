import { useEffect, useState } from "react";
import {
  Add,
  ArrowBack,
  ArrowForward,
  CalendarToday,
  LocationOn,
  Article,
  Close,
  Edit,
  Delete,
  Link as LinkIcon,
  Badge,
  People,
  Search,
  FilterList,
} from "@mui/icons-material";
import { useAuth } from "../../../context/useAuth";
import { useToast } from "../../../context/ToastContext";
import nckhActivityService from "../../../services/nckhActivityService";
import userService from "../../../services/userService";
import DeclarationHeaderForm from "./DeclarationHeaderForm";
import {
  TYPE_META,
  STATUS_META,
  STATUS_TABS,
  canEdit,
  resolveActivityType,
  formatDateValue,
  formatDateTimeValue,
  parseDetailsJson,
  prettifyKey,
  prettifyDetailValue,
} from "../../../constants/activityConstants";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import { getBadgeColorStyles } from "../../../utils/helpers";
import ActivityDetailModal from "./ActivityDetailModal";




function StatusBadge({ status }) {
  const s = STATUS_META[status] || {
    label: status,
    cls: "bg-slate-100 text-slate-600 border-slate-200",
  };
  
  // Convert strong bg classes to soft ones if they exist, or just rely on s.cls if it's already soft.
  // For safety, we just use a generic soft style if it's not defined, but STATUS_META already provides cls.
  return (
    <span
      className={`inline-flex items-center text-[10px] font-bold px-2.5 py-0.5 rounded-md border uppercase tracking-wider ${s.cls}`}
    >
      {s.label}
    </span>
  );
}

function TypeBadge({ type }) {
  const t = TYPE_META[type] || { label: type || "Chưa phân loại" };
  const styleClass = getBadgeColorStyles(t.color);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border tracking-wide uppercase ${styleClass}`}
    >
      {t.label}
    </span>
  );
}

function ActivityCard({ item, onViewDetail, onEdit, onDelete }) {
  const editable = canEdit(item.status);
  const resolvedType = resolveActivityType(item);

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Indicator line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-mainColor/80 to-blue-400/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="p-6 flex-1 flex flex-col">
        {/* Header with type and status */}
        <div className="flex items-start justify-between mb-4 gap-3">
          <TypeBadge type={resolvedType} />
          <StatusBadge status={item.status} />
        </div>

        {/* Title */}
        <h3
          title={item.title}
          className="text-[15px] font-extrabold text-slate-800 mb-4 line-clamp-2 leading-snug flex-1 group-hover:text-mainColor transition-colors"
        >
          {item.title}
        </h3>

        {/* Meta info */}
        <div className="space-y-2.5 text-[13px] text-slate-500 mb-5 bg-slate-50/50 rounded-xl p-3 border border-slate-50">
          {item.activityDate && (
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                <CalendarToday sx={{ fontSize: 13 }} />
              </div>
              <span className="font-medium text-slate-700">{formatDateValue(item.activityDate)}</span>
            </div>
          )}
          {item.venue && (
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
                <LocationOn sx={{ fontSize: 13 }} />
              </div>
              <span className="font-medium text-slate-700 line-clamp-1" title={item.venue}>{item.venue}</span>
            </div>
          )}
          {item.publicationName && (
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
                <Article sx={{ fontSize: 13 }} />
              </div>
              <span className="font-medium text-slate-700 line-clamp-1" title={item.publicationName}>{item.publicationName}</span>
            </div>
          )}
        </div>

        {/* Quota hours chip */}
        {item.quotaHoursSnapshot != null && (
          <div className="mb-5">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 shadow-sm">
              <Badge sx={{ fontSize: 14 }} />
              {item.quotaHoursSnapshot} giờ NCKH
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-2">
          {editable && (
            <>
              <button
                type="button"
                onClick={() => onEdit(item)}
                className="flex items-center justify-center gap-1.5 px-3 py-2 text-slate-600 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 hover:text-mainColor transition-colors font-bold text-[12px]"
                title="Chỉnh sửa"
              >
                <Edit sx={{ fontSize: 15 }} />
              </button>
              <button
                type="button"
                onClick={() => onDelete(item)}
                className="flex items-center justify-center gap-1.5 px-3 py-2 text-rose-600 bg-rose-50 border border-rose-100 rounded-xl hover:bg-rose-100 transition-colors font-bold text-[12px]"
                title="Xóa"
              >
                <Delete sx={{ fontSize: 15 }} />
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => onViewDetail(item)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-mainColor text-white shadow-sm shadow-mainColor/20 rounded-xl hover:brightness-110 hover:-translate-y-0.5 transition-all font-bold text-[13px] ml-auto"
          >
            Chi tiết
            <ArrowForward sx={{ fontSize: 15 }} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DeclarationScreen({
  title,
  description,
  activityType,
}) {
  const { user } = useAuth();
  const toast = useToast();
  const currentYear = new Date().getFullYear();

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingContributors, setEditingContributors] = useState([]);

  const [myItems, setMyItems] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchKeyword, setSearchKeyword] = useState("");

  const [detailItem, setDetailItem] = useState(null);
  const [userNameById, setUserNameById] = useState({});

  const loadList = async () => {
    if (!user?.id) return;
    setLoadingList(true);
    try {
      const res = await nckhActivityService.getMyActivities({
        userId: user.id,
        year: selectedYear,
        activityType,
        status: statusFilter === "ALL" ? undefined : statusFilter,
      });
      const items = res?.data || res || [];
      setMyItems(items);

      const uniqueIds = [...new Set(items.flatMap(it => [it.createdByUserId, it.mainAuthorUserId, it.approvedByUserId]).filter(Boolean))];
      if (uniqueIds.length > 0) {
        // Lấy danh sách ID chưa có trong map
        setUserNameById(prev => {
          const currentMap = { ...prev };
          const missingIds = uniqueIds.filter(id => !currentMap[id]);
          if (missingIds.length > 0) {
            const promises = missingIds.map(id => userService.getUserById(id).catch(() => null));
            Promise.all(promises).then(usersRes => {
              setUserNameById(prevMap => {
                const newMap = { ...prevMap };
                usersRes.forEach(r => {
                  const u = r?.data || r;
                  if (u && u.id) {
                    newMap[u.id] = u.name || u.fullName || u.username || `User #${u.id}`;
                  }
                });
                return newMap;
              });
            });
          }
          return currentMap;
        });
      }
    } catch (err) {
      toast.error(err?.message || "Không tải được danh sách khai báo");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadList();
  }, [user?.id, activityType, selectedYear, statusFilter]);

  const openNewForm = () => {
    setEditingItem(null);
    setEditingContributors([]);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openEditForm = async (item) => {
    try {
      const res = await nckhActivityService.getContributors(item.id);
      setEditingItem(item);
      setEditingContributors(res?.data || res || []);
      setShowForm(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      toast.error(err?.message || "Không tải được người tham gia");
    }
  };

  const openDetail = (item) => {
    setDetailItem(item);
  };

  const onDelete = async (item) => {
    if (!window.confirm(`Xóa khai báo "${item.title}"?`)) return;
    try {
      await nckhActivityService.deleteActivity(item.id, user.id);
      toast.success("Đã xóa khai báo");
      await loadList();
    } catch (err) {
      toast.error(err?.message || "Xóa thất bại");
    }
  };

  // ── FORM VIEW ──────────────────────────────────────────────────────────────
  if (showForm) {
    return (
      <div className="min-h-screen bg-gray-50 pb-10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-5">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingItem(null);
              }}
              className="flex items-center gap-1.5 font-medium text-gray-600 hover:text-mainColor transition-colors"
            >
              <ArrowBack sx={{ fontSize: 17 }} />
              Quay lại
            </button>
            <span className="text-gray-300">/</span>
            <span className="text-gray-500">{title}</span>
            <span className="text-gray-300">/</span>
            <span className="font-semibold text-mainColor">
              {editingItem ? "Chỉnh sửa khai báo" : "Khai báo mới"}
            </span>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <DeclarationHeaderForm
              user={user}
              toast={toast}
              initialActivityType={activityType}
              lockActivityType={true}
              heading={editingItem ? `Chỉnh sửa: ${title}` : title}
              subheading={
                editingItem
                  ? "Cập nhật thông tin khai báo"
                  : "Nhập thông tin và lưu khai báo"
              }
              initialData={editingItem}
              initialContributors={editingContributors}
              onCompleted={async () => {
                setShowForm(false);
                setEditingItem(null);
                setEditingContributors([]);
                await loadList();
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // ── LIST VIEW ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 font-sans">
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-[#0f2027] to-mainColor text-white py-16">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-mainColor/30 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight tracking-tight">
              {title}
            </h1>
            <p className="text-lg text-slate-300 font-medium max-w-2xl leading-relaxed mb-8">
              {description}
            </p>
            <button
              type="button"
              onClick={openNewForm}
              className="inline-flex items-center gap-2 bg-mainColor text-white font-bold px-6 py-3 rounded-xl hover:brightness-110 hover:-translate-y-0.5 shadow-[0_4px_20px_rgb(0,0,0,0.15)] transition-all"
            >
              <Add sx={{ fontSize: 20 }} />
              Tạo khai báo mới
            </button>
          </div>
        </div>
      </section>

      {/* Filters: Tabs + Search */}
      <section className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-5 mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              fontSize="small"
            />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Tìm kiếm theo tên khai báo..."
              className="w-full pl-11 pr-4 h-11 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor text-sm font-semibold text-slate-700 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 md:w-auto w-full">
            <div className="h-11 w-11 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 hidden md:flex">
              <FilterList className="text-slate-500" fontSize="small" />
            </div>
            <input
              type="number"
              value={selectedYear}
              onChange={(e) =>
                setSelectedYear(e.target.value || currentYear)
              }
              className="w-full md:w-32 h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor text-sm font-semibold text-slate-700 transition-all"
              placeholder="Năm"
            />
          </div>
        </div>

        {/* Grid */}
        {(() => {
          const kw = searchKeyword.trim().toLowerCase();
          const displayed = kw
            ? myItems.filter((it) => it.title?.toLowerCase().includes(kw))
            : myItems;

          if (loadingList)
            return (
              <div className="flex flex-col justify-center items-center py-32 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <LoadingSpinner size="lg" />
                <p className="text-slate-400 font-medium animate-pulse mt-4">Đang tải dữ liệu khai báo...</p>
              </div>
            );

          if (displayed.length === 0)
            return (
              <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-slate-100 shadow-sm text-center px-4">
                <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                  <Article sx={{ fontSize: 40 }} className="text-slate-300" />
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-2">
                  {kw
                    ? `Không tìm thấy "${searchKeyword}"`
                    : "Chưa có khai báo nào"}
                </h3>
                <p className="text-slate-500 font-medium mb-6">
                  {kw
                    ? "Hãy thử tìm kiếm với từ khóa khác."
                    : "Bạn chưa tạo khai báo nào trong danh mục này."}
                </p>
                {!kw && (
                  <button
                    type="button"
                    onClick={openNewForm}
                    className="inline-flex items-center gap-2 bg-mainColor text-white px-6 py-2.5 rounded-xl hover:brightness-110 hover:-translate-y-0.5 shadow-sm transition-all text-sm font-bold"
                  >
                    <Add sx={{ fontSize: 18 }} />
                    Tạo khai báo đầu tiên
                  </button>
                )}
              </div>
            );

          return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayed.map((item) => (
                <ActivityCard
                  key={item.id}
                  item={item}
                  onViewDetail={openDetail}
                  onEdit={openEditForm}
                  onDelete={onDelete}
                />
              ))}
            </div>
          );
        })()}
      </section>

      {/* Detail Modal */}
      {detailItem && (
        <ActivityDetailModal
          isOpen={true}
          item={detailItem}
          getName={(id) => userNameById[id]}
          onClose={() => setDetailItem(null)}
          onEdit={canEdit(detailItem.status) ? openEditForm : undefined}
        />
      )}
    </div>
  );
}
