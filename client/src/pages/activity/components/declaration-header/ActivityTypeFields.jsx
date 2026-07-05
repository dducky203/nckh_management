import {
  CONFERENCE_ROLE_LABELS,
  INTL_CATEGORY_LABELS,
  LEVEL_LABELS,
  PROPOSAL_LEVEL_LABELS,
  VN_CATEGORY_LABELS,
} from "./constants";

const TASK_LEVEL_LABELS = {
  QG: "Cấp Quốc gia",
  BO: "Cấp Bộ / Tương đương",
  HV: "Cấp Học viện",
};

const TASK_ROLE_LABELS = {
  CHU_NHIEM: "Chủ nhiệm",
  THU_KY: "Thư ký",
  THAM_GIA: "Tham gia",
  HD_SV: "Hướng dẫn SV NCKH",
};

const OTHER_ACTIVITY_TYPE_LABELS = {
  CHUONG_SACH: "Chương sách (ISBN)",
  GIAO_TRINH: "Giáo trình",
  SACH_CHUYEN_KHAO: "Sách chuyên khảo",
  SACH_THAM_KHAO: "Sách tham khảo",
  HOP_DONG_KHCN: "Hợp đồng KH&CN",
  DE_AN_HV: "Đề án Học viện",
  BAI_QUANG_BA: "Bài quảng bá KH&CN",
};

/* ─── Reusable field primitives ─── */
function Field({ label, required, children, colSpan, error }) {
  return (
    <label className={`flex flex-col gap-1${colSpan ? ` md:col-span-${colSpan}` : ""}`}>
      <span className="text-xs font-bold text-slate-500">
        {label} {required && <span className="text-red-400">*</span>}
      </span>
      {children}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </label>
  );
}

const inputCls =
  "h-10 rounded-lg border border-slate-200 px-3 text-sm focus:outline-none focus:border-mainColor";
const selectCls =
  "h-10 rounded-lg border border-slate-200 px-3 text-sm focus:outline-none focus:border-mainColor";

const withError = (baseClass, error) =>
  `${baseClass} ${error ? "border-red-400 focus:border-red-400" : ""}`;

function TextInput({ value, onChange, placeholder, error }) {
  return (
    <input
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className={withError(inputCls, error)}
      placeholder={placeholder}
    />
  );
}

function NumberInput({ value, onChange, placeholder, min, error }) {
  return (
    <input
      type="number"
      value={value || ""}
      min={min}
      onChange={(e) => onChange(e.target.value)}
      className={withError(inputCls, error)}
      placeholder={placeholder}
    />
  );
}

function UrlInput({ value, onChange, placeholder, error }) {
  return (
    <input
      type="url"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className={withError(inputCls, error)}
      placeholder={placeholder || "https://..."}
    />
  );
}

function SelectInput({ value, onChange, options, error }) {
  return (
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className={withError(selectCls, error)}
    >
      {options.map(([val, label]) => (
        <option key={val} value={val}>
          {label}
        </option>
      ))}
    </select>
  );
}

/* ─── Divider ─── */
function SectionTitle({ children }) {
  return (
    <div className="col-span-full flex items-center gap-2 pt-1">
      <span className="text-[11px] font-extrabold uppercase tracking-widest text-mainColor">
        {children}
      </span>
      <div className="flex-1 h-px bg-slate-200" />
    </div>
  );
}

/* ================================================================
   Main component
================================================================ */
export default function ActivityTypeFields({
  form,
  options,
  onFormChange,
  onExtraDetailChange,
  errors = {},
}) {
  const ex = form.extraDetails || {};
  const onEx = onExtraDetailChange;

  /* ── SEMINAR ── */
  if (form.activityType === "SEMINAR") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <SectionTitle>Thông tin Seminar</SectionTitle>

        <Field label="Người / Nhóm trình bày" colSpan={2}>
          <TextInput value={ex.speaker} onChange={(v) => onEx("speaker", v)} placeholder="Họ tên người trình bày chính" />
        </Field>

        <Field label="Đơn vị / Bộ môn tổ chức">
          <TextInput
            value={form.venue}
            onChange={(v) => onFormChange("venue", v)}
            placeholder="Ví dụ: Khoa CNTT"
          />
        </Field>

        <Field label="Số lượng người tham dự">
          <NumberInput value={ex.attendeeCount} onChange={(v) => onEx("attendeeCount", v)} placeholder="Số người" min={1} />
        </Field>

        <Field label="Link slide / tài liệu" colSpan={2} error={errors.externalLink}>
          <UrlInput value={form.externalLink} onChange={(v) => onFormChange("externalLink", v)} error={errors.externalLink} />
        </Field>
      </div>
    );
  }

  /* ── CONFERENCE ── */
  if (form.activityType === "CONFERENCE") {
    const isOrg = form.conferenceRole === "ORG";
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <SectionTitle>Thông tin Hội thảo</SectionTitle>

        <Field label="Vai trò" required error={errors.conferenceRole}>
          <SelectInput
            value={form.conferenceRole}
            onChange={(v) => onFormChange("conferenceRole", v)}
            error={errors.conferenceRole}
            options={(options.conferenceRoles || []).map((it) => [it, CONFERENCE_ROLE_LABELS[it] || it])}
          />
        </Field>

        <Field label="Cấp độ hội thảo" required error={errors.conferenceLevel}>
          <SelectInput
            value={form.conferenceLevel}
            onChange={(v) => onFormChange("conferenceLevel", v)}
            error={errors.conferenceLevel}
            options={(options.conferenceLevels || []).map((it) => [it, LEVEL_LABELS[it] || it])}
          />
        </Field>

        {isOrg && (
          <div className="col-span-full rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-xs text-violet-700 font-semibold">
            Khai báo tổ chức hội thảo — sẽ tính vào <strong>Bảng 2 định mức nhóm NCM</strong>. Chỉ trưởng nhóm / thư ký nhóm được tạo sự kiện này.
          </div>
        )}

        <Field label="Tên hội thảo" colSpan={2} required error={errors.publicationName}>
          <TextInput value={form.publicationName} onChange={(v) => onFormChange("publicationName", v)} placeholder="Tên đầy đủ của hội thảo" error={errors.publicationName} />
        </Field>

        <Field label="Nơi tổ chức">
          <TextInput value={form.venue} onChange={(v) => onFormChange("venue", v)} placeholder="Thành phố, quốc gia..." />
        </Field>

        <Field label={isOrg ? "Số / Mã quyết định tổ chức" : "Số / Mã giấy chứng nhận"} required error={errors.identifierCode}>
          <TextInput value={form.identifierCode} onChange={(v) => onFormChange("identifierCode", v)} placeholder={isOrg ? "Số QĐ tổ chức hội thảo" : "Số chứng nhận tham dự"} error={errors.identifierCode} />
        </Field>

        <Field label="Link hội thảo" colSpan={2} error={errors.externalLink}>
          <UrlInput value={form.externalLink} onChange={(v) => onFormChange("externalLink", v)} placeholder="https://conference..." error={errors.externalLink} />
        </Field>
      </div>
    );
  }

  /* ── INTL_PAPER ── */
  if (form.activityType === "INTL_PAPER") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <SectionTitle>Thông tin Bài báo Quốc tế</SectionTitle>

        <Field label="Danh mục" required error={errors.intlPaperCategory}>
          <SelectInput
            value={form.intlPaperCategory}
            onChange={(v) => onFormChange("intlPaperCategory", v)}
            error={errors.intlPaperCategory}
            options={(options.intlPaperCategories || []).map((it) => [it, INTL_CATEGORY_LABELS[it] || it])}
          />
        </Field>

        <Field label="Tên tạp chí" required error={errors.publicationName}>
          <TextInput value={form.publicationName} onChange={(v) => onFormChange("publicationName", v)} placeholder="Journal of ..." error={errors.publicationName} />
        </Field>

        <Field label="Tập / Số (Volume / Issue)">
          <TextInput value={ex.volumeIssue} onChange={(v) => onEx("volumeIssue", v)} placeholder="Vol. 12, No. 3" />
        </Field>

        <Field label="Trang">
          <TextInput value={ex.pages} onChange={(v) => onEx("pages", v)} placeholder="123–145" />
        </Field>

        <Field label="DOI" required error={errors.identifierCode}>
          <TextInput value={form.identifierCode} onChange={(v) => onFormChange("identifierCode", v)} placeholder="10.xxxx/xxxxx" error={errors.identifierCode} />
        </Field>

        <Field label="Impact Factor / Điểm Q">
          <TextInput value={ex.impactFactor} onChange={(v) => onEx("impactFactor", v)} placeholder="Ví dụ: IF=3.2, Q1" />
        </Field>

        <Field label="Link bài báo" colSpan={2} error={errors.externalLink}>
          <UrlInput value={form.externalLink} onChange={(v) => onFormChange("externalLink", v)} error={errors.externalLink} />
        </Field>
      </div>
    );
  }

  /* ── VN_PAPER ── */
  if (form.activityType === "VN_PAPER") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <SectionTitle>Thông tin Bài báo Tiếng Việt</SectionTitle>

        <Field label="Danh mục" required error={errors.vnPaperCategory}>
          <SelectInput
            value={form.vnPaperCategory}
            onChange={(v) => onFormChange("vnPaperCategory", v)}
            error={errors.vnPaperCategory}
            options={(options.vnPaperCategories || []).map((it) => [it, VN_CATEGORY_LABELS[it] || it])}
          />
        </Field>

        <Field label="Tên tạp chí" required error={errors.publicationName}>
          <TextInput value={form.publicationName} onChange={(v) => onFormChange("publicationName", v)} placeholder="Tạp chí Khoa học và Công nghệ..." error={errors.publicationName} />
        </Field>

        <Field label="Tập / Số / Năm phát hành">
          <TextInput value={ex.volumeIssue} onChange={(v) => onEx("volumeIssue", v)} placeholder="Tập 10, Số 2 (2025)" />
        </Field>

        <Field label="ISSN" required error={errors.identifierCode}>
          <TextInput value={form.identifierCode} onChange={(v) => onFormChange("identifierCode", v)} placeholder="xxxx-xxxx" error={errors.identifierCode} />
        </Field>

        <Field label="Link bài báo" colSpan={2} error={errors.externalLink}>
          <UrlInput value={form.externalLink} onChange={(v) => onFormChange("externalLink", v)} error={errors.externalLink} />
        </Field>
      </div>
    );
  }

  /* ── PROCEEDING ── */
  if (form.activityType === "PROCEEDING") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <SectionTitle>Thông tin Bài tham luận kỷ yếu</SectionTitle>

        <Field label="Cấp độ" required error={errors.proceedingLevel}>
          <SelectInput
            value={form.proceedingLevel}
            onChange={(v) => onFormChange("proceedingLevel", v)}
            error={errors.proceedingLevel}
            options={(options.proceedingLevels || []).map((it) => [it, LEVEL_LABELS[it] || it])}
          />
        </Field>

        <Field label="Tên kỷ yếu / Hội thảo" required error={errors.publicationName}>
          <TextInput value={form.publicationName} onChange={(v) => onFormChange("publicationName", v)} placeholder="Tên kỷ yếu hoặc hội thảo" error={errors.publicationName} />
        </Field>

        <Field label="Nơi tổ chức">
          <TextInput value={form.venue} onChange={(v) => onFormChange("venue", v)} placeholder="Thành phố, quốc gia..." />
        </Field>

        <Field label="Trang">
          <TextInput value={ex.pages} onChange={(v) => onEx("pages", v)} placeholder="pp. 45–52" />
        </Field>

        <Field label="ISBN">
          <TextInput value={form.identifierCode} onChange={(v) => onFormChange("identifierCode", v)} placeholder="978-xxx-xxx" />
        </Field>

        <Field label="Link tài liệu" error={errors.externalLink}>
          <UrlInput value={form.externalLink} onChange={(v) => onFormChange("externalLink", v)} error={errors.externalLink} />
        </Field>
      </div>
    );
  }

  /* ── REVIEW_PAPER ── */
  if (form.activityType === "REVIEW_PAPER") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <SectionTitle>Thông tin Bài tổng quan lĩnh vực</SectionTitle>

        <Field label="Lĩnh vực tổng quan" colSpan={2} required error={errors.reviewField}>
          <TextInput value={ex.reviewField} onChange={(v) => onEx("reviewField", v)} placeholder="Ví dụ: Trí tuệ nhân tạo, Nông nghiệp công nghệ cao..." error={errors.reviewField} />
        </Field>

        <Field label="Đầu sách / Tạp chí đăng" required error={errors.publicationName}>
          <TextInput value={form.publicationName} onChange={(v) => onFormChange("publicationName", v)} placeholder="Tên tạp chí hoặc đầu sách" error={errors.publicationName} />
        </Field>

        <Field label="Số tài liệu tham khảo">
          <NumberInput value={ex.refCount} onChange={(v) => onEx("refCount", v)} placeholder="Ví dụ: 80" min={0} />
        </Field>

        <Field label="DOI / Mã định danh">
          <TextInput value={form.identifierCode} onChange={(v) => onFormChange("identifierCode", v)} placeholder="10.xxxx/xxxxx" />
        </Field>

        <Field label="Link bài báo">
          <UrlInput value={form.externalLink} onChange={(v) => onFormChange("externalLink", v)} />
        </Field>
      </div>
    );
  }

  /* ── TECH_CONSULT ── */
  if (form.activityType === "TECH_CONSULT") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <SectionTitle>Thông tin Tư vấn / Hướng dẫn kỹ thuật</SectionTitle>

        <Field label="Loại hình tư vấn">
          <SelectInput
            value={ex.consultType || ""}
            onChange={(v) => onEx("consultType", v)}
            options={[
              ["", "— Chọn loại hình —"],
              ["REPORT", "Báo cáo / Tài liệu kỹ thuật"],
              ["DIRECT", "Hướng dẫn trực tiếp"],
              ["POLICY", "Tư vấn chính sách"],
              ["OTHER", "Khác"],
            ]}
          />
        </Field>

        <Field label="Tên đề tài / Dự án" required error={errors.publicationName}>
          <TextInput value={form.publicationName} onChange={(v) => onFormChange("publicationName", v)} placeholder="Tên đề tài hoặc dự án tư vấn" error={errors.publicationName} />
        </Field>

        <Field label="Đơn vị thụ hưởng">
          <TextInput value={form.venue} onChange={(v) => onFormChange("venue", v)} placeholder="Tên tổ chức / đơn vị nhận tư vấn" />
        </Field>

        <Field label="Số hợp đồng / Văn bản" required error={errors.identifierCode}>
          <TextInput value={form.identifierCode} onChange={(v) => onFormChange("identifierCode", v)} placeholder="Số HĐ hoặc số văn bản" error={errors.identifierCode} />
        </Field>

        <Field label="Thời gian thực hiện">
          <TextInput value={ex.consultPeriod} onChange={(v) => onEx("consultPeriod", v)} placeholder="Ví dụ: T3/2025 – T9/2025" />
        </Field>

        <Field label="Link tài liệu" error={errors.externalLink}>
          <UrlInput value={form.externalLink} onChange={(v) => onFormChange("externalLink", v)} error={errors.externalLink} />
        </Field>
      </div>
    );
  }

  /* ── TECH_PROCEDURE ── */
  if (form.activityType === "TECH_PROCEDURE") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <SectionTitle>Thông tin Quy trình / Tiến bộ kỹ thuật</SectionTitle>

        <Field label="Tên tiến bộ kỹ thuật / Quy trình" colSpan={2} required error={errors.publicationName}>
          <TextInput value={form.publicationName} onChange={(v) => onFormChange("publicationName", v)} placeholder="Tên đầy đủ của quy trình / tiến bộ kỹ thuật" error={errors.publicationName} />
        </Field>

        <Field label="Mã / Số quyết định" required error={errors.identifierCode}>
          <TextInput value={form.identifierCode} onChange={(v) => onFormChange("identifierCode", v)} placeholder="Số QĐ công nhận" error={errors.identifierCode} />
        </Field>

        <Field label="Đơn vị công nhận / Cấp phép">
          <TextInput value={form.venue} onChange={(v) => onFormChange("venue", v)} placeholder="Tên cơ quan công nhận" />
        </Field>

        <Field label="Đơn vị / Địa phương áp dụng">
          <TextInput value={ex.applyUnit} onChange={(v) => onEx("applyUnit", v)} placeholder="Nơi đưa vào sản xuất / ứng dụng" />
        </Field>

        <Field label="Phạm vi áp dụng">
          <TextInput value={ex.scopeNote} onChange={(v) => onEx("scopeNote", v)} placeholder="Ví dụ: Vùng ĐBSCL, tỉnh X..." />
        </Field>

        <Field label="Link văn bản / Quyết định" colSpan={2}>
          <UrlInput value={form.externalLink} onChange={(v) => onFormChange("externalLink", v)} />
        </Field>
      </div>
    );
  }

  /* ── PROPOSAL ── */
  if (form.activityType === "PROPOSAL") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <SectionTitle>Thông tin Đề xuất vào danh mục tuyển chọn</SectionTitle>

        <Field label="Cấp độ" required error={errors.proposalLevel}>
          <SelectInput
            value={form.proposalLevel}
            onChange={(v) => onFormChange("proposalLevel", v)}
            error={errors.proposalLevel}
            options={[
              ["NAT", PROPOSAL_LEVEL_LABELS["NAT"]],
              ["MINISTRY", PROPOSAL_LEVEL_LABELS["MINISTRY"]],
            ]}
          />
        </Field>

        <Field label="Tên đề tài đề xuất" required error={errors.publicationName}>
          <TextInput value={form.publicationName} onChange={(v) => onFormChange("publicationName", v)} placeholder="Tên đề tài / nhiệm vụ" error={errors.publicationName} />
        </Field>

        <Field label="Cơ quan tài trợ / Đặt hàng">
          <TextInput value={form.venue} onChange={(v) => onFormChange("venue", v)} placeholder="Bộ KH&CN, Bộ NN&PTNT..." />
        </Field>

        <Field label="Số quyết định / Văn bản" required error={errors.identifierCode}>
          <TextInput value={form.identifierCode} onChange={(v) => onFormChange("identifierCode", v)} placeholder="Số QĐ hoặc mã đề tài" error={errors.identifierCode} />
        </Field>

        <Field label="Kinh phí đề xuất (triệu đồng)">
          <NumberInput value={ex.estimatedBudget} onChange={(v) => onEx("estimatedBudget", v)} placeholder="Ví dụ: 500" min={0} />
        </Field>

        <Field label="Thời gian thực hiện">
          <TextInput value={ex.duration} onChange={(v) => onEx("duration", v)} placeholder="Ví dụ: 3 năm (2025–2028)" />
        </Field>

        <Field label="Link đề xuất / Tài liệu" colSpan={2}>
          <UrlInput value={form.externalLink} onChange={(v) => onFormChange("externalLink", v)} />
        </Field>
      </div>
    );
  }

  /* ── APPROVED_TASK ── */
  if (form.activityType === "APPROVED_TASK") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <SectionTitle>Thông tin Nhiệm vụ KH&CN được phê duyệt</SectionTitle>

        <Field label="Cấp nhiệm vụ" required error={errors.taskLevel}>
          <SelectInput
            value={form.taskLevel}
            onChange={(v) => onFormChange("taskLevel", v)}
            error={errors.taskLevel}
            options={Object.entries(TASK_LEVEL_LABELS)}
          />
        </Field>

        <Field label="Vai trò" required error={errors.taskRole}>
          <SelectInput
            value={form.taskRole}
            onChange={(v) => onFormChange("taskRole", v)}
            error={errors.taskRole}
            options={Object.entries(TASK_ROLE_LABELS)}
          />
        </Field>

        <Field label="Tên đề tài / Nhiệm vụ" colSpan={2} required error={errors.publicationName}>
          <TextInput
            value={form.publicationName}
            onChange={(v) => onFormChange("publicationName", v)}
            placeholder="Tên đầy đủ đề tài / nhiệm vụ nghiên cứu"
            error={errors.publicationName}
          />
        </Field>

        <Field label="Cơ quan chủ quản / Chủ trì">
          <TextInput
            value={form.venue}
            onChange={(v) => onFormChange("venue", v)}
            placeholder="VD: Bộ KH&CN, Bộ NN&PTNT..."
          />
        </Field>

        <Field label="Mã số đề tài / Số hợp đồng" required error={errors.identifierCode}>
          <TextInput
            value={form.identifierCode}
            onChange={(v) => onFormChange("identifierCode", v)}
            placeholder="Mã số đề tài theo quyết định"
            error={errors.identifierCode}
          />
        </Field>

        <Field label="Kinh phí (triệu đồng)">
          <NumberInput
            value={ex.budget}
            onChange={(v) => onEx("budget", v)}
            placeholder="Ví dụ: 500"
            min={0}
          />
        </Field>

        <Field label="Thời gian thực hiện">
          <TextInput
            value={ex.duration}
            onChange={(v) => onEx("duration", v)}
            placeholder="VD: 2 năm (2025–2027)"
          />
        </Field>

        <Field label="Link quyết định / Tài liệu" colSpan={2} error={errors.externalLink}>
          <UrlInput value={form.externalLink} onChange={(v) => onFormChange("externalLink", v)} error={errors.externalLink} />
        </Field>
      </div>
    );
  }

  /* ── COUNCIL ── */
  if (form.activityType === "COUNCIL") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <SectionTitle>Thông tin Hội đồng tư vấn khoa học</SectionTitle>

        <Field label="Loại hội đồng">
          <SelectInput
            value={ex.councilType || ""}
            onChange={(v) => onEx("councilType", v)}
            options={[
              ["", "— Chọn loại hội đồng —"],
              ["TUYEN_CHON", "Tuyển chọn đề tài"],
              ["NGHIEM_THU", "Nghiệm thu đề tài"],
              ["TU_VAN", "Tư vấn định hướng"],
              ["OTHER", "Khác"],
            ]}
          />
        </Field>

        <Field label="Cấp hội đồng">
          <SelectInput
            value={ex.councilLevel || ""}
            onChange={(v) => onEx("councilLevel", v)}
            options={[
              ["", "— Chọn cấp —"],
              ["INTL", "Quốc tế"],
              ["NAT", "Quốc gia"],
              ["MINISTRY", "Cấp Bộ"],
              ["HV", "Học viện"],
            ]}
          />
        </Field>

        <Field label="Đơn vị tổ chức" colSpan={2} required error={errors.venue}>
          <TextInput
            value={form.venue}
            onChange={(v) => onFormChange("venue", v)}
            placeholder="VD: Bộ KH&CN, Học viện Nông nghiệp..."
            error={errors.venue}
          />
        </Field>

        <Field label="Số quyết định thành lập HĐ" required error={errors.identifierCode}>
          <TextInput
            value={form.identifierCode}
            onChange={(v) => onFormChange("identifierCode", v)}
            placeholder="Số QĐ..."
            error={errors.identifierCode}
          />
        </Field>

        <Field label="Số đề tài được tư vấn">
          <NumberInput
            value={ex.taskCount}
            onChange={(v) => onEx("taskCount", v)}
            placeholder="Số đề tài"
            min={1}
          />
        </Field>

        <Field label="Link tài liệu" colSpan={2}>
          <UrlInput value={form.externalLink} onChange={(v) => onFormChange("externalLink", v)} />
        </Field>
      </div>
    );
  }

  /* ── EXPERT_INVITE ── */
  if (form.activityType === "EXPERT_INVITE") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <SectionTitle>Thông tin Mời chuyên gia Seminar / Chuyên đề</SectionTitle>

        <Field label="Họ tên chuyên gia" colSpan={2} required error={errors.expertName}>
          <TextInput
            value={ex.expertName}
            onChange={(v) => onEx("expertName", v)}
            placeholder="Họ và tên chuyên gia được mời"
            error={errors.expertName}
          />
        </Field>

        <Field label="Đơn vị / Tổ chức chuyên gia">
          <TextInput
            value={ex.expertOrg}
            onChange={(v) => onEx("expertOrg", v)}
            placeholder="Trường ĐH, Viện NC, Doanh nghiệp..."
          />
        </Field>

        <Field label="Quốc gia">
          <TextInput
            value={ex.expertCountry}
            onChange={(v) => onEx("expertCountry", v)}
            placeholder="VD: Việt Nam, Nhật Bản, Hoa Kỳ..."
          />
        </Field>

        <Field label="Nơi tổ chức" required error={errors.venue}>
          <TextInput
            value={form.venue}
            onChange={(v) => onFormChange("venue", v)}
            placeholder="Địa điểm / Phòng học"
            error={errors.venue}
          />
        </Field>

        <Field label="Số lượng người tham dự">
          <NumberInput
            value={ex.attendeeCount}
            onChange={(v) => onEx("attendeeCount", v)}
            placeholder="Số người"
            min={1}
          />
        </Field>

        <Field label="Link tài liệu / Slide" colSpan={2}>
          <UrlInput value={form.externalLink} onChange={(v) => onFormChange("externalLink", v)} />
        </Field>
      </div>
    );
  }

  /* ── OTHER_ACTIVITY ── */
  if (form.activityType === "OTHER_ACTIVITY") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <SectionTitle>Thông tin Hoạt động KH&CN khác</SectionTitle>

        <Field label="Loại sản phẩm / hoạt động" required colSpan={2} error={errors.otherActivityType}>
          <SelectInput
            value={form.otherActivityType}
            onChange={(v) => onFormChange("otherActivityType", v)}
            error={errors.otherActivityType}
            options={Object.entries(OTHER_ACTIVITY_TYPE_LABELS)}
          />
        </Field>

        <Field label="Nhà xuất bản / Đơn vị phát hành" required error={errors.publicationName}>
          <TextInput
            value={form.publicationName}
            onChange={(v) => onFormChange("publicationName", v)}
            placeholder="Tên nhà xuất bản / đơn vị"
            error={errors.publicationName}
          />
        </Field>

        <Field label="ISBN / Mã số / Số hợp đồng" required error={errors.identifierCode}>
          <TextInput
            value={form.identifierCode}
            onChange={(v) => onFormChange("identifierCode", v)}
            placeholder="ISBN / Số hợp đồng / Mã định danh"
            error={errors.identifierCode}
          />
        </Field>

        {form.otherActivityType === "HOP_DONG_KHCN" && (
          <Field label="Giá trị hợp đồng (triệu đồng)" required error={errors.contractValue}>
            <NumberInput
              value={ex.contractValue}
              onChange={(v) => onEx("contractValue", v)}
              placeholder="Giá trị (triệu đồng)"
              min={0}
              error={errors.contractValue}
            />
          </Field>
        )}

        <Field label="Đơn vị chủ trì / Đặt hàng">
          <TextInput
            value={form.venue}
            onChange={(v) => onFormChange("venue", v)}
            placeholder="Đơn vị tổ chức / đặt hàng"
          />
        </Field>

        <Field label="Link tài liệu / Sản phẩm" colSpan={2}>
          <UrlInput value={form.externalLink} onChange={(v) => onFormChange("externalLink", v)} />
        </Field>
      </div>
    );
  }

  return null;
}
