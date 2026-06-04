import { useState } from "react";
import AssessmentIcon from "@mui/icons-material/Assessment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import StarIcon from "@mui/icons-material/Star";
import LoadingSpinner from "../common/LoadingSpinner";
import NcmGroupQuotasCard from "./NcmGroupQuotasCard";
import { round2 } from "./utils";

export default function EvaluationTab({
  stats,
  loading,
  academicYear,
  setAcademicYear,
  onRefresh,
  isLeader,
  memberFactor = 0.8,
}) {
  if (loading && !stats) {
    return (
      <div className="p-12 flex justify-center">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100">
      <div className="px-5 py-4 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <AssessmentIcon sx={{ fontSize: 18 }} className="text-mainColor" />
            <h3 className="text-sm font-bold text-slate-800">Đánh giá thực hiện</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            <strong>% hoàn thành nhóm</strong> = TB tiến độ các chỉ tiêu.{" "}
            <strong>Giờ cuối</strong> = (giờ nhóm ÷ số TV) + phần bạn vượt tổng nhóm — không cộng chồng giờ đã nằm trong tổng
            (vd. seminar 10h/4 TV → <strong>2,5h</strong>, không phải 12,5h).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500">Năm học</label>
          <input
            type="number"
            min="2020"
            max="2100"
            value={academicYear}
            onChange={(e) => setAcademicYear(Number(e.target.value))}
            className="w-24 text-center border border-slate-200 rounded-lg py-1.5 text-sm font-semibold"
          />
          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-mainColor text-white disabled:opacity-60"
          >
            {loading ? "..." : "Làm mới"}
          </button>
        </div>
      </div>

      {!stats && !loading && (
        <div className="p-8 text-center text-slate-400 text-sm">Chưa có dữ liệu thống kê</div>
      )}

      {stats && (
        <>
          <div className="px-5 py-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <StatBox
              label="% hoàn thành nhóm"
              value={stats.groupCompletionPercent ?? 0}
              unit="%"
              accent="main"
              sub={
                stats.groupCompletionCriteriaCount != null
                  ? `${stats.groupCompletionCriteriaCount} chỉ tiêu`
                  : undefined
              }
            />
            <StatBox label="Giờ tự làm" value={stats.myTotalHours} unit="giờ" />
            <StatBox
              label="Giờ cuối (được tính)"
              value={stats.myCreditedTotalHours ?? stats.myGroupQuotaHours}
              unit="giờ"
              accent="main"
            />
            <StatBox label="Tổng giờ nhóm" value={stats.totalGroupHours} unit="giờ" />
            <StatBox
              label="Nhóm ÷ TV"
              value={stats.totalPerMemberHours}
              unit="giờ"
              sub={`${stats.memberCount} thành viên`}
            />
          </div>

          {stats.groupCompletionPercent != null && !isLeader && (
            <div className="px-5 pb-2">
              <div className="rounded-xl border border-violet-100 bg-violet-50/60 px-4 py-3">
                <div className="flex justify-between mb-2">
                  <p className="text-xs font-bold text-violet-800">Tiến độ tập thể</p>
                  <p className="text-sm font-black text-violet-700">{round2(stats.groupCompletionPercent)}%</p>
                </div>
                <div className="h-2 rounded-full bg-violet-100 overflow-hidden">
                  <div
                    className="h-full bg-mainColor rounded-full"
                    style={{ width: `${Math.min(100, stats.groupCompletionPercent)}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="px-5 pb-4">
            {isLeader ? (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                <StarIcon sx={{ fontSize: 20 }} className="text-amber-600 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-amber-800">Trưởng nhóm</p>
                  <p className="text-xs text-amber-700 mt-1">
                    Định mức đánh giá theo sản phẩm tập thể (WoS/Scopus, đề tài Bộ). Xem mục Định mức Trưởng nhóm ở đầu trang.
                  </p>
                </div>
              </div>
            ) : (
              <div
                className={`rounded-xl p-4 flex items-center gap-3 border
                  ${stats.overallAchieved ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200"}`}
              >
                {stats.overallAchieved ? (
                  <CheckCircleIcon sx={{ fontSize: 28 }} className="text-emerald-600" />
                ) : (
                  <CancelIcon sx={{ fontSize: 28 }} className="text-rose-600" />
                )}
                <div>
                  <p
                    className={`text-base font-extrabold ${stats.overallAchieved ? "text-emerald-700" : "text-rose-700"}`}
                  >
                    {stats.overallAchieved ? "ĐẠT ĐỊNH MỨC CÁ NHÂN" : "CHƯA ĐẠT ĐỊNH MỨC"}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {stats.achievedCount}/{stats.evaluatedCount} tiêu chí đạt
                  </p>
                </div>
              </div>
            )}
          </div>

          {!isLeader && stats.personalEvaluation?.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase">Tiêu chí</th>
                    <th className="text-center px-3 py-3 text-xs font-bold text-slate-500 uppercase">ĐM bạn</th>
                    <th className="text-center px-3 py-3 text-xs font-bold text-slate-500 uppercase">Bạn làm</th>
                    <th className="text-center px-3 py-3 text-xs font-bold text-slate-500 uppercase">Tổng nhóm</th>
                    <th className="text-center px-3 py-3 text-xs font-bold text-slate-500 uppercase">Chia đều</th>
                    <th className="text-center px-3 py-3 text-xs font-bold text-slate-500 uppercase">Giờ cuối</th>
                    <th className="text-center px-3 py-3 text-xs font-bold text-slate-500 uppercase">Kết quả</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {stats.personalEvaluation
                  .filter((row) => !row.isGroupLevel)
                  .map((row) => (
                    <EvaluationCriterionRow key={row.code} row={row} />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {stats.ncmGroupQuotas && (
            <div className="px-5 py-4 border-t border-slate-100 bg-blue-50/30">
              <NcmGroupQuotasCard quotas={stats.ncmGroupQuotas} compact />
            </div>
          )}

          {stats.criteria?.length > 0 && (
            <div className="px-5 py-4 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-500 uppercase mb-3">
                Chi tiết tập thể (tổng nhóm đã nhân hệ số PA, chia {stats.memberCount} người)
              </p>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="text-left px-3 py-2 font-bold text-slate-500">Tiêu chí</th>
                      <th className="text-center px-2 py-2 font-bold text-slate-500">Tổng nhóm (×PA)</th>
                      <th className="text-center px-2 py-2 font-bold text-slate-500">Chia đều</th>
                      <th className="text-center px-2 py-2 font-bold text-slate-500">Giờ tự làm</th>
                      <th className="text-center px-2 py-2 font-bold text-slate-500">Giờ cuối</th>
                      <th className="text-center px-2 py-2 font-bold text-slate-500">Đạt SL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {stats.criteria
                      .filter((c) => !c.isGroupLevel)
                      .map((row) => {
                        const met = row.achievedViaShare ?? (row.perMemberQty >= (row.requiredQty ?? 0));
                        return (
                          <tr key={row.code}>
                            <td className="px-3 py-2 text-slate-700">{row.name}</td>
                            <td className="px-2 py-2 text-center">{row.groupTotalQty}</td>
                            <td className="px-2 py-2 text-center font-bold text-mainColor">{row.perMemberQty}</td>
                            <td className="px-2 py-2 text-center text-slate-500">{row.myHours ?? 0}</td>
                            <td className="px-2 py-2 text-center font-bold text-blue-700">
                              {round2(row.myCreditedHours ?? row.myHours ?? 0)}
                              {(row.groupHoursCredit ?? 0) > 0 && (
                                <span className="block text-[10px] text-blue-500 font-normal">
                                  gồm +{round2(row.groupHoursCredit)} nhóm
                                </span>
                              )}
                            </td>
                            <td className="px-2 py-2 text-center">
                              {met ? (
                                <span className="text-emerald-600 font-bold">Đạt</span>
                              ) : (
                                <span className="text-rose-500">Chưa</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function EvaluationCriterionRow({ row }) {
  const [open, setOpen] = useState(false);
  const acts = row.activities ?? [];
  const perMember = row.perMemberQty ?? row.actualQty;
  const myQty = row.myQty ?? 0;
  const creditedH = row.myCreditedHours ?? row.actualHours ?? row.myHours ?? 0;

  return (
    <>
      <tr className="hover:bg-slate-50/50 cursor-pointer" onClick={() => acts.length > 0 && setOpen(!open)}>
        <td className="px-4 py-3 font-medium text-slate-700 text-[13px]">
          {row.name}
          {row.carriedByTeam && (
            <span className="ml-1 text-[10px] font-bold text-violet-600 bg-violet-50 px-1.5 py-0.5 rounded">
              Gánh team
            </span>
          )}
          {acts.length > 0 && (
            <span className="ml-2 text-[10px] text-slate-400">({acts.length} HĐ)</span>
          )}
        </td>
        <td className="px-3 py-3 text-center font-bold text-slate-600">{row.requiredQty}</td>
        <td className="px-3 py-3 text-center text-slate-600">{myQty}</td>
        <td className="px-3 py-3 text-center text-slate-500">{row.groupTotalQty ?? "—"}</td>
        <td className="px-3 py-3 text-center font-bold text-mainColor">{perMember}</td>
        <td className="px-3 py-3 text-center">
          <span className="font-bold text-blue-700">{round2(creditedH)}</span>
          {(row.groupHoursCredit ?? 0) > 0 && (
            <span className="block text-[10px] text-blue-500">+{round2(row.groupHoursCredit)} nhóm</span>
          )}
        </td>
        <td className="px-3 py-3 text-center">
          {row.achieved ? (
            <span className="inline-flex flex-col items-center gap-0.5">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                <CheckCircleIcon sx={{ fontSize: 14 }} /> Đạt
              </span>
              {row.carriedByTeam && (
                <span className="text-[10px] text-violet-600">nhờ tập thể</span>
              )}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-full">
              <CancelIcon sx={{ fontSize: 14 }} /> Chưa đạt
            </span>
          )}
        </td>
      </tr>
      {open && acts.map((act) => (
        <tr key={act.activityId} className="bg-slate-50/80">
          <td colSpan={4} className="px-6 py-2 text-xs text-slate-500 pl-8">
            ↳ {act.title || act.catalogName}
          </td>
          <td className="px-3 py-2 text-center text-xs font-semibold text-mainColor">
            +{act.poolQty ?? act.equivQty}
            {act.equivQty !== act.poolQty && (
              <span className="text-slate-400 font-normal"> (gốc {act.equivQty})</span>
            )}
          </td>
          <td className="px-3 py-2 text-center text-xs text-slate-400">{act.activityDate}</td>
        </tr>
      ))}
    </>
  );
}

function StatBox({ label, value, unit, sub, accent }) {
  return (
    <div className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <p className={`text-2xl font-black mt-1 ${accent === "main" ? "text-mainColor" : "text-slate-800"}`}>
        {round2(value)}
        <span className="text-sm font-bold text-slate-400 ml-1">{unit}</span>
      </p>
      {sub && <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}
