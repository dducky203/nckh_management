import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

import { useAuth } from "../../context/useAuth";
import { useToast } from "../../context/ToastContext";
import nckhPlanService from "../../services/nckhPlanService";
import nckhTieuChiDinhMucService from "../../services/nckhTieuChiDinhMucService";
import nckhActivityService from "../../services/nckhActivityService";
import groupQuotaService from "../../services/groupQuotaService";
import GroupQuotaPanel from "../../components/groupQuota/GroupQuotaPanel";
import PlanPA0 from "./components/PlanPA0";
import PlanPA1 from "./components/PlanPA1";
import PlanPA2 from "./components/PlanPA2";
import PlanPA3 from "./components/PlanPA3";
import PlanPA4 from "./components/PlanPA4";
import PlanPA5 from "./components/PlanPA5";
import ActivityDataTable from "./components/ActivityDataTable";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { PLAN_OPTIONS } from "../../utils/data.js";

const IconCheck = () => <CheckIcon sx={{ fontSize: 20 }} />;
const IconX = () => <CloseIcon sx={{ fontSize: 20 }} />;
const IconClock = () => <AccessTimeIcon sx={{ fontSize: 24 }} />;
const IconChevronDown = ({ className }) => (
  <KeyboardArrowDownIcon className={className} sx={{ fontSize: 18 }} />
);
const IconArrowUp = () => <ArrowUpwardIcon sx={{ fontSize: 16 }} />;
const IconArrowDown = () => <ArrowDownwardIcon sx={{ fontSize: 16 }} />;

function round1(x) {
  return Math.round(x * 10) / 10;
}

/**
 * =========================
 * 2) MAIN COMPONENT
 * =========================
 */

export default function ActivityStandards() {
  const toast = useToast();
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const toastRef = useRef(toast);

  useEffect(() => {
    toastRef.current = toast;
  }, [toast]);

  const canManagePlanAndData = useMemo(() => {
    const roleStr = (user?.role ?? "").toLowerCase();
    const isAdmin = roleStr === "admin" || user?.idRole === 1;
    const isDeptHead = user?.power === 1;
    const isAssistant = roleStr === "assistant";
    return isAdmin || isDeptHead || isAssistant;
  }, [user]);

  const title = user?.title ?? "";
  const [plan, setPlan] = useState(1);
  const [groupRole, setGroupRole] = useState("member");
  const [values] = useState({});
  const [planLocked, setPlanLocked] = useState(false);
  const [planNotSet, setPlanNotSet] = useState(false);
  const [planLoading, setPlanLoading] = useState(false);
  const [planSaving, setPlanSaving] = useState(false);
  const [planCriteria, setPlanCriteria] = useState([]);
  const [criteriaLoading, setCriteriaLoading] = useState(false);
  const [actualStats, setActualStats] = useState([]);
  // --- Summary từ API mới (PersonalQuotaSummaryDto) ---
  const [quotaSummary, setQuotaSummary] = useState(null);
  // --- Activities chi tiết để hiển thị user & link ---
  const [activities, setActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);

  // --- Nhóm nghiên cứu (NCM / Xuất sắc / Tinh hoa) ---
  const [groupStats, setGroupStats] = useState(null);  // stats từ /my-stats
  const [groupStatsLoading, setGroupStatsLoading] = useState(false);

  useEffect(() => {
    if (!user?.id || !selectedYear) return;

    let cancelled = false;
    (async () => {
      setPlanLoading(true);
      try {
        const res = await nckhPlanService.getCurrentPlan(user.id, selectedYear);
        const current = res?.data;

        if (cancelled) return;

        if (current?.planId != null) {
          setPlan(current.planId);
          setPlanLocked(current.isLocked);
          setPlanNotSet(false);
        } else {
          setPlanLocked(false);
          setPlanNotSet(true);
        }
      } catch (e) {
        if (cancelled) return;
        setPlanNotSet(true);
        toastRef.current?.info("Bạn chưa chọn phương án nào cho năm học này.");
      } finally {
        if (!cancelled) setPlanLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.id, selectedYear]);

  // Fetch criteria from API whenever plan or academic title changes
  useEffect(() => {
    if (!title || !plan) return;

    let cancelled = false;
    (async () => {
      setCriteriaLoading(true);

      try {
        const res = await nckhTieuChiDinhMucService.getByPlan(
          plan,
          title || null,
        );
        if (cancelled) return;
        setPlanCriteria(res?.data ?? res);
      } catch (e) {
        if (cancelled) return;
        toastRef.current?.error(
          e?.message || "Không thể tải tiêu chí định mức",
        );
      } finally {
        if (!cancelled) setCriteriaLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [plan, title]);

  // Fetch actual statistics
  useEffect(() => {
    if (!user?.id || !selectedYear) return;

    let cancelled = false;
    (async () => {
      setStatsLoading(true);
      try {
        const res = await nckhActivityService.getStatistics(
          user.id,
          selectedYear,
        );
        if (cancelled) return;
        const raw = res?.data ?? res;
        // Nếu API trả về PersonalQuotaSummaryDto (có trường criteria)
        if (raw && raw.criteria) {
          setActualStats(raw.criteria ?? []);
          setQuotaSummary(raw);
        } else {
          // Fallback: API cũ trả về array
          setActualStats(raw ?? []);
          setQuotaSummary(null);
        }
      } catch (e) {
        if (cancelled) return;
        toastRef.current?.error(e?.message || "Không thể tải dữ liệu thực tế");
      } finally {
        if (!cancelled) setStatsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.id, selectedYear]);

  // --- Fetch chi tiết activities (APPROVED) để hiển thị user & link ---
  useEffect(() => {
    if (!user?.id || !selectedYear) return;
    let cancelled = false;
    (async () => {
      setActivitiesLoading(true);
      try {
        const res = await nckhActivityService.getMyActivities({
          userId: user.id,
          year: selectedYear,
          status: "APPROVED",
        });
        if (!cancelled) setActivities(res?.data ?? res ?? []);
      } catch (_) {
        if (!cancelled) setActivities([]);
      } finally {
        if (!cancelled) setActivitiesLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user?.id, selectedYear]);

  // --- Fetch group stats tự động theo user ---
  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    (async () => {
      setGroupStatsLoading(true);
      try {
        const data = await groupQuotaService.getMyGroupStats(selectedYear);
        if (!cancelled) setGroupStats(data);
      } catch (_) {
        if (!cancelled) setGroupStats(null);
      } finally {
        if (!cancelled) setGroupStatsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user?.id, selectedYear]);

  // --- Logic Helpers ---
  const calcHours = useCallback(
    (child) => {
      const d = values[child.id] || {};
      const qty = +(d.qty || 0);
      const S = child.quota;
      if (!child.isTeam) return qty * S;
      const participants = Math.max(1, +(d.participants || 1));
      const role = d.role || "main";
      const mainShare = S / 3;
      const memberShare = (2 * S) / (3 * participants);
      const unit = role === "main" ? mainShare + memberShare : memberShare;
      return qty * unit;
    },
    [values],
  );

  const result = useMemo(() => {
    if (criteriaLoading || planCriteria.length === 0) {
      return { checks: [], overallOk: false, requiredHours: null };
    }

    const sortedCriteria = [...planCriteria].sort(
      (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
    );

    // Create map of actual data by tieuChiCode
    const actualMap = {};
    (Array.isArray(actualStats) ? actualStats : []).forEach((stat) => {
      actualMap[stat.catalogCode] = stat;
    });

    const checks = sortedCriteria.map((c) => {
      const req = +(c.dinhMucToiThieu ?? 0);
      const actual = actualMap[c.tieuChiCode];
      const got = actual ? +(actual.totalQty ?? 0) : 0;
      const hasActual = got > 0;
      const ok = got >= req;

      return {
        label: c.tieuChiName,
        got,
        req,
        unit: c.donViTinh,
        hasActual,
        ok,
        actualHours: actual
          ? +(actual.ownQuotaHours ?? actual.totalQuotaHours ?? 0)
          : 0,
        participationCount: actual ? +(actual.participationCount ?? 0) : 0,
      };
    });

    // Lấy từ quotaSummary nếu có (API mới), fallback tính tổng
    const requiredHoursSum = quotaSummary?.requiredTotalHours ?? sortedCriteria.reduce(
      (sum, c) => sum + +(c.tongGioToiThieu ?? 0),
      0,
    );

    const actualHoursSum = quotaSummary?.actualTotalHours ?? checks.reduce(
      (sum, check) => sum + +(check.actualHours ?? 0),
      0,
    );

    // Logic: có nhóm định mức → dùng overallCompleted từ API; không có → chỉ xét tổng giờ cá nhân
    const overallOk = quotaSummary != null
      ? quotaSummary.overallCompleted
      : actualHoursSum >= requiredHoursSum && requiredHoursSum > 0;

    const inQuotaGroup = quotaSummary?.inQuotaGroup === true;

    return {
      checks,
      overallOk,
      inQuotaGroup,
      requiredHours: requiredHoursSum > 0 ? requiredHoursSum : null,
      actualHours: actualHoursSum,
      personalPercent: quotaSummary?.personalCompletionPercent ?? null,
      groupPercent: inQuotaGroup ? (quotaSummary?.groupCompletionPercent ?? null) : null,
      effectivePercent: inQuotaGroup
        ? (quotaSummary?.effectiveCompletionPercent ?? null)
        : (quotaSummary?.personalCompletionPercent ?? null),
      groupName: inQuotaGroup ? (quotaSummary?.groupName ?? null) : null,
      groupRequiredHours: inQuotaGroup ? (quotaSummary?.groupRequiredTotalHours ?? null) : null,
      groupActualHours: inQuotaGroup ? (quotaSummary?.groupActualTotalHours ?? null) : null,
    };
  }, [criteriaLoading, planCriteria, actualStats, quotaSummary]);

  const tableCriteria = useMemo(() => {
    const children = [...planCriteria]
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .map((c) => ({
        id: c.tieuChiCode,
        name: c.tieuChiName,
        unit: c.donViTinh || "",
        quota: +(c.gioQuyDoiPerUnit ?? 0),
        isTeam: false,
      }));

    if (children.length === 0) return [];

    return [
      {
        id: `plan-${plan}`,
        name: `Nội dung PA${plan}`,
        children,
      },
    ];
  }, [planCriteria, plan]);

  const requiredHoursNum =
    result.requiredHours == null ? null : result.requiredHours || 0;
  const actualHoursNum = result.actualHours || 0;
  const diffHours =
    requiredHoursNum == null ? null : round1(actualHoursNum - requiredHoursNum);

  const handleLockPlan = async () => {
    if (!canManagePlanAndData && !planNotSet) return;
    if (!user?.id) {
      toast.error(ERROR_MESSAGES.USER.CANNOT_IDENTIFY);
      return;
    }

    try {
      setPlanSaving(true);
      const res = await nckhPlanService.selectAndLock(user.id, plan);
      const saved = res?.data ?? res;
      setPlanLocked(!!(saved?.isLocked ?? true));
      setPlanNotSet(false);
      toast.success(`Đã khóa phương án ${plan} cho năm nay`);
    } catch (e) {
      toast.error(e?.message || "Khóa phương án thất bại");
    } finally {
      setPlanSaving(false);
    }
  };

  const canSelectPlan = (canManagePlanAndData || planNotSet) && !planLocked && selectedYear >= currentYear;
  const planSelectDisabled = !canSelectPlan || planLoading;
  const isApiLoading = planLoading || criteriaLoading || statsLoading;

  const PLAN_COMPONENTS = {
    0: PlanPA0,
    1: PlanPA1,
    2: PlanPA2,
    3: PlanPA3,
    4: PlanPA4,
    5: PlanPA5,
  };
  const ActivePlanComponent = PLAN_COMPONENTS[plan] ?? PlanPA0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-4 font-sans selection:bg-mainColor selection:text-white">
      {/* 1. Header & Configuration */}
      <div className="bg-white border-b top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Title */}
            <div className="flex items-center gap-3">
              <div className="w-1 h-10 rounded-full bg-mainColor flex-shrink-0 hidden md:block" />
              <div>
                <h1 className="text-base font-extrabold text-slate-800 leading-tight">
                  Tiêu chuẩn hoạt động NCKH
                </h1>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  Theo dõi &amp; đánh giá theo các phương án năm học
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 items-end">
              {/* Chọn năm xem */}
              <div className="flex-grow md:flex-grow-0">
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5 ml-1">
                  Năm học
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={2020}
                    max={currentYear + 1}
                    value={selectedYear}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val) && val >= 2020 && val <= currentYear + 1) {
                        setSelectedYear(val);
                      }
                    }}
                    className="w-full md:w-28 bg-white hover:bg-slate-50 transition-colors text-sm font-bold text-slate-800 py-2.5 pl-3 pr-3 rounded-xl outline-none border border-slate-200 focus:border-mainColor shadow-sm text-center"
                  />
                </div>
              </div>
              {/* Chọn Phương án */}
              <div className="relative flex-grow md:flex-grow-0">
                <label className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-400 mb-1.5 ml-1">
                  Phương án
                  {/* {!canManagePlanAndData && !planNotSet && (
                    <span className="text-[10px] font-extrabold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                      Chỉ xem
                    </span>
                  )} */}
                  {!canManagePlanAndData && planNotSet && !planLocked && (
                    <span className="text-[10px] font-extrabold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                      Cần chọn
                    </span>
                  )}
                  {planLocked && (
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                      ✓ Đã khóa
                    </span>
                  )}
                </label>
                <select
                  value={plan}
                  onChange={(e) => {
                    if (!canSelectPlan) return;
                    setPlan(e.target.value);
                  }}
                  disabled={planSelectDisabled}
                  className={`w-full md:w-60 transition-colors text-sm font-bold py-2.5 pl-3 pr-8 rounded-xl appearance-none outline-none border shadow-sm focus:border-mainColor focus:bg-white
                    ${planSelectDisabled
                      ? "bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed"
                      : "bg-white hover:bg-slate-50 text-slate-800 border-slate-200 cursor-pointer"
                    }`}
                >
                  {PLAN_OPTIONS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
                {!planSelectDisabled && (
                  <IconChevronDown className="w-4 h-4 text-slate-500 absolute right-3 bottom-3 pointer-events-none" />
                )}
              </div>

              {/* Chức danh */}
              <div className="flex-grow md:flex-grow-0">
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5 ml-1">
                  Chức danh
                </label>
                <div className="w-full md:w-28 bg-slate-100 text-sm font-extrabold text-slate-700 py-2.5 px-3 rounded-xl border border-slate-200">
                  {title || "—"}
                </div>
              </div>

              {/* Vai trò nhóm */}
              {!planLocked && (plan === 2 || plan === 3) && (
                <div className="relative flex-grow md:flex-grow-0">
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5 ml-1">
                    Vai trò nhóm
                  </label>
                  <select
                    value={groupRole}
                    onChange={(e) => {
                      if (!canManagePlanAndData) return;
                      setGroupRole(e.target.value);
                    }}
                    disabled={!canManagePlanAndData}
                    className={`w-full md:w-36 bg-white hover:bg-slate-50 transition-colors text-sm font-bold text-slate-800 py-2.5 pl-3 pr-8 rounded-xl appearance-none outline-none cursor-pointer border border-slate-200 focus:border-mainColor shadow-sm ${!canManagePlanAndData ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    <option value="member">Thành viên</option>
                    <option value="leader">Trưởng nhóm</option>
                  </select>
                  <IconChevronDown className="w-4 h-4 text-slate-500 absolute right-3 bottom-3 pointer-events-none" />
                </div>
              )}

              {(canManagePlanAndData || planNotSet) && !planLocked && (
                <div>
                  <button
                    type="button"
                    onClick={handleLockPlan}
                    disabled={planSaving || planLoading}
                    className="h-[42px] px-5 rounded-xl text-xs font-extrabold border shadow-sm transition-all bg-mainColor text-white border-mainColor hover:brightness-110 hover:shadow-md"
                    title="Khóa phương án để áp dụng cho năm"
                  >
                    {planSaving ? "Đang khóa..." : `Chốt PA${plan}`}
                  </button>
                </div>
              )}
            </div>

            {/* {!canManagePlanAndData && (
              <div className="w-full mt-2">
                <p className="text-[11px] text-slate-500 font-semibold">
                  Phương án và dữ liệu hoạt động là cố định (chỉ Trưởng
                  khoa/Admin được chỉnh sửa).
                </p>
              </div>
            )}

            {planNotSet && (
              <div className="w-full mt-2">
                <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2">
                  <div className="mt-0.5 text-rose-600">
                    <IconX />
                  </div>
                  <div>
                    <p className="text-[11px] text-rose-700 font-extrabold">
                      Năm {selectedYear}: Chưa có phương án được thiết lập/khóa.
                    </p>
                    <p className="text-[11px] text-rose-700/80 font-semibold">
                      Vui lòng liên hệ Trưởng khoa/Admin để thiết lập phương án
                      cho năm.
                    </p>
                  </div>
                </div>
              </div>
            )} */}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {isApiLoading ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] min-h-[260px]">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            {/* Banner: Đang xem năm quá khứ */}
            {selectedYear < currentYear && (
              <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 shadow-sm">
                <span className="text-xl">📅</span>
                <div>
                  <p className="text-sm font-extrabold text-amber-800"> 
                    Đang xem dữ liệu năm {selectedYear}
                  </p>
                  <p className="text-xs text-amber-700 mt-0.5">
                    Dữ liệu này là lịch sử và ở trạng thái chỉ đọc. Thao tác chốt phương án bị vô hiệu hóa.
                  </p>
                </div>
                <button
                  onClick={() => setSelectedYear(currentYear)}
                  className="ml-auto flex-shrink-0 text-xs font-bold text-amber-800 border border-amber-300 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Về năm {currentYear}
                </button>
              </div>
            )}

            {/* 2. Overview Dashboard */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card: Tổng giờ */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] relative overflow-hidden group">
                <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  {/* Icon màu chính */}
                  <div className="text-mainColor">
                    <IconClock />
                  </div>
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Giờ cá nhân được tính
                </p>
                {requiredHoursNum !== null ? (
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-5xl font-black tracking-tight text-mainColor">
                      {round1(actualHoursNum)}
                    </span>
                    <span className="text-lg font-black text-slate-400">/</span>
                    <span className="text-3xl font-black tracking-tight text-slate-600">
                      {round1(requiredHoursNum)}
                    </span>
                    <span className="text-sm font-bold text-slate-400">
                      giờ
                    </span>
                  </div>
                ) : (
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black tracking-tight text-mainColor">
                      {round1(actualHoursNum)}
                    </span>
                    <span className="text-sm font-bold text-slate-400">
                      giờ
                    </span>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-slate-50">
                  {requiredHoursNum !== null ? (
                    <div
                      className={`inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${diffHours >= 0 ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"}`}
                    >
                      {diffHours >= 0 ? <IconArrowUp /> : <IconArrowDown />}
                      {diffHours === 0
                        ? "Đúng định mức (0 giờ)"
                        : diffHours > 0
                          ? `${round1(Math.abs(diffHours))} giờ`
                          : `${round1(Math.abs(diffHours))} giờ`}
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium italic">
                      Không xét tổng giờ cho phương án này
                    </span>
                  )}
                </div>
              </div>

              {/* Card: % hoàn thành cá nhân + nhóm */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] relative overflow-hidden">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  % Hoàn thành phương án
                </p>
                {result.inQuotaGroup ? (
                  <p className="text-[10px] text-violet-600 font-medium mb-3">
                    Bạn thuộc nhóm định mức — % nhóm ảnh hưởng kết quả phương án.
                  </p>
                ) : (
                  <p className="text-[10px] text-slate-400 font-medium mb-3">
                    Không thuộc nhóm NCM/Xuất sắc/Tinh hoa — chỉ tính theo % cá nhân.
                  </p>
                )}
                <div className="space-y-3">
                  {/* % Cá nhân */}
                  <div>
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-[11px] font-bold text-slate-500 truncate pr-2">Cá nhân</span>
                      <span className="text-xl font-black text-mainColor shrink-0">
                        {result.personalPercent != null ? `${round1(result.personalPercent)}%` : "—"}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-mainColor rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, result.personalPercent ?? 0)}%` }}
                      />
                    </div>
                  </div>

                  {/* % Nhóm (nếu có) */}
                  {result.groupPercent != null && (
                    <div>
                      <div className="flex justify-between items-baseline mb-1">
                        <span
                          className="text-[11px] font-bold text-violet-600 truncate pr-2"
                          title={`Nhóm ${result.groupName ? `(${result.groupName})` : ""}`}
                        >
                          Nhóm {result.groupName ? `(${result.groupName})` : ""}
                        </span>
                        <span className={`text-xl font-black shrink-0 ${result.groupPercent >= 100 ? "text-emerald-600" : "text-violet-600"}`}>
                          {round1(result.groupPercent)}%
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-violet-100 overflow-hidden">
                        <div
                          className="h-full bg-violet-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, result.groupPercent)}%` }}
                        />
                      </div>
                      {result.groupPercent < 100 && (
                        <p className="text-[10px] text-rose-500 font-semibold mt-1 leading-tight">
                          ⚠ Nhóm chưa đạt 100% → giới hạn % thực tế của bạn
                        </p>
                      )}
                      {result.groupPercent >= 100 && (result.personalPercent ?? 0) < 100 && (
                        <p className="text-[10px] text-emerald-600 font-semibold mt-1 leading-tight">
                          ✓ Nhóm đạt 100% → được tính hoàn thành phương án
                        </p>
                      )}
                      {result.groupRequiredHours != null && (
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {round1(result.groupActualHours ?? 0)}/{round1(result.groupRequiredHours)} giờ nhóm
                        </p>
                      )}
                    </div>
                  )}

                  {/* % Thực tế — chỉ hiện khi thuộc nhóm định mức */}
                  {result.inQuotaGroup && (
                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex justify-between items-baseline mb-1">
                      <span
                        className="text-[11px] font-extrabold text-slate-700 truncate pr-2"
                        title={result.groupPercent != null ? "Nhóm ≥ 100% → 100%; nhóm < 100% → bị giới hạn" : "% Thực tế"}
                      >
                        {result.groupPercent != null ? "% Thực tế (theo nhóm)" : "% Thực tế"}
                      </span>
                      <span className={`text-2xl font-black shrink-0 ${result.overallOk ? "text-emerald-600" : "text-rose-600"}`}>
                        {result.effectivePercent != null ? `${round1(result.effectivePercent)}%` : (result.personalPercent != null ? `${round1(result.personalPercent)}%` : "—")}
                      </span>
                    </div>
                    <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${result.overallOk ? "bg-emerald-500" : "bg-rose-400"
                          }`}
                        style={{ width: `${Math.min(100, result.effectivePercent ?? result.personalPercent ?? 0)}%` }}
                      />
                    </div>
                  </div>
                  )}
                </div>
              </div>

              {/* Right Column: Checklist */}
              <ActivePlanComponent result={result} />
            </div>
            {/* 3. Activity Data */}
            <ActivityDataTable
              criteria={tableCriteria}
              values={values}
              calcHours={calcHours}
              actualStats={actualStats}
              activities={activities}
            />

            {/* 4. Định mức nhóm nghiên cứu */}
            <GroupQuotaPanel
              stats={groupStats}
              loading={groupStatsLoading}
            />
          </>
        )}
      </div>

      {/* 4. Sticky Footer Status */}
      <div
        className={`fixed bottom-0 left-0 right-0 border-t bg-white/95 backdrop-blur-xl px-4 py-3 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.1)] z-50 transition-transform duration-300 ${actualHoursNum > 0 ? "translate-y-0" : "translate-y-full"}`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="hidden md:block">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                Tổng giờ thực tế
              </p>
              {/* Footer total color */}
              <p className="text-2xl font-black leading-none text-mainColor">
                {round1(actualHoursNum)}
                {requiredHoursNum != null && (
                  <span className="text-sm font-bold text-slate-400 ml-1">/ {round1(requiredHoursNum)}</span>
                )}
              </p>
            </div>
            <div className="hidden md:block h-8 w-px bg-slate-200"></div>
            {result.personalPercent != null && (
              <div className="hidden md:block">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  % Hoàn thành
                </p>
                <p className="text-lg font-black leading-none text-mainColor">
                  {round1(result.inQuotaGroup ? (result.effectivePercent ?? result.personalPercent) : result.personalPercent)}%
                  {result.inQuotaGroup && result.groupPercent != null && (
                    <span className="text-[10px] font-bold text-violet-500 ml-1">
                      (nhóm {round1(result.groupPercent)}%)
                    </span>
                  )}
                </p>
              </div>
            )}
            <div className="hidden md:block h-8 w-px bg-slate-200"></div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                Kết quả
              </p>
              <div
                className={`flex items-center gap-2 text-sm font-black ${result.overallOk ? "text-emerald-600" : "text-rose-600"}`}
              >
                <div
                  className={`rounded-md p-0.5 ${result.overallOk ? "bg-emerald-100" : "bg-rose-100"}`}
                >
                  {result.overallOk ? <IconCheck /> : <IconX />}
                </div>
                {result.overallOk ? "ĐẠT YÊU CẦU" : "CHƯA ĐẠT"}
              </div>
            </div>
          </div>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            // Button dùng bg-mainColor
            className="px-5 py-2.5 text-white text-xs font-bold rounded-md shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all bg-mainColor"
          >
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );
}

