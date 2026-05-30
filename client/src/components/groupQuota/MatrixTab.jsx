import TableChartIcon from "@mui/icons-material/TableChart";
import StarIcon from "@mui/icons-material/Star";
import { CHUC_DANH_LABELS } from "./constants";

export default function MatrixTab({ matrix, typeConfig, myChucDanhKey }) {
  if (!matrix?.matrix) {
    return (
      <div className="p-8 text-center text-slate-400 text-sm">
        Không có dữ liệu ma trận định mức
      </div>
    );
  }

  const chucDanhs = matrix.chucDanhs || ["GS_PGS", "TS", "THS", "KS_CN"];
  const rows = matrix.matrix;
  const leaderQuota = matrix.leaderQuota;

  return (
    <div className="divide-y divide-slate-100">
      <div className="px-5 py-4 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <TableChartIcon sx={{ fontSize: 18 }} className="text-mainColor" />
          <h3 className="text-sm font-bold text-slate-800">
            {typeConfig?.tableName ?? "Bảng"} — Định mức theo chức danh
          </h3>
        </div>
        {leaderQuota && (
          <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3">
            <p className="text-xs font-bold text-amber-700 mb-1.5 flex items-center gap-1.5">
              <StarIcon sx={{ fontSize: 14 }} /> Định mức Trưởng nhóm
            </p>
            <div className="flex flex-wrap gap-3">
              {Object.entries(leaderQuota).map(([code, val]) => {
                const critRow = rows.find((r) => r.code === code);
                return (
                  <div key={code} className="text-xs text-amber-800">
                    <span className="font-medium">{critRow?.name || code}:</span>{" "}
                    <span className="font-bold">{val}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-[40%] sticky left-0 bg-slate-50 z-10">
                Tiêu chí
              </th>
              <th className="text-center px-3 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-[15%]">
                ĐM nhóm
              </th>
              {chucDanhs.map((cd) => (
                <th
                  key={cd}
                  className={`text-center px-3 py-3 text-xs font-bold uppercase tracking-wider
                    ${cd === myChucDanhKey ? "text-mainColor bg-mainColor/5" : "text-slate-500"}`}
                >
                  {CHUC_DANH_LABELS[cd] || cd}
                  {cd === myChucDanhKey && (
                    <div className="text-[10px] font-medium normal-case text-mainColor/70 mt-0.5">
                      (Bạn)
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {rows.map((row, idx) => (
              <tr
                key={row.code}
                className={`${idx % 2 === 0 ? "bg-white" : "bg-slate-50/30"} hover:bg-blue-50/30`}
              >
                <td className="px-4 py-3 font-medium text-slate-700 text-[13px] sticky left-0 bg-inherit z-10">
                  {row.name}
                </td>
                <td className="px-3 py-3 text-center">
                  {row.isGroupLevel ? (
                    <span className="inline-block text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-2 py-1">
                      {row.groupQuota}
                    </span>
                  ) : (
                    <span className="text-slate-300 text-xs">—</span>
                  )}
                </td>
                {chucDanhs.map((cd) => {
                  const coeff = row.coefficients?.[cd];
                  const isMyCol = cd === myChucDanhKey;
                  const hasValue = coeff != null && coeff > 0;

                  if (row.isGroupLevel) {
                    return (
                      <td key={cd} className={`px-3 py-3 text-center ${isMyCol ? "bg-mainColor/5" : ""}`}>
                        <span className="text-xs text-slate-300 italic">chia đều</span>
                      </td>
                    );
                  }

                  return (
                    <td key={cd} className={`px-3 py-3 text-center ${isMyCol ? "bg-mainColor/5" : ""}`}>
                      {hasValue ? (
                        <span
                          className={`inline-block text-xs font-bold px-2 py-1 rounded-lg
                            ${isMyCol ? "bg-mainColor/10 text-mainColor" : "bg-slate-100 text-slate-700"}`}
                        >
                          {coeff}
                        </span>
                      ) : (
                        <span className="text-slate-300 text-xs">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-5 py-3 bg-slate-50/50 flex flex-wrap gap-4 text-[11px] text-slate-400">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-mainColor/10 border border-mainColor/20 inline-block" />
          Định mức của bạn
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-emerald-50 border border-emerald-200 inline-block" />
          Định mức cấp nhóm
        </span>
        <span>— = Không áp dụng cho chức danh</span>
      </div>
    </div>
  );
}
