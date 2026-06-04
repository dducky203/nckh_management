import DashboardIcon from "@mui/icons-material/Dashboard";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import StarIcon from "@mui/icons-material/Star";
import { round2 } from "./utils";

export default function OverviewTab({ quota, stats, onNavigateTab }) {
  const personalCriteria = (quota?.criteria ?? []).filter(
    (c) => !c.isGroupLevel && (c.requiredQty ?? c.coefficient) > 0
  );

  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center gap-2">
        <DashboardIcon sx={{ fontSize: 18 }} className="text-mainColor" />
        <h3 className="text-sm font-bold text-slate-800">Tổng quan định mức của bạn</h3>
      </div>

      {quota.isLeader ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
          <StarIcon className="text-amber-600" sx={{ fontSize: 22 }} />
          <div>
            <p className="text-sm font-bold text-amber-800">Vai trò Trưởng nhóm</p>
            <p className="text-xs text-amber-700 mt-1">
              Bạn chịu trách nhiệm sản phẩm khoán cho cả nhóm. Xem định mức trưởng nhóm ở thẻ phía trên.
            </p>
          </div>
        </div>
      ) : stats ? (
        <div
          className={`rounded-xl p-4 border flex items-center gap-3
            ${stats.overallAchieved ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200"}`}
        >
          {stats.overallAchieved ? (
            <CheckCircleIcon sx={{ fontSize: 32 }} className="text-emerald-600" />
          ) : (
            <CancelIcon sx={{ fontSize: 32 }} className="text-rose-600" />
          )}
          <div>
            <p className="text-lg font-extrabold text-slate-800">
              Năm {stats.academicYear}:{" "}
              <span className={stats.overallAchieved ? "text-emerald-700" : "text-rose-700"}>
                {stats.overallAchieved ? "Đạt" : "Chưa đạt"}
              </span>
            </p>
            <p className="text-xs text-slate-500">
              {stats.achievedCount}/{stats.evaluatedCount} tiêu chí · {round2(stats.myTotalHours)} giờ quy đổi
              {stats.groupCompletionPercent != null && (
                <> · Nhóm <strong>{round2(stats.groupCompletionPercent)}%</strong></>
              )}
              {stats.myCreditedTotalHours != null && (
                <> · Giờ được tính <strong>{round2(stats.myCreditedTotalHours)}</strong></>
              )}
            </p>
          </div>
        </div>
      ) : null}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <QuickCard
          title="Định mức cá nhân"
          desc={`${personalCriteria.length} tiêu chí áp dụng`}
          onClick={() => onNavigateTab("matrix")}
        />
        <QuickCard
          title="Hoạt động của tôi"
          desc={`${stats?.activities?.length ?? 0} hoạt động đã duyệt`}
          onClick={() => onNavigateTab("activities")}
        />
        <QuickCard
          title="Đánh giá năm"
          desc="So với hoạt động đã duyệt"
          onClick={() => onNavigateTab("evaluation")}
        />
        <QuickCard
          title="Thành viên"
          desc={`${quota.memberCount} người trong nhóm`}
          onClick={() => onNavigateTab("members")}
        />
      </div>

      <p className="text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
        <strong>% hoàn thành nhóm</strong> theo dõi tiến độ tập thể.{" "}
        <strong>Giờ cuối</strong> = (giờ nhóm ÷ {quota.memberCount} TV) + phần vượt tổng nhóm — không cộng chồng
        (seminar 10h, 4 TV → 2,5h mỗi người).
      </p>

      {!quota.isLeader && personalCriteria.length > 0 && (
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase mb-2">Định mức bắt buộc (mỗi thành viên)</p>
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs">
                  <th className="text-left px-4 py-2 font-bold text-slate-500">Tiêu chí</th>
                  <th className="text-center px-3 py-2 font-bold text-slate-500">Định mức</th>
                  <th className="text-center px-3 py-2 font-bold text-slate-500">Đơn vị</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {personalCriteria.map((c) => (
                  <tr key={c.code} className="hover:bg-slate-50/50">
                    <td className="px-4 py-2.5 text-slate-700 font-medium text-[13px]">{c.name}</td>
                    <td className="px-3 py-2.5 text-center font-bold text-mainColor">
                      {c.requiredQty ?? c.coefficient}
                    </td>
                    <td className="px-3 py-2.5 text-center text-slate-400 text-xs">{c.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {stats?.personalEvaluation?.length > 0 && (
            <button
              type="button"
              onClick={() => onNavigateTab("evaluation")}
              className="mt-3 text-xs font-bold text-mainColor hover:underline"
            >
              Xem chi tiết đánh giá →
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function QuickCard({ title, desc, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left rounded-xl border border-slate-200 bg-slate-50/50 p-4 hover:border-mainColor hover:bg-mainColor/5 transition"
    >
      <p className="text-sm font-bold text-slate-800">{title}</p>
      <p className="text-xs text-slate-500 mt-1">{desc}</p>
    </button>
  );
}
