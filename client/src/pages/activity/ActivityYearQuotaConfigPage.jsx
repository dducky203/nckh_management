import { useEffect, useMemo, useState } from "react";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import nckhTieuChiDinhMucService from "../../services/nckhTieuChiDinhMucService";

function formatNumber(value) {
  if (value === null || value === undefined || value === "") return "-";
  return (+value).toLocaleString("vi-VN", { maximumFractionDigits: 2 });
}

export default function ActivityYearQuotaConfigPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedPlan, setSelectedPlan] = useState("all");

  const getYearValue = (row) => String(row?.year ?? row?.namHoc ?? "").trim();
  const getPlanValue = (row) => String(row?.phuongAn ?? "").trim();

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await nckhTieuChiDinhMucService.getAll(null, null);
        const data = res?.data || (res?.length >= 0 ? res : []);

        if (!cancelled) {
          setRows(data);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e?.message || "Không tải được dữ liệu định mức.");
          setRows([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  const yearOptions = useMemo(() => {
    const values = Array.from(
      new Set(rows.map((row) => getYearValue(row)).filter(Boolean)),
    );

    return values.sort((a, b) => Number(b) - Number(a));
  }, [rows]);

  const planOptions = useMemo(() => {
    const values = Array.from(
      new Set(rows.map((row) => getPlanValue(row)).filter(Boolean)),
    );

    return values.sort((a, b) => Number(a) - Number(b));
  }, [rows]);

  const filteredRows = useMemo(
    () =>
      rows.filter((row) => {
        const yearMatch =
          selectedYear === "all" || getYearValue(row) === selectedYear;
        const planMatch =
          selectedPlan === "all" || getPlanValue(row) === selectedPlan;
        return yearMatch && planMatch;
      }),
    [rows, selectedYear, selectedPlan],
  );

  const totalRows = useMemo(() => filteredRows.length, [filteredRows]);
  const totalMinHours = useMemo(
    () => filteredRows.reduce((sum, row) => sum + (+row.tongGioToiThieu || 0), 0),
    [filteredRows],
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      <div className="mx-auto max-w-7xl px-4 pt-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-extrabold text-slate-800">
            Chỉnh sửa định mức theo năm
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Bước 1: Đang gọi API getAll và hiển thị dữ liệu định mức.
          </p>


          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wide text-slate-400 mb-1">
                Lọc theo năm
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-mainColor"
              >
                <option value="all">Tất cả năm</option>
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wide text-slate-400 mb-1">
                Lọc theo phương án
              </label>
              <select
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-mainColor"
              >
                <option value="all">Tất cả phương án</option>
                {planOptions.map((plan) => (
                  <option key={plan} value={plan}>
                    PA{plan}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="flex min-h-[220px] items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 shadow-sm">
              {error}
            </div>
          ) : rows.length === 0 ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700 shadow-sm">
              Chưa có dữ liệu định mức.
            </div>
          ) : filteredRows.length === 0 ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700 shadow-sm">
              Không có dữ liệu phù hợp với bộ lọc hiện tại.
            </div>
          ) : (
            <div className="animate-in slide-in-from-top-1 duration-300">
              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead className="bg-slate-100 border-b border-slate-200 text-xs uppercase font-bold text-slate-500 tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4 w-14 text-center">STT</th>
                      <th className="py-3.5 px-4 min-w-[90px]">Năm</th>
                      <th className="py-3.5 px-4 min-w-[120px]">Phương án</th>
                      <th className="py-3.5 px-4 min-w-[250px] whitespace-normal">Tên tiêu chí</th>
                      <th className="py-3.5 px-4 min-w-[120px]">Chức danh</th>
                      <th className="py-3.5 px-4 min-w-[100px]">Đơn vị</th>
                      <th className="py-3.5 px-4 text-right min-w-[110px]">Định mức</th>
                      <th className="py-3.5 px-4 text-right min-w-[110px]">Giờ quy đổi</th>
                      <th className="py-3.5 px-4 text-right min-w-[140px]">Tổng giờ tối thiểu</th>
                    </tr>
                  </thead>
                  
                  <tbody className="text-sm">
                    {filteredRows.map((row, index) => {
                      const hasHours = row.tongGioToiThieu > 0;

                      return (
                        <tr
                          key={`${row.id || row.tieuChiCode || "item"}-${index}`}
                          className={`group/row transition-colors duration-200 border-b border-slate-100 last:border-0 ${
                            hasHours ? "bg-slate-50" : "hover:bg-slate-50"
                          }`}
                        >
                          <td className="py-3 px-4 text-center align-middle font-medium text-slate-500">
                            {index + 1}
                          </td>
                          <td className="py-3 px-4 text-slate-700">
                            {row.year || row.namHoc || "-"}
                          </td>
                          <td className="py-3 px-4 text-slate-700">
                            {row.phuongAn ?? "-"}
                          </td>
                          <td className="py-3 px-4 whitespace-normal min-w-[250px]">
                            <div className="font-semibold text-slate-800">
                              {row.tieuChiName || "-"}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-700">
                            {row.chucDanh || "-"}
                          </td>
                          <td className="py-3 px-4 text-slate-700">
                            {row.donViTinh || "-"}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="inline-block text-xs font-semibold text-slate-600 bg-slate-100/50 group-hover/row:bg-white border border-transparent transition-colors px-2.5 py-1 rounded-md">
                              {formatNumber(row.dinhMucToiThieu)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="inline-block text-xs font-semibold text-slate-600 bg-slate-100/50 group-hover/row:bg-white border border-transparent transition-colors px-2.5 py-1 rounded-md">
                              {formatNumber(row.gioQuyDoiPerUnit)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span
                              className={`font-black text-lg transition-colors ${
                                hasHours ? "text-mainColor" : "text-slate-300"
                              }`}
                            >
                              {hasHours ? formatNumber(row.tongGioToiThieu) : "0"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  
                  {totalMinHours > 0 && (
                    <tfoot>
                      <tr className="bg-slate-50 border-t-2 border-slate-200">
                        <td
                          colSpan={8}
                          className="py-3.5 px-4 text-sm font-bold text-slate-600 uppercase tracking-wide text-right"
                        >
                          Tổng tất cả
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="font-black text-lg text-mainColor">
                            {formatNumber(totalMinHours)}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium ml-1.5">
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
      </div>
    </div>
  );
}