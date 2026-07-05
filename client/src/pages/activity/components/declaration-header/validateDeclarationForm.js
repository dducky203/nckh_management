import { resolveCatalogCode } from "./utils";

const isBlank = (value) =>
  value == null || (typeof value === "string" && value.trim() === "");

const trim = (value) => (typeof value === "string" ? value.trim() : value);

const isValidUrl = (value) => {
  const text = trim(value);
  if (!text) return true;
  try {
    const url = new URL(text);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const setError = (errors, field, message) => {
  if (!errors[field]) {
    errors[field] = message;
  }
};

const requireField = (errors, field, label, value) => {
  if (isBlank(value)) {
    setError(errors, field, `${label} là bắt buộc`);
  }
};

const validateCommonFields = (form, errors, getTodayString) => {
  requireField(errors, "academicYear", "Năm học", form.academicYear);

  const year = Number(form.academicYear);
  if (!isBlank(form.academicYear) && (Number.isNaN(year) || year < 2000 || year > 2100)) {
    setError(errors, "academicYear", "Năm học không hợp lệ");
  }

  const qty = Number(form.qty);
  if (isBlank(form.qty) || Number.isNaN(qty) || qty < 1) {
    setError(errors, "qty", "Số lượng phải lớn hơn hoặc bằng 1");
  }

  requireField(errors, "title", "Tên hoạt động", form.title);
  requireField(errors, "activityDate", "Thời gian hoạt động", form.activityDate);

  if (!isBlank(form.activityDate) && form.activityDate >= getTodayString()) {
    setError(
      errors,
      "activityDate",
      "Ngày xuất bản/nghiệm thu phải là ngày trong quá khứ",
    );
  }

  if (!isBlank(form.externalLink) && !isValidUrl(form.externalLink)) {
    setError(errors, "externalLink", "Link không đúng định dạng URL");
  }
};

const validateTypeSpecificFields = (form, errors) => {
  const ex = form.extraDetails || {};
  const type = form.activityType;

  switch (type) {
    case "CONFERENCE":
      requireField(errors, "conferenceRole", "Vai trò", form.conferenceRole);
      requireField(errors, "conferenceLevel", "Cấp độ hội thảo", form.conferenceLevel);
      requireField(errors, "publicationName", "Tên hội thảo", form.publicationName);
      requireField(
        errors,
        "identifierCode",
        form.conferenceRole === "ORG" ? "Số/Mã quyết định tổ chức" : "Số/Mã giấy chứng nhận",
        form.identifierCode,
      );
      break;

    case "INTL_PAPER":
      requireField(errors, "intlPaperCategory", "Danh mục bài báo", form.intlPaperCategory);
      requireField(errors, "publicationName", "Tên tạp chí", form.publicationName);
      requireField(errors, "identifierCode", "DOI", form.identifierCode);
      break;

    case "VN_PAPER":
      requireField(errors, "vnPaperCategory", "Danh mục bài báo", form.vnPaperCategory);
      requireField(errors, "publicationName", "Tên tạp chí", form.publicationName);
      requireField(errors, "identifierCode", "ISSN", form.identifierCode);
      break;

    case "PROCEEDING":
      requireField(errors, "proceedingLevel", "Cấp độ", form.proceedingLevel);
      requireField(errors, "publicationName", "Tên kỷ yếu/Hội thảo", form.publicationName);
      break;

    case "REVIEW_PAPER":
      requireField(errors, "reviewField", "Lĩnh vực tổng quan", ex.reviewField);
      requireField(errors, "publicationName", "Đầu sách/Tạp chí đăng", form.publicationName);
      break;

    case "TECH_CONSULT":
      requireField(errors, "publicationName", "Tên đề tài/Dự án", form.publicationName);
      requireField(errors, "identifierCode", "Số hợp đồng/Văn bản", form.identifierCode);
      break;

    case "TECH_PROCEDURE":
      requireField(errors, "publicationName", "Tên quy trình/Tiến bộ kỹ thuật", form.publicationName);
      requireField(errors, "identifierCode", "Mã/Số quyết định", form.identifierCode);
      break;

    case "PROPOSAL":
      requireField(errors, "proposalLevel", "Cấp độ", form.proposalLevel);
      requireField(errors, "publicationName", "Tên đề tài đề xuất", form.publicationName);
      requireField(errors, "identifierCode", "Số quyết định/Văn bản", form.identifierCode);
      break;

    case "APPROVED_TASK":
      requireField(errors, "taskLevel", "Cấp nhiệm vụ", form.taskLevel);
      requireField(errors, "taskRole", "Vai trò", form.taskRole);
      requireField(errors, "publicationName", "Tên đề tài/Nhiệm vụ", form.publicationName);
      requireField(errors, "identifierCode", "Mã số đề tài/Số hợp đồng", form.identifierCode);
      break;

    case "COUNCIL":
      requireField(errors, "venue", "Đơn vị tổ chức", form.venue);
      requireField(errors, "identifierCode", "Số quyết định thành lập HĐ", form.identifierCode);
      break;

    case "EXPERT_INVITE":
      requireField(errors, "expertName", "Họ tên chuyên gia", ex.expertName);
      requireField(errors, "venue", "Nơi tổ chức", form.venue);
      break;

    case "OTHER_ACTIVITY":
      requireField(errors, "otherActivityType", "Loại sản phẩm/Hoạt động", form.otherActivityType);
      requireField(errors, "publicationName", "Nhà xuất bản/Đơn vị phát hành", form.publicationName);
      requireField(errors, "identifierCode", "ISBN/Mã số/Số hợp đồng", form.identifierCode);
      if (form.otherActivityType === "HOP_DONG_KHCN" && isBlank(ex.contractValue)) {
        setError(errors, "contractValue", "Giá trị hợp đồng là bắt buộc");
      }
      break;

    default:
      break;
  }
};

const parseProofUrls = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [value];
  } catch {
    return [value];
  }
};

export function validateDeclarationForm({
  form,
  options,
  proofFiles = [],
  existingProofFileUrls = [],
  contributors = [],
  user,
  getTodayString,
}) {
  const errors = {};

  if (!user?.id) {
    return {
      message: "Không xác định được người dùng",
      errors: { _form: "Không xác định được người dùng" },
    };
  }

  validateCommonFields(form, errors, getTodayString);
  validateTypeSpecificFields(form, errors);

  const resolvedCatalogCode = resolveCatalogCode(form, options?.generatedTypeCodes);
  if (!resolvedCatalogCode) {
    setError(
      errors,
      "catalogCode",
      "Vui lòng chọn đầy đủ thông tin loại hoạt động để xác định tiêu chí",
    );
  }

  const requiresProofFile = ["PROCEEDING", "TECH_CONSULT"].includes(form.activityType);
  const hasProofFile =
    proofFiles.length > 0 || parseProofUrls(existingProofFileUrls).length > 0;

  if (requiresProofFile && !hasProofFile) {
    setError(errors, "proofFiles", "Hoạt động này bắt buộc có file minh chứng");
  }

  const normalizedContributors = contributors.filter(
    (row) => row.userId != null && row.userId !== "",
  );

  if (normalizedContributors.length === 0) {
    setError(errors, "contributors", "Vui lòng thêm ít nhất 1 người tham gia");
  } else {
    const mainContributors = normalizedContributors.filter((row) => row.role === "MAIN");
    if (mainContributors.length === 0) {
      setError(errors, "contributors", "Cần có đúng 1 tác giả chính (MAIN)");
    } else if (mainContributors.length > 1) {
      setError(errors, "contributors", "Chỉ được phép có 1 tác giả chính (MAIN)");
    }

    const seenUserIds = new Set();
    for (const row of normalizedContributors) {
      const userId = Number(row.userId);
      if (seenUserIds.has(userId)) {
        setError(errors, "contributors", "Không được chọn trùng người tham gia");
        break;
      }
      seenUserIds.add(userId);
    }
  }

  const messages = Object.values(errors);
  if (messages.length === 0) {
    return null;
  }

  return {
    message: messages[0],
    errors,
  };
}

export function clearDeclarationError(errors, key) {
  if (!errors || !errors[key]) return errors;
  const next = { ...errors };
  delete next[key];
  return next;
}
