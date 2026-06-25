import { useCallback, useEffect, useMemo, useState } from "react";
import GroupIcon from "@mui/icons-material/Group";
import InsightsIcon from "@mui/icons-material/Insights";
import BarChartIcon from "@mui/icons-material/BarChart";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import groupQuotaService from "../../services/groupQuotaService";
import SchemeComparisonChart from "./components/SchemeComparisonChart";

const currentYear = new Date().getFullYear();

const formatPct = (v) => `${Number(v || 0).toFixed(2)}%`;
const formatHours = (v) => Number(v || 0).toLocaleString("vi-VN", { maximumFractionDigits: 2 });

export default function AdminGroupQuotaStatsPage() {
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [year, setYear] = useState(currentYear);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingScheme, setLoadingScheme] = useState(false);
  const [stats, setStats] = useState(null);
  const [schemeComparison, setSchemeComparison] = useState(null);
  const [error, setError] = useState("");

  const selectedGroup = useMemo(
    () => groups.find((g) => String(g.groupId) === String(selectedGroupId)),
    [groups, selectedGroupId]
  );

  const loadGroups = useCallback(async () => {
    try {
      setLoadingGroups(true);
      const data = await groupQuotaService.getManageableGroups();
      const rows = data?.groups || [];
      setGroups(rows);
      if (rows.length > 0) {
        setSelectedGroupId(String(rows[0].groupId));
      }
    } catch (e) {
      setError(e.message || "Không tải được danh sách nhóm.");
    } finally {
      setLoadingGroups(false);
    }
  }, []);

  const loadSchemeComparison = useCallback(async () => {
    try {
      setLoadingScheme(true);
      const data = await groupQuotaService.getAdminSchemeComparison(Number(year));
      setSchemeComparison(data);
    } catch (e) {
      setSchemeComparison(null);
      console.error("Scheme comparison error:", e);
    } finally {
      setLoadingScheme(false);
    }
  }, [year]);

  const loadStats = useCallback(async () => {
    if (!selectedGroupId) return;
    try {
      setError("");
      setLoadingStats(true);
      const data = await groupQuotaService.getAdminGroupStats(Number(selectedGroupId), Number(year));
      setStats(data);
    } catch (e) {
      setStats(null);
      setError(e.message || "Không tải được thống kê nhóm.");
    } finally {
      setLoadingStats(false);
    }
  }, [selectedGroupId, year]);

  const loadAll = useCallback(() => {
    loadSchemeComparison();
    loadStats();
  }, [loadSchemeComparison, loadStats]);

  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  useEffect(() => {
    loadSchemeComparison();
  }, [loadSchemeComparison]);

  useEffect(() => {
    if (selectedGroupId) loadStats();
  }, [selectedGroupId, loadStats]);

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      <div className="mx-auto max-w-7xl px-4 pt-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-mainColor/10 p-3 text-mainColor">
              <InsightsIcon sx={{ fontSize: 28 }} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-800">Thống kê hoàn thành định mức nhóm</h1>
              <p className="mt-1 text-sm font-medium text-slate-500">
                So sánh 3 phương án nhóm (NCM / Xuất sắc / Tinh hoa) và theo dõi đóng góp từng thành viên.
              </p>
            </div>
          </div>
        </div>



        {error && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {(loadingGroups || loadingStats) && (
          <div className="mt-6 flex justify-center">
            <LoadingSpinner />
          </div>
        )}

        {!loadingGroups && groups.length === 0 && (
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-6 text-center text-sm text-amber-800">
            Bạn chưa có quyền xem thống kê nhóm nào.
          </div>
        )}

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <BarChartIcon className="text-mainColor" />
            <div>
              <h2 className="text-base font-bold text-slate-800">
                So sánh 3 phương án nhóm — năm {schemeComparison?.academicYear ?? year}
              </h2>
              <p className="text-xs text-slate-500">
                Cột: số thành viên tham gia · Đường: % hoàn thành định mức tập thể
                {schemeComparison?.asStaff
                  ? " (toàn khoa)"
                  : " (các nhóm bạn quản lý)"}
              </p>
            </div>
          </div>
          <SchemeComparisonChart
            data={schemeComparison?.schemes || []}
            loading={loadingScheme}
          />
          {schemeComparison?.schemes?.length > 0 && (
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {schemeComparison.schemes.map((row) => (
                <div
                  key={row.scheme}
                  className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm"
                >
                  <p className="font-bold text-slate-800">{row.schemeLabel}</p>
                  <p className="mt-1 text-slate-600">{row.memberCount} thành viên</p>
                  <p className="mt-1 font-semibold text-amber-600">
                    {formatPct(row.completionPercent)} hoàn thành
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-[260px]">
              <label className="mb-1 block text-xs font-semibold text-slate-500">Nhóm nghiên cứu</label>
              <select
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                disabled={loadingGroups || groups.length === 0}
              >
                {groups.map((g) => (
                  <option key={g.groupId} value={g.groupId}>
                    {g.groupName} ({g.groupType})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">Năm học</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-32 rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <button
              type="button"
              onClick={loadAll}
              disabled={!selectedGroupId || loadingStats || loadingScheme}
              className="rounded-lg bg-mainColor px-4 py-2 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-50"
            >
              Xem thống kê
            </button>
          </div>
        </div>

        {!loadingStats && stats && (
          <>
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-5">
              <MetricCard label="Nhóm" value={stats.groupName} icon={<GroupIcon />} />
              <MetricCard label="% hoàn thành nhóm" value={formatPct(stats.groupCompletionPercent)} />
              <MetricCard label="ĐM chuẩn nhóm" value={formatHours(stats.groupRequiredTotalHours)} />
              <MetricCard label="Tổng giờ nhóm" value={formatHours(stats.groupActualTotalHours)} />
              <MetricCard label="Số thành viên" value={stats.memberCount} />
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-4 py-3">
                <h3 className="text-sm font-bold text-slate-700">
                  Chi tiết thành viên — {stats.groupName}
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-100 text-slate-700">
                    <tr>
                      <th className="px-3 py-2 text-left">Thành viên</th>
                      <th className="px-3 py-2 text-left">Chức danh</th>
                      <th className="px-3 py-2 text-right">Giờ đóng góp</th>
                      <th className="px-3 py-2 text-right">% tham gia nhóm</th>
                      <th className="px-3 py-2 text-right">Nhóm đạt định mức</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.members?.map((m) => (
                      <tr key={m.userId} className="border-t border-slate-100">
                        <td className="px-3 py-2 font-semibold text-slate-800">
                          {m.name}{" "}
                          {m.isLeader ? (
                            <span className="text-xs text-mainColor">(Trưởng nhóm)</span>
                          ) : null}
                        </td>
                        <td className="px-3 py-2 text-slate-600">{m.chucDanh || "-"}</td>
                        <td className="px-3 py-2 text-right text-slate-700">
                          {formatHours(m.contributedHours ?? m.creditedHours)}
                        </td>
                        <td className="px-3 py-2 text-right font-semibold text-indigo-600">
                          {formatPct(m.participationPercent)}
                        </td>
                        <td className="px-3 py-2 text-right">
                          {(stats.groupQuotaAchieved ?? m.overallAchieved) ? (
                            <span className="font-semibold text-emerald-600">Đạt</span>
                          ) : (
                            <span className="text-rose-500">Chưa đạt</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {!loadingStats && !stats && selectedGroup && !error && (
          <div className="mt-6 rounded-xl border border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-500">
            Chọn nhóm và nhấn &quot;Xem thống kê&quot; để tải dữ liệu chi tiết.
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon = null }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center gap-2 text-slate-500">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-lg font-extrabold text-slate-800">{value ?? "-"}</p>
    </div>
  );
}
