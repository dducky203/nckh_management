import {
  CONFERENCE_ROLE_LABELS,
  INTL_CATEGORY_LABELS,
  LEVEL_LABELS,
  PROPOSAL_LEVEL_LABELS,
  VN_CATEGORY_LABELS,
} from "./constants";

/* ─── Reusable field primitives ─── */
function Field({ label, required, children, colSpan }) {
  return (
    <label className={`flex flex-col gap-1${colSpan ? ` md:col-span-${colSpan}` : ""}`}>
      <span className="text-xs font-bold text-slate-500">
        {label} {required && <span className="text-red-400">*</span>}
      </span>
      {children}
    </label>
  );
}

const inputCls = "h-10 rounded-lg border border-slate-200 px-3 text-sm focus:outline-none focus:border-mainColor";
const selectCls = "h-10 rounded-lg border border-slate-200 px-3 text-sm focus:outline-none focus:border-mainColor";

function TextInput({ value, onChange, placeholder }) {
  return (
    <input
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className={inputCls}
      placeholder={placeholder}
    />
  );
}

function NumberInput({ value, onChange, placeholder, min }) {
  return (
    <input
      type="number"
      value={value || ""}
      min={min}
      onChange={(e) => onChange(e.target.value)}
      className={inputCls}
      placeholder={placeholder}
    />
  );
}

function UrlInput({ value, onChange, placeholder }) {
  return (
    <input
      type="url"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className={inputCls}
      placeholder={placeholder || "https://..."}
    />
  );
}

function SelectInput({ value, onChange, options }) {
  return (
    <select value={value || ""} onChange={(e) => onChange(e.target.value)} className={selectCls}>
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
export default function ActivityTypeFields({ form, options, onFormChange, onExtraDetailChange }) {
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

        <Field label="Link slide / tài liệu" colSpan={2}>
          <UrlInput value={form.externalLink} onChange={(v) => onFormChange("externalLink", v)} />
        </Field>
      </div>
    );
  }

  /* ── CONFERENCE ── */
  if (form.activityType === "CONFERENCE") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <SectionTitle>Thông tin Hội thảo</SectionTitle>

        <Field label="Vai trò" required>
          <SelectInput
            value={form.conferenceRole}
            onChange={(v) => onFormChange("conferenceRole", v)}
            options={(options.conferenceRoles || []).map((it) => [it, CONFERENCE_ROLE_LABELS[it] || it])}
          />
        </Field>

        <Field label="Cấp độ hội thảo" required>
          <SelectInput
            value={form.conferenceLevel}
            onChange={(v) => onFormChange("conferenceLevel", v)}
            options={(options.conferenceLevels || []).map((it) => [it, LEVEL_LABELS[it] || it])}
          />
        </Field>

        <Field label="Tên hội thảo" colSpan={2}>
          <TextInput value={form.publicationName} onChange={(v) => onFormChange("publicationName", v)} placeholder="Tên đầy đủ của hội thảo" />
        </Field>

        <Field label="Nơi tổ chức">
          <TextInput value={form.venue} onChange={(v) => onFormChange("venue", v)} placeholder="Thành phố, quốc gia..." />
        </Field>

        <Field label="Số / Mã giấy chứng nhận">
          <TextInput value={form.identifierCode} onChange={(v) => onFormChange("identifierCode", v)} placeholder="Số chứng nhận tham dự" />
        </Field>

        <Field label="Link hội thảo" colSpan={2}>
          <UrlInput value={form.externalLink} onChange={(v) => onFormChange("externalLink", v)} placeholder="https://conference..." />
        </Field>
      </div>
    );
  }

  /* ── INTL_PAPER ── */
  if (form.activityType === "INTL_PAPER") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <SectionTitle>Thông tin Bài báo Quốc tế</SectionTitle>

        <Field label="Danh mục" required>
          <SelectInput
            value={form.intlPaperCategory}
            onChange={(v) => onFormChange("intlPaperCategory", v)}
            options={(options.intlPaperCategories || []).map((it) => [it, INTL_CATEGORY_LABELS[it] || it])}
          />
        </Field>

        <Field label="Tên tạp chí">
          <TextInput value={form.publicationName} onChange={(v) => onFormChange("publicationName", v)} placeholder="Journal of ..." />
        </Field>

        <Field label="Tập / Số (Volume / Issue)">
          <TextInput value={ex.volumeIssue} onChange={(v) => onEx("volumeIssue", v)} placeholder="Vol. 12, No. 3" />
        </Field>

        <Field label="Trang">
          <TextInput value={ex.pages} onChange={(v) => onEx("pages", v)} placeholder="123–145" />
        </Field>

        <Field label="DOI">
          <TextInput value={form.identifierCode} onChange={(v) => onFormChange("identifierCode", v)} placeholder="10.xxxx/xxxxx" />
        </Field>

        <Field label="Impact Factor / Điểm Q">
          <TextInput value={ex.impactFactor} onChange={(v) => onEx("impactFactor", v)} placeholder="Ví dụ: IF=3.2, Q1" />
        </Field>

        <Field label="Link bài báo" colSpan={2}>
          <UrlInput value={form.externalLink} onChange={(v) => onFormChange("externalLink", v)} />
        </Field>
      </div>
    );
  }

  /* ── VN_PAPER ── */
  if (form.activityType === "VN_PAPER") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <SectionTitle>Thông tin Bài báo Tiếng Việt</SectionTitle>

        <Field label="Danh mục" required>
          <SelectInput
            value={form.vnPaperCategory}
            onChange={(v) => onFormChange("vnPaperCategory", v)}
            options={(options.vnPaperCategories || []).map((it) => [it, VN_CATEGORY_LABELS[it] || it])}
          />
        </Field>

        <Field label="Tên tạp chí">
          <TextInput value={form.publicationName} onChange={(v) => onFormChange("publicationName", v)} placeholder="Tạp chí Khoa học và Công nghệ..." />
        </Field>

        <Field label="Tập / Số / Năm phát hành">
          <TextInput value={ex.volumeIssue} onChange={(v) => onEx("volumeIssue", v)} placeholder="Tập 10, Số 2 (2025)" />
        </Field>

        <Field label="ISSN">
          <TextInput value={form.identifierCode} onChange={(v) => onFormChange("identifierCode", v)} placeholder="xxxx-xxxx" />
        </Field>

        <Field label="Link bài báo" colSpan={2}>
          <UrlInput value={form.externalLink} onChange={(v) => onFormChange("externalLink", v)} />
        </Field>
      </div>
    );
  }

  /* ── PROCEEDING ── */
  if (form.activityType === "PROCEEDING") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <SectionTitle>Thông tin Bài tham luận kỷ yếu</SectionTitle>

        <Field label="Cấp độ" required>
          <SelectInput
            value={form.proceedingLevel}
            onChange={(v) => onFormChange("proceedingLevel", v)}
            options={(options.proceedingLevels || []).map((it) => [it, LEVEL_LABELS[it] || it])}
          />
        </Field>

        <Field label="Tên kỷ yếu / Hội thảo">
          <TextInput value={form.publicationName} onChange={(v) => onFormChange("publicationName", v)} placeholder="Tên kỷ yếu hoặc hội thảo" />
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

        <Field label="Link tài liệu">
          <UrlInput value={form.externalLink} onChange={(v) => onFormChange("externalLink", v)} />
        </Field>
      </div>
    );
  }

  /* ── REVIEW_PAPER ── */
  if (form.activityType === "REVIEW_PAPER") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <SectionTitle>Thông tin Bài tổng quan lĩnh vực</SectionTitle>

        <Field label="Lĩnh vực tổng quan" colSpan={2}>
          <TextInput value={ex.reviewField} onChange={(v) => onEx("reviewField", v)} placeholder="Ví dụ: Trí tuệ nhân tạo, Nông nghiệp công nghệ cao..." />
        </Field>

        <Field label="Đầu sách / Tạp chí đăng">
          <TextInput value={form.publicationName} onChange={(v) => onFormChange("publicationName", v)} placeholder="Tên tạp chí hoặc đầu sách" />
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

        <Field label="Tên đề tài / Dự án">
          <TextInput value={form.publicationName} onChange={(v) => onFormChange("publicationName", v)} placeholder="Tên đề tài hoặc dự án tư vấn" />
        </Field>

        <Field label="Đơn vị thụ hưởng">
          <TextInput value={form.venue} onChange={(v) => onFormChange("venue", v)} placeholder="Tên tổ chức / đơn vị nhận tư vấn" />
        </Field>

        <Field label="Số hợp đồng / Văn bản">
          <TextInput value={form.identifierCode} onChange={(v) => onFormChange("identifierCode", v)} placeholder="Số HĐ hoặc số văn bản" />
        </Field>

        <Field label="Thời gian thực hiện">
          <TextInput value={ex.consultPeriod} onChange={(v) => onEx("consultPeriod", v)} placeholder="Ví dụ: T3/2025 – T9/2025" />
        </Field>

        <Field label="Link tài liệu">
          <UrlInput value={form.externalLink} onChange={(v) => onFormChange("externalLink", v)} />
        </Field>
      </div>
    );
  }

  /* ── TECH_PROCEDURE ── */
  if (form.activityType === "TECH_PROCEDURE") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <SectionTitle>Thông tin Quy trình / Tiến bộ kỹ thuật</SectionTitle>

        <Field label="Tên tiến bộ kỹ thuật / Quy trình" colSpan={2}>
          <TextInput value={form.publicationName} onChange={(v) => onFormChange("publicationName", v)} placeholder="Tên đầy đủ của quy trình / tiến bộ kỹ thuật" />
        </Field>

        <Field label="Mã / Số quyết định">
          <TextInput value={form.identifierCode} onChange={(v) => onFormChange("identifierCode", v)} placeholder="Số QĐ công nhận" />
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

        <Field label="Cấp độ" required>
          <SelectInput
            value={form.proposalLevel}
            onChange={(v) => onFormChange("proposalLevel", v)}
            options={[
              ["NAT", PROPOSAL_LEVEL_LABELS["NAT"]],
              ["MINISTRY", PROPOSAL_LEVEL_LABELS["MINISTRY"]],
            ]}
          />
        </Field>

        <Field label="Tên đề tài đề xuất">
          <TextInput value={form.publicationName} onChange={(v) => onFormChange("publicationName", v)} placeholder="Tên đề tài / nhiệm vụ" />
        </Field>

        <Field label="Cơ quan tài trợ / Đặt hàng">
          <TextInput value={form.venue} onChange={(v) => onFormChange("venue", v)} placeholder="Bộ KH&CN, Bộ NN&PTNT..." />
        </Field>

        <Field label="Số quyết định / Văn bản">
          <TextInput value={form.identifierCode} onChange={(v) => onFormChange("identifierCode", v)} placeholder="Số QĐ hoặc mã đề tài" />
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

  return null;
}
