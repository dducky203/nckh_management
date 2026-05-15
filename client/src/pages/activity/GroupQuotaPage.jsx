import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import GroupsIcon from "@mui/icons-material/Groups";
import CalculateIcon from "@mui/icons-material/Calculate";
import TableChartIcon from "@mui/icons-material/TableChart";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PersonIcon from "@mui/icons-material/Person";
import StarIcon from "@mui/icons-material/Star";

import groupQuotaService from "../../services/groupQuotaService";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useToast } from "../../context/ToastContext";

const GROUP_TYPE_CONFIG = {
  NCM: {
    label: "Nhóm Nghiên cứu mạnh (NCM)",
    shortLabel: "NCM",
    badge: "bg-blue-100 text-blue-700 border-blue-200",
    accent: "blue",
    desc: "Phương án 1 — Hệ số 0,8 — Bảng 2",
    tableName: "Bảng 2",
  },
  XUAT_SAC: {
    label: "Nhóm Nghiên cứu xuất sắc",
    shortLabel: "Xuất sắc",
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    accent: "amber",
    desc: "2 tiêu chí cho thành viên — Bảng 3",
    tableName: "Bảng 3",
  },
  TINH_HOA: {
    label: "Nhóm Nghiên cứu tinh hoa",
    shortLabel: "Tinh hoa",
    badge: "bg-purple-100 text-purple-700 border-purple-200",
    accent: "purple",
    desc: "2 tiêu chí cho thành viên — Bảng 4",
    tableName: "Bảng 4",
  },
};

const CHUC_DANH_LABELS = {
  GS_PGS: "GS/PGS",
  TS: "TS",
  THS: "ThS",
  KS_CN: "KS/CN",
};

function getTypeConfig(type) {
  if (!type) return null;
  const up = type.toUpperCase();
  if (up.includes("TINH_HOA")) return GROUP_TYPE_CONFIG.TINH_HOA;
  if (up.includes("XUAT_SAC")) return GROUP_TYPE_CONFIG.XUAT_SAC;
  if (up.includes("NCM")) return GROUP_TYPE_CONFIG.NCM;
  return null;
}

function round2(x) {
  return Math.round(x * 100) / 100;
}

function mapChucDanhToKey(chucDanh) {
  if (!chucDanh) return "KS_CN";
  const up = chucDanh.toUpperCase().replace(/\s/g, "");
  if (up.includes("GS") || up.includes("PGS")) return "GS_PGS";
  if (up.includes("TS") || up.includes("TIẾNSĨ")) return "TS";
  if (up.includes("THS") || up.includes("THẠCSĨ")) return "THS";
  return "KS_CN";
}

const TABS = [
  { id: "matrix", label: "Bảng định mức", icon: TableChartIcon },
  { id: "calculator", label: "Tính định mức", icon: CalculateIcon },
  { id: "members", label: "Thành viên", icon: PeopleIcon },
];

export default function GroupQuotaPage() {
  const toast = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("matrix");
  const [loading, setLoading] = useState(true);

  const [quota, setQuota] = useState(null);
  const [matrix, setMatrix] = useState(null);
  const [membersData, setMembersData] = useState(null);

  const [quantities, setQuantities] = useState({});
  const [calcResult, setCalcResult] = useState(null);
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [quotaRes, matrixRes, membersRes] = await Promise.all([
          groupQuotaService.getMyQuota(),
          groupQuotaService.getCriteriaMatrix(),
          groupQuotaService.getGroupMembers(),
        ]);
        if (cancelled) return;

        setQuota(quotaRes);
        setMatrix(matrixRes);
        setMembersData(membersRes);

        if (quotaRes?.criteria) {
          const init = {};
          quotaRes.criteria.forEach((c) => { init[c.code] = 0; });
          setQuantities(init);
        }
      } catch (e) {
        if (!cancelled) toast.error(e?.message || "Không tải được dữ liệu định mức nhóm");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCalculate = useCallback(async () => {
    if (!quota) return;
    const nonZero = Object.fromEntries(
      Object.entries(quantities).filter(([, v]) => v > 0)
    );
    if (Object.keys(nonZero).length === 0) {
      toast.error("Vui lòng nhập số lượng cho ít nhất một tiêu chí");
      return;
    }
    setCalculating(true);
    try {
      const data = await groupQuotaService.calculateMyGroup(nonZero);
      setCalcResult(data);
    } catch (e) {
      toast.error(e?.message || "Lỗi khi tính định mức");
    } finally {
      setCalculating(false);
    }
  }, [quota, quantities, toast]);

  const typeConfig = quota ? getTypeConfig(quota.groupType) : null;
  const myChucDanhKey = quota ? mapChucDanhToKey(quota.chucDanh) : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!quota) {
    return (
      <div className="min-h-screen bg-slate-50 pb-24 font-sans">
        <PageHeader navigate={navigate} />
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
            <GroupsIcon sx={{ fontSize: 48 }} className="text-slate-200 mb-4" />
            <p className="text-base font-semibold text-slate-500">
              Bạn chưa tham gia nhóm nghiên cứu NCM / Xuất sắc / Tinh hoa nào.
            </p>
            <p className="text-sm text-slate-400 mt-2">
              Liên hệ quản trị viên để được thêm vào nhóm nghiên cứu.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans">
      <PageHeader navigate={navigate} />

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-5">
        {/* Group Info Card */}
        <GroupInfoCard quota={quota} typeConfig={typeConfig} />

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex border-b border-slate-100">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-bold transition-all
                    ${isActive
                      ? "text-mainColor border-b-2 border-mainColor bg-mainColor/5"
                      : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                    }`}
                >
                  <Icon sx={{ fontSize: 18 }} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="p-0">
            {activeTab === "matrix" && (
              <MatrixTab matrix={matrix} typeConfig={typeConfig} myChucDanhKey={myChucDanhKey} />
            )}
            {activeTab === "calculator" && (
              <CalculatorTab
                quota={quota}
                quantities={quantities}
                setQuantities={setQuantities}
                calcResult={calcResult}
                setCalcResult={setCalcResult}
                calculating={calculating}
                handleCalculate={handleCalculate}
              />
            )}
            {activeTab === "members" && (
              <MembersTab membersData={membersData} typeConfig={typeConfig} quota={quota} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PageHeader({ navigate }) {
  return (
    <div className="bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition"
        >
          <ArrowBackIcon sx={{ fontSize: 20 }} />
        </button>
        <div className="w-1 h-8 rounded-full bg-mainColor hidden md:block" />
        <div>
          <h1 className="text-base font-extrabold text-slate-800 leading-tight">
            Định mức nhóm nghiên cứu
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Tính giờ quy đổi theo tiêu chí nhóm NCM / Xuất sắc / Tinh hoa
          </p>
        </div>
      </div>
    </div>
  );
}

function GroupInfoCard({ quota, typeConfig }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-mainColor/10 flex items-center justify-center">
            <GroupsIcon sx={{ fontSize: 22 }} className="text-mainColor" />
          </div>
          <div>
            <p className="text-base font-extrabold text-slate-800">{quota.groupName}</p>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              {quota.memberCount} thành viên
            </p>
          </div>
        </div>
        {typeConfig && (
          <div className="flex flex-col items-start sm:items-end gap-1">
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${typeConfig.badge}`}>
              {typeConfig.label}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">{typeConfig.desc}</span>
          </div>
        )}
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <InfoPill label="Vai trò" value={quota.isLeader ? "Trưởng nhóm" : "Thành viên"} />
        <InfoPill label="Chức danh" value={quota.chucDanh} />
        <InfoPill label="Số thành viên" value={quota.memberCount} />
      </div>
    </div>
  );
}

function InfoPill({ label, value }) {
  return (
    <div className="bg-slate-50 rounded-lg px-3 py-1.5">
      <span className="text-slate-400 font-medium text-xs">{label}: </span>
      <span className="font-bold text-slate-700 text-xs">{value}</span>
    </div>
  );
}

/* ============================================================
   TAB 1: BẢNG ĐỊNH MỨC (Matrix)
   ============================================================ */
function MatrixTab({ matrix, typeConfig, myChucDanhKey }) {
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
      {/* Header info */}
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

      {/* Matrix table */}
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
                    ${cd === myChucDanhKey
                      ? "text-mainColor bg-mainColor/5"
                      : "text-slate-500"
                    }`}
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
                className={`transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/30"} hover:bg-blue-50/30`}
              >
                <td className="px-4 py-3 font-medium text-slate-700 text-[13px] sticky left-0 bg-inherit z-10">
                  {row.name}
                </td>
                <td className="px-3 py-3 text-center">
                  {row.isGroupLevel ? (
                    <span className="inline-block text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-2 py-1 leading-tight">
                      {row.groupQuota}
                    </span>
                  ) : (
                    <span className="text-slate-300 text-xs">—</span>
                  )}
                </td>
                {chucDanhs.map((cd) => {
                  const coeff = row.coefficients?.[cd];
                  const isMyCol = cd === myChucDanhKey;
                  const hasValue = coeff !== undefined && coeff !== null && coeff > 0;

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
                        <span className={`inline-block text-xs font-bold px-2 py-1 rounded-lg
                          ${isMyCol
                            ? "bg-mainColor/10 text-mainColor"
                            : "bg-slate-100 text-slate-700"
                          }`}
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

      {/* Legend */}
      <div className="px-5 py-3 bg-slate-50/50 flex flex-wrap gap-4 text-[11px] text-slate-400">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-mainColor/10 border border-mainColor/20 inline-block" />
          Hệ số của bạn
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-emerald-50 border border-emerald-200 inline-block" />
          Định mức cấp nhóm
        </span>
        <span>— = Không áp dụng</span>
      </div>
    </div>
  );
}

/* ============================================================
   TAB 2: TÍNH ĐỊNH MỨC (Calculator)
   ============================================================ */
function CalculatorTab({
  quota, quantities, setQuantities,
  calcResult, setCalcResult,
  calculating, handleCalculate,
}) {
  if (!quota?.criteria) {
    return (
      <div className="p-8 text-center text-slate-400 text-sm">
        Không có dữ liệu tiêu chí
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100">
      <div className="px-5 py-4 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <CalculateIcon sx={{ fontSize: 18 }} className="text-mainColor" />
          <h3 className="text-sm font-bold text-slate-800">Tính định mức cá nhân</h3>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Nhập số lượng hoạt động thực tế để tính giờ quy đổi theo hệ số nhóm của bạn ({quota.chucDanh})
        </p>
      </div>

      {/* Input table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-[45%]">
                Tiêu chí
              </th>
              <th className="text-center px-3 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Đơn vị
              </th>
              <th className="text-center px-3 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Hệ số
              </th>
              <th className="text-center px-3 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Số lượng
              </th>
              <th className="text-center px-3 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Giờ quy đổi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {quota.criteria.map((c) => {
              const qty = quantities[c.code] ?? 0;
              const serverItem = calcResult?.items?.find((i) => i.code === c.code);
              const displayHours = serverItem ? round2(serverItem.hours) : round2(qty * c.coefficient);
              const hasCoeff = c.coefficient > 0;

              return (
                <tr
                  key={c.code}
                  className={`hover:bg-slate-50/50 transition-colors ${!hasCoeff ? "opacity-40" : ""}`}
                >
                  <td className="px-4 py-3 font-medium text-slate-700 text-[13px]">{c.name}</td>
                  <td className="px-3 py-3 text-center text-slate-500 text-xs">{c.unit}</td>
                  <td className="px-3 py-3 text-center">
                    {hasCoeff ? (
                      <span className="inline-block bg-mainColor/10 text-mainColor font-bold text-xs px-2 py-1 rounded-lg">
                        {c.coefficient}
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
                        step="1"
                        value={qty}
                        onChange={(e) => {
                          setQuantities((prev) => ({
                            ...prev,
                            [c.code]: Math.max(0, Number(e.target.value)),
                          }));
                          setCalcResult(null);
                        }}
                        className="w-20 mx-auto block text-center border border-slate-200 rounded-lg py-1.5 text-sm font-semibold text-slate-700 focus:outline-none focus:border-mainColor focus:ring-1 focus:ring-mainColor/30"
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

      {/* Total + Calculate */}
      <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          {calcResult && (
            <div className="flex items-center gap-3">
              <CheckCircleIcon sx={{ fontSize: 20 }} className="text-emerald-500" />
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Tổng giờ quy đổi
                </p>
                <span className="text-3xl font-black text-mainColor">
                  {round2(calcResult.totalHours)}
                </span>
                <span className="text-sm font-bold text-slate-400 ml-1">giờ</span>
              </div>
            </div>
          )}
        </div>
        <button
          onClick={handleCalculate}
          disabled={calculating}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-mainColor text-white text-sm font-bold shadow-sm hover:brightness-110 transition disabled:opacity-60"
        >
          <CalculateIcon sx={{ fontSize: 18 }} />
          {calculating ? "Đang tính..." : "Tính định mức"}
        </button>
      </div>

      {/* Detail result */}
      {calcResult?.items?.length > 0 && (
        <div className="divide-y divide-slate-50">
          <div className="px-5 py-3 bg-emerald-50/50">
            <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircleIcon sx={{ fontSize: 14 }} /> Chi tiết kết quả
            </p>
          </div>
          {calcResult.items.map((item) => {
            const crit = quota.criteria.find((c) => c.code === item.code);
            return (
              <div key={item.code} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50/50">
                <div>
                  <p className="text-sm font-semibold text-slate-700">{crit?.name ?? item.code}</p>
                  <p className="text-xs text-slate-400 font-medium">
                    {item.qty} {crit?.unit} × {crit?.coefficient ?? "hệ số"}
                  </p>
                </div>
                <span className="text-lg font-black text-mainColor">{round2(item.hours)} giờ</span>
              </div>
            );
          })}
          <div className="px-5 py-4 bg-mainColor/5 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-700">Tổng cộng</span>
            <span className="text-2xl font-black text-mainColor">
              {round2(calcResult.totalHours)} giờ
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   TAB 3: THÀNH VIÊN (Members)
   ============================================================ */
function MembersTab({ membersData, typeConfig, quota }) {
  if (!membersData?.members) {
    return (
      <div className="p-8 text-center text-slate-400 text-sm">
        Không có dữ liệu thành viên
      </div>
    );
  }

  const members = membersData.members;

  return (
    <div className="divide-y divide-slate-100">
      <div className="px-5 py-4 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <PeopleIcon sx={{ fontSize: 18 }} className="text-mainColor" />
          <h3 className="text-sm font-bold text-slate-800">
            Thành viên nhóm ({members.length} người)
          </h3>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Hệ số định mức của từng thành viên theo chức danh
        </p>
      </div>

      <div className="divide-y divide-slate-100">
        {members.map((member) => (
          <MemberCard key={member.userId} member={member} isCurrentUser={member.userId === quota?.userId} />
        ))}
      </div>
    </div>
  );
}

function MemberCard({ member, isCurrentUser }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`transition-colors ${isCurrentUser ? "bg-mainColor/5" : ""}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-4 flex items-center gap-4 text-left hover:bg-slate-50/50 transition-colors"
      >
        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0
          ${member.isLeader ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-500"}`}
        >
          {member.isLeader ? <StarIcon sx={{ fontSize: 18 }} /> : <PersonIcon sx={{ fontSize: 18 }} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-slate-800 truncate">{member.name}</p>
            {isCurrentUser && (
              <span className="text-[10px] font-bold text-mainColor bg-mainColor/10 px-1.5 py-0.5 rounded">
                Bạn
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-slate-400 font-medium">{member.chucDanh}</span>
            <span className="text-slate-200">·</span>
            <span className={`text-xs font-semibold ${member.isLeader ? "text-amber-600" : "text-slate-500"}`}>
              {member.role}
            </span>
          </div>
        </div>
        <svg
          className={`w-4 h-4 text-slate-300 transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && member.quotaItems?.length > 0 && (
        <div className="px-5 pb-4">
          <div className="bg-slate-50 rounded-xl overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left px-3 py-2 font-bold text-slate-500 uppercase tracking-wider">
                    Tiêu chí
                  </th>
                  <th className="text-center px-3 py-2 font-bold text-slate-500 uppercase tracking-wider w-24">
                    Hệ số
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {member.quotaItems.map((item) => (
                  <tr key={item.code}>
                    <td className="px-3 py-2 text-slate-700 font-medium">{item.name}</td>
                    <td className="px-3 py-2 text-center">
                      {item.coefficient > 0 ? (
                        <span className="font-bold text-mainColor">{item.coefficient}</span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
