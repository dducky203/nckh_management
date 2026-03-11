import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/useAuth";
import { useToast } from "../../context/ToastContext";
import nckhPlanService from "../../services/nckhPlanService";

/**
 * =========================
 * 0) ICONS (SVG)
 * =========================
 */
const IconCheck = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={3}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.5 12.75l6 6 9-13.5"
    />
  </svg>
);
const IconX = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={3}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);
const IconClock = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
const IconChevronDown = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
    />
  </svg>
);
const IconUserGroup = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-4 h-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
    />
  </svg>
);

const IconArrowUp = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={3}
    stroke="currentColor"
    className="w-4 h-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 19V5m0 0l-6 6m6-6l6 6"
    />
  </svg>
);

const IconArrowDown = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={3}
    stroke="currentColor"
    className="w-4 h-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 5v14m0 0l-6-6m6 6l6-6"
    />
  </svg>
);

/**
 * =========================
 * 1) DATA CONFIGURATION
 * =========================
 */
const CRITERIA = [
  {
    id: "1",
    name: "1. Seminar",
    children: [
      { id: "1.1", name: "Trình bày Seminar", unit: "lần", quota: 10 },
    ],
  },
  {
    id: "2",
    name: "2. Hội thảo",
    children: [
      { id: "2.1", name: "Tổ chức HT Quốc tế", unit: "hội thảo", quota: 100 },
      { id: "2.2", name: "Tổ chức HT Quốc gia", unit: "hội thảo", quota: 60 },
      { id: "2.3", name: "Tổ chức HT Học viện", unit: "hội thảo", quota: 20 },
      {
        id: "2.4",
        name: "Trình bày HT Quốc tế",
        unit: "bài",
        quota: 50,
        isTeam: true,
      },
      {
        id: "2.5",
        name: "Trình bày HT Quốc gia",
        unit: "bài",
        quota: 30,
        isTeam: true,
      },
      {
        id: "2.6",
        name: "Trình bày HT Học viện",
        unit: "bài",
        quota: 20,
        isTeam: true,
      },
    ],
  },
  {
    id: "3",
    name: "3. Bài báo quốc tế / tiếng Anh",
    children: [
      { id: "3.1", name: "Bài WoS", unit: "bài", quota: 210, isTeam: true },
      { id: "3.2", name: "Bài Scopus", unit: "bài", quota: 140, isTeam: true },
      {
        id: "3.3",
        name: "Bài tiếng Anh (Tạp chí HV)",
        unit: "bài",
        quota: 70,
        isTeam: true,
      },
      {
        id: "3.4",
        name: "Bài quốc tế khác",
        unit: "bài",
        quota: 60,
        isTeam: true,
      },
      {
        id: "3.5",
        name: "Trích dẫn bài báo tiếng Anh HV",
        unit: "lần",
        quota: 1,
      },
    ],
  },
  {
    id: "4",
    name: "4. Bài báo tiếng Việt",
    children: [
      {
        id: "4.1",
        name: "Tạp chí HV (Tiếng Việt)",
        unit: "bài",
        quota: 40,
        isTeam: true,
      },
      {
        id: "4.2",
        name: "Tạp chí chuyên ngành khác",
        unit: "bài",
        quota: 20,
        isTeam: true,
      },
    ],
  },
  {
    id: "5",
    name: "5. Kỷ yếu hội thảo (fulltext)",
    children: [
      { id: "5.1", name: "HT Quốc tế", unit: "bài", quota: 25, isTeam: true },
      { id: "5.2", name: "HT Quốc gia", unit: "bài", quota: 15, isTeam: true },
      { id: "5.3", name: "HT Học viện", unit: "bài", quota: 10, isTeam: true },
    ],
  },
  {
    id: "6",
    name: "6. Bài tổng quan lĩnh vực",
    children: [
      {
        id: "6.1",
        name: "Bài tổng quan",
        unit: "bài",
        quota: 10,
        isTeam: true,
      },
    ],
  },
  {
    id: "7",
    name: "7. Tư vấn/Hướng dẫn/Bản tin website",
    children: [{ id: "7.1", name: "Sản phẩm website", unit: "SP", quota: 5 }],
  },
  {
    id: "8",
    name: "8. Quy trình/Tiêu chuẩn/Góp ý",
    children: [
      { id: "8.1", name: "Sản phẩm quy trình/góp ý", unit: "SP", quota: 10 },
    ],
  },
  {
    id: "9",
    name: "9. Đề xuất nhiệm vụ KH&CN",
    children: [
      { id: "9.1", name: "Đề xuất cấp Quốc gia", unit: "đề xuất", quota: 10 },
      {
        id: "9.2",
        name: "Đề xuất cấp Bộ & tương đương",
        unit: "đề xuất",
        quota: 5,
      },
      { id: "9.3", name: "Đề xuất HV trọng điểm", unit: "đề xuất", quota: 2.5 },
    ],
  },
  {
    id: "10",
    name: "10. Nhiệm vụ KH&CN được phê duyệt",
    children: [
      {
        id: "10.1",
        name: "Cấp Quốc gia: Chủ nhiệm",
        unit: "đề tài",
        quota: 90,
      },
      { id: "10.2", name: "Cấp Quốc gia: Thư ký", unit: "đề tài", quota: 40 },
      {
        id: "10.3",
        name: "Cấp Quốc gia: Tham gia (max 8)",
        unit: "đề tài",
        quota: 150,
        isTeam: true,
      },
      { id: "10.4", name: "Cấp Bộ & tđ: Chủ nhiệm", unit: "đề tài", quota: 70 },
      { id: "10.5", name: "Cấp Bộ & tđ: Thư ký", unit: "đề tài", quota: 30 },
      {
        id: "10.6",
        name: "Cấp Bộ & tđ: Tham gia (max 8)",
        unit: "đề tài",
        quota: 110,
        isTeam: true,
      },
      {
        id: "10.7",
        name: "Cấp Học viện: Chủ nhiệm",
        unit: "đề tài",
        quota: 15,
      },
      {
        id: "10.8",
        name: "Cấp Học viện: Tham gia (max 4)",
        unit: "đề tài",
        quota: 25,
        isTeam: true,
      },
      { id: "10.9", name: "Hướng dẫn SV NCKH", unit: "nhóm", quota: 15 },
    ],
  },
  {
    id: "11",
    name: "11. Hội đồng tư vấn khoa học",
    children: [{ id: "11.1", name: "Hội đồng", unit: "hội đồng", quota: 20 }],
  },
  {
    id: "12",
    name: "12. Mời chuyên gia Seminar/Chuyên đề",
    children: [{ id: "12.1", name: "Mời chuyên gia", unit: "lần", quota: 15 }],
  },
  {
    id: "13",
    name: "13. Hoạt động KH&CN khác",
    children: [
      {
        id: "13.1",
        name: "Chương sách (ISBN)",
        unit: "chương",
        quota: 80,
        isTeam: true,
      },
      { id: "13.2", name: "Đề án Học viện (50–120)", unit: "đề án", quota: 80 },
      { id: "13.3", name: "Bài quảng bá", unit: "bài", quota: 10 },
      {
        id: "13.4",
        name: "Giáo trình xuất bản",
        unit: "giáo trình",
        quota: 80,
        isTeam: true,
      },
      {
        id: "13.5",
        name: "Bài giảng môn học mới",
        unit: "bài giảng",
        quota: 30,
        isTeam: true,
      },
      {
        id: "13.6",
        name: "Sách chuyên khảo",
        unit: "sách",
        quota: 40,
        isTeam: true,
      },
      {
        id: "13.7",
        name: "Sách tham khảo",
        unit: "sách",
        quota: 20,
        isTeam: true,
      },
      { id: "13.8", name: "Hợp đồng KH&CN", unit: "10 triệu", quota: 1 },
    ],
  },
];

const PLAN_OPTIONS = [
  { id: "PA0", label: "PA0 - Định mức chuẩn (Bảng 1)" },
  { id: "PA1", label: "PA1 - Nhóm nghiên cứu mạnh (Bảng 2)" },
  { id: "PA2", label: "PA2 - Nhóm nghiên cứu xuất sắc (Bảng 3)" },
  { id: "PA3", label: "PA3 - Nhóm nghiên cứu tinh hoa (Bảng 4)" },
  { id: "PA4", label: "PA4 - Chỉ tiêu bài báo/đề tài (Bảng 5)" },
  { id: "PA5", label: "PA5 - Chỉ tiêu bài báo KH (Bảng 6)" },
];

const TABLE1_STANDARD = {
  "GS/PGS": {
    totalHours: 300,
    sem: 2,
    conf: 2,
    int_wos_scopus: 0.6,
    en_hv: 0.5,
    vi: 0,
    proceedings: 1,
    review: 1,
    consult: 0,
    process: 1,
    proposal_bo: 2,
    task_bo_pi: 0.4,
    council: 2,
    expert: 2,
  },
  TS: {
    totalHours: 220,
    sem: 1,
    conf: 1,
    int_wos_scopus: 0.4,
    en_hv: 0,
    vi: 0.5,
    proceedings: 1,
    review: 0.5,
    consult: 1,
    process: 0,
    proposal_bo: 2,
    task_bo_pi: 0.4,
    council: 2,
    expert: 2,
  },
  ThS: {
    totalHours: 140,
    sem: 1,
    conf: 1,
    int_wos_scopus: 0,
    en_hv: 0.5,
    vi: 1,
    proceedings: 0.5,
    review: 0.3,
    consult: 2,
    process: 0,
    proposal_bo: 1,
    task_bo_pi: 0,
    council: 2,
    expert: 2,
  },
  "KS/CN": {
    totalHours: 70,
    sem: 1,
    conf: 1,
    int_wos_scopus: 0,
    en_hv: 0,
    vi: 0.5,
    proceedings: 0,
    review: 0,
    consult: 1,
    process: 0,
    proposal_bo: 0,
    task_bo_pi: 0,
    council: 2,
    expert: 2,
  },
};

const TABLE2_STRONG = {
  "GS/PGS": {
    totalHours: 300,
    sem: 1.6,
    conf: 1.6,
    int_wos_scopus: 0.48,
    en_hv: 0.4,
    vi: 0,
    proceedings: 0.8,
    review: 0,
    consult: 0,
    process: 0.8,
    proposal_bo: 1.6,
    task_bo_pi: 0.32,
    council: 0,
    expert: 0,
  },
  TS: {
    totalHours: 220,
    sem: 0.8,
    conf: 0.8,
    int_wos_scopus: 0.32,
    en_hv: 0,
    vi: 0.4,
    proceedings: 0.8,
    review: 0,
    consult: 0.8,
    process: 0,
    proposal_bo: 1.6,
    task_bo_pi: 0.32,
    council: 0,
    expert: 0,
  },
  ThS: {
    totalHours: 140,
    sem: 0.8,
    conf: 0.8,
    int_wos_scopus: 0,
    en_hv: 0.4,
    vi: 0.8,
    proceedings: 0.8,
    review: 0,
    consult: 1.6,
    process: 0,
    proposal_bo: 0.8,
    task_bo_pi: 0,
    council: 0,
    expert: 0,
  },
  "KS/CN": {
    totalHours: 70,
    sem: 0.8,
    conf: 0.8,
    int_wos_scopus: 0,
    en_hv: 0.4,
    vi: 0.4,
    proceedings: 0.4,
    review: 0,
    consult: 0.8,
    process: 0,
    proposal_bo: 0,
    task_bo_pi: 0.8,
    council: 0,
    expert: 0,
  },
};

const TABLE3_EXCELLENT = {
  leader: { papers_wos_scopus_first: 4, bo_project_pi: 2 },
  member: {
    "GS/PGS": { papers_wos_scopus_first: 0.6, bo_project_pi: 0.4 },
    TS: { papers_wos_scopus_first: 0.4, bo_project_pi: 0.4 },
    ThS: { papers_wos_scopus_first: 0, bo_project_pi: 0 },
  },
};

const TABLE4_ELITE = {
  leader: { papers_wos_scopus_first: 8, bo_project_pi: 4 },
  member: {
    "GS/PGS": { papers_wos_scopus_first: 0.48, bo_project_pi: 0.32 },
    TS: { papers_wos_scopus_first: 0.32, bo_project_pi: 0.32 },
    ThS: { papers_wos_scopus_first: 0, bo_project_pi: 0 },
  },
};

const TABLE5_ARTICLE_OR_PROJECT = {
  "GS/PGS": {
    wos_first: 1,
    scopus_first: 0,
    en_hv_first: 0,
    vi_first: 0,
    bo_project_pi: 1,
  },
  TS: {
    wos_first: 0,
    scopus_first: 1,
    en_hv_first: 0,
    vi_first: 0,
    bo_project_pi: 1,
  },
  ThS: {
    wos_first: 0,
    scopus_first: 0,
    en_hv_first: 1,
    vi_first: 0,
    province_or_company_pi: 1,
  },
  "KS/CN": { wos_first: 0, scopus_first: 0, en_hv_first: 0, vi_first: 1 },
};

const TABLE6_ONLY_ARTICLES = {
  "GS/PGS": { wos_scopus_first: 0.3 },
  TS: { wos_scopus_first: 0.3 },
  ThS: { en_hv_first: 0.3 },
  "KS/CN": { vi_first: 0.3 },
};

function round1(x) {
  return Math.round(x * 10) / 10;
}

function normalizeAcademicTitle(raw) {
  const v = String(raw ?? "")
    .trim()
    .toLowerCase();
  if (!v) return "TS";
  if (v === "gs/pgs" || v === "gs_pgs" || v === "gs" || v === "pgs")
    return "GS/PGS";
  if (v === "ts" || v.includes("tiến sĩ")) return "TS";
  if (v === "ths" || v === "th.s" || v.includes("thạc sĩ")) return "ThS";
  if (v === "ks/cn" || v === "ks_cn" || v === "ks" || v === "cn")
    return "KS/CN";
  if (v === "sinh viên") return "TS";
  return "TS";
}

/**
 * =========================
 * 2) MAIN COMPONENT
 * =========================
 */

export default function ActivityStandards() {
  const toast = useToast();
  const { user, currentYear, isInitializing } = useAuth();
  const academicYear = currentYear;

  const canManagePlanAndData = useMemo(() => {
    const roleStr = String(user?.role ?? "").toLowerCase();
    const isAdmin = roleStr === "admin" || user?.idRole === 1;
    const isDeptHead = Number(user?.power) === 1;
    return isAdmin || isDeptHead;
  }, [user]);

  const title = useMemo(
    () => normalizeAcademicTitle(user?.title),
    [user?.title],
  );

  const [plan, setPlan] = useState("PA0");
  const [groupRole, setGroupRole] = useState("member");
  const [openIds, setOpenIds] = useState(() => CRITERIA.map((g) => g.id));
  const [values, setValues] = useState({});
  const [planLocked, setPlanLocked] = useState(false);
  const [planNotSet, setPlanNotSet] = useState(false);
  const [planLoading, setPlanLoading] = useState(false);
  const [planSaving, setPlanSaving] = useState(false);

  useEffect(() => {
    if (isInitializing) return;
    if (!user?.id || !academicYear) return;

    let cancelled = false;
    (async () => {
      setPlanLoading(true);
      try {
        const res = await nckhPlanService.getCurrent(user.id, academicYear);
        const current = res?.data ?? res;

        if (cancelled) return;

        if (current?.planCode) {
          setPlan(String(current.planCode));
          setPlanLocked(Boolean(current.isLocked));
          setPlanNotSet(false);
        } else {
          setPlanLocked(false);
          setPlanNotSet(true);
        }
      } catch (e) {
        if (cancelled) return;
        setPlanNotSet(true);
        toast.error(e?.message || "Không thể tải phương án năm học");
      } finally {
        if (!cancelled) setPlanLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.id, academicYear, isInitializing, toast]);

  // --- Logic Helpers ---
  const update = (id, field, value) => {
    if (!canManagePlanAndData) return;
    setValues((p) => ({ ...p, [id]: { ...p[id], [field]: value } }));
  };

  const toggle = (gid) => {
    setOpenIds((prev) =>
      prev.includes(gid) ? prev.filter((x) => x !== gid) : [...prev, gid],
    );
  };

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

  const metrics = useMemo(() => {
    const m = {
      sem: 0,
      conf: 0,
      int_wos_scopus: 0,
      en_hv: 0,
      vi: 0,
      proceedings: 0,
      review: 0,
      consult: 0,
      process: 0,
      proposal_bo: 0,
      task_bo_pi: 0,
      council: 0,
      expert: 0,
      wos_first: 0,
      scopus_first: 0,
      wos_scopus_first: 0,
      en_hv_first: 0,
      vi_first: 0,
      bo_project_pi: 0,
      province_or_company_pi: 0,
    };
    const get = (id) => values[id] || {};
    const qty = (id) => Number(get(id).qty || 0);
    const isMain = (id) => (get(id).role || "main") === "main";

    m.sem += qty("1.1");
    m.conf +=
      qty("2.1") +
      qty("2.2") +
      qty("2.3") +
      qty("2.4") +
      qty("2.5") +
      qty("2.6");
    m.int_wos_scopus += qty("3.1") + qty("3.2") + qty("3.4");
    m.en_hv += qty("3.3");
    m.vi += qty("4.1") + qty("4.2");
    m.proceedings += qty("5.1") + qty("5.2") + qty("5.3");
    m.review += qty("6.1");
    m.consult += qty("7.1");
    m.process += qty("8.1");
    m.proposal_bo += qty("9.2");
    m.task_bo_pi += qty("10.4") + qty("10.9");
    m.council += qty("11.1");
    m.expert += qty("12.1");

    if (qty("3.1") > 0 && isMain("3.1")) m.wos_first += qty("3.1");
    if (qty("3.2") > 0 && isMain("3.2")) m.scopus_first += qty("3.2");
    m.wos_scopus_first = m.wos_first + m.scopus_first;
    if (qty("3.3") > 0 && isMain("3.3")) m.en_hv_first += qty("3.3");
    if (qty("4.1") > 0 && isMain("4.1")) m.vi_first += qty("4.1");
    if (qty("4.2") > 0 && isMain("4.2")) m.vi_first += qty("4.2");
    m.bo_project_pi += qty("10.4");
    m.province_or_company_pi += qty("10.7");
    return m;
  }, [values]);

  const totalHours = useMemo(() => {
    let sum = 0;
    for (const g of CRITERIA) for (const c of g.children) sum += calcHours(c);
    return sum;
  }, [calcHours]);

  const result = useMemo(() => {
    const checks = [];
    const add = (label, got, req) =>
      checks.push({ label, got, req, ok: req === 0 ? true : got >= req });
    const addOR = (label, options) =>
      checks.push({
        label,
        got: null,
        req: null,
        ok: options.some((x) => (x.req === 0 ? false : x.got >= x.req)),
        options,
        isOr: true,
      });

    let overallOk = true;
    if (plan === "PA0") {
      const req = TABLE1_STANDARD[title];
      add("Seminar", metrics.sem, req.sem);
      add("Hội thảo", metrics.conf, req.conf);
      add(
        "Bài báo quốc tế (WoS/Scopus/khác)",
        metrics.int_wos_scopus,
        req.int_wos_scopus,
      );
      add("Bài báo tiếng Anh (Tạp chí HV)", metrics.en_hv, req.en_hv);
      add("Bài báo tiếng Việt", metrics.vi, req.vi);
      add("Tham luận kỷ yếu", metrics.proceedings, req.proceedings);
      add("Bài tổng quan", metrics.review, req.review);
      add("Website/Bản tin", metrics.consult, req.consult);
      add("Quy trình/Góp ý", metrics.process, req.process);
      add("Đề xuất cấp Bộ", metrics.proposal_bo, req.proposal_bo);
      add("Nhiệm vụ (chủ trì/hướng dẫn)", metrics.task_bo_pi, req.task_bo_pi);
      add("Hội đồng", metrics.council, req.council);
      add("Chuyên gia", metrics.expert, req.expert);
      overallOk = checks.every((c) => c.ok);
      return { checks, overallOk, requiredHours: req.totalHours };
    }
    if (plan === "PA1") {
      const req = TABLE2_STRONG[title];
      add("Seminar", metrics.sem, req.sem);
      add("Bài tham luận/Hội thảo", metrics.conf, req.conf);
      add("Bài WoS/Scopus", metrics.int_wos_scopus, req.int_wos_scopus);
      add("Bài tiếng Anh (Tạp chí HV)", metrics.en_hv, req.en_hv);
      add("Bài tiếng Việt", metrics.vi, req.vi);
      add("Kỷ yếu", metrics.proceedings, req.proceedings);
      add("Website/Bản tin", metrics.consult, req.consult);
      add("Quy trình/Góp ý", metrics.process, req.process);
      add("Đề xuất cấp Bộ", metrics.proposal_bo, req.proposal_bo);
      add("Nhiệm vụ (chủ trì/hướng dẫn)", metrics.task_bo_pi, req.task_bo_pi);
      overallOk = checks.every((c) => c.ok);
      return { checks, overallOk, requiredHours: req.totalHours };
    }
    if (plan === "PA2") {
      if (groupRole === "leader") {
        add(
          "Bài WoS/Scopus (tác giả chính)",
          metrics.wos_scopus_first,
          TABLE3_EXCELLENT.leader.papers_wos_scopus_first,
        );
        add(
          "Đề tài cấp Bộ & tương đương (chủ trì)",
          metrics.bo_project_pi,
          TABLE3_EXCELLENT.leader.bo_project_pi,
        );
      } else {
        const req = TABLE3_EXCELLENT.member[title] || {
          papers_wos_scopus_first: 0,
          bo_project_pi: 0,
        };
        add(
          "Bài WoS/Scopus (tác giả chính)",
          metrics.wos_scopus_first,
          req.papers_wos_scopus_first,
        );
        add(
          "Đề tài cấp Bộ & tương đương (chủ trì)",
          metrics.bo_project_pi,
          req.bo_project_pi,
        );
      }
      overallOk = checks.every((c) => c.ok);
      return { checks, overallOk, requiredHours: null };
    }
    if (plan === "PA3") {
      if (groupRole === "leader") {
        add(
          "Bài WoS/Scopus (tác giả chính)",
          metrics.wos_scopus_first,
          TABLE4_ELITE.leader.papers_wos_scopus_first,
        );
        add(
          "Đề tài cấp Bộ & tương đương (chủ trì)",
          metrics.bo_project_pi,
          TABLE4_ELITE.leader.bo_project_pi,
        );
      } else {
        const req = TABLE4_ELITE.member[title] || {
          papers_wos_scopus_first: 0,
          bo_project_pi: 0,
        };
        add(
          "Bài WoS/Scopus (tác giả chính)",
          metrics.wos_scopus_first,
          req.papers_wos_scopus_first,
        );
        add(
          "Đề tài cấp Bộ & tương đương (chủ trì)",
          metrics.bo_project_pi,
          req.bo_project_pi,
        );
      }
      overallOk = checks.every((c) => c.ok);
      return { checks, overallOk, requiredHours: null };
    }
    if (plan === "PA4") {
      const req = TABLE5_ARTICLE_OR_PROJECT[title];
      if (title === "GS/PGS") {
        addOR("Đạt tiêu chí Bảng 5", [
          {
            name: "1 bài WoS (tác giả chính)",
            got: metrics.wos_first,
            req: req.wos_first,
          },
          {
            name: "Chủ nhiệm đề tài cấp Bộ/QG",
            got: metrics.bo_project_pi,
            req: req.bo_project_pi,
          },
        ]);
      } else if (title === "TS") {
        addOR("Đạt tiêu chí Bảng 5", [
          {
            name: "1 bài Scopus (tác giả chính)",
            got: metrics.scopus_first,
            req: req.scopus_first,
          },
          {
            name: "Chủ nhiệm đề tài cấp Bộ/QG",
            got: metrics.bo_project_pi,
            req: req.bo_project_pi,
          },
        ]);
      } else if (title === "ThS") {
        addOR("Đạt tiêu chí Bảng 5", [
          {
            name: "1 bài TA (Tạp chí HV) - tác giả chính",
            got: metrics.en_hv_first,
            req: req.en_hv_first,
          },
          {
            name: "Chủ nhiệm đề tài cấp tỉnh/DN",
            got: metrics.province_or_company_pi,
            req: req.province_or_company_pi,
          },
        ]);
      } else {
        add("1 bài tiếng Việt (tác giả chính)", metrics.vi_first, req.vi_first);
      }
      overallOk = checks.every((c) => c.ok);
      return { checks, overallOk, requiredHours: null };
    }
    if (plan === "PA5") {
      const req = TABLE6_ONLY_ARTICLES[title];
      if (title === "GS/PGS" || title === "TS")
        add(
          "WoS/Scopus (tác giả chính)",
          metrics.wos_scopus_first,
          req.wos_scopus_first,
        );
      else if (title === "ThS")
        add(
          "Bài tiếng Anh (Tạp chí HV) - chính",
          metrics.en_hv_first,
          req.en_hv_first,
        );
      else add("Bài tiếng Việt - chính", metrics.vi_first, req.vi_first);
      overallOk = checks.every((c) => c.ok);
      return { checks, overallOk, requiredHours: null };
    }
    return { checks: [], overallOk: false, requiredHours: null };
  }, [plan, title, groupRole, metrics]);

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
    if (!academicYear) {
      toast.error("Không xác định được năm học");
      return;
    }
    try {
      setPlanSaving(true);
      const res = await nckhPlanService.selectAndLock(
        user.id,
        academicYear,
        plan,
      );
      const saved = res?.data ?? res;
      setPlanLocked(Boolean(saved?.isLocked ?? true));
      setPlanNotSet(false);
      toast.success(`Đã khóa phương án ${plan} cho năm ${academicYear}`);
    } catch (e) {
      toast.error(e?.message || "Khóa phương án thất bại");
    } finally {
      setPlanSaving(false);
    }
  };

  const planSelectDisabled = !canManagePlanAndData || planLocked || planLoading;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-24 font-sans selection:bg-mainColor selection:text-white">
      {/* 1. Header & Configuration */}
      <div className="bg-white border-b top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-md  text-center text-slate-600 font-medium leading-relaxed">
                Tiêu chuẩn hoạt động NCKH <br />
                theo các phương án
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {/* Chọn Phương án */}
              <div className="relative group flex-grow md:flex-grow-0">
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 ml-1">
                  Phương án
                  {!canManagePlanAndData && (
                    <span className="ml-2 align-middle text-[10px] font-extrabold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                      Chỉ xem
                    </span>
                  )}
                  {planLocked && (
                    <span className="ml-2 align-middle text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                      Đã khóa
                    </span>
                  )}
                </label>
                <select
                  value={plan}
                  onChange={(e) => {
                    if (!canManagePlanAndData || planLocked) return;
                    setPlan(e.target.value);
                  }}
                  // Sử dụng focus:border-mainColor
                  disabled={planSelectDisabled}
                  className={`w-full md:w-64 transition-colors text-sm font-bold py-2.5 pl-3 pr-8 rounded-xl appearance-none outline-none border shadow-sm focus:border-mainColor focus:bg-white
                    ${
                      planSelectDisabled
                        ? "bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200 cursor-pointer"
                    }`}
                >
                  {PLAN_OPTIONS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
                {!planSelectDisabled && (
                  <IconChevronDown className="w-4 h-4 text-slate-500 absolute right-3 bottom-3.5 pointer-events-none" />
                )}
              </div>

              {/* Chức danh lấy theo user đang đăng nhập */}
              <div className="relative group flex-grow md:flex-grow-0">
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 ml-1">
                  Chức danh
                </label>
                <div className="w-full md:w-28 bg-slate-50 text-sm font-extrabold text-slate-700 py-2.5 px-3 rounded-xl border border-slate-200 shadow-sm">
                  {title}
                </div>
              </div>

              {/* Chọn Vai trò (nếu có) */}
              {(plan === "PA2" || plan === "PA3") && (
                <div className="relative group flex-grow md:flex-grow-0">
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 ml-1">
                    Vai trò nhóm
                  </label>
                  <select
                    value={groupRole}
                    onChange={(e) => {
                      if (!canManagePlanAndData) return;
                      setGroupRole(e.target.value);
                    }}
                    disabled={!canManagePlanAndData}
                    className={`w-full md:w-36 bg-slate-50 hover:bg-slate-100 transition-colors text-sm font-bold text-slate-800 py-2.5 pl-3 pr-8 rounded-xl appearance-none outline-none cursor-pointer border border-slate-200 focus:border-mainColor focus:bg-white shadow-sm ${!canManagePlanAndData ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    <option value="member">Thành viên</option>
                    <option value="leader">Trưởng nhóm</option>
                  </select>
                  <IconChevronDown className="w-4 h-4 text-slate-500 absolute right-3 bottom-3.5 pointer-events-none" />
                </div>
              )}

              {canManagePlanAndData && (
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={handleLockPlan}
                    disabled={
                      planLocked ||
                      planSaving ||
                      planLoading ||
                      (planNotSet === false && planLocked)
                    }
                    className={`h-[42px] px-4 rounded-xl text-xs font-extrabold border shadow-sm transition-colors ${planLocked ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed" : "bg-mainColor text-white border-mainColor hover:bg-opacity-90"}`}
                    title="Khóa phương án để áp dụng cho năm"
                  >
                    {planSaving
                      ? "Đang khóa..."
                      : planLocked
                        ? "Đã khóa"
                        : `Khóa PA (${academicYear})`}
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
                <span className="text-sm font-bold text-slate-400">giờ</span>
              </div>
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black tracking-tight text-mainColor">
                  {round1(totalHours)}
                </span>
                <span className="text-sm font-bold text-slate-400">giờ</span>
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

          {/* Card: Checklist Kết quả */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-700 text-sm uppercase">
                  Tiêu chí {plan}
                </h3>
              </div>
              {/* Pass/Fail vẫn giữ màu xanh lá/đỏ để đảm bảo ngữ nghĩa UI */}
              <span
                className={`text-xs font-extrabold px-3 py-1 rounded-md border ${result.overallOk ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "bg-rose-50 border-rose-200 text-rose-600"}`}
              >
                {result.overallOk ? "ĐẠT YÊU CẦU" : "CHƯA ĐẠT"}
              </span>
            </div>

            <div className="p-5 overflow-y-auto max-h-[180px] scrollbar-thin scrollbar-thumb-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                {result.checks.map((c, idx) => {
                  // --- LOGIC CHO TRƯỜNG HỢP OR (Bảng 5) ---
                  if (c.isOr) {
                    return (
                      <div
                        key={idx}
                        className={`md:col-span-2 rounded-xl p-3 border transition-all ${c.ok ? "bg-emerald-50/40 border-emerald-100" : "bg-rose-50/40 border-rose-100"}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`text-xs font-black uppercase tracking-wide ${c.ok ? "text-emerald-700" : "text-rose-700"}`}
                          >
                            {c.label}
                          </span>
                          {c.ok ? (
                            <div className="text-emerald-600 bg-white rounded-md p-0.5">
                              <IconCheck />
                            </div>
                          ) : (
                            <span className="text-[10px] text-rose-500 font-bold bg-white px-2 py-0.5 rounded border border-rose-100">
                              Thiếu
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {c.options.map((o, i) => {
                            const isOptPass = o.req > 0 && o.got >= o.req;
                            return (
                              <div
                                key={i}
                                className={`text-xs flex justify-between px-3 py-1.5 rounded-lg transition-colors border ${isOptPass ? "bg-white shadow-sm text-emerald-700 font-bold border-emerald-100" : "text-slate-500 border-transparent"}`}
                              >
                                <span>{o.name}</span>
                                <span>
                                  {o.got}/{o.req}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }

                  // --- LOGIC THÔNG THƯỜNG ---
                  const req = Number(c.req || 0);
                  const got = Number(c.got || 0);
                  const isPass = req === 0 || got >= req;

                  return (
                    <div
                      key={idx}
                      className={`flex items-center justify-between text-sm py-2 px-3 rounded-lg border transition-all ${isPass ? "bg-emerald-50/50 border-emerald-100/50" : "bg-transparent border-slate-50"}`}
                    >
                      <span
                        className={`truncate mr-3 font-semibold transition-colors ${isPass ? "text-emerald-800" : "text-slate-600"}`}
                      >
                        {c.label}
                      </span>
                      <div className="flex items-center gap-3 text-xs min-w-fit">
                        <span
                          className={`font-bold transition-colors px-2 py-0.5 rounded ${isPass ? "bg-white text-emerald-600 shadow-sm" : "bg-slate-100 text-slate-500"}`}
                        >
                          {got} / {req}
                        </span>
                        {isPass ? (
                          <div className="text-emerald-500">
                            <IconCheck />
                          </div>
                        ) : (
                          <div className="text-rose-300">
                            <IconX />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Input Section */}
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-200 overflow-hidden">
          <div className="px-6 py-5 flex items-center justify-between bg-slate-50 border-b border-slate-100">
            <div>
              <h2 className="font-bold text-lg text-slate-800">
                Nhập dữ liệu hoạt động
              </h2>
              <p className="text-slate-500 text-xs mt-1">
                {canManagePlanAndData
                  ? "Nhập số lượng thực tế. Giờ quy đổi sẽ tự động tính."
                  : "Dữ liệu hoạt động chỉ để xem (không cho chỉnh sửa)."}
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {CRITERIA.map((g) => (
              <div key={g.id} className="group">
                <button
                  onClick={() => toggle(g.id)}
                  className="w-full flex items-center justify-between px-6 py-4 bg-white hover:bg-slate-50 transition-colors focus:outline-none"
                >
                  <span
                    className={`font-bold text-sm md:text-base transition-colors ${openIds.includes(g.id) ? "text-slate-900" : "text-slate-600"}`}
                  >
                    {g.name}
                  </span>
                  <div
                    className={`p-1 rounded-md transition-all ${openIds.includes(g.id) ? "bg-slate-200 rotate-180" : "bg-slate-100"}`}
                  >
                    <IconChevronDown className="w-4 h-4 text-slate-500" />
                  </div>
                </button>

                {openIds.includes(g.id) && (
                  <div className="px-6 pb-6 pt-2 bg-slate-50/30 animate-in slide-in-from-top-1 duration-200">
                    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">
                          <tr>
                            <th className="py-3 pl-4 min-w-[220px]">
                              Nội dung
                            </th>
                            <th className="py-3 text-center w-16">
                              Định mức(S)
                            </th>
                            <th className="py-3 text-center w-28">Số lượng</th>
                            <th className="py-3 text-center w-36">Đồng TG</th>
                            <th className="py-3 text-center w-36">Vai trò</th>
                            <th className="py-3 pr-4 text-right w-24">Giờ</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm">
                          {g.children.map((c) => {
                            const d = values[c.id] || {};
                            const hours = calcHours(c);
                            const hasQty = Number(d.qty) > 0;

                            return (
                              <tr
                                key={c.id}
                                className={`group/row transition-colors border-b border-slate-50 last:border-0 ${hasQty ? "bg-slate-50" : "hover:bg-slate-50"}`}
                              >
                                <td className="py-3 pl-4 align-middle">
                                  <div
                                    className={`font-semibold transition-colors ${hasQty ? "text-slate-900" : "text-slate-600"}`}
                                  >
                                    {c.name}
                                  </div>
                                  <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                                    {c.unit} {c.isTeam && "• Đồng tác giả"}
                                  </div>
                                </td>
                                <td className="py-3 text-center">
                                  <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">
                                    {c.quota}
                                  </span>
                                </td>

                                {/* Input Số lượng */}
                                <td className="py-3 text-center">
                                  <input
                                    type="number"
                                    min="0"
                                    placeholder="0"
                                    // Dùng text-mainColor khi có giá trị
                                    disabled={!canManagePlanAndData}
                                    className={`w-20 text-center font-bold outline-none border rounded-lg py-1.5 transition-all focus:ring-2 focus:ring-opacity-20 shadow-sm ${hasQty ? "bg-white border-slate-300 text-mainColor" : "bg-slate-50 border-slate-200 text-slate-500"} ${!canManagePlanAndData ? "opacity-60 cursor-not-allowed" : ""}`}
                                    value={d.qty ?? ""}
                                    onChange={(e) =>
                                      update(c.id, "qty", e.target.value)
                                    }
                                  />
                                </td>

                                {/* Input Người tham gia (Chỉ hiện nếu isTeam) */}
                                <td className="py-3 text-center">
                                  {c.isTeam ? (
                                    <div
                                      className={`flex items-center justify-center relative transition-opacity ${!hasQty && "opacity-30 grayscale pointer-events-none"}`}
                                    >
                                      <IconUserGroup />
                                      <input
                                        type="number"
                                        min="1"
                                        // focus:border-mainColor
                                        disabled={!canManagePlanAndData}
                                        className={`w-14 ml-1.5 text-center font-semibold outline-none border-b-2 border-slate-200 focus:border-mainColor bg-transparent py-1 transition-colors ${!canManagePlanAndData ? "cursor-not-allowed" : ""}`}
                                        value={d.participants ?? 1}
                                        onChange={(e) =>
                                          update(
                                            c.id,
                                            "participants",
                                            e.target.value,
                                          )
                                        }
                                      />
                                    </div>
                                  ) : (
                                    <span className="text-slate-200">—</span>
                                  )}
                                </td>

                                {/* Input Vai trò */}
                                <td className="py-3 text-center">
                                  {c.isTeam ? (
                                    <select
                                      value={d.role ?? "main"}
                                      onChange={(e) =>
                                        update(c.id, "role", e.target.value)
                                      }
                                      disabled={!canManagePlanAndData}
                                      // focus:border-mainColor
                                      className={`text-xs font-semibold py-1.5 px-2 rounded-lg border border-slate-200 outline-none focus:border-mainColor cursor-pointer bg-white transition-opacity ${(!hasQty || !canManagePlanAndData) && "opacity-30 pointer-events-none"}`}
                                    >
                                      <option value="main">
                                        Tác giả chính
                                      </option>
                                      <option value="member">Thành viên</option>
                                    </select>
                                  ) : (
                                    <span className="text-slate-200">—</span>
                                  )}
                                </td>

                                <td className="py-3 pr-4 text-right">
                                  {/* Số giờ quy đổi hiển thị text-mainColor */}
                                  <span
                                    className={`font-black text-lg transition-colors ${hours > 0 ? "text-mainColor" : "text-slate-200"}`}
                                  >
                                    {hours > 0 ? round1(hours) : "0"}
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
            ))}
          </div>
        </div>
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
