import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import nckhTieuChiDinhMucService from "../../services/nckhTieuChiDinhMucService";
import { downloadFileFromResponse } from "../../utils/helpers";
import { useToast } from "../../context/ToastContext";

function formatNumber(value) {
  if (value === null || value === undefined || value === "") return "-";
  return (+value).toLocaleString("vi-VN", { maximumFractionDigits: 2 });
}

export default function ActivityYearQuotaConfigPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [yearInput, setYearInput] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("all");
  const [importing, setImporting] = useState(false);
  const [downloadingTemplate, setDownloadingTemplate] = useState(false);
  const fileInputRef = useRef(null);
  const debounceRef = useRef(null);
  const toast = useToast();

  const getPlanValue = (row) => String(row?.phuongAn ?? "").trim();

  const fetchData = useCallback(async (year) => {
    setLoading(true);
    setError("");
    try {
      const yearParam = year && String(year).trim() !== "" ? Number(year) : null;
      const res = await nckhTieuChiDinhMucService.getAll(null, null, yearParam);
      const data = Array.isArray(res) ? res : (res?.data ?? []);
      setRows(data);
    } catch (e) {
      setError(e?.message || "Không tải được dữ liệu định mức.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load lần đầu với năm hiện tại
  useEffect(() => {
    const currentYear = String(new Date().getFullYear());
    setYearInput(currentYear);
    fetchData(currentYear);
  }, [fetchData]);

  // Debounce gọi API khi người dùng nhập năm
  const handleYearChange = (e) => {
    const val = e.target.value;
    setYearInput(val);
    setSelectedPlan("all");

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchData(val);
    }, 600);
  };

  const planOptions = useMemo(() => {
    const values = Array.from(
      new Set(rows.map((row) => getPlanValue(row)).filter(Boolean)),
    );

    return values.sort((a, b) => Number(a) - Number(b));
  }, [rows]);

  const filteredRows = useMemo(
    () =>
      selectedPlan === "all"
        ? rows
        : rows.filter((row) => getPlanValue(row) === selectedPlan),
    [rows, selectedPlan],
  );

  const totalRows = useMemo(() => filteredRows.length, [filteredRows]);
  const totalMinHours = useMemo(
    () => filteredRows.reduce((sum, row) => sum + (+row.tongGioToiThieu || 0), 0),
    [filteredRows],
  );

  const handleDownloadTemplate = async () => {
    try {
      setDownloadingTemplate(true);
      const params = {};
      if (yearInput.trim() !== "") params.year = Number(yearInput);
      if (selectedPlan !== "all") params.phuongAn = Number(selectedPlan);

      const response = await nckhTieuChiDinhMucService.downloadImportTemplate(params);
      downloadFileFromResponse(response, "template-dinh-muc.xlsx");
      toast.success("Đã tải file mẫu. Chỉ nhập 2 cột Định mức và Giờ quy đổi, tổng giờ sẽ tự tính.");
    } catch (e) {
      toast.error(e?.message || "Không tải được file mẫu.");
    } finally {
      setDownloadingTemplate(false);
    }
  };

  const handleImportExcel = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setImporting(true);
      const response = await nckhTieuChiDinhMucService.importFromExcel(file);

      const successCount = Number(response.headers?.["x-import-success"] ?? 0);
      const errorCount = Number(response.headers?.["x-import-error"] ?? 0);

      if (errorCount === 0) {
        toast.success(`Import thành công ${successCount} dòng. Tổng giờ tối thiểu đã được tự tính.`);
      } else {
        toast.error(
          `Import xong: ${successCount} thành công, ${errorCount} lỗi. Đang tải file kết quả để xem chi tiết...`,
          7000,
        );
        // Tự động tải file Excel có ghi lỗi ở cột cuối
        downloadFileFromResponse(response, "ket-qua-import-dinh-muc.xlsx");
      }

      await fetchData(yearInput);
    } catch (e) {
      toast.error(e?.message || "Không import được file Excel.");
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      <div className="mx-auto max-w-7xl px-4 pt-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
            <div>
              <h1 className="text-xl font-extrabold text-slate-800">
                Chỉnh sửa định mức theo năm
              </h1>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Import Excel để cập nhật hàng loạt. Chỉ cần nhập <b>Định mức</b> và
                <b> Giờ quy đổi</b>; <b>Tổng giờ tối thiểu</b> sẽ tự tính = Định mức × Giờ quy đổi.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadTemplate}
                disabled={downloadingTemplate || importing}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {downloadingTemplate ? "Đang tải..." : "Tải file mẫu"}
              </button>

              <label
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-white shadow-sm transition cursor-pointer ${
                  importing ? "bg-emerald-400 cursor-wait" : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                {importing ? "Đang import..." : "Import Excel"}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleImportExcel}
                  disabled={importing}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wide text-slate-400 mb-1">
                Lọc theo năm
              </label>
              <input
                type="number"
                value={yearInput}
                onChange={handleYearChange}
                placeholder="Nhập năm (VD: 2025)..."
                min={2000}
                max={2099}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-mainColor"
              />
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
