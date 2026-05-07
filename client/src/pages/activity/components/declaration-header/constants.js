export const TYPE_LABELS = {
  SEMINAR: "Seminar",
  CONFERENCE: "Hội thảo",
  INTL_PAPER: "Bài báo Quốc tế",
  VN_PAPER: "Bài báo Tiếng Việt",
  PROCEEDING: "Bài tham luận kỷ yếu (Fulltext)",
  REVIEW_PAPER: "Bài tổng quan lĩnh vực",
  TECH_CONSULT: "Tư vấn / Hướng dẫn kỹ thuật",
  TECH_PROCEDURE: "Quy trình / Tiến bộ kỹ thuật",
  PROPOSAL: "Đề xuất vào danh mục tuyển chọn",
};

export const CONFERENCE_ROLE_LABELS = {
  ORG: "Tổ chức",
  PRES: "Trình bày",
};

export const LEVEL_LABELS = {
  INTL: "Quốc tế",
  NAT: "Quốc gia",
  ACAD: "Học viện",
};

export const INTL_CATEGORY_LABELS = {
  WOS: "WoS",
  SCOPUS: "Scopus",
  ENG_ACAD: "Tiếng Anh Học viện",
  OTHER: "Khác",
  CITATION: "Được trích dẫn",
};

export const VN_CATEGORY_LABELS = {
  ACADEMY: "Tạp chí Học viện",
  OTHER: "Tạp chí khác",
};

export const PROPOSAL_LEVEL_LABELS = {
  NAT: "Quốc gia",
  MINISTRY: "Cấp Bộ/Tương đương",
};

export const DECLARATION_OPTIONS_DEFAULT = {
  activityTypes: [],
  conferenceRoles: [],
  conferenceLevels: [],
  intlPaperCategories: [],
  vnPaperCategories: [],
  proceedingLevels: [],
  proposalLevels: [],
};


export const BASIC_FIELD_CONFIG = {
  SEMINAR: {
    titleLabel: "Tên chuyên đề seminar",
    titlePlaceholder: "VD: Ứng dụng AI trong nông nghiệp thông minh",
    descLabel: "Tóm tắt nội dung trình bày",
    descPlaceholder: "Nội dung chính đã trình bày tại seminar",
    qtyLabel: "Số buổi seminar",
    dateLabel: "Ngày trình bày",
  },
  CONFERENCE: {
    titleLabel: "Tên bài trình bày / bài báo tại hội thảo",
    titlePlaceholder: "VD: A Novel Approach to Deep Learning...",
    descLabel: "Tóm tắt nội dung tham gia",
    descPlaceholder: "Mô tả ngắn gọn nội dung tham gia hội thảo",
    qtyLabel: "Số bài / lần tham gia",
    dateLabel: "Ngày diễn ra hội thảo",
  },
  INTL_PAPER: {
    titleLabel: "Tên bài báo quốc tế",
    titlePlaceholder: "VD: Machine Learning for Crop Yield Prediction",
    descLabel: "Tóm tắt bài báo (Abstract)",
    descPlaceholder: "Tóm tắt nội dung nghiên cứu của bài báo",
    qtyLabel: "Số bài báo",
    dateLabel: "Ngày xuất bản",
  },
  VN_PAPER: {
    titleLabel: "Tên bài báo tiếng Việt",
    titlePlaceholder: "VD: Nghiên cứu ảnh hưởng của phân bón hữu cơ...",
    descLabel: "Tóm tắt bài báo",
    descPlaceholder: "Tóm tắt nội dung nghiên cứu của bài báo",
    qtyLabel: "Số bài báo",
    dateLabel: "Ngày xuất bản",
  },
  PROCEEDING: {
    titleLabel: "Tên bài tham luận kỷ yếu",
    titlePlaceholder: "VD: Phân tích dữ liệu lớn trong quản lý tài nguyên nước",
    descLabel: "Tóm tắt bài tham luận",
    descPlaceholder: "Mô tả nội dung chính của bài tham luận",
    qtyLabel: "Số bài tham luận",
    dateLabel: "Ngày đăng / xuất bản kỷ yếu",
  },
  REVIEW_PAPER: {
    titleLabel: "Tên bài tổng quan",
    titlePlaceholder: "VD: Tổng quan nghiên cứu về năng lượng tái tạo tại Việt Nam",
    descLabel: "Tóm tắt bài tổng quan",
    descPlaceholder: "Mô tả phạm vi và nội dung tổng quan",
    qtyLabel: "Số bài tổng quan",
    dateLabel: "Ngày công bố / nghiệm thu",
  },
  TECH_CONSULT: {
    titleLabel: "Tên hoạt động tư vấn / hướng dẫn",
    titlePlaceholder: "VD: Tư vấn quy trình GAP cho HTX Tân Phú",
    descLabel: "Mô tả nội dung tư vấn",
    descPlaceholder: "Mô tả chi tiết nội dung và phạm vi tư vấn",
    qtyLabel: "Số lần / hợp đồng tư vấn",
    dateLabel: "Ngày bắt đầu hoạt động",
  },
  TECH_PROCEDURE: {
    titleLabel: "Tên quy trình / tiến bộ kỹ thuật",
    titlePlaceholder: "VD: Quy trình sản xuất phân vi sinh từ bã mía",
    descLabel: "Mô tả quy trình / tiến bộ kỹ thuật",
    descPlaceholder: "Mô tả chi tiết nội dung và phạm vi áp dụng",
    qtyLabel: "Số quy trình",
    dateLabel: "Ngày công nhận / cấp phép",
  },
  PROPOSAL: {
    titleLabel: "Tên đề xuất",
    titlePlaceholder: "VD: Đề xuất nghiên cứu giống lúa chịu mặn cho ĐBSCL",
    descLabel: "Mô tả tóm tắt đề xuất",
    descPlaceholder: "Mô tả mục tiêu và nội dung chính của đề xuất",
    qtyLabel: "Số đề xuất",
    dateLabel: "Ngày nộp đề xuất",
  },
};

export const getBasicFieldConfig = (activityType) => {
  const defaults = {
    titleLabel: "Tên hoạt động",
    titlePlaceholder: "Nhập tên hoạt động",
    descLabel: "Mô tả thêm",
    descPlaceholder: "Thông tin bổ sung (không bắt buộc)",
    qtyLabel: "Số lượng",
    dateLabel: "Ngày hoạt động",
  };
  return { ...defaults, ...(BASIC_FIELD_CONFIG[activityType] || {}) };
};
