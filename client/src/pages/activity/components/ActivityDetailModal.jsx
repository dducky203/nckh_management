import React, { useState, useEffect } from "react";
import {
  Close,
  CalendarToday,
  LocationOn,
  Article,
  Badge,
  People,
  Link as LinkIcon,
  Download,
  Launch,
  Edit
} from "@mui/icons-material";
import nckhActivityService from "../../../services/nckhActivityService";
import {
  STATUS_META,
  TYPE_META,
  canEdit,
  resolveActivityType,
  formatDateValue,
  formatDateTimeValue,
  parseDetailsJson,
  prettifyKey,
  prettifyDetailValue,
} from "../../../constants/activityConstants";
import { getBadgeColorStyles } from "../../../utils/helpers";

function StatusBadge({ status }) {
  const s = STATUS_META[status] || {
    label: status,
    cls: "bg-slate-100 text-slate-600 border-slate-200",
  };
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

export default function ActivityDetailModal({ isOpen, onClose, item, getName, onEdit }) {
  const [contributors, setContributors] = useState([]);
  const [loadingContributors, setLoadingContributors] = useState(false);

  useEffect(() => {
    if (isOpen && item) {
      setLoadingContributors(true);
      nckhActivityService.getContributors(item.id)
        .then((res) => setContributors(res?.data || res || []))
        .catch((err) => console.error("Failed to load contributors", err))
        .finally(() => setLoadingContributors(false));
    } else {
      setContributors([]);
    }
  }, [isOpen, item]);

  if (!isOpen || !item) return null;

  const resolvedType = resolveActivityType(item);
  const parsedDetails = parseDetailsJson(item.detailsJson);
  const hasProof = !!(item.proofFileUrl || item.proofImageUrl);

  const parseUrls = (urlStr) => {
    if (!urlStr) return [];
    try {
      const parsed = JSON.parse(urlStr);
      if (Array.isArray(parsed)) return parsed.map(s => s.trim()).filter(Boolean);
    } catch {
      // Fallback
    }
    return urlStr
      .replace(/^\[|\]$/g, '')
      .replace(/"/g, '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
  };

  const externalLinks = parseUrls(item.externalLink);
  const fileUrls = parseUrls(item.proofFileUrl);
  const imageUrls = parseUrls(item.proofImageUrl);

  const resolveName = (id) => getName && id ? getName(id) : id ? `User #${id}` : "-";

  return (
    <div className="fixed inset-0 bg-slate-900/55 backdrop-blur-[2px] flex items-center justify-center p-4 z-[9999]">
      <div className="bg-slate-50 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-slate-200 sticky top-0 bg-gradient-to-r from-mainColor to-[#154c6e] z-10 text-white">
          <div>
            <p className="text-xs uppercase tracking-wider text-white/70 mb-1">
              Chi tiết khai báo
            </p>
            <h2 className="text-xl font-bold leading-snug">{item.title}</h2>
            <p className="text-sm text-white/80 mt-1">
              Theo dõi tình trạng, thông tin chuyên môn và minh chứng của khai báo.
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
              {onEdit && canEdit(item.status) && (
                <span className="inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700">
                  Có thể chỉnh sửa
                </span>
              )}
      
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
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
                icon={<CalendarToday sx={{ fontSize: 16 }} className="text-blue-500" />}
                label="Ngày hoạt động"
                value={formatDateValue(item.activityDate)}
              />
              <InfoBlock
                icon={<LocationOn sx={{ fontSize: 16 }} className="text-red-500" />}
                label="Địa điểm / Đơn vị"
                value={item.venue || "-"}
              />
              <InfoBlock
                icon={<Article sx={{ fontSize: 16 }} className="text-purple-500" />}
                label="Tạp chí / Nơi công bố"
                value={item.publicationName || "-"}
              />
              <InfoBlock
                icon={<Badge sx={{ fontSize: 16 }} className="text-amber-500" />}
                label="ISSN / DOI / ISBN"
                value={item.identifierCode || "-"}
              />
              <InfoBlock
                icon={<Badge sx={{ fontSize: 16 }} className="text-slate-500" />}
                label="Người tạo"
                value={resolveName(item.createdByUserId)}
              />
              <InfoBlock
                icon={<Badge sx={{ fontSize: 16 }} className="text-slate-500" />}
                label="Tác giả chính"
                value={resolveName(item.mainAuthorUserId)}
              />
              <InfoBlock
                icon={<CalendarToday sx={{ fontSize: 16 }} className="text-emerald-500" />}
                label="Thời gian duyệt"
                value={formatDateTimeValue(item.approvedAt)}
              />
              <InfoBlock
                icon={<Badge sx={{ fontSize: 16 }} className="text-emerald-500" />}
                label="Người duyệt"
                value={resolveName(item.approvedByUserId)}
              />
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
            
            <div className="space-y-4">
              {externalLinks.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Đường dẫn liên kết</span>
                  <div className="flex flex-wrap gap-2">
                    {externalLinks.map((url, i) => (
                      <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors border border-blue-100">
                        <Launch sx={{ fontSize: 16 }} /> Truy cập liên kết {externalLinks.length > 1 ? i + 1 : ''}
                      </a>
                    ))}
                  </div>
                </div>
              )}
              {fileUrls.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Minh chứng (File đính kèm)</span>
                  <div className="flex flex-wrap gap-2">
                    {fileUrls.map((url, i) => (
                      <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-lg transition-colors border border-emerald-100">
                        <Download sx={{ fontSize: 16 }} /> Xem / Tải xuống File {fileUrls.length > 1 ? i + 1 : ''}
                      </a>
                    ))}
                  </div>
                </div>
              )}
              {imageUrls.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Minh chứng (Ảnh minh hoạ)</span>
                  <div className="flex flex-wrap gap-3">
                    {imageUrls.map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt={`Minh chứng ${i + 1}`}
                        className="h-32 w-auto object-cover rounded-xl border border-slate-200 cursor-zoom-in hover:opacity-80 hover:shadow-md transition-all"
                        onClick={() => window.open(url, '_blank')}
                        title="Bấm để phóng to"
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {!hasProof && externalLinks.length === 0 && (
                <p className="text-sm text-slate-500 italic">Chưa có minh chứng.</p>
              )}
            </div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {contributors.map((c, i) => {
                  const displayName = c.userName || c.name || `User #${c.userId}`;
                  const initials = displayName.split(" ").slice(-2).map(w => w[0]?.toUpperCase()).join("");
                  const isMain = c.role === "MAIN";
                  return (
                    <div
                      key={i}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 border transition-colors ${isMain ? "bg-blue-50/50 border-blue-200" : "bg-white border-slate-200"
                        }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${isMain ? "bg-mainColor text-white" : "bg-slate-200 text-slate-600"
                        }`}>
                        {initials}
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-sm font-bold text-slate-700 truncate">{displayName}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {isMain ? "Tác giả chính" : "Thành viên"} {c.roleDetail ? `- ${c.roleDetail}` : ""}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-white flex justify-between items-center sticky bottom-0">
      
          <div className="flex gap-3 ml-auto">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg text-slate-700 font-medium bg-white border border-slate-300 hover:bg-slate-100 transition-colors text-sm"
            >
              Đóng
            </button>
            {onEdit && canEdit(item.status) && (
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
