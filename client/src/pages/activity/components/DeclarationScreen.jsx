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

function DetailModal({
  item,
  contributors,
  loadingContributors,
  onClose,
  onEdit,
}) {
  if (!item) return null;

  const resolvedType = resolveActivityType(item);
  const parsedDetails = parseDetailsJson(item.detailsJson);
  const memberIds = (item.memberUserIds || "")
    .split(",")
    .map((id) => id.trim())
    .filter((id) => id);
  const hasProof = !!(item.proofFileUrl || item.proofImageUrl);

  return (
    <div className="fixed inset-0 bg-slate-900/55 backdrop-blur-[2px] flex items-center justify-center p-4 z-50">
      <div className="bg-slate-50 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-slate-200 sticky top-0 bg-gradient-to-r from-mainColor to-[#154c6e] z-10 text-white">
          <div>
            <p className="text-xs uppercase tracking-wider text-white/70 mb-1">
              Chi tiết khai báo
            </p>
            <h2 className="text-xl font-bold leading-snug">{item.title}</h2>
            <p className="text-sm text-white/80 mt-1">
              Theo dõi tình trạng, thông tin chuyên môn và minh chứng của khai
              báo.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <Close />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50">
          {/* Quick overview chips */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <TypeBadge type={resolvedType} />
              <StatusBadge status={item.status} />
              {canEdit(item.status) && (
                <span className="inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700">
                  Có thể chỉnh sửa
                </span>
              )}
              <span className="ml-auto text-xs text-slate-400 font-medium">Mã: #{item.id}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="text-center p-2.5 rounded-lg bg-blue-50/70 border border-blue-100">
                <p className="text-[10px] font-bold text-blue-400 uppercase mb-1">Năm học</p>
                <p className="text-sm font-bold text-blue-700">{item.academicYear || "-"}</p>
              </div>
              <div className="text-center p-2.5 rounded-lg bg-indigo-50/70 border border-indigo-100">
                <p className="text-[10px] font-bold text-indigo-400 uppercase mb-1">Số lượng</p>
                <p className="text-sm font-bold text-indigo-700">{item.qty == null ? "-" : item.qty}</p>
              </div>
              <div className="text-center p-2.5 rounded-lg bg-amber-50/70 border border-amber-100">
                <p className="text-[10px] font-bold text-amber-400 uppercase mb-1">Định mức</p>
                <p className="text-sm font-bold text-amber-700">{item.quotaHoursSnapshot == null ? "-" : `${item.quotaHoursSnapshot} giờ`}</p>
              </div>
              <div className="text-center p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Mã danh mục</p>
                <p className="text-sm font-bold text-slate-700">{item.catalogCode || "-"}</p>
              </div>
            </div>
          </div>

          {/* Core information */}
          <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-700 border-l-4 border-mainColor pl-3 mb-4 flex items-center gap-2">
              <Article sx={{ fontSize: 16 }} className="text-mainColor" />
              Thông tin hoạt động
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoBlock
                icon={
                  <CalendarToday
                    sx={{ fontSize: 16 }}
                    className="text-blue-500"
                  />
                }
                label="Năm học"
                value={item.academicYear || "-"}
              />
              <InfoBlock
                icon={
                  <CalendarToday
                    sx={{ fontSize: 16 }}
                    className="text-blue-500"
                  />
                }
                label="Ngày hoạt động"
                value={formatDateValue(item.activityDate)}
              />
              <InfoBlock
                icon={
                  <LocationOn sx={{ fontSize: 16 }} className="text-red-500" />
                }
                label="Địa điểm / Đơn vị"
                value={item.venue || "-"}
              />
              <InfoBlock
                icon={
                  <Article sx={{ fontSize: 16 }} className="text-purple-500" />
                }
                label="Tạp chí / Nơi công bố"
                value={item.publicationName || "-"}
              />
              <InfoBlock
                icon={
                  <Badge sx={{ fontSize: 16 }} className="text-amber-500" />
                }
                label="ISSN / DOI / ISBN"
                value={item.identifierCode || "-"}
              />
              <InfoBlock
                icon={
                  <Badge sx={{ fontSize: 16 }} className="text-slate-500" />
                }
                label="Người tạo"
                value={
                  item.createdByUserId ? `User #${item.createdByUserId}` : "-"
                }
              />
              <InfoBlock
                icon={
                  <Badge sx={{ fontSize: 16 }} className="text-slate-500" />
                }
                label="Tác giả chính"
                value={
                  item.mainAuthorUserId ? `User #${item.mainAuthorUserId}` : "-"
                }
              />
              <InfoBlock
                icon={
                  <CalendarToday
                    sx={{ fontSize: 16 }}
                    className="text-emerald-500"
                  />
                }
                label="Thời gian duyệt"
                value={formatDateTimeValue(item.approvedAt)}
              />
              <InfoBlock
                icon={
                  <Badge sx={{ fontSize: 16 }} className="text-emerald-500" />
                }
                label="Người duyệt"
                value={
                  item.approvedByUserId ? `User #${item.approvedByUserId}` : "-"
                }
              />


            </div>

            <div className="mt-4 border-t border-slate-200 pt-4">
              <div className="flex gap-2 items-start">
                <LinkIcon
                  sx={{ fontSize: 16 }}
                  className="text-green-500 mt-0.5 flex-shrink-0"
                />
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase mb-0.5">
                    Link minh chứng
                  </p>
                  {item.externalLink ? (
                    <a
                      href={item.externalLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-blue-600 underline break-all"
                    >
                      {item.externalLink}
                    </a>
                  ) : (
                    <p className="text-sm text-slate-500">-</p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Description */}
          {item.description && (
            <section className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <h3 className="text-sm font-bold text-slate-700 border-l-4 border-mainColor pl-3 mb-2">
                Mô tả
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                {item.description}
              </p>
            </section>
          )}

          {/* Proof files */}
          <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-700 border-l-4 border-mainColor pl-3 mb-4 flex items-center gap-2">
              <LinkIcon sx={{ fontSize: 16 }} className="text-mainColor" />
              Minh chứng
            </h3>
            {hasProof ? (
              <div className="flex gap-3 flex-wrap">
                {item.proofFileUrl && (
                  <a
                    href={item.proofFileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-blue-700 border border-blue-200 bg-blue-50 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Article sx={{ fontSize: 14 }} /> Tải file minh chứng
                  </a>
                )}
                {item.proofImageUrl && (
                  <a
                    href={item.proofImageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-blue-700 border border-blue-200 bg-blue-50 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Article sx={{ fontSize: 14 }} /> Xem ảnh minh chứng
                  </a>
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic">Chưa có minh chứng.</p>
            )}
          </section>

          {/* System + expanded data */}
          <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-700 border-l-4 border-mainColor pl-3 mb-4 flex items-center gap-2">
              <Badge sx={{ fontSize: 16 }} className="text-mainColor" />
              Dữ liệu khai báo mở rộng
            </h3>

            {(parsedDetails.entries.length > 0 || parsedDetails.raw) && (
              <div className="space-y-3">
                {parsedDetails.entries.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {parsedDetails.entries.map(([key, value]) => (
                      <div
                        key={key}
                        className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
                      >
                        <p className="text-[11px] font-bold text-slate-400 uppercase mb-1">
                          {prettifyKey(key)}
                        </p>
                        <p className="text-sm text-slate-700 break-words">
                          {prettifyDetailValue(key, value)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
                    <p className="text-xs font-semibold text-amber-700 mb-1">
                      Chi tiết mở rộng không đúng JSON chuẩn
                    </p>
                    <p className="text-sm text-slate-700 break-words">
                      {parsedDetails.raw}
                    </p>
                  </div>
                )}
              </div>
            )}

            {!parsedDetails.entries.length && !parsedDetails.raw && (
              <p className="text-sm text-slate-500 italic">
                Không có dữ liệu mở rộng.
              </p>
            )}

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Danh sách thành viên theo ID
                </p>
                {memberIds.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {memberIds.map((id) => (
                      <span
                        key={id}
                        className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white border border-slate-300 text-slate-600"
                      >
                        User #{id}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-600">-</p>
                )}
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Trạng thái bản ghi
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={item.status} />
                  <span className="text-sm text-slate-600">
                    Cập nhật gần nhất: {formatDateTimeValue(item.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Contributors */}
          <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-700 border-l-4 border-mainColor pl-3 mb-4 flex items-center gap-2">
              <People sx={{ fontSize: 16 }} className="text-mainColor" />
              Người tham gia
            </h3>
            {loadingContributors ? (
              <div className="flex items-center gap-2 py-4">
                <div className="w-5 h-5 border-2 border-mainColor border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-slate-400">Đang tải...</p>
              </div>
            ) : contributors.length === 0 ? (
              <p className="text-sm text-slate-400 italic py-2">Không có thông tin người tham gia.</p>
            ) : (
              <div className="space-y-2">
                {contributors.map((c, i) => {
                  const displayName = c.userName || c.name || `User #${c.userId}`;
                  const initials = displayName.split(" ").slice(-2).map(w => w[0]?.toUpperCase()).join("");
                  const isMain = c.role === "MAIN";
                  return (
                    <div
                      key={i}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 border transition-colors ${isMain ? "bg-blue-50/50 border-blue-200" : "bg-slate-50 border-slate-200"
                        }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${isMain ? "bg-mainColor text-white" : "bg-slate-200 text-slate-600"
                        }`}>
                        {initials}
                      </div>
                      <span className="text-sm text-slate-700 font-medium flex-1">
                        {displayName}
                      </span>
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${isMain
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-600"
                          }`}
                      >
                        {isMain ? "Tác giả chính" : "Thành viên"}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-white flex justify-between items-center sticky bottom-0">
          <span className="text-xs text-slate-500 hidden sm:block">
            Mã khai báo: #{item.id}
          </span>
          <div className="flex gap-3 ml-auto">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg text-slate-700 font-medium bg-white border border-slate-300 hover:bg-slate-100 transition-colors text-sm"
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
    <div className="flex gap-2.5 items-start rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-2.5 transition-colors">
      <span className="mt-0.5 flex-shrink-0 w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">
          {label}
        </p>
        <p className="text-sm font-medium text-slate-700 break-words leading-snug">{value || "-"}</p>
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
