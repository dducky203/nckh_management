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
import DeclarationHeaderForm from "./DeclarationHeaderForm";

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
  REVIEW_PAPER: {
    label: "Bài tổng quan lĩnh vực",
    color: "bg-teal-600 text-white",
  },
  TECH_CONSULT: { label: "Tư vấn kỹ thuật", color: "bg-amber-600 text-white" },
  TECH_PROCEDURE: {
    label: "Quy trình kỹ thuật",
    color: "bg-cyan-600 text-white",
  },
  PROPOSAL: { label: "Đề xuất tuyển chọn", color: "bg-pink-600 text-white" },
};

const STATUS_META = {
  DRAFT: { label: "Nháp", cls: "bg-gray-100 text-gray-700" },
  SUBMITTED: { label: "Chờ duyệt", cls: "bg-yellow-100 text-yellow-800" },
  APPROVED: { label: "Đã duyệt", cls: "bg-green-100 text-green-800" },
  REJECTED: { label: "Từ chối", cls: "bg-red-100 text-red-800" },
};

const canEdit = (status) => status === "DRAFT" || status === "REJECTED";

const STATUS_TABS = [
  {
    value: "ALL",
    label: "Tất cả",
    icon: null,
    activeText: "text-mainColor",
    activeBorder: "border-mainColor",
    activeBg: "bg-blue-50",
    badgeBg: "bg-mainColor",
  },
  {
    value: "DRAFT",
    label: "Nháp",
    icon: null,
    activeText: "text-gray-700",
    activeBorder: "border-gray-500",
    activeBg: "bg-gray-50",
    badgeBg: "bg-gray-500",
  },
  {
    value: "SUBMITTED",
    label: "Chờ duyệt",
    icon: null,
    activeText: "text-yellow-700",
    activeBorder: "border-yellow-500",
    activeBg: "bg-yellow-50",
    badgeBg: "bg-yellow-500",
  },
  {
    value: "APPROVED",
    label: "Đã duyệt",
    icon: null,
    activeText: "text-green-700",
    activeBorder: "border-green-600",
    activeBg: "bg-green-50",
    badgeBg: "bg-green-600",
  },
  {
    value: "REJECTED",
    label: "Từ chối",
    icon: null,
    activeText: "text-red-600",
    activeBorder: "border-red-500",
    activeBg: "bg-red-50",
    badgeBg: "bg-red-500",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const s = STATUS_META[status] || {
    label: status,
    cls: "bg-gray-100 text-gray-600",
  };
  return (
    <span
      className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full ${s.cls}`}
    >
      {s.label}
    </span>
  );
}

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

function ActivityCard({ item, onViewDetail, onEdit, onDelete }) {
  const editable = canEdit(item.status);

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden group flex flex-col">
      {/* Color bar top */}
      <div
        className={`h-1.5 w-full ${TYPE_META[item.activityType]?.color?.split(" ")[0] || "bg-gray-400"}`}
      />

      <div className="p-5 flex-1 flex flex-col">
        {/* Badges */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <TypeBadge type={item.activityType} />
          <StatusBadge status={item.status} />
        </div>

        {/* Title */}
        <h3
          title={item.title}
          className="text-base font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-mainColor transition-colors flex-1"
        >
          {item.title}
        </h3>

        {/* Meta */}
        <div className="space-y-1.5 text-sm text-gray-500 mb-4">
          {item.activityDate && (
            <div className="flex items-center gap-2">
              <CalendarToday
                sx={{ fontSize: 15 }}
                className="text-gray-400 flex-shrink-0"
              />
              <span>{item.activityDate}</span>
            </div>
          )}
          {item.venue && (
            <div className="flex items-center gap-2">
              <LocationOn
                sx={{ fontSize: 15 }}
                className="text-gray-400 flex-shrink-0"
              />
              <span className="line-clamp-1">{item.venue}</span>
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
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          {editable && (
            <>
              <button
                type="button"
                onClick={() => onEdit(item)}
                className="flex items-center gap-1 px-3 py-1.5 text-gray-600 border border-gray-200 rounded-md hover:text-mainColor hover:border-mainColor transition-colors text-sm"
              >
                <Edit sx={{ fontSize: 14 }} />
                Sửa
              </button>
              <button
                type="button"
                onClick={() => onDelete(item)}
                className="flex items-center gap-1 px-3 py-1.5 text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition-colors text-sm"
              >
                <Delete sx={{ fontSize: 14 }} />
                Xóa
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => onViewDetail(item)}
            className="flex items-center gap-1 ml-auto px-3 py-1.5 border border-gray-200 rounded-md hover:bg-mainColor hover:text-white hover:border-mainColor transition-all text-sm font-medium text-gray-700"
          >
            Chi tiết
            <ArrowForward sx={{ fontSize: 14 }} />
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailModal({
  item,
  contributors,
  loadingContributors,
  onClose,
  onEdit,
}) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-gray-800">Chi tiết khai báo</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Close />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Badges + Title */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <TypeBadge type={item.activityType} />
              <StatusBadge status={item.status} />
            </div>
            <h1 className="text-xl font-bold text-gray-900">{item.title}</h1>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
            {item.academicYear && (
              <InfoBlock
                icon={
                  <CalendarToday
                    sx={{ fontSize: 16 }}
                    className="text-blue-500"
                  />
                }
                label="Năm học"
                value={item.academicYear}
              />
            )}
            {item.activityDate && (
              <InfoBlock
                icon={
                  <CalendarToday
                    sx={{ fontSize: 16 }}
                    className="text-blue-500"
                  />
                }
                label="Ngày hoạt động"
                value={item.activityDate}
              />
            )}
            {item.venue && (
              <InfoBlock
                icon={
                  <LocationOn sx={{ fontSize: 16 }} className="text-red-500" />
                }
                label="Địa điểm / Đơn vị"
                value={item.venue}
              />
            )}
            {item.publicationName && (
              <InfoBlock
                icon={
                  <Article sx={{ fontSize: 16 }} className="text-purple-500" />
                }
                label="Tạp chí / Nơi công bố"
                value={item.publicationName}
              />
            )}
            {item.identifierCode && (
              <InfoBlock
                icon={
                  <Badge sx={{ fontSize: 16 }} className="text-amber-500" />
                }
                label="ISSN / DOI / ISBN"
                value={item.identifierCode}
              />
            )}
            {item.externalLink && (
              <div className="flex gap-2 items-start">
                <LinkIcon
                  sx={{ fontSize: 16 }}
                  className="text-green-500 mt-0.5 flex-shrink-0"
                />
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase mb-0.5">
                    Link minh chứng
                  </p>
                  <a
                    href={item.externalLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-blue-600 underline break-all"
                  >
                    {item.externalLink}
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {item.description && (
            <div>
              <h3 className="text-sm font-bold text-gray-700 border-l-4 border-mainColor pl-3 mb-2">
                Mô tả
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          )}

          {/* Proof files */}
          {(item.proofFileUrl || item.proofImageUrl) && (
            <div>
              <h3 className="text-sm font-bold text-gray-700 border-l-4 border-mainColor pl-3 mb-2">
                Minh chứng
              </h3>
              <div className="flex gap-3 flex-wrap">
                {item.proofFileUrl && (
                  <a
                    href={item.proofFileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Article sx={{ fontSize: 14 }} /> Tải file
                  </a>
                )}
                {item.proofImageUrl && (
                  <a
                    href={item.proofImageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Xem ảnh
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Contributors */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 border-l-4 border-mainColor pl-3 mb-2 flex items-center gap-2">
              <People sx={{ fontSize: 16 }} />
              Người tham gia
            </h3>
            {loadingContributors ? (
              <p className="text-sm text-gray-400">Đang tải...</p>
            ) : contributors.length === 0 ? (
              <p className="text-sm text-gray-400 italic">Không có thông tin</p>
            ) : (
              <div className="space-y-2">
                {contributors.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2"
                  >
                    <span className="text-sm text-gray-700">
                      {c.userName || c.name || `User #${c.userId}`}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        c.role === "MAIN"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {c.role === "MAIN" ? "Tác giả chính" : "Thành viên"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center sticky bottom-0">
          <span className="text-xs text-gray-400 hidden sm:block">
            ID: #{item.id}
          </span>
          <div className="flex gap-3 ml-auto">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg text-gray-700 font-medium bg-white border border-gray-300 hover:bg-gray-100 transition-colors text-sm"
            >
              Đóng
            </button>
            {canEdit(item.status) && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(item);
                }}
                className="px-5 py-2 rounded-lg bg-mainColor text-white font-medium hover:brightness-110 transition-colors text-sm flex items-center gap-2"
              >
                <Edit sx={{ fontSize: 15 }} />
                Chỉnh sửa
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoBlock({ icon, label, value }) {
  return (
    <div className="flex gap-2 items-start">
      <span className="mt-0.5 flex-shrink-0">{icon}</span>
      <div>
        <p className="text-[11px] font-bold text-gray-400 uppercase mb-0.5">
          {label}
        </p>
        <p className="text-sm text-gray-700">{value}</p>
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
  const [detailContributors, setDetailContributors] = useState([]);
  const [loadingContributors, setLoadingContributors] = useState(false);

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
      setMyItems(res?.data || res || []);
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

  const openDetail = async (item) => {
    setDetailItem(item);
    setDetailContributors([]);
    setLoadingContributors(true);
    try {
      const res = await nckhActivityService.getContributors(item.id);
      setDetailContributors(res?.data || res || []);
    } catch {
      // không chặn modal
    } finally {
      setLoadingContributors(false);
    }
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-mainColor to-[#154c6e] text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">{title}</h1>
            <p className="text-lg text-white/80 mb-6">{description}</p>
            <button
              type="button"
              onClick={openNewForm}
              className="inline-flex items-center gap-2 bg-white text-mainColor font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
            >
              <Add />
              Khai báo mới
            </button>
          </div>
        </div>
      </section>

      {/* Filters: Tabs + Search */}
      <section className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm mb-6">
          {/* Status Tabs — giống EventTabs */}
          <div className="flex border-b overflow-x-auto">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors
                  ${
                    statusFilter === tab.value
                      ? `${tab.activeText} border-b-2 ${tab.activeBorder} ${tab.activeBg}`
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                  }`}
              >
                {tab.icon}
                {tab.label}
                {statusFilter === tab.value && myItems.length > 0 && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-md text-white ${tab.badgeBg}`}
                  >
                    {myItems.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search + Year — giống EventFilters */}
          <div className="p-4 bg-gray-50 flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                fontSize="small"
              />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Tìm kiếm theo tên khai báo..."
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <FilterList className="text-gray-400" fontSize="small" />
              <input
                type="number"
                value={selectedYear}
                onChange={(e) =>
                  setSelectedYear(Number(e.target.value || currentYear))
                }
                className="w-28 py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor text-sm"
                placeholder="Năm"
              />
            </div>
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
              <div className="flex justify-center items-center py-20">
                <div className="w-10 h-10 border-4 border-mainColor border-t-transparent rounded-full animate-spin" />
              </div>
            );

          if (displayed.length === 0)
            return (
              <div className="text-center py-20 bg-white rounded-lg shadow-sm">
                <p className="text-gray-400 text-base mb-3">
                  {kw
                    ? `Không tìm thấy kết quả cho "${searchKeyword}"`
                    : "Chưa có khai báo nào"}
                </p>
                {!kw && (
                  <button
                    type="button"
                    onClick={openNewForm}
                    className="inline-flex items-center gap-2 bg-mainColor text-white px-5 py-2 rounded-lg hover:brightness-110 transition-colors text-sm font-semibold"
                  >
                    <Add sx={{ fontSize: 18 }} />
                    Tạo khai báo đầu tiên
                  </button>
                )}
              </div>
            );

          return (
            <>
              <p className="text-sm text-gray-500 mb-4">
                Tìm thấy{" "}
                <span className="font-semibold text-gray-800">
                  {displayed.length}
                </span>{" "}
                khai báo
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            </>
          );
        })()}
      </section>

      {/* Detail Modal */}
      {detailItem && (
        <DetailModal
          item={detailItem}
          contributors={detailContributors}
          loadingContributors={loadingContributors}
          onClose={() => setDetailItem(null)}
          onEdit={openEditForm}
        />
      )}
    </div>
  );
}
