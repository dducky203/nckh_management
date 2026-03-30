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
import userService from "../../../services/userService";



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
  const t = TYPE_META[type] || { label: type || "Chưa phân loại", color: "bg-gray-600 text-white" };
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
  const resolvedType = resolveActivityType(item);

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden group flex flex-col">
      {/* Color bar top */}
      <div
        className={`h-1.5 w-full ${TYPE_META[item.activityType]?.color?.split(" ")[0] || "bg-gray-400"}`}
      />

      <div className="p-5 flex-1 flex flex-col">
        {/* Badges */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <TypeBadge type={resolvedType} />
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

  const resolvedType = resolveActivityType(item);
  const parsedDetails = parseDetailsJson(item.detailsJson);
  const memberIds = String(item.memberUserIds || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
  const hasProof = Boolean(item.proofFileUrl || item.proofImageUrl);

  const summaryMetrics = [
    {
      label: "Năm học",
      value: item.academicYear || "-",
      icon: <CalendarToday sx={{ fontSize: 15 }} className="text-blue-500" />,
    },
    {
      label: "Ngày hoạt động",
      value: formatDateValue(item.activityDate),
      icon: <CalendarToday sx={{ fontSize: 15 }} className="text-blue-500" />,
    },
    {
      label: "Số lượng",
      value:
        item.qty == null
          ? "-"
          : Number(item.qty).toLocaleString("vi-VN", {
              maximumFractionDigits: 2,
            }),
      icon: <Badge sx={{ fontSize: 15 }} className="text-indigo-500" />,
    },
    {
      label: "Mã danh mục",
      value: item.catalogCode || "-",
      icon: <Article sx={{ fontSize: 15 }} className="text-violet-500" />,
    },
    {
      label: "Định mức (snapshot)",
      value:
        item.quotaHoursSnapshot == null
          ? "-"
          : `${Number(item.quotaHoursSnapshot).toLocaleString("vi-VN", {
              maximumFractionDigits: 2,
            })} giờ`,
      icon: <Badge sx={{ fontSize: 15 }} className="text-amber-500" />,
    },
    {
      label: "Mã khai báo",
      value: `#${item.id}`,
      icon: <Badge sx={{ fontSize: 15 }} className="text-slate-500" />,
    },
  ];


  const getUser = (id) =>  userService.getUserById(id).then(res => res?.data || res).catch(() => null);
  
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
          {/* Badges + summary line */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <TypeBadge type={resolvedType} />
              <StatusBadge status={item.status} />
              {canEdit(item.status) && (
                <span className="inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700">
                  Có thể chỉnh sửa
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {summaryMetrics.map((meta) => (
                <InfoBlock
                  key={meta.label}
                  icon={meta.icon}
                  label={meta.label}
                  value={meta.value}
                />
              ))}
            </div>
          </div>

          {/* Core information */}
          <section className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wide">
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
          <section className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-700 border-l-4 border-mainColor pl-3 mb-3">
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
          <section className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-700 border-l-4 border-mainColor pl-3 mb-3">
              Dữ liệu khai báo mở rộng
            </h3>

            {(parsedDetails.entries.length > 0 || parsedDetails.raw) && (
              <div className="space-y-3">
                {parsedDetails.entries.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {parsedDetails.entries.map(([key, value]) => (
                      <div
                        key={String(key)}
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
          <section className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-700 border-l-4 border-mainColor pl-3 mb-3 flex items-center gap-2">
              <People sx={{ fontSize: 16 }} />
              Người tham gia
            </h3>
            {loadingContributors ? (
              <p className="text-sm text-slate-400">Đang tải...</p>
            ) : contributors.length === 0 ? (
              <p className="text-sm text-slate-400 italic">Không có thông tin</p>
            ) : (
              <div className="space-y-2">
                {contributors.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-3 py-2"
                  >
                    <div>
                      <span className="text-sm text-slate-700 font-medium">
                        {c.userName || c.name || `User #${c.userId}`}
                      </span>
                      
                    </div>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-md ${
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
    <div className="flex gap-2 items-start rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
      <span className="mt-0.5 flex-shrink-0">{icon}</span>
      <div>
        <p className="text-[11px] font-bold text-slate-400 uppercase mb-0.5">
          {label}
        </p>
        <p className="text-sm text-slate-700 break-words">{value || "-"}</p>
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
