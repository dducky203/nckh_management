import CalculateIcon from "@mui/icons-material/Calculate";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { round2 } from "./utils";

export default function CalculatorTab({
  quota,
  quantities,
  setQuantities,
  calcResult,
  setCalcResult,
  calculating,
  handleCalculate,
}) {
  if (!quota?.criteria) {
    return (
      <div className="p-8 text-center text-slate-400 text-sm">Không có dữ liệu tiêu chí</div>
    );
  }

  const memberCriteria = quota.criteria.filter((c) => !c.isGroupLevel);

  return (
    <div className="divide-y divide-slate-100">
      <div className="px-5 py-4 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <CalculateIcon sx={{ fontSize: 18 }} className="text-mainColor" />
          <h3 className="text-sm font-bold text-slate-800">Tính định mức cá nhân</h3>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Nhập số lượng hoạt động để tính giờ quy đổi ({quota.chucDanh}
          {quota.memberFactor != null && ` · hệ số ×${quota.memberFactor}`})
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase w-[45%]">
                Tiêu chí
              </th>
              <th className="text-center px-3 py-3 text-xs font-bold text-slate-500 uppercase">Đơn vị</th>
              <th className="text-center px-3 py-3 text-xs font-bold text-slate-500 uppercase">Định mức</th>
              <th className="text-center px-3 py-3 text-xs font-bold text-slate-500 uppercase">Số lượng</th>
              <th className="text-center px-3 py-3 text-xs font-bold text-slate-500 uppercase">Giờ QĐ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {memberCriteria.map((c) => {
              const qty = quantities[c.code] ?? 0;
              const serverItem = calcResult?.items?.find((i) => i.code === c.code);
              const coeff = c.requiredQty ?? c.coefficient ?? 0;
              const displayHours = serverItem ? round2(serverItem.hours) : round2(qty * coeff);
              const hasCoeff = coeff > 0;

              return (
                <tr
                  key={c.code}
                  className={`hover:bg-slate-50/50 ${!hasCoeff ? "opacity-40" : ""}`}
                >
                  <td className="px-4 py-3 font-medium text-slate-700 text-[13px]">{c.name}</td>
                  <td className="px-3 py-3 text-center text-slate-500 text-xs">{c.unit}</td>
                  <td className="px-3 py-3 text-center">
                    {hasCoeff ? (
                      <span className="inline-block bg-mainColor/10 text-mainColor font-bold text-xs px-2 py-1 rounded-lg">
                        {coeff}
                      </span>
                    ) : (
                      <span className="text-slate-300 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    {hasCoeff ? (
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={qty}
                        onChange={(e) => {
                          setQuantities((prev) => ({
                            ...prev,
                            [c.code]: Math.max(0, Number(e.target.value)),
                          }));
                          setCalcResult(null);
                        }}
                        className="w-20 mx-auto block text-center border border-slate-200 rounded-lg py-1.5 text-sm font-semibold focus:outline-none focus:border-mainColor focus:ring-1 focus:ring-mainColor/30"
                      />
                    ) : (
                      <span className="block text-center text-slate-300 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-center">
                    {displayHours > 0 ? (
                      <span className="font-bold text-mainColor">{displayHours}</span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          {calcResult && (
            <div className="flex items-center gap-3">
              <CheckCircleIcon sx={{ fontSize: 20 }} className="text-emerald-500" />
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Tổng giờ quy đổi</p>
                <span className="text-3xl font-black text-mainColor">{round2(calcResult.totalHours)}</span>
                <span className="text-sm font-bold text-slate-400 ml-1">giờ</span>
              </div>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={handleCalculate}
          disabled={calculating}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-mainColor text-white text-sm font-bold shadow-sm hover:brightness-110 disabled:opacity-60"
        >
          <CalculateIcon sx={{ fontSize: 18 }} />
          {calculating ? "Đang tính..." : "Tính định mức"}
        </button>
      </div>

      {calcResult?.items?.length > 0 && (
        <div className="divide-y divide-slate-50 border-t border-slate-100">
          {calcResult.items.map((item) => {
            const crit = quota.criteria.find((c) => c.code === item.code);
            return (
              <div key={item.code} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-700">{crit?.name ?? item.code}</p>
                  <p className="text-xs text-slate-400">
                    {item.qty} {crit?.unit} × {crit?.requiredQty ?? crit?.coefficient}
                  </p>
                </div>
                <span className="text-lg font-black text-mainColor">{round2(item.hours)} giờ</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
