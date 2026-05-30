import { Link } from "react-router-dom";
import ListAltIcon from "@mui/icons-material/ListAlt";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import LoadingSpinner from "../common/LoadingSpinner";
import { round2 } from "./utils";

export default function ActivitiesTab({ stats, loading, academicYear }) {
  if (loading && !stats) {
    return (
      <div className="p-12 flex justify-center">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  const activities = stats?.activities ?? [];

  return (
    <div className="divide-y divide-slate-100">
      <div className="px-5 py-4 bg-slate-50/50 flex flex-col sm:flex-row sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <ListAltIcon sx={{ fontSize: 18 }} className="text-mainColor" />
            <h3 className="text-sm font-bold text-slate-800">Hoạt động đã duyệt</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Hệ thống tự cộng dồn từ khai báo NCKH năm {academicYear} — không cần nhập tay
          </p>
        </div>
        <Link
          to="/activity"
          className="inline-flex items-center gap-1 text-xs font-bold text-mainColor hover:underline"
        >
          Khai báo hoạt động mới
          <OpenInNewIcon sx={{ fontSize: 14 }} />
        </Link>
      </div>

      {activities.length === 0 ? (
        <div className="p-10 text-center">
          <p className="text-sm text-slate-500 font-medium">Chưa có hoạt động được duyệt trong năm này.</p>
          <p className="text-xs text-slate-400 mt-2">
            Khai báo hoạt động NCKH và chờ phê duyệt — định mức nhóm sẽ tự cập nhật.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase">Hoạt động</th>
                <th className="text-left px-3 py-3 text-xs font-bold text-slate-500 uppercase">Tiêu chí</th>
                <th className="text-center px-3 py-3 text-xs font-bold text-slate-500 uppercase">SL gốc</th>
              <th className="text-center px-3 py-3 text-xs font-bold text-slate-500 uppercase">Vào nhóm (×PA)</th>
                <th className="text-center px-3 py-3 text-xs font-bold text-slate-500 uppercase">Giờ ĐM nhóm</th>
                <th className="text-center px-3 py-3 text-xs font-bold text-slate-500 uppercase">Ngày</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {activities.map((act) => (
                <tr key={`${act.activityId}-${act.catalogCode}`} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-medium text-slate-700 text-[13px] max-w-[200px] truncate">
                    {act.title || "—"}
                  </td>
                  <td className="px-3 py-3 text-slate-600 text-xs">
                    <span className="font-semibold">{act.catalogName || act.catalogCode}</span>
                  </td>
                  <td className="px-3 py-3 text-center text-slate-600">
                    {act.equivQty}
                  </td>
                  <td className="px-3 py-3 text-center font-bold text-slate-700">
                    {act.poolQty ?? act.equivQty}
                    {act.unit && <span className="text-slate-400 font-normal text-xs ml-1">{act.unit}</span>}
                  </td>
                  <td className="px-3 py-3 text-center font-bold text-mainColor">
                    {act.groupQuotaHours > 0 ? `${act.groupQuotaHours} giờ` : "—"}
                  </td>
                  <td className="px-3 py-3 text-center text-slate-400 text-xs">{act.activityDate || "—"}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-mainColor/5 border-t border-slate-200">
                <td colSpan={4} className="px-4 py-3 text-sm font-bold text-slate-700">
                  Tổng giờ định mức nhóm (bạn)
                </td>
                <td className="px-3 py-3 text-center text-lg font-black text-mainColor">
                  {round2(stats?.myGroupQuotaHours ?? 0)}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
