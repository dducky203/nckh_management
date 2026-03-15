import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  const academicYear = new Date().getFullYear();
  const toastRef = useRef(toast);

  useEffect(() => {
    toastRef.current = toast;
  }, [toast]);

  const canManagePlanAndData = useMemo(() => {
    const roleStr = String(user?.role ?? "").toLowerCase();
    const isAdmin = roleStr === "admin" || user?.idRole === 1;
    const isDeptHead = Number(user?.power) === 1;
    return isAdmin || isDeptHead;
  }, [user]);

  const title = user?.title ?? "";
  const [plan, setPlan] = useState(1);
  const [groupRole, setGroupRole] = useState("member");
  const [values] = useState({});
  const [planLocked, setPlanLocked] = useState(false);
  const [, setPlanNotSet] = useState(false);
  const [planLoading, setPlanLoading] = useState(false);
  const [planSaving, setPlanSaving] = useState(false);
  const [planCriteria, setPlanCriteria] = useState([]);
  const [criteriaLoading, setCriteriaLoading] = useState(false);

  useEffect(() => {
    if (!user?.id || !academicYear) return;

    let cancelled = false;
    (async () => {
      setPlanLoading(true);
      try {
        const res = await nckhPlanService.getCurrentPlan(user.id, academicYear);
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
        toastRef.current?.error(
          e?.message || "Không thể tải phương án năm học",
        );
      } finally {
        if (!cancelled) setPlanLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.id, academicYear]);

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

  console.log({ planCriteria });

  // --- Logic Helpers ---
  const calcHours = useCallback(
    (child) => {
      const d = values[child.id] || {};
      const qty = Number(d.qty || 0);
      const S = child.quota;
      if (!child.isTeam) return qty * S;
      const participants = Math.max(1, Number(d.participants || 1));
      const role = d.role || "main";
      const mainShare = S / 3;
      const memberShare = (2 * S) / (3 * participants);
      const unit = role === "main" ? mainShare + memberShare : memberShare;
      return qty * unit;
    },
    [values],
  );

  const totalHours = useMemo(() => {
    return planCriteria.reduce((sum, c) => {
      const quota = Number(c.gioQuyDoiPerUnit ?? 0);
      const qty = Number(values[c.tieuChiCode]?.qty || 0);
      return sum + qty * quota;
    }, 0);
  }, [planCriteria, values]);

  const result = useMemo(() => {
    if (criteriaLoading || planCriteria.length === 0) {
      return { checks: [], overallOk: false, requiredHours: null };
    }

    const sortedCriteria = [...planCriteria].sort(
      (a, b) => Number(a.sortOrder ?? 0) - Number(b.sortOrder ?? 0),
    );

    const checks = sortedCriteria.map((c) => {
      const req = Number(c.dinhMucToiThieu ?? 0);
      const got = null;

      return {
        label: c.tieuChiName,
        got,
        req,
        unit: c.donViTinh,
        hasActual: false,
        ok: null,
      };
    });

    const requiredHoursSum = sortedCriteria.reduce(
      (sum, c) => sum + Number(c.tongGioToiThieu ?? 0),
      0,
    );

    return {
      checks,
      overallOk: false,
      requiredHours: requiredHoursSum > 0 ? requiredHoursSum : null,
    };
  }, [criteriaLoading, planCriteria]);

  const tableCriteria = useMemo(() => {
    const children = [...planCriteria]
      .sort((a, b) => Number(a.sortOrder ?? 0) - Number(b.sortOrder ?? 0))
      .map((c) => ({
        id: c.tieuChiCode,
        name: c.tieuChiName,
        unit: c.donViTinh || "",
        quota: Number(c.gioQuyDoiPerUnit ?? 0),
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
    result.requiredHours == null ? null : Number(result.requiredHours || 0);
  const diffHours =
    requiredHoursNum == null ? null : round1(totalHours - requiredHoursNum);

  const handleLockPlan = async () => {
    if (!canManagePlanAndData) return;
    if (!user?.id) {
      toast.error("Không xác định được người dùng");
      return;
    }

    try {
      setPlanSaving(true);
      const res = await nckhPlanService.selectAndLock(user.id, plan);
      const saved = res?.data ?? res;
      setPlanLocked(Boolean(saved?.isLocked ?? true));
      setPlanNotSet(false);
      toast.success(`Đã khóa phương án ${plan} cho năm nay`);
    } catch (e) {
      toast.error(e?.message || "Khóa phương án thất bại");
    } finally {
      setPlanSaving(false);
    }
  };

  const planSelectDisabled = !canManagePlanAndData || planLocked || planLoading;
  const isApiLoading = planLoading || criteriaLoading;

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
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-24 font-sans selection:bg-mainColor selection:text-white">
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
              {/* Chọn Phương án */}
              <div className="relative flex-grow md:flex-grow-0">
                <label className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-400 mb-1.5 ml-1">
                  Phương án
                  {!canManagePlanAndData && (
                    <span className="text-[10px] font-extrabold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                      Chỉ xem
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
                    if (!canManagePlanAndData) return;
                    setPlan(Number(e.target.value));
                  }}
                  disabled={planSelectDisabled}
                  className={`w-full md:w-60 transition-colors text-sm font-bold py-2.5 pl-3 pr-8 rounded-xl appearance-none outline-none border shadow-sm focus:border-mainColor focus:bg-white
                    ${
                      planSelectDisabled
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

              {canManagePlanAndData && !planLocked && (
                <div>
                  <button
                    type="button"
                    onClick={handleLockPlan}
                    disabled={planSaving || planLoading}
                    className="h-[42px] px-5 rounded-xl text-xs font-extrabold border shadow-sm transition-all bg-mainColor text-white border-mainColor hover:brightness-110 hover:shadow-md"
                    title="Khóa phương án để áp dụng cho năm"
                  >
                    {planSaving ? "Đang khóa..." : `Khóa PA${plan}`}
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
                      Năm {academicYear}: Chưa có phương án được thiết lập/khóa.
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
            {/* 2. Overview Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card: Tổng giờ */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] relative overflow-hidden group">
                <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  {/* Icon màu chính */}
                  <div className="text-mainColor">
                    <IconClock />
                  </div>
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Tổng giờ quy đổi
                </p>
                {requiredHoursNum !== null ? (
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-5xl font-black tracking-tight text-mainColor">
                      {round1(totalHours)}
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
                      {round1(totalHours)}
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

              <ActivePlanComponent result={result} />
            </div>
            {/* 3. Activity Data */}
            <ActivityDataTable
              criteria={tableCriteria}
              values={values}
              calcHours={calcHours}
            />
          </>
        )}
      </div>

      {/* 4. Sticky Footer Status */}
      <div
        className={`fixed bottom-0 left-0 right-0 border-t bg-white/95 backdrop-blur-xl px-4 py-3 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.1)] z-50 transition-transform duration-300 ${totalHours > 0 ? "translate-y-0" : "translate-y-full"}`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="hidden md:block">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                Tổng giờ thực tế
              </p>
              {/* Footer total color */}
              <p className="text-2xl font-black leading-none text-mainColor">
                {round1(totalHours)}
              </p>
            </div>
            <div className="hidden md:block h-8 w-px bg-slate-200"></div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                Kết quả {plan}
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
