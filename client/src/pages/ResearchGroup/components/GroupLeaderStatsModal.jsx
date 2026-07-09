import { useState, useEffect } from "react";
import {
  Close,
  FileDownload,
  People,
  BarChart,
  ExpandMore,
  ExpandLess,
  Insights,
  TableChart,
} from "@mui/icons-material";
import researchGroupService from "../../../services/researchGroupService";
import { useToast } from "../../../context/ToastContext";
import { downloadFileFromResponse } from "../../../utils";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

const CURRENT_YEAR = new Date().getFullYear();

const formatPct = (v) => `${Number(v || 0).toFixed(2)}%`;
const formatHours = (v) =>
  Number(v || 0).toLocaleString("vi-VN", { maximumFractionDigits: 2 });

const TABS = [
  { id: "overview", label: "Tổng quan", icon: <Insights sx={{ fontSize: 15 }} /> },
  { id: "activities", label: "Hoạt động chi tiết", icon: <People sx={{ fontSize: 15 }} /> },
  { id: "quota", label: "Định mức nhóm", icon: <TableChart sx={{ fontSize: 15 }} /> },
];

const GroupLeaderStatsModal = ({ isOpen, onClose, group, currentUserId }) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [stats, setStats] = useState(null);
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [expandedMember, setExpandedMember] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (isOpen && group) {
      setStats(null);
      fetchStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, group, selectedYear]);

  const fetchStats = async () => {
    if (!group?.id) return;
    try {
      setLoading(true);
      const res = await researchGroupService.getLeaderMemberStats(group.id, selectedYear);
      setStats(res?.data ?? res);
    } catch (err) {
      console.error("Error fetching member stats:", err);
      toast.error(err?.message || "Không tải được dữ liệu thống kê");
    } finally {
      setLoading(false);
    }
  };

  const handleExportWord = async () => {
    try {
      setExporting(true);
      const response = await researchGroupService.exportMemberWord(group.id, selectedYear);
      const filename = `DanhSachThanhVien_${group.groupName || group.id}_${selectedYear}.docx`;
      downloadFileFromResponse(response, filename);
      toast.success("Xuất Word thành công");
    } catch (err) {
      console.error("Export word error:", err);
      toast.error(err?.message || "Không thể xuất file Word");
    } finally {
      setExporting(false);
    }
  };

  if (!isOpen || !group) return null;

  const members = stats?.members ?? [];
  const groupQuota = stats?.groupQuota ?? {};
  const totalHours = stats?.totalGroupHours ?? 0;

  const years = [];
  for (let y = CURRENT_YEAR; y >= CURRENT_YEAR - 4; y--) years.push(y);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-mainColor/10 p-2 text-mainColor">
              <Insights sx={{ fontSize: 22 }} />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-800">
                Thống kê hoạt động thành viên
              </h2>
              <p className="text-xs font-medium text-slate-500">
                {group.groupName || "Nhóm NCKH"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 focus:border-mainColor focus:outline-none focus:ring-1 focus:ring-mainColor"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  Năm {y}
                </option>
              ))}
            </select>
            <button
              onClick={handleExportWord}
              disabled={exporting || loading || members.length === 0}
              className="flex items-center gap-1.5 rounded-lg bg-mainColor px-3 py-1.5 text-sm font-bold text-white hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FileDownload sx={{ fontSize: 17 }} />
              {exporting ? "Đang xuất..." : "Xuất Word"}
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 transition-colors"
            >
              <Close sx={{ fontSize: 20 }} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-slate-200 bg-slate-50 px-5">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
                activeTab === tab.id
                  ? "border-mainColor text-mainColor"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto bg-slate-50 p-5">
          {loading ? (
            <div className="flex justify-center py-16">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              {/* ── Tổng quan ── */}
              {activeTab === "overview" && (
                <div className="space-y-4">
                  {/* Summary cards */}
                  <div className="grid grid-cols-3 gap-4">
                    <MetricCard label="Số thành viên" value={members.length} />
                    <MetricCard label="Tổng giờ nhóm" value={formatHours(totalHours)} />
                    <MetricCard label="Năm học" value={selectedYear} />
                  </div>

                  {/* Members table */}
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 px-5 py-3">
                      <h3 className="text-sm font-bold text-slate-700">
                        Chi tiết thành viên — {stats?.groupName}
                      </h3>
                    </div>
                    {members.length === 0 ? (
                      <div className="py-10 text-center text-sm text-slate-500">
                        <People sx={{ fontSize: 40 }} className="mb-2 text-slate-300" />
                        <p>Chưa có dữ liệu hoạt động trong năm {selectedYear}</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead className="bg-slate-100 text-slate-700">
                            <tr>
                              {[
                                "STT",
                                "Họ và tên",
                                "Học hàm/HV",
                                "Nhiệm vụ",
                                "Đơn vị",
                                "Giờ đóng góp",
                                "% tham gia nhóm",
                              ].map((h) => (
                                <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold whitespace-nowrap">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {members.map((m, idx) => (
                              <tr key={m.userId} className="border-t border-slate-100">
                                <td className="px-3 py-2 text-slate-500">{idx + 1}</td>
                                <td className="px-3 py-2 font-semibold text-slate-800">
                                  {m.name}{" "}
                                  {m.isLeader && (
                                    <span className="text-xs text-mainColor">(Trưởng nhóm)</span>
                                  )}
                                </td>
                                <td className="px-3 py-2 text-slate-600">{m.chucDanh || "—"}</td>
                                <td className="px-3 py-2 text-slate-600">{m.role || "Thành viên"}</td>
                                <td className="px-3 py-2 text-slate-600">{m.address || "—"}</td>
                                <td className="px-3 py-2 text-right text-slate-700">
                                  {formatHours(m.contributedHours)}
                                </td>
                                <td className="px-3 py-2 text-right">
                                  <span className="font-semibold text-mainColor">
                                    {formatPct(m.participationPercent)}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── Hoạt động chi tiết ── */}
              {activeTab === "activities" && (
                <div className="space-y-3">
                  {members.length === 0 ? (
                    <div className="rounded-xl border border-slate-200 bg-white py-10 text-center text-sm text-slate-500">
                      Chưa có dữ liệu hoạt động
                    </div>
                  ) : (
                    members.map((m, idx) => {
                      const activities = m.activities ?? [];
                      const isExpanded = expandedMember === m.userId;
                      return (
                        <div
                          key={m.userId}
                          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                        >
                          <button
                            type="button"
                            onClick={() => setExpandedMember(isExpanded ? null : m.userId)}
                            className="flex w-full items-center justify-between px-5 py-3 hover:bg-slate-50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-mainColor/10 text-sm font-bold text-mainColor">
                                {idx + 1}
                              </div>
                              <div className="text-left">
                                <p className="text-sm font-semibold text-slate-800">
                                  {m.name}{" "}
                                  {m.isLeader && (
                                    <span className="text-xs text-mainColor">(Trưởng nhóm)</span>
                                  )}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {m.chucDanh || "—"} · {m.role || "Thành viên"} · {m.address || "—"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-5">
                              <div className="text-right">
                                <p className="text-xs text-slate-400">% tham gia</p>
                                <p className="text-sm font-bold text-mainColor">
                                  {formatPct(m.participationPercent)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-slate-400">Giờ đóng góp</p>
                                <p className="text-sm font-bold text-emerald-600">
                                  {formatHours(m.contributedHours)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-slate-400">Khai báo</p>
                                <p className="text-sm font-bold text-slate-700">
                                  {activities.length} HĐ
                                </p>
                              </div>
                              {isExpanded ? (
                                <ExpandLess sx={{ fontSize: 20 }} className="text-slate-400" />
                              ) : (
                                <ExpandMore sx={{ fontSize: 20 }} className="text-slate-400" />
                              )}
                            </div>
                          </button>

                          {isExpanded && (
                            <div className="border-t border-slate-100 px-5 py-3">
                              {activities.length === 0 ? (
                                <p className="py-2 text-sm text-slate-400">
                                  Chưa có hoạt động được duyệt trong năm {selectedYear}.
                                </p>
                              ) : (
                                <div className="overflow-x-auto">
                                  <table className="min-w-full text-xs">
                                    <thead>
                                      <tr className="bg-slate-50 text-slate-600">
                                        <th className="px-3 py-2 text-left font-semibold">STT</th>
                                        <th className="px-3 py-2 text-left font-semibold">Tên hoạt động</th>
                                        <th className="px-3 py-2 text-left font-semibold">Loại</th>
                                        <th className="px-3 py-2 text-right font-semibold">SL quy đổi</th>
                                        <th className="px-3 py-2 text-right font-semibold">Giờ quy đổi</th>
                                        <th className="px-3 py-2 text-right font-semibold">Ngày</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {activities.map((act, aIdx) => (
                                        <tr
                                          key={act.activityId || aIdx}
                                          className="border-t border-slate-100"
                                        >
                                          <td className="px-3 py-2 text-slate-400">{aIdx + 1}</td>
                                          <td
                                            className="max-w-[260px] truncate px-3 py-2 font-medium text-slate-800"
                                            title={act.title}
                                          >
                                            {act.title || act.catalogName || "—"}
                                          </td>
                                          <td className="px-3 py-2 text-slate-600">
                                            <span className="rounded bg-mainColor/10 px-1.5 py-0.5 text-xs text-mainColor">
                                              {act.catalogName || act.catalogCode}
                                            </span>
                                          </td>
                                          <td className="px-3 py-2 text-right text-slate-700">
                                            {Number(act.equivQty ?? 0).toFixed(2)}
                                          </td>
                                          <td className="px-3 py-2 text-right font-semibold text-emerald-600">
                                            {Number(act.hoursShare ?? 0).toFixed(2)}
                                          </td>
                                          <td className="px-3 py-2 text-right text-slate-500">
                                            {act.activityDate
                                              ? new Date(act.activityDate).toLocaleDateString("vi-VN")
                                              : "—"}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                    <tfoot>
                                      <tr className="border-t border-slate-200 bg-slate-50">
                                        <td colSpan={3} className="px-3 py-2 text-right text-xs font-bold text-slate-600">
                                          Tổng
                                        </td>
                                        <td className="px-3 py-2 text-right text-xs font-bold text-slate-700">
                                          {activities
                                            .reduce((s, a) => s + (a.equivQty ?? 0), 0)
                                            .toFixed(2)}
                                        </td>
                                        <td className="px-3 py-2 text-right text-xs font-bold text-emerald-600">
                                          {activities
                                            .reduce((s, a) => s + (a.hoursShare ?? 0), 0)
                                            .toFixed(2)}
                                        </td>
                                        <td />
                                      </tr>
                                    </tfoot>
                                  </table>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* ── Định mức nhóm ── */}
              {activeTab === "quota" && (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-100 px-5 py-3">
                    <h3 className="text-sm font-bold text-slate-700">
                      Định mức nhiệm vụ KH&amp;CN — {stats?.groupName}
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Tổng định mức yêu cầu của các thành viên theo từng tiêu chí
                    </p>
                  </div>
                  {Object.keys(groupQuota).length === 0 ? (
                    <div className="py-10 text-center text-sm text-slate-500">
                      Không có dữ liệu định mức
                    </div>
                  ) : (
                    <div className="overflow-x-auto p-4">
                      <table className="min-w-full border border-slate-200 text-xs">
                        <thead>
                          <tr className="bg-slate-100">
                            {Object.keys(groupQuota).map((code) => (
                              <th
                                key={code}
                                className="whitespace-nowrap border border-slate-200 px-3 py-2 text-center text-xs font-semibold text-slate-700"
                              >
                                {code.replace(/_/g, " ")}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="bg-white">
                            {Object.values(groupQuota).map((val, i) => (
                              <td
                                key={i}
                                className="border border-slate-200 px-3 py-2 text-center font-semibold text-slate-800"
                              >
                                {typeof val === "number"
                                  ? val.toLocaleString("vi-VN")
                                  : val}
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-3">
          <p className="text-xs text-slate-400">
            Dữ liệu hoạt động đã được duyệt · Năm {selectedYear}
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleExportWord}
              disabled={exporting || loading || members.length === 0}
              className="flex items-center gap-1.5 rounded-lg bg-mainColor px-4 py-2 text-sm font-bold text-white hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FileDownload sx={{ fontSize: 17 }} />
              {exporting ? "Đang xuất..." : "Xuất Word"}
            </button>
            <button
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function MetricCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="text-xl font-extrabold text-slate-800">{value ?? "—"}</p>
    </div>
  );
}

export default GroupLeaderStatsModal;
