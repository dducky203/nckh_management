import { Link } from "react-router-dom";
import GroupsIcon from "@mui/icons-material/Groups";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import LoadingSpinner from "../common/LoadingSpinner";
import { GROUP_TYPE_LABEL } from "./constants";
import { resolveTypeKey, round2 } from "./utils";

/**
 * Panel nhúng trong trang Định mức cá nhân (ActivityStandards).
 */
export default function GroupQuotaPanel({ stats, loading }) {
  const typeKey = resolveTypeKey(stats?.groupType);
  const typeInfo = typeKey ? GROUP_TYPE_LABEL[typeKey] : null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-mainColor/10 p-2 text-mainColor">
            <GroupsIcon sx={{ fontSize: 20 }} />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-800">Định mức nhóm nghiên cứu</h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Tự động từ hoạt động NCKH đã duyệt
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {typeInfo && (
            <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${typeInfo.cls}`}>
              {typeInfo.text}
            </span>
          )}
          <Link
            to="/activity/group-quota"
            className="inline-flex items-center gap-1 text-xs font-bold text-mainColor hover:underline"
          >
            Chi tiết
            <OpenInNewIcon sx={{ fontSize: 14 }} />
          </Link>
        </div>
      </div>

      {loading && (
        <div className="min-h-[120px] flex items-center justify-center">
          <LoadingSpinner size="md" />
        </div>
      )}

      {!loading && !stats && (
        <div className="px-6 py-8 text-center text-sm text-slate-400">
          Bạn chưa thuộc nhóm NCM / Xuất sắc / Tinh hoa đã duyệt.
          <Link to="/activity/group-quota" className="block mt-2 text-mainColor font-bold">
            Xem định mức nhóm
          </Link>
        </div>
      )}

      {!loading && stats && (
        <>
          {!stats.isLeader && stats.evaluatedCount > 0 && (
            <div
              className={`mx-6 mt-4 rounded-xl px-4 py-3 flex items-center gap-2 border text-sm font-bold
                ${stats.overallAchieved
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-rose-50 border-rose-200 text-rose-700"}`}
            >
              {stats.overallAchieved ? (
                <CheckCircleIcon sx={{ fontSize: 18 }} />
              ) : (
                <CancelIcon sx={{ fontSize: 18 }} />
              )}
              {stats.overallAchieved ? "Đạt định mức nhóm" : "Chưa đạt định mức nhóm"}
              <span className="font-normal text-slate-500 ml-1">
                ({stats.achievedCount}/{stats.evaluatedCount} tiêu chí)
              </span>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-6 divide-x divide-y md:divide-y-0 divide-slate-100 border-b border-slate-100 mt-2">
            <MiniStat label="Nhóm" value={stats.groupName} isText />
            <MiniStat label="% hoàn thành" value={round2(stats.groupCompletionPercent ?? 0)} suffix="%" highlight />
            <MiniStat label="Giờ cuối" value={round2(stats.myCreditedTotalHours ?? stats.myGroupQuotaHours ?? 0)} suffix="giờ" />
            <MiniStat label="Tổng nhóm" value={round2(stats.totalGroupHours)} suffix="giờ" />
            <MiniStat label="ĐM chuẩn nhóm" value={round2(stats.groupRequiredTotalHours ?? 0)} suffix="giờ" />
            <MiniStat label="% giờ nhóm" value={round2(stats.groupHoursCompletionPercent ?? 0)} suffix="%" highlight />
          </div>

          {stats.personalEvaluation?.length > 0 && (
            <div className="px-6 py-3 flex flex-wrap gap-2">
              {stats.personalEvaluation.map((row) => (
                <span
                  key={row.code}
                  className={`text-[11px] font-semibold px-2 py-1 rounded-lg border
                    ${row.achieved
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-rose-50 text-rose-700 border-rose-200"}`}
                >
                  {row.name}: {row.perMemberQty ?? row.actualQty}/{row.requiredQty}
                 
                </span>
              ))}
            </div>
          )}

          <div className="overflow-x-auto max-h-64">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 sticky top-0">
                  <th className="text-left px-5 py-2 text-xs font-bold text-slate-500">Tiêu chí</th>
                  <th className="text-center px-3 py-2 text-xs font-bold text-slate-500">Chia đều</th>
                  <th className="text-center px-3 py-2 text-xs font-bold text-slate-500">Tổng nhóm</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {(stats.criteria ?? [])
                  .filter((c) => !c.isGroupLevel)
                  .slice(0, 6)
                  .map((c) => (
                    <tr key={c.code}>
                      <td className="px-5 py-2 font-medium text-slate-700 text-xs">{c.name}</td>
                      <td className="px-3 py-2 text-center font-bold text-mainColor text-xs">{c.perMemberQty}</td>
                      <td className="px-3 py-2 text-center text-slate-500 text-xs">{c.groupTotalQty}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-3 bg-blue-50 border-t border-blue-100 flex justify-between items-center">
            <div className="text-xs text-blue-700">
              <p>
                Nhóm {round2(stats.groupCompletionPercent ?? 0)}% · Giờ cuối = chia đều + phần vượt (năm {stats.academicYear}).
                {stats.myCreditedTotalHours != null && (
                  <> Giờ được tính: <strong>{round2(stats.myCreditedTotalHours)}</strong>.</>)}
              </p>
              {stats.groupRequiredTotalHours != null && (
                <p className="mt-0.5">
                  Định mức chuẩn nhóm: <strong>{round2(stats.groupRequiredTotalHours)}</strong> giờ · 
                  Tổng nhóm: <strong>{round2(stats.totalGroupHours)}</strong> giờ · 
                  % giờ nhóm: <strong>{round2(stats.groupHoursCompletionPercent ?? 0)}%</strong>
                </p>
              )}
            </div>
            <Link
              to="/activity/group-quota"
              className="text-xs font-bold text-mainColor whitespace-nowrap ml-2"
            >
              Mở trang đầy đủ →
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

function MiniStat({ label, value, suffix, isText, highlight }) {
  return (
    <div className="px-4 py-3">
      <p className="text-[10px] font-bold text-slate-400 uppercase">{label}</p>
      {isText ? (
        <p className="text-sm font-extrabold text-slate-800 mt-1 truncate">{value}</p>
      ) : (
        <p className={`text-xl font-black mt-1 ${highlight ? "text-mainColor" : "text-slate-800"}`}>
          {value}
          {suffix && <span className="text-xs font-bold text-slate-400 ml-1">{suffix}</span>}
        </p>
      )}
    </div>
  );
}
