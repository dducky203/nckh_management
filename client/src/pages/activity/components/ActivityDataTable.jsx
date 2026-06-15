import { useMemo, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import GroupIcon from "@mui/icons-material/Group";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ArticleIcon from "@mui/icons-material/Article";
import PersonIcon from "@mui/icons-material/Person";
import nckhActivityService from "../../../services/nckhActivityService";

const IconChevronDown = ({ className }) => (
  <KeyboardArrowDownIcon className={className} sx={{ fontSize: 18 }} />
);
const IconUserGroup = () => <GroupIcon sx={{ fontSize: 16 }} />;

// Map catalogCode → đường dẫn trang khai báo tương ứng
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

function round1(x) {
  return Math.round(x * 10) / 10;
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

/** Một activity row với lazy-load contributors */
function ActivityRow({ act, catalogCode }) {
  const [contributors, setContributors] = useState(null);
  const [loadingContribs, setLoadingContribs] = useState(false);
  const declPath = CATALOG_TO_DECL_PATH[catalogCode] || "/activity/user";

  const loadContributors = useCallback(async () => {
    if (contributors !== null || !act.id) return;
    setLoadingContribs(true);
    try {
      const res = await nckhActivityService.getContributors(act.id);
      setContributors(res?.data ?? res ?? []);
    } catch {
      setContributors([]);
    } finally {
      setLoadingContribs(false);
    }
  }, [act.id, contributors]);

  // Load ngay khi render
  useEffect(() => {
    loadContributors();
  }, [loadContributors]);

  const contribNames = contributors
    ? contributors.map((c) => c.userName || c.name || `User #${c.userId}`)
    : [];

  return (
    <div className="px-3 py-2.5 hover:bg-blue-50/40 transition-colors border-b border-slate-50 last:border-0">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          {/* Tiêu đề hoạt động */}
          <p className="text-[12px] font-semibold text-slate-700 leading-snug line-clamp-2">
            {act.title || `Hoạt động #${act.id}`}
          </p>

          {/* Date */}
          {act.activityDate && (
            <span className="text-[10px] text-slate-400 font-medium">
              📅 {formatDate(act.activityDate)}
            </span>
          )}

          {/* Contributors */}
          <div className="mt-1 flex flex-wrap items-center gap-1">
            {loadingContribs ? (
              <span className="text-[10px] text-slate-300 italic">
                Đang tải...
              </span>
            ) : contribNames.length > 0 ? (
              <>
                <PersonIcon sx={{ fontSize: 11 }} className="text-slate-400 flex-shrink-0" />
                {contribNames.map((name, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 whitespace-nowrap"
                  >
                    {name}
                  </span>
                ))}
              </>
            ) : null}
          </div>
        </div>

        {/* Link đến trang khai báo */}
        <Link
          to={declPath}
          className="flex-shrink-0 flex items-center gap-1 text-[10px] font-bold text-mainColor hover:text-mainColor/80 transition-colors px-2 py-1 rounded-lg border border-mainColor/20 bg-mainColor/5 hover:bg-mainColor/10 mt-0.5"
          title="Đến trang khai báo"
        >
          Xem
          <OpenInNewIcon sx={{ fontSize: 11 }} />
        </Link>
      </div>
    </div>
  );
}

/** Panel collapsible hiển thị danh sách activities cho một tiêu chí */
function ActivityListPanel({ activities, catalogCode }) {
  const [expanded, setExpanded] = useState(false);
  if (!activities || activities.length === 0) return null;

  const declPath = CATALOG_TO_DECL_PATH[catalogCode] || "/activity/user";

  return (
    <div className="mt-2 border border-blue-100 rounded-lg overflow-hidden bg-white shadow-sm">
      {/* Toggle header */}
      <button
        onClick={() => setExpanded((p) => !p)}
        className="w-full flex items-center justify-between px-3 py-2 bg-blue-50/60 hover:bg-blue-50 transition-colors text-left"
      >
        <span className="text-[11px] font-bold text-blue-700 flex items-center gap-1.5">
          <ArticleIcon sx={{ fontSize: 13 }} className="text-blue-500" />
          {activities.length} hoạt động đã duyệt
        </span>
        <div className="flex items-center gap-2">
          <Link
            to={declPath}
            onClick={(e) => e.stopPropagation()}
            className="text-[10px] font-bold text-mainColor underline hover:text-mainColor/80 transition-colors"
            title="Mở trang khai báo"
          >
            Mở trang →
          </Link>
          <IconChevronDown
            className={`w-4 h-4 text-blue-400 transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {/* Danh sách activities */}
      {expanded && (
        <div className="max-h-52 overflow-y-auto divide-y divide-slate-50">
          {activities.map((act, idx) => (
            <ActivityRow
              key={act.id || idx}
              act={act}
              catalogCode={catalogCode}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ActivityDataTable({ criteria, actualStats = [], activities = [] }) {
  const [openIds, setOpenIds] = useState(() => criteria.map((g) => g.id));

  const toggle = (gid) =>
    setOpenIds((prev) =>
      prev.includes(gid) ? prev.filter((x) => x !== gid) : [...prev, gid],
    );

  // Create map of actual data by catalogCode
  const actualMap = useMemo(() => {
    const map = {};
    actualStats.forEach((stat) => {
      map[stat.catalogCode] = stat;
    });
    return map;
  }, [actualStats]);

  // Map activities by catalogCode
  const activitiesByCatalog = useMemo(() => {
    const map = {};
    activities.forEach((act) => {
      const code = act.catalogCode;
      if (!code) return;
      if (!map[code]) map[code] = [];
      map[code].push(act);
    });
    return map;
  }, [activities]);

  // Calculate actual statistics summary
  const actualSummary = useMemo(() => {
    const uniqueCatalogCodes = new Set(actualStats.map((s) => s.catalogCode));
    const totalActivities = actualStats.reduce(
      (sum, s) => sum + (s.participationCount || 0),
      0,
    );
    return {
      groupCount: uniqueCatalogCodes.size,
      activityCount: totalActivities,
    };
  }, [actualStats]);

  const groupTotals = useMemo(() => {
    const map = {};
    for (const g of criteria) {
      let total = 0;
      g.children.forEach((c) => {
        const actual = actualMap[c.id];
        if (actual) {
          total += actual.totalQuotaHours || 0;
        }
      });
      map[g.id] = total;
    }
    return map;
  }, [criteria, actualMap]);

  const totalRows = useMemo(
    () => criteria.reduce((s, g) => s + g.children.length, 0),
    [criteria],
  );

  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-200 overflow-hidden">
      <div className="px-6 py-5 flex items-center justify-between bg-slate-50 border-b border-slate-100">
        <div>
          <h2 className="font-bold text-lg text-slate-800">
            Dữ liệu hoạt động
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            {actualSummary.groupCount > 0 ? (
              <>
                {actualSummary.groupCount} nhóm · {actualSummary.activityCount}{" "}
                hoạt động
                {activities.length > 0 && (
                  <span className="ml-2 text-blue-600 font-semibold">
                    • {activities.length} bản khai báo đã duyệt
                  </span>
                )}
              </>
            ) : (
              "Chưa có dữ liệu thực tế"
            )}
          </p>
        </div>
        <button
          onClick={() =>
            setOpenIds((prev) =>
              prev.length === criteria.length ? [] : criteria.map((g) => g.id),
            )
          }
          className="text-xs font-bold text-slate-500 hover:text-mainColor transition-colors"
        >
          {openIds.length === criteria.length
            ? "Thu gọn tất cả"
            : "Mở rộng tất cả"}
        </button>
      </div>

      <div className="divide-y divide-slate-100">
        {criteria.map((g) => {
          const groupHours = groupTotals[g.id];
          const isOpen = openIds.includes(g.id);

          return (
            <div key={g.id} className="group">
              {isOpen && (
                <div className="px-6 pb-6 pt-2 bg-slate-50/30 animate-in slide-in-from-top-1 duration-200">
                  <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-50 text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">
                        <tr>
                          <th className="py-3 pl-4 min-w-[260px]">Nội dung</th>
                          <th className="py-3 text-center w-16">Định mức(S)</th>
                          <th className="py-3 text-center w-28">Số lượng</th>
                          <th className="py-3 text-center w-36">Đồng TG</th>
                          <th className="py-3 text-center w-36">Vai trò</th>
                          <th className="py-3 pr-4 text-right w-24">Giờ</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {g.children.map((c) => {
                          const actual = actualMap[c.id];
                          const participationCount = actual
                            ? actual.participationCount || 0
                            : 0;
                          const qty = participationCount;
                          const hours = actual
                            ? actual.totalQuotaHours || 0
                            : 0;
                          const ownH = actual?.ownQuotaHours ?? hours;
                          const teamH = actual?.groupHoursCredit ?? 0;
                          const participants = actual
                            ? Math.round(actual.avgParticipantsN || 0)
                            : 0;
                          const hasQty = qty > 0;
                          const catalogActivities = activitiesByCatalog[c.id] || [];

                          return (
                            <tr
                              key={c.id}
                              className={`group/row transition-colors border-b border-slate-50 last:border-0 ${hasQty ? "bg-slate-50" : "hover:bg-slate-50"}`}
                            >
                              <td className="py-3 pl-4 align-top pr-3">
                                <div
                                  className={`font-semibold transition-colors ${hasQty ? "text-slate-900" : "text-slate-600"}`}
                                >
                                  {c.name}
                                </div>
                                <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                                  {c.unit}{" "}
                                  {participationCount > 0 &&
                                    `• ${participationCount} hoạt động`}
                                </div>

                                {/* Expandable activities list */}
                                {catalogActivities.length > 0 && (
                                  <ActivityListPanel
                                    activities={catalogActivities}
                                    catalogCode={c.id}
                                  />
                                )}
                              </td>

                              <td className="py-3 text-center align-top">
                                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">
                                  {c.quota}
                                </span>
                              </td>

                              <td className="py-3 text-center align-top">
                                <span
                                  className={`inline-block w-20 text-center font-bold py-1.5 rounded-lg text-sm border shadow-sm ${
                                    hasQty
                                      ? "bg-white border-slate-300 text-mainColor"
                                      : "bg-slate-50 border-slate-200 text-slate-500"
                                  }`}
                                >
                                  {qty}
                                </span>
                              </td>

                              <td className="py-3 text-center align-top">
                                {participants > 0 ? (
                                  <div className="flex items-center justify-center">
                                    <IconUserGroup />
                                    <span className="w-14 ml-1.5 text-center font-semibold text-slate-600">
                                      {participants}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-slate-200">—</span>
                                )}
                              </td>

                              <td className="py-3 text-center align-top">
                                {hasQty ? (
                                  <span className="text-xs font-semibold py-1.5 px-2 rounded-lg border bg-white text-blue-700 border-blue-100">
                                    Thực tế
                                  </span>
                                ) : (
                                  <span className="text-slate-200">—</span>
                                )}
                              </td>

                              <td className="py-3 pr-4 text-right align-top">
                                <span
                                  className={`font-black text-lg transition-colors ${hours > 0 ? "text-mainColor" : "text-slate-200"}`}
                                >
                                  {hours > 0 ? round1(hours) : "0"}
                                </span>
                                {teamH > 0 && (
                                  <span className="block text-[10px] text-blue-600 font-medium">
                                    gồm {round1(teamH)}h nhóm
                                    {ownH > hours + 0.01
                                      ? ` · tự làm ${round1(ownH)}`
                                      : ""}
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      {groupHours > 0 && (
                        <tfoot>
                          <tr className="bg-slate-50 border-t border-slate-200">
                            <td
                              colSpan={5}
                              className="py-2.5 pl-4 text-xs font-bold text-slate-400 uppercase tracking-wide"
                            >
                              Tổng nhóm
                            </td>
                            <td className="py-2.5 pr-4 text-right">
                              <span className="font-black text-base text-mainColor">
                                {round1(groupHours)}
                              </span>
                              <span className="text-[10px] text-slate-400 font-medium ml-1">
                                giờ
                              </span>
                            </td>
                          </tr>
                        </tfoot>
                      )}
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
