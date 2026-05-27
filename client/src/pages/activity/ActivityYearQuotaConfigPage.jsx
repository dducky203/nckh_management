import { Add } from "@mui/icons-material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useToast } from "../../context/ToastContext";
import nckhTieuChiDinhMucService from "../../services/nckhTieuChiDinhMucService";
import { downloadFileFromResponse, formatNumber } from "../../utils/helpers";



function AiUploadModal({ onClose, onScan, scanning }) {
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selected]);
    }
  };

  const removeFile = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-violet-100 p-2 text-violet-600">
              <AutoAwesomeIcon sx={{ fontSize: 20 }} />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-800">
                Tải lên ảnh/PDF để quét AI
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Bạn có thể chọn nhiều file cùng lúc
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={scanning}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition"
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </button>
        </div>

        <div className="p-6">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-200 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <AutoAwesomeIcon className="mb-2 text-slate-400" sx={{ fontSize: 28 }} />
              <p className="text-sm text-slate-500 font-semibold">Nhấn để chọn file</p>
              <p className="text-xs text-slate-400">Hỗ trợ định dạng Ảnh (.jpg, .png) & PDF</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              multiple
              className="hidden"
              onChange={handleFileChange}
              disabled={scanning}
            />
          </label>

          {files.length > 0 && (
            <div className="mt-4 max-h-40 overflow-y-auto space-y-2">
              {files.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-xs font-semibold text-slate-600 truncate mr-2">
                    {file.name}
                  </span>
                  <button
                    onClick={() => removeFile(idx)}
                    disabled={scanning}
                    className="p-1 text-slate-400 hover:text-rose-500 transition"
                  >
                    <CloseIcon sx={{ fontSize: 14 }} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={scanning}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition"
          >
            Hủy
          </button>
          <button
            onClick={() => onScan(files)}
            disabled={files.length === 0 || scanning}
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-violet-600 rounded-lg shadow-sm hover:brightness-110 transition disabled:opacity-60"
          >
            {scanning ? (
              <>
                <LoadingSpinner size="sm" />
                Đang xử lý AI...
              </>
            ) : (
              `Quét ${files.length} file`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}


function AiPreviewModal({ rows: initialRows, onConfirm, onClose, saving }) {
  const [rows, setRows] = useState(() =>
    initialRows.map((r, i) => ({ ...r, _key: i }))
  );

  const update = (idx, field, value) => {
    setRows((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, [field]: value } : r))
    );
  };

  const remove = (idx) => setRows((prev) => prev.filter((_, i) => i !== idx));

  const createEmptyRow = (prev) => {
    const nextKey = Date.now();
    const defaultYear = (initialRows && initialRows.length > 0 && initialRows[0].year)
      ? initialRows[0].year
      : String(new Date().getFullYear());
    return {
      phuongAn: null,
      tieuChiCode: "",
      tieuChiName: "",
      chucDanh: null,
      donViTinh: "",
      dinhMucToiThieu: null,
      gioQuyDoiPerUnit: null,
      year: defaultYear,
      sortOrder: (prev ? prev.length + 1 : 1),
      _key: nextKey,
    };
  };

  const addEmptyRow = () => {
    setRows((prev) => [...prev, createEmptyRow(prev)]);
  };

  const insertRowAfter = (idx) => {
    setRows((prev) => {
      const before = prev.slice(0, idx + 1);
      const after = prev.slice(idx + 1);
      return [...before, createEmptyRow(prev), ...after];
    });
  };

  const CHUC_DANH = [
    { value: "GS_PGS", label: "GS/PGS" },
    { value: "TS", label: "TS" },
    { value: "THS", label: "ThS" },
    { value: "KS_CN", label: "KS/CN" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm overflow-y-auto py-8 px-2">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-violet-100 p-2 text-violet-600">
              <AutoAwesomeIcon sx={{ fontSize: 20 }} />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-800">
                Preview dữ liệu AI quét được
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Kiểm tra và chỉnh sửa trực tiếp trước khi lưu — {rows.length} dòng
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition"
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto max-h-[60vh] overflow-y-auto show-scrollbar">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-slate-50 border-b border-slate-200">
              <tr>
                {["Năm", "PA", "Tên tiêu chí", "Chức danh", "ĐV tính", "Định mức", "Giờ quy đổi", ""].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-3 py-2.5 text-left font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {rows.map((r, idx) => (
                <tr key={r._key} className="hover:bg-slate-50/60 group">
                  <td className="px-2 py-1.5">
                    <input
                      value={r.year ?? ""}
                      onChange={(e) => update(idx, "year", e.target.value)}
                      className="w-16 border border-slate-200 rounded px-1.5 py-1 text-center focus:border-mainColor focus:outline-none"
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <input
                      type="number"
                      value={r.phuongAn ?? ""}
                      onChange={(e) => update(idx, "phuongAn", e.target.value ? +e.target.value : null)}
                      className="w-12 border border-slate-200 rounded px-1.5 py-1 text-center focus:border-mainColor focus:outline-none"
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <input
                      value={r.tieuChiName ?? ""}
                      onChange={(e) => update(idx, "tieuChiName", e.target.value)}
                      className="w-56 border border-slate-200 rounded px-1.5 py-1 focus:border-mainColor focus:outline-none"
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <select
                      value={r.chucDanh ?? ""}
                      onChange={(e) => update(idx, "chucDanh", e.target.value || null)}
                      className="border border-slate-200 rounded px-1.5 py-1 focus:border-mainColor focus:outline-none"
                    >
                      <option value="">—</option>
                      {CHUC_DANH.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-2 py-1.5">
                    <input
                      value={r.donViTinh ?? ""}
                      onChange={(e) => update(idx, "donViTinh", e.target.value)}
                      className="w-20 border border-slate-200 rounded px-1.5 py-1 focus:border-mainColor focus:outline-none"
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <input
                      type="number"
                      step="0.01"
                      value={r.dinhMucToiThieu ?? ""}
                      onChange={(e) => update(idx, "dinhMucToiThieu", e.target.value ? +e.target.value : null)}
                      className="w-20 border border-slate-200 rounded px-1.5 py-1 text-right focus:border-mainColor focus:outline-none"
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <input
                      type="number"
                      step="0.01"
                      value={r.gioQuyDoiPerUnit ?? ""}
                      onChange={(e) => update(idx, "gioQuyDoiPerUnit", e.target.value ? +e.target.value : null)}
                      className="w-20 border border-slate-200 rounded px-1.5 py-1 text-right focus:border-mainColor focus:outline-none"
                    />
                  </td>
                  <td className="px-0.5 py-2 cursor-pointer flex items-center justify-end gap-2">
                    <Add
                      onClick={() => insertRowAfter(idx)}
                      title="Thêm dòng sau"
                      className="opacity-0 group-hover:opacity-100 hover:bg-slate-300 p-1 text-slate-500 hover:text-slate-700 rounded hover:bg-slate-50 transition"
                    />

                    <CloseIcon
                      onClick={() => remove(idx)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-rose-200 text-rose-400 transition"
                      sx={{ fontSize: 24 }}
                    />

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
          <p className="text-xs text-slate-500 font-medium">
            <EditIcon sx={{ fontSize: 13 }} className="mr-1 text-slate-400" />
            Nhấn vào ô để chỉnh sửa trực tiếp. Hover vào dòng để xóa dòng đó.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              Hủy
            </button>
            <button
              onClick={() => onConfirm(rows)}
              disabled={saving || rows.length === 0}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-mainColor rounded-lg shadow-sm hover:brightness-110 transition disabled:opacity-60"
            >
              {saving ? (
                "Đang lưu..."
              ) : (
                <>
                  <CheckIcon sx={{ fontSize: 16 }} />
                  Xác nhận lưu {rows.length} dòng
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function ActivityYearQuotaConfigPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [yearInput, setYearInput] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("all");
  const [importing, setImporting] = useState(false);
  const [downloadingTemplate, setDownloadingTemplate] = useState(false);


  // AI scan states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [previewRows, setPreviewRows] = useState(null); // null = modal closed
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef(null);
  const debounceRef = useRef(null);
  const toast = useToast();

  const getPlanValue = (row) => (row?.phuongAn ?? "");

  const fetchData = useCallback(async (year) => {
    setLoading(true);
    setError("");
    try {
      const yearParam = year && year.toString().trim() !== "" ? year : null;
      const res = await nckhTieuChiDinhMucService.getAll(null, null, yearParam);
      setRows(res?.data ?? res ?? []);
    } catch (e) {
      setError(e?.message || "Không tải được dữ liệu định mức.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    setYearInput(currentYear);
    fetchData(currentYear);
  }, [fetchData]);

  const handleYearChange = (e) => {
    const val = e.target.value;
    setYearInput(val);
    setSelectedPlan("all");
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchData(val), 600);
  };

  const planOptions = useMemo(() => {
    const values = Array.from(
      new Set(rows.map((row) => getPlanValue(row)).filter(Boolean))
    );
    return values.sort((a, b) => a - b);
  }, [rows]);

  const filteredRows = useMemo(
    () =>
      selectedPlan === "all"
        ? rows
        : rows.filter((row) => getPlanValue(row) === selectedPlan),
    [rows, selectedPlan]
  );

  const totalMinHours = useMemo(
    () => filteredRows.reduce((sum, row) => sum + (+row.tongGioToiThieu || 0), 0),
    [filteredRows]
  );

  const handleDownloadTemplate = async () => {
    try {
      setDownloadingTemplate(true);
      const params = {};
      if (yearInput !== "") params.year = yearInput;
      if (selectedPlan !== "all") params.phuongAn = selectedPlan;
      const response = await nckhTieuChiDinhMucService.downloadImportTemplate(params);
      downloadFileFromResponse(response, "template-dinh-muc.xlsx");
      toast.success("Đã tải file mẫu.");
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
      const successCount = response.headers?.["x-import-success"] ?? 0;
      const errorCount = response.headers?.["x-import-error"] ?? 0;
      if (errorCount === 0) {
        toast.success(`Import thành công ${successCount} dòng.`);
      } else {
        toast.error(`Import xong: ${successCount} OK, ${errorCount} lỗi.`, 7000);
        downloadFileFromResponse(response, "ket-qua-import-dinh-muc.xlsx");
      }
      await fetchData(yearInput);
    } catch (e) {
      toast.error(e?.message || "Không import được file.");
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // ── AI Scan ────────────────────────────────────────────────────────────
  const handleAiScan = async (files) => {
    if (!files || files.length === 0) return;
    try {
      setScanning(true);
      toast.info("Đang gửi dữ liệu cho AI phân tích, vui lòng chờ...");
      const data = await nckhTieuChiDinhMucService.aiScan(files, yearInput);
      if (!data || data.length === 0) {
        toast.warning("AI không tìm thấy dữ liệu định mức hợp lệ trong các file này.");
        return;
      }
      setPreviewRows(data);
      setShowUploadModal(false);
    } catch (e) {
      toast.error(e?.message || "Lỗi khi quét bằng AI.");
    } finally {
      setScanning(false);
    }
  };

  const handleConfirmSave = async (editedRows) => {
    try {
      setSaving(true);
      const result = await nckhTieuChiDinhMucService.batchSave(editedRows);
      const saved = result?.data ?? result;
      toast.success(`Đã lưu ${saved} dòng từ AI scan thành công!`);
      setPreviewRows(null);
      await fetchData(yearInput);
    } catch (e) {
      toast.error(e?.message || "Lưu thất bại.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      {/* Upload Modal */}
      {showUploadModal && (
        <AiUploadModal
          onClose={() => !scanning && setShowUploadModal(false)}
          onScan={handleAiScan}
          scanning={scanning}
        />
      )}

      {/* AI Preview Modal */}
      {previewRows && (
        <AiPreviewModal
          rows={previewRows}
          onConfirm={handleConfirmSave}
          onClose={() => setPreviewRows(null)}
          saving={saving}
        />
      )}

      <div className="mx-auto max-w-7xl px-4 pt-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
            <div>
              <h1 className="text-xl font-extrabold text-slate-800">
                Chỉnh sửa định mức theo năm
              </h1>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Import Excel hoặc <b>quét tự động bằng AI</b> từ ảnh/PDF để cập nhật hàng loạt.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Tải file mẫu */}
              <button
                type="button"
                onClick={handleDownloadTemplate}
                disabled={downloadingTemplate || importing}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
              >
                {downloadingTemplate ? "Đang tải..." : "Tải file mẫu"}
              </button>

              {/* Import Excel */}
              <label
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-white shadow-sm transition cursor-pointer ${importing ? "bg-emerald-400 cursor-wait" : "bg-emerald-600 hover:bg-emerald-700"
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

              <button
                type="button"
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-white shadow-sm transition bg-violet-600 hover:bg-violet-700"
              >
                <AutoAwesomeIcon sx={{ fontSize: 16 }} />
                Quét bằng AI
              </button>
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
                          className={`group/row transition-colors duration-200 border-b border-slate-100 last:border-0 ${hasHours ? "bg-slate-50" : "hover:bg-slate-50"
                            }`}
                        >
                          <td className="py-3 px-4 text-center align-middle font-medium text-slate-500">
                            {index + 1}
                          </td>
                          <td className="py-3 px-4 text-slate-700">
                            {row.year || row.namHoc || "-"}
                          </td>
                          <td className="py-3 px-4 text-slate-700">{row.phuongAn ?? "-"}</td>
                          <td className="py-3 px-4 whitespace-normal min-w-[250px]">
                            <div className="font-semibold text-slate-800">
                              {row.tieuChiName || "-"}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-700">{row.chucDanh || "-"}</td>
                          <td className="py-3 px-4 text-slate-700">{row.donViTinh || "-"}</td>
                          <td className="py-3 px-4 text-right">
                            <span className="inline-block text-xs font-semibold text-slate-600 bg-slate-100/50 px-2.5 py-1 rounded-md">
                              {formatNumber(row.dinhMucToiThieu)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="inline-block text-xs font-semibold text-slate-600 bg-slate-100/50 px-2.5 py-1 rounded-md">
                              {formatNumber(row.gioQuyDoiPerUnit)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span
                              className={`font-black text-lg transition-colors ${hasHours ? "text-mainColor" : "text-slate-300"
                                }`}
                            >
                              {hasHours ? formatNumber(row.tongGioToiThieu) : "0"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
