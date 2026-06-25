import { useEffect, useMemo, useRef, useState } from "react";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { useToast } from "../../context/ToastContext";
import nckhPlanService from "../../services/nckhPlanService";
import { PLAN_OPTIONS } from "../../utils/data.js";
import { downloadFileFromResponse } from "../../utils/helpers";
import Pagination from "../../components/common/Pagination";

const ITEMS_PER_PAGE = 20;

export default function PlanStatisticsPage() {
  const toast = useToast();
  const toastRef = useRef(toast);
  const academicYear = new Date().getFullYear();

  const [reportYear, setReportYear] = useState(academicYear);
  const [planStatsRows, setPlanStatsRows] = useState([]);
  const [planStatsCounts, setPlanStatsCounts] = useState({});
  const [planStatsMeta, setPlanStatsMeta] = useState({
    totalUsers: 0,
    selectedUsers: 0,
  });
  const [planStatsLoading, setPlanStatsLoading] = useState(false);
  const [exportingPlanStats, setExportingPlanStats] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    toastRef.current = toast;
  }, [toast]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setPlanStatsLoading(true);
      try {
        const res = await nckhPlanService.getPlanStatistics(reportYear);
        if (cancelled) return;

        const payload = res?.data ?? res ?? {};
        setPlanStatsRows(payload.rows ?? []);
        setPlanStatsCounts(payload.planCounts ?? {});
        setPlanStatsMeta({
          totalUsers: payload.totalUsers ?? 0,
          selectedUsers: payload.selectedUsers ?? 0,
        });
      } catch (e) {
        if (cancelled) return;
        toastRef.current?.error(e?.message || "Không thể tải thống kê phương án");
      } finally {
        if (!cancelled) setPlanStatsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [reportYear]);

  useEffect(() => {
    setCurrentPage(0);
  }, [reportYear]);

  const planLabelById = useMemo(() => {
    return PLAN_OPTIONS.reduce((acc, item) => {
      acc[item.id] = item.label;
      return acc;
    }, {});
  }, []);

  const totalUsers = planStatsMeta.totalUsers || 0;
  const pieColors = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#F43F5E",
    "#8B5CF6",
    "#06B6D4",
  ];

  const pieData = useMemo(() => {
    return PLAN_OPTIONS.map((opt, idx) => {
      const value = planStatsCounts?.[opt.id] ?? 0;
      return {
        id: opt.id,
        name: `PA${opt.id}`,
        fullLabel: opt.label,
        value,
        percent: totalUsers > 0 ? (value / totalUsers) * 100 : 0,
        color: pieColors[idx % pieColors.length],
      };
    });
  }, [planStatsCounts, totalUsers]);

  const totalSelectedByPlan = useMemo(
    () => pieData.reduce((sum, item) => sum + item.value, 0),
    [pieData],
  );

  const totalItems = planStatsRows.length;
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;

  const paginatedRows = useMemo(() => {
    return planStatsRows.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [planStatsRows, startIndex]);

  const endIndex = Math.min(startIndex + paginatedRows.length, totalItems);

  useEffect(() => {
    if (totalPages === 0) {
      if (currentPage !== 0) setCurrentPage(0);
      return;
    }
    if (currentPage > totalPages - 1) {
      setCurrentPage(totalPages - 1);
    }
  }, [currentPage, totalPages]);

  const goToPage = (page) => {
    setCurrentPage(page - 1);

  };

  const goToFirstPage = () => {
    setCurrentPage(0);

  };

  const goToLastPage = () => {
    if (totalPages <= 0) return;
    setCurrentPage(totalPages - 1);

  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));

  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, Math.max(totalPages - 1, 0)));

  };

  const getPageNumbers = () => {
    const pages = [];
    const delta = 2;
    const displayCurrentPage = currentPage + 1;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);
    let start = Math.max(2, displayCurrentPage - delta);
    let end = Math.min(totalPages - 1, displayCurrentPage + delta);

    if (displayCurrentPage <= delta + 2) {
      end = Math.min(5, totalPages - 1);
    }
    if (displayCurrentPage >= totalPages - delta - 1) {
      start = Math.max(totalPages - 4, 2);
    }

    if (start > 2) pages.push("...");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push("...");
    pages.push(totalPages);

    return pages;
  };

  const handleExportPlanStatistics = async () => {
    try {
      setExportingPlanStats(true);
      const response = await nckhPlanService.exportPlanStatisticsExcel(reportYear);
      downloadFileFromResponse(response, `ThongKePhuongAnNCKH_${reportYear}.xlsx`);
      toast.success("Đã xuất Excel thống kê phương án");
    } catch (e) {
      toast.error(e?.message || "Xuất Excel thống kê thất bại");
    } finally {
      setExportingPlanStats(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <section
          id="plan-stats"
          className="bg-white rounded-2xl border border-slate-200 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] p-5"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
            <div>
              <h2 className="text-base font-extrabold text-slate-800">
                Thống kê chọn phương án theo cán bộ
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Tổng hợp danh sách user đã chọn PA1 đến PA6 theo năm học.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <input
                type="number"
                value={reportYear}
                onChange={(e) =>
                  setReportYear(e.target.value || academicYear)
                }
                className="w-28 py-2 px-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainColor text-sm"
                placeholder="Năm"
              />
              <button
                type="button"
                onClick={handleExportPlanStatistics}
                disabled={exportingPlanStats || planStatsLoading}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-white bg-mainColor text-sm font-semibold hover:brightness-110 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <FileDownloadIcon sx={{ fontSize: 16 }} />
                {exportingPlanStats ? "Đang xuất..." : "Xuất Excel"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                Tổng Cán bộ
              </p>
              <p className="text-xl font-black text-slate-800">
                {planStatsMeta.totalUsers}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                Đã chọn
              </p>
              <p className="text-xl font-black text-emerald-700">
                {planStatsMeta.selectedUsers}
              </p>
            </div>
            {PLAN_OPTIONS.map((opt) => (
              <div
                key={opt.id}
                className="rounded-xl border border-slate-200 bg-slate-50 p-3"
              >
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                  PA{opt.id}
                </p>
                <p className="text-xl font-black text-mainColor">
                  {planStatsCounts?.[opt.id] ?? 0}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 mb-4">
            <h3 className="text-sm font-bold text-slate-700 mb-4">
              Biểu đồ tròn tỷ lệ chọn phương án
            </h3>

            {totalSelectedByPlan === 0 ? (
              <p className="text-sm text-slate-500 italic">
                Không có dữ liệu .
              </p>
            ) : (
              <div className="w-full h-[340px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="36%"
                      cy="50%"
                      outerRadius={110}
                      innerRadius={56}
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent).toFixed(1)}%`
                      }
                    >
                      {pieData.map((entry) => (
                        <Cell key={entry.id} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, _name, item) => {
                        const payload = item?.payload;
                        return [
                          `${value} người (${payload?.percent?.toFixed?.(1) || "0.0"}%)`,
                          payload?.fullLabel || "Phương án",
                        ];
                      }}
                    />
                    <Legend
                      layout="vertical"
                      align="right"
                      verticalAlign="middle"
                      formatter={(value, entry) => {
                        const payload = entry?.payload;
                        return `${value}: ${payload?.value ?? 0} người (${payload?.percent?.toFixed?.(1) || "0.0"}%)`;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="min-w-[980px] w-full text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-3 py-2 border-b border-slate-200 text-center w-14">
                    STT
                  </th>
                  <th className="px-3 py-2 border-b border-slate-200 text-left">
                    Họ tên
                  </th>
                  <th className="px-3 py-2 border-b border-slate-200 text-left">
                    Mã cán bộ
                  </th>
                  <th className="px-3 py-2 border-b border-slate-200 text-center">
                    PA1 (Định mức chuẩn)
                  </th>
                  <th className="px-3 py-2 border-b border-slate-200 text-center">
                    PA2
                  </th>
                  <th className="px-3 py-2 border-b border-slate-200 text-center">
                    PA3
                  </th>
                  <th className="px-3 py-2 border-b border-slate-200 text-center">
                    PA4
                  </th>
                  <th className="px-3 py-2 border-b border-slate-200 text-center">
                    PA5
                  </th>
                  <th className="px-3 py-2 border-b border-slate-200 text-center">
                    PA6
                  </th>
                  <th className="px-3 py-2 border-b border-slate-200 text-left">
                    Ghi chú
                  </th>
                </tr>
              </thead>
              <tbody>
                {planStatsLoading ? (
                  <tr>
                    <td colSpan={10} className="text-center py-8 text-slate-500">
                      Đang tải thống kê...
                    </td>
                  </tr>
                ) : planStatsRows.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center py-8 text-slate-500">
                      Không có dữ liệu thống kê cho năm {reportYear}.
                    </td>
                  </tr>
                ) : (
                  paginatedRows.map((row) => (
                    <tr key={row.userId} className="odd:bg-white even:bg-slate-50/50">
                      <td className="px-3 py-2 border-b border-slate-100 text-center">
                        {row.stt}
                      </td>
                      <td className="px-3 py-2 border-b border-slate-100 font-medium text-slate-700">
                        {row.fullName || "-"}
                      </td>
                      <td className="px-3 py-2 border-b border-slate-100 text-slate-600">
                        {row.staffCode || "-"}
                      </td>
                      <td className="px-3 py-2 border-b border-slate-100 text-center font-bold">
                        {row.pa1 ? "x" : ""}
                      </td>
                      <td className="px-3 py-2 border-b border-slate-100 text-center font-bold">
                        {row.pa2 ? "x" : ""}
                      </td>
                      <td className="px-3 py-2 border-b border-slate-100 text-center font-bold">
                        {row.pa3 ? "x" : ""}
                      </td>
                      <td className="px-3 py-2 border-b border-slate-100 text-center font-bold">
                        {row.pa4 ? "x" : ""}
                      </td>
                      <td className="px-3 py-2 border-b border-slate-100 text-center font-bold">
                        {row.pa5 ? "x" : ""}
                      </td>
                      <td className="px-3 py-2 border-b border-slate-100 text-center font-bold">
                        {row.pa6 ? "x" : ""}
                      </td>
                      <td className={`px-3 py-2 border-b border-slate-100 ${row.planId ? 'text-green-600' : 'text-red-500'}`}>
                        {row.planId
                          ? `Đã chọn ${planLabelById[row.planId] || `PA${row.planId}`}`
                          : "Chưa chọn"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!planStatsLoading && totalItems > 0 && (
            <div className="mt-3 w-full bg-white rounded-md justify-center sm:justify-end">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={ITEMS_PER_PAGE}
                startIndex={startIndex}
                endIndex={endIndex}
                onPageChange={goToPage}
                onFirstPage={goToFirstPage}
                onLastPage={goToLastPage}
                onPreviousPage={goToPreviousPage}
                onNextPage={goToNextPage}
                getPageNumbers={getPageNumbers}
                itemName="cán bộ"
                className="px-0"
              />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
