import React, { useMemo, useState } from "react";

/**
 * =========================
 * 0) Helpers UI
 * =========================
 */
const Badge = ({ ok, children }) => (
  <span
    className={[
      "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-extrabold",
      ok ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200",
    ].join(" ")}
  >
    {children}
  </span>
);

const Card = ({ title, sub, children }) => (
  <div className="rounded-2xl border bg-white p-5 shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <div>
        <div className="text-sm font-black text-slate-900">{title}</div>
        {sub && <div className="mt-1 text-xs font-bold text-slate-400">{sub}</div>}
      </div>
    </div>
    <div className="mt-4">{children}</div>
  </div>
);

/**
 * =========================
 * 1) BẢNG QUY ĐỔI GIỜ (13 danh mục)
 * - qty: số lượng thực tế (0/1/2...)
 * - participants: số người tham gia (n)
 * - role: main/member (tác giả chính / thành viên)
 *
 * Công thức (theo bạn chốt):
 *  - Tác giả chính:  S/3 + 2S/(3n)
 *  - Thành viên:     2S/(3n)
 * =========================
 */
const CRITERIA = [
  { id: "1", name: "1. Seminar", children: [{ id: "1.1", name: "Trình bày Seminar", unit: "lần", quota: 10 }] },

  {
    id: "2",
    name: "2. Hội thảo",
    children: [
      { id: "2.1", name: "Tổ chức HT Quốc tế", unit: "hội thảo", quota: 100 },
      { id: "2.2", name: "Tổ chức HT Quốc gia", unit: "hội thảo", quota: 60 },
      { id: "2.3", name: "Tổ chức HT Học viện", unit: "hội thảo", quota: 20 },
      { id: "2.4", name: "Trình bày HT Quốc tế", unit: "bài", quota: 50, isTeam: true },
      { id: "2.5", name: "Trình bày HT Quốc gia", unit: "bài", quota: 30, isTeam: true },
      { id: "2.6", name: "Trình bày HT Học viện", unit: "bài", quota: 20, isTeam: true },
    ],
  },

  {
    id: "3",
    name: "3. Bài báo quốc tế / tiếng Anh",
    children: [
      { id: "3.1", name: "Bài WoS", unit: "bài", quota: 210, isTeam: true },
      { id: "3.2", name: "Bài Scopus", unit: "bài", quota: 140, isTeam: true },
      { id: "3.3", name: "Bài tiếng Anh (Tạp chí HV)", unit: "bài", quota: 70, isTeam: true },
      { id: "3.4", name: "Bài quốc tế khác (không WoS/Scopus)", unit: "bài", quota: 60, isTeam: true },
      { id: "3.5", name: "Trích dẫn bài báo tiếng Anh HV", unit: "lần", quota: 1 },
    ],
  },

  {
    id: "4",
    name: "4. Bài báo tiếng Việt",
    children: [
      { id: "4.1", name: "Tạp chí HV (Tiếng Việt)", unit: "bài", quota: 40, isTeam: true },
      { id: "4.2", name: "Tạp chí chuyên ngành khác", unit: "bài", quota: 20, isTeam: true },
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

  { id: "6", name: "6. Bài tổng quan lĩnh vực", children: [{ id: "6.1", name: "Bài tổng quan", unit: "bài", quota: 10, isTeam: true }] },

  { id: "7", name: "7. Tư vấn/Hướng dẫn/Bản tin website", children: [{ id: "7.1", name: "Sản phẩm website", unit: "SP", quota: 5 }] },

  { id: "8", name: "8. Quy trình/Tiêu chuẩn/Góp ý", children: [{ id: "8.1", name: "Sản phẩm quy trình/góp ý", unit: "SP", quota: 10 }] },

  {
    id: "9",
    name: "9. Đề xuất nhiệm vụ KH&CN",
    children: [
      { id: "9.1", name: "Đề xuất cấp Quốc gia", unit: "đề xuất", quota: 10 },
      { id: "9.2", name: "Đề xuất cấp Bộ & tương đương", unit: "đề xuất", quota: 5 },
      { id: "9.3", name: "Đề xuất HV trọng điểm", unit: "đề xuất", quota: 2.5 },
    ],
  },

  {
    id: "10",
    name: "10. Nhiệm vụ KH&CN được phê duyệt",
    children: [
      { id: "10.1", name: "Cấp Quốc gia: Chủ nhiệm", unit: "đề tài", quota: 90 },
      { id: "10.2", name: "Cấp Quốc gia: Thư ký", unit: "đề tài", quota: 40 },
      { id: "10.3", name: "Cấp Quốc gia: Tham gia (tối đa 8)", unit: "đề tài", quota: 150, isTeam: true },

      { id: "10.4", name: "Cấp Bộ & tương đương: Chủ nhiệm", unit: "đề tài", quota: 70 },
      { id: "10.5", name: "Cấp Bộ & tương đương: Thư ký", unit: "đề tài", quota: 30 },
      { id: "10.6", name: "Cấp Bộ & tương đương: Tham gia (tối đa 8)", unit: "đề tài", quota: 110, isTeam: true },

      { id: "10.7", name: "Cấp Học viện: Chủ nhiệm", unit: "đề tài", quota: 15 },
      { id: "10.8", name: "Cấp Học viện: Tham gia (tối đa 4)", unit: "đề tài", quota: 25, isTeam: true },

      { id: "10.9", name: "Hướng dẫn SV NCKH", unit: "nhóm", quota: 15 },
    ],
  },

  { id: "11", name: "11. Hội đồng tư vấn khoa học", children: [{ id: "11.1", name: "Hội đồng", unit: "hội đồng", quota: 20 }] },

  { id: "12", name: "12. Mời chuyên gia Seminar/Chuyên đề", children: [{ id: "12.1", name: "Mời chuyên gia", unit: "lần", quota: 15 }] },

  {
    id: "13",
    name: "13. Hoạt động KH&CN khác",
    children: [
      { id: "13.1", name: "Chương sách (ISBN)", unit: "chương", quota: 80, isTeam: true },
      { id: "13.2", name: "Đề án Học viện (50–120)", unit: "đề án", quota: 80 },
      { id: "13.3", name: "Bài quảng bá", unit: "bài", quota: 10 },
      { id: "13.4", name: "Giáo trình xuất bản", unit: "giáo trình", quota: 80, isTeam: true },
      { id: "13.5", name: "Bài giảng môn học mới", unit: "bài giảng", quota: 30, isTeam: true },
      { id: "13.6", name: "Sách chuyên khảo", unit: "sách", quota: 40, isTeam: true },
      { id: "13.7", name: "Sách tham khảo", unit: "sách", quota: 20, isTeam: true },
      { id: "13.8", name: "Hợp đồng KH&CN", unit: "10 triệu", quota: 1 },
    ],
  },
];

/**
 * =========================
 * 2) Quy tắc xét đạt theo 6 PHƯƠNG ÁN
 * - PA0: chuẩn (Bảng 1)
 * - PA1: nhóm mạnh (Bảng 2 – phần cá nhân)
 * - PA2: nhóm xuất sắc (Bảng 3)
 * - PA3: nhóm tinh hoa (Bảng 4)
 * - PA4: chỉ tiêu bài báo hoặc đề tài (Bảng 5)
 * - PA5: chỉ tiêu chỉ bài báo (Bảng 6)
 *
 * ⚠️ PA4/PA5: một vài ô nhỏ trong ảnh khó đọc tuyệt đối.
 *    Bạn có thể chỉnh số ở đây cho khớp 100% văn bản của bạn.
 * =========================
 */
const PLAN_OPTIONS = [
  { id: "PA0", label: "PA0 - Định mức chuẩn (Bảng 1)" },
  { id: "PA1", label: "PA1 - Nhóm nghiên cứu mạnh (Bảng 2)" },
  { id: "PA2", label: "PA2 - Nhóm nghiên cứu xuất sắc (Bảng 3)" },
  { id: "PA3", label: "PA3 - Nhóm nghiên cứu tinh hoa (Bảng 4)" },
  { id: "PA4", label: "PA4 - Chỉ tiêu bài báo hoặc đề tài (Bảng 5)" },
  { id: "PA5", label: "PA5 - Chỉ tiêu chỉ bài báo khoa học (Bảng 6)" },
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
    task_bo_pi: 0.4, // (đề tài cấp Bộ & tương đương - chủ trì) / hoặc hướng dẫn...
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
    review: 0, // tổng quan theo nhóm
    consult: 0,
    process: 0.8,
    proposal_bo: 1.6,
    task_bo_pi: 0.32,
    council: 0, // theo nhóm
    expert: 0,  // theo nhóm
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
    task_bo_pi: 0.8, // theo ảnh: “hướng dẫn SV / HĐ KH&CN khác” cho KS/CN
    council: 0,
    expert: 0,
  },
};

// PA2/PA3: theo bảng 3/4 (chỉ 2 tiêu chí, có leader/member)
const TABLE3_EXCELLENT = {
  leader: {
    papers_wos_scopus_first: 4, // (3 WoS)
    bo_project_pi: 2,
  },
  member: {
    "GS/PGS": { papers_wos_scopus_first: 0.6, bo_project_pi: 0.4 },
    TS: { papers_wos_scopus_first: 0.4, bo_project_pi: 0.4 },
    ThS: { papers_wos_scopus_first: 0, bo_project_pi: 0 },
  },
};

const TABLE4_ELITE = {
  leader: {
    papers_wos_scopus_first: 8, // (5 WoS)
    bo_project_pi: 4,
  },
  member: {
    "GS/PGS": { papers_wos_scopus_first: 0.48, bo_project_pi: 0.32 },
    TS: { papers_wos_scopus_first: 0.32, bo_project_pi: 0.32 },
    ThS: { papers_wos_scopus_first: 0, bo_project_pi: 0 },
  },
};

// PA4 (Bảng 5): chỉ tiêu bài báo hoặc đề tài (dạng OR theo chức danh)
// ⚠️ Bạn kiểm lại từng ô nếu cần.
const TABLE5_ARTICLE_OR_PROJECT = {
  "GS/PGS": {
    // đạt nếu có 1 trong:
    wos_first: 1,
    scopus_first: 0, // không yêu cầu riêng
    en_hv_first: 0,
    vi_first: 0,
    bo_project_pi: 1, // hoặc chủ nhiệm đề tài cấp Bộ/Quốc gia
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
    // trong ảnh có “chủ nhiệm đề tài cấp tỉnh, doanh nghiệp” = 1
    province_or_company_pi: 1,
  },
  "KS/CN": {
    wos_first: 0,
    scopus_first: 0,
    en_hv_first: 0,
    vi_first: 1,
  },
};

// PA5 (Bảng 6): chỉ tiêu chỉ bài báo khoa học (0.3 bài/năm tuỳ chức danh)
// ⚠️ Bạn kiểm lại nếu văn bản bạn khác.
const TABLE6_ONLY_ARTICLES = {
  "GS/PGS": { wos_scopus_first: 0.3 },
  TS: { wos_scopus_first: 0.3 },
  ThS: { en_hv_first: 0.3 },
  "KS/CN": { vi_first: 0.3 },
};

function round1(x) {
  return Math.round(x * 10) / 10;
}

/**
 * =========================
 * 3) Component
 * =========================
 */
export default function ActivityStandards() {
  const [plan, setPlan] = useState("PA0");
  const [title, setTitle] = useState("TS");
  const [groupRole, setGroupRole] = useState("member"); // chỉ dùng cho PA2/PA3
  const [openIds, setOpenIds] = useState(() => CRITERIA.map((g) => g.id));
  const [values, setValues] = useState({}); // { childId: { qty, participants, role } }

  const update = (id, field, value) => {
    setValues((p) => ({ ...p, [id]: { ...p[id], [field]: value } }));
  };

  const toggle = (gid) => {
    setOpenIds((prev) => (prev.includes(gid) ? prev.filter((x) => x !== gid) : [...prev, gid]));
  };

  // Tính giờ theo công thức chia tác giả
  const calcHours = (child) => {
    const d = values[child.id] || {};
    const qty = Number(d.qty || 0);
    const S = child.quota;

    if (!child.isTeam) return qty * S;

    const participants = Math.max(1, Number(d.participants || 1));
    const role = d.role || "main"; // main = tác giả chính
    const mainShare = S / 3;
    const memberShare = (2 * S) / (3 * participants);
    const unit = role === "main" ? mainShare + memberShare : memberShare;
    return qty * unit;
  };

  // Gom số liệu để xét định mức theo các bảng
  const metrics = useMemo(() => {
    const m = {
      // PA0/PA1
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

      // phục vụ PA2/PA3/PA4/PA5 (tác giả chính)
      wos_first: 0,
      scopus_first: 0,
      wos_scopus_first: 0,
      en_hv_first: 0,
      vi_first: 0,

      // đề tài
      bo_project_pi: 0,
      province_or_company_pi: 0,
    };

    // Helper lấy qty và role
    const get = (id) => values[id] || {};
    const qty = (id) => Number(get(id).qty || 0);
    const isMain = (id) => (get(id).role || "main") === "main";

    // Seminar
    m.sem += qty("1.1");

    // Hội thảo (tính số lần/ năm theo bảng: gộp tất cả hoạt động hội thảo)
    m.conf += qty("2.1") + qty("2.2") + qty("2.3") + qty("2.4") + qty("2.5") + qty("2.6");

    // Bài báo quốc tế (số lượng)
    m.int_wos_scopus += qty("3.1") + qty("3.2") + qty("3.4");
    m.en_hv += qty("3.3");

    // Bài báo TV
    m.vi += qty("4.1") + qty("4.2");

    // Kỷ yếu
    m.proceedings += qty("5.1") + qty("5.2") + qty("5.3");

    // Tổng quan
    m.review += qty("6.1");

    // Website / quy trình
    m.consult += qty("7.1");
    m.process += qty("8.1");

    // Đề xuất cấp Bộ
    m.proposal_bo += qty("9.2");

    // Nhiệm vụ KH&CN (Bảng 1 ghi chủ trì/hướng dẫn)
    // -> mình tính task_bo_pi = (chủ nhiệm cấp Bộ) + (hướng dẫn SV)
    // Nếu bạn muốn tính cả 10.1/10.7 thì thêm vào.
    m.task_bo_pi += qty("10.4") + qty("10.9");

    // Hội đồng / chuyên gia
    m.council += qty("11.1");
    m.expert += qty("12.1");

    // Tác giả chính cho PA2/PA3/PA4/PA5:
    if (qty("3.1") > 0 && isMain("3.1")) m.wos_first += qty("3.1");
    if (qty("3.2") > 0 && isMain("3.2")) m.scopus_first += qty("3.2");

    m.wos_scopus_first = m.wos_first + m.scopus_first;

    if (qty("3.3") > 0 && isMain("3.3")) m.en_hv_first += qty("3.3");

    // tiếng Việt tác giả chính: lấy 4.1 + 4.2 nếu role main (mỗi item có role riêng)
    if (qty("4.1") > 0 && isMain("4.1")) m.vi_first += qty("4.1");
    if (qty("4.2") > 0 && isMain("4.2")) m.vi_first += qty("4.2");

    // Đề tài cấp Bộ chủ trì
    m.bo_project_pi += qty("10.4");

    // Đề tài cấp tỉnh/doanh nghiệp: trong form quy đổi giờ bạn chưa tách mục này rõ,
    // tạm lấy "Cấp Học viện chủ nhiệm" làm gần nhất. Nếu bạn có mục riêng thì đổi lại.
    m.province_or_company_pi += qty("10.7");

    return m;
  }, [values]);

  const totalHours = useMemo(() => {
    let sum = 0;
    for (const g of CRITERIA) for (const c of g.children) sum += calcHours(c);
    return sum;
  }, [values]);

  /**
   * =========================
   * 4) XÉT ĐẠT THEO PHƯƠNG ÁN
   * =========================
   */
  const result = useMemo(() => {
    const checks = [];

    const add = (label, got, req) => {
      const ok = req === 0 ? true : got >= req;
      checks.push({ label, got, req, ok });
    };

    const addOR = (label, options) => {
      // options: [{name, got, req}]
      const ok = options.some((x) => (x.req === 0 ? false : x.got >= x.req));
      checks.push({
        label,
        got: null,
        req: null,
        ok,
        options,
        isOr: true,
      });
    };

    let overallOk = true;

    if (plan === "PA0") {
      const req = TABLE1_STANDARD[title];

      add("Seminar", metrics.sem, req.sem);
      add("Hội thảo", metrics.conf, req.conf);
      add("Bài báo quốc tế (WoS/Scopus/khác)", metrics.int_wos_scopus, req.int_wos_scopus);
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
      // xuất sắc
      if (groupRole === "leader") {
        add("Bài WoS/Scopus (tác giả chính)", metrics.wos_scopus_first, TABLE3_EXCELLENT.leader.papers_wos_scopus_first);
        add("Đề tài cấp Bộ & tương đương (chủ trì)", metrics.bo_project_pi, TABLE3_EXCELLENT.leader.bo_project_pi);
      } else {
        const req = TABLE3_EXCELLENT.member[title] || { papers_wos_scopus_first: 0, bo_project_pi: 0 };
        add("Bài WoS/Scopus (tác giả chính)", metrics.wos_scopus_first, req.papers_wos_scopus_first);
        add("Đề tài cấp Bộ & tương đương (chủ trì)", metrics.bo_project_pi, req.bo_project_pi);
      }
      overallOk = checks.every((c) => c.ok);
      // PA2 không dùng tổng giờ chuẩn 300/220... (văn bản là tiêu chí riêng), nhưng mình vẫn hiển thị giờ quy đổi bên ngoài.
      return { checks, overallOk, requiredHours: null };
    }

    if (plan === "PA3") {
      // tinh hoa
      if (groupRole === "leader") {
        add("Bài WoS/Scopus (tác giả chính)", metrics.wos_scopus_first, TABLE4_ELITE.leader.papers_wos_scopus_first);
        add("Đề tài cấp Bộ & tương đương (chủ trì)", metrics.bo_project_pi, TABLE4_ELITE.leader.bo_project_pi);
      } else {
        const req = TABLE4_ELITE.member[title] || { papers_wos_scopus_first: 0, bo_project_pi: 0 };
        add("Bài WoS/Scopus (tác giả chính)", metrics.wos_scopus_first, req.papers_wos_scopus_first);
        add("Đề tài cấp Bộ & tương đương (chủ trì)", metrics.bo_project_pi, req.bo_project_pi);
      }
      overallOk = checks.every((c) => c.ok);
      return { checks, overallOk, requiredHours: null };
    }

    if (plan === "PA4") {
      // bài báo hoặc đề tài: đạt nếu thỏa 1 trong các lựa chọn theo chức danh
      const req = TABLE5_ARTICLE_OR_PROJECT[title];

      if (title === "GS/PGS") {
        addOR("Đạt theo Bảng 5 (chọn 1 trong các tiêu chí)", [
          { name: "1 bài WoS (tác giả chính)", got: metrics.wos_first, req: req.wos_first },
          { name: "Chủ nhiệm đề tài cấp Bộ/Quốc gia", got: metrics.bo_project_pi, req: req.bo_project_pi },
        ]);
      } else if (title === "TS") {
        addOR("Đạt theo Bảng 5 (chọn 1 trong các tiêu chí)", [
          { name: "1 bài Scopus (tác giả chính)", got: metrics.scopus_first, req: req.scopus_first },
          { name: "Chủ nhiệm đề tài cấp Bộ/Quốc gia", got: metrics.bo_project_pi, req: req.bo_project_pi },
        ]);
      } else if (title === "ThS") {
        addOR("Đạt theo Bảng 5 (chọn 1 trong các tiêu chí)", [
          { name: "1 bài tiếng Anh (Tạp chí HV) - tác giả chính", got: metrics.en_hv_first, req: req.en_hv_first },
          { name: "Chủ nhiệm đề tài cấp tỉnh/doanh nghiệp", got: metrics.province_or_company_pi, req: req.province_or_company_pi },
        ]);
      } else {
        add("1 bài tiếng Việt (tác giả chính)", metrics.vi_first, req.vi_first);
      }

      overallOk = checks.every((c) => c.ok);
      return { checks, overallOk, requiredHours: null };
    }

    if (plan === "PA5") {
      // chỉ bài báo: 0.3 bài/năm tuỳ chức danh
      const req = TABLE6_ONLY_ARTICLES[title];

      if (title === "GS/PGS" || title === "TS") {
        add("WoS/Scopus (tác giả chính)", metrics.wos_scopus_first, req.wos_scopus_first);
      } else if (title === "ThS") {
        add("Bài tiếng Anh (Tạp chí HV) - tác giả chính", metrics.en_hv_first, req.en_hv_first);
      } else {
        add("Bài tiếng Việt - tác giả chính", metrics.vi_first, req.vi_first);
      }

      overallOk = checks.every((c) => c.ok);
      return { checks, overallOk, requiredHours: null };
    }

    return { checks: [], overallOk: false, requiredHours: null };
  }, [plan, title, groupRole, metrics]);

  const hoursDone =
    result.requiredHours == null ? null : totalHours >= Number(result.requiredHours || 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4">
      <div className="mx-auto max-w-7xl space-y-4">
        {/* Header */}
        <div className="rounded-2xl border bg-white p-5 shadow-sm flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-2xl font-black">Kê khai NCKH theo 6 phương án</div>
            <div className="mt-1 text-xs font-bold text-slate-400">
              Bạn nhập số lượng thực tế (0/1/2...). Hệ thống tự xét ĐẠT theo phương án + tính giờ quy đổi theo bảng giờ.
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="rounded-xl border bg-slate-50 px-3 py-2">
              <div className="text-[11px] font-extrabold text-slate-500 uppercase">Phương án</div>
              <select
                className="mt-1 bg-transparent font-black outline-none"
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
              >
                {PLAN_OPTIONS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-xl border bg-slate-50 px-3 py-2">
              <div className="text-[11px] font-extrabold text-slate-500 uppercase">Chức danh</div>
              <select
                className="mt-1 bg-transparent font-black outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              >
                <option value="GS/PGS">GS/PGS</option>
                <option value="TS">TS</option>
                <option value="ThS">ThS</option>
                <option value="KS/CN">KS/CN</option>
              </select>
            </div>

            {(plan === "PA2" || plan === "PA3") && (
              <div className="rounded-xl border bg-slate-50 px-3 py-2">
                <div className="text-[11px] font-extrabold text-slate-500 uppercase">Vai trò trong nhóm</div>
                <select
                  className="mt-1 bg-transparent font-black outline-none"
                  value={groupRole}
                  onChange={(e) => setGroupRole(e.target.value)}
                >
                  <option value="member">Thành viên tham gia</option>
                  <option value="leader">Trưởng nhóm</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card title="Giờ quy đổi đã đạt" sub="Tính theo bảng quy đổi giờ + chia tác giả">
            <div className="text-3xl font-black text-indigo-700">{round1(totalHours)}</div>
          </Card>

          <Card
            title="Kết luận theo phương án"
            sub="Đạt/Chưa đạt theo đúng tiêu chí của phương án đã chọn"
          >
            <div className="flex items-center gap-2">
              <Badge ok={result.overallOk}>{result.overallOk ? "✅ ĐẠT" : "❌ CHƯA ĐẠT"}</Badge>
              <div className="text-sm font-bold text-slate-600">
                {plan === "PA0" ? "Theo Bảng 1" : plan === "PA1" ? "Theo Bảng 2" : plan === "PA2" ? "Theo Bảng 3" : plan === "PA3" ? "Theo Bảng 4" : plan === "PA4" ? "Theo Bảng 5" : "Theo Bảng 6"}
              </div>
            </div>
          </Card>

          <Card
            title="Kết luận theo GIỜ (chỉ PA0/PA1)"
            sub={result.requiredHours == null ? "PA2–PA5 không dùng tổng giờ chuẩn, xét theo tiêu chí riêng" : `Yêu cầu giờ: ${result.requiredHours}`}
          >
            {result.requiredHours == null ? (
              <div className="text-sm font-bold text-slate-500">—</div>
            ) : (
              <div className="flex items-center gap-2">
                <Badge ok={hoursDone}>{hoursDone ? "✅ ĐỦ GIỜ" : "❌ CHƯA ĐỦ GIỜ"}</Badge>
                <div className="text-sm font-bold text-slate-600">
                  Thiếu/Thừa: {round1(totalHours - Number(result.requiredHours || 0))}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Checklist */}
        <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
          <div className="px-5 py-4 bg-slate-900 text-white">
            <div className="font-black">Bảng kiểm theo phương án</div>
            <div className="text-xs font-bold opacity-80">
              Lưu ý: các ngưỡng như 0.6/0.48/0.3 là “định mức”, bạn không nhập — bạn chỉ nhập số lượng thực tế.
            </div>
          </div>

          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3">
            {result.checks.map((c, idx) => {
              if (c.isOr) {
                return (
                  <div key={idx} className={`rounded-xl border p-4 ${c.ok ? "bg-emerald-50" : "bg-rose-50"}`}>
                    <div className="flex items-center justify-between">
                      <div className="font-black">{c.label}</div>
                      <Badge ok={c.ok}>{c.ok ? "ĐẠT" : "CHƯA ĐẠT"}</Badge>
                    </div>
                    <div className="mt-2 space-y-1 text-sm font-bold text-slate-700">
                      {c.options.map((o, i) => {
                        const ok = o.req > 0 && o.got >= o.req;
                        return (
                          <div key={i} className="flex items-center justify-between gap-3">
                            <div className="text-slate-700">{o.name}</div>
                            <div className="flex items-center gap-2">
                              <div className="text-slate-600">{o.got} / {o.req}</div>
                              <Badge ok={ok}>{ok ? "OK" : "NO"}</Badge>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              const req = Number(c.req || 0);
              const got = Number(c.got || 0);
              return (
                <div key={idx} className={`rounded-xl border p-4 ${c.ok ? "bg-emerald-50" : "bg-rose-50"}`}>
                  <div className="flex items-center justify-between">
                    <div className="font-black">{c.label}</div>
                    <Badge ok={c.ok}>{req === 0 ? "Không yêu cầu" : c.ok ? "ĐẠT" : "CHƯA ĐẠT"}</Badge>
                  </div>
                  <div className="mt-2 text-sm font-bold text-slate-700">
                    Thực tế: <span className="text-slate-900">{got}</span> &nbsp;|&nbsp; Định mức:{" "}
                    <span className="text-slate-900">{req}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Input table 13 criteria */}
        <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
          <div className="px-5 py-4 bg-slate-800 text-white">
            <div className="font-black">Nhập dữ liệu thực tế (13 danh mục)</div>
            <div className="text-xs font-bold opacity-80">
              Mục có đồng tác giả: nhập <b>Số người tham gia</b> + chọn <b>Tác giả chính/Thành viên</b>.
            </div>
          </div>

          <div className="divide-y">
            {CRITERIA.map((g) => (
              <div key={g.id}>
                <button
                  onClick={() => toggle(g.id)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100"
                >
                  <div className="font-black text-slate-800">{g.name}</div>
                  <div className="text-xs font-extrabold text-slate-500">{openIds.includes(g.id) ? "▲ Thu" : "▼ Mở"}</div>
                </button>

                {openIds.includes(g.id) && (
                  <div className="px-5 py-4 overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="text-[11px] uppercase text-slate-500">
                        <tr>
                          <th className="py-2">Nội dung</th>
                          <th className="py-2 text-center w-24">ĐM (S)</th>
                          <th className="py-2 text-center w-28">Số lượng</th>
                          <th className="py-2 text-center w-44">Số người tham gia</th>
                          <th className="py-2 text-center w-36">Vai trò</th>
                          <th className="py-2 text-right w-28">Giờ</th>
                        </tr>
                      </thead>

                      <tbody className="text-sm">
                        {g.children.map((c) => {
                          const d = values[c.id] || {};
                          const hours = calcHours(c);
                          return (
                            <tr key={c.id} className="border-t">
                              <td className="py-3">
                                <div className="font-bold text-slate-800">{c.name}</div>
                                <div className="text-[11px] font-extrabold text-slate-400">
                                  Đơn vị: {c.unit} {c.isTeam ? "• Đồng tác giả" : ""}
                                </div>
                              </td>

                              <td className="py-3 text-center font-black text-slate-700">{c.quota}</td>

                              <td className="py-3 text-center">
                                <input
                                  type="number"
                                  min="0"
                                  step="1"
                                  value={d.qty ?? ""}
                                  onChange={(e) => update(c.id, "qty", e.target.value)}
                                  className="w-20 rounded-lg border px-2 py-1 text-center font-black outline-none focus:border-indigo-500"
                                  placeholder="0"
                                />
                              </td>

                              <td className="py-3 text-center">
                                {c.isTeam ? (
                                  <input
                                    type="number"
                                    min="1"
                                    step="1"
                                    value={d.participants ?? 1}
                                    onChange={(e) => update(c.id, "participants", e.target.value)}
                                    className="w-24 rounded-lg border px-2 py-1 text-center font-black outline-none focus:border-amber-500"
                                  />
                                ) : (
                                  <span className="text-slate-400 font-bold">—</span>
                                )}
                              </td>

                              <td className="py-3 text-center">
                                {c.isTeam ? (
                                  <select
                                    value={d.role ?? "main"}
                                    onChange={(e) => update(c.id, "role", e.target.value)}
                                    className="rounded-lg border px-2 py-1 font-bold outline-none"
                                  >
                                    <option value="main">Tác giả chính</option>
                                    <option value="member">Thành viên</option>
                                  </select>
                                ) : (
                                  <span className="text-slate-400 font-bold">—</span>
                                )}
                              </td>

                              <td className="py-3 text-right font-black text-indigo-700">{round1(hours)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="text-xs font-bold text-slate-400">
          Ghi chú: PA2/PA3/PA4/PA5 xét theo tiêu chí riêng (không phải “đủ 300/220/140/70 giờ”). PA0/PA1 có thể xem song song “đạt tiêu chí” và “đủ tổng giờ”.
        </div>
      </div>
    </div>
  );
}
