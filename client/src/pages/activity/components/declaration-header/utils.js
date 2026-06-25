const normalize = (value) =>
  (value || "")
    .trim()
    .toUpperCase();

const resolveFromGeneratedCodes = (data, generatedTypeCodes = {}) => {
  const activityType = normalize(data?.activityType);
  if (!activityType || !generatedTypeCodes) return "";

  const typeCodeMap = Object.entries(generatedTypeCodes).reduce(
    (acc, [key, value]) => {
      acc[normalize(key)] = value;
      return acc;
    },
    {},
  );

  const directKey = activityType;
  if (typeCodeMap[directKey]) return typeCodeMap[directKey];

  const conferenceKey = `${activityType}.${normalize(data?.conferenceRole)}.${normalize(data?.conferenceLevel)}`;
  if (typeCodeMap[conferenceKey]) return typeCodeMap[conferenceKey];

  const intlPaperKey = `${activityType}.${normalize(data?.intlPaperCategory)}`;
  if (typeCodeMap[intlPaperKey]) return typeCodeMap[intlPaperKey];

  const vnPaperKey = `${activityType}.${normalize(data?.vnPaperCategory)}`;
  if (typeCodeMap[vnPaperKey]) return typeCodeMap[vnPaperKey];

  const proceedingKey = `${activityType}.${normalize(data?.proceedingLevel)}`;
  if (typeCodeMap[proceedingKey]) return typeCodeMap[proceedingKey];

  const proposalKey = `${activityType}.${normalize(data?.proposalLevel)}`;
  if (typeCodeMap[proposalKey]) return typeCodeMap[proposalKey];

  // APPROVED_TASK: LEVEL.ROLE
  const approvedTaskKey = `${activityType}.${normalize(data?.taskLevel)}.${normalize(data?.taskRole)}`;
  if (typeCodeMap[approvedTaskKey]) return typeCodeMap[approvedTaskKey];

  // OTHER_ACTIVITY: TYPE
  const otherActivityKey = `${activityType}.${normalize(data?.otherActivityType)}`;
  if (typeCodeMap[otherActivityKey]) return typeCodeMap[otherActivityKey];

  return "";
};

export const resolveCatalogCode = (data, generatedTypeCodes = {}) => {
  const generatedCode = resolveFromGeneratedCodes(data, generatedTypeCodes);
  if (generatedCode) return generatedCode;

  const activityType = normalize(data?.activityType);

  switch (activityType) {
    case "SEMINAR":
      return "SEMINAR_TRINH_BAY";
    case "CONFERENCE":
      if (data?.conferenceRole === "ORG") {
        const lvl = (data?.conferenceLevel || "").toUpperCase();
        if (lvl === "INTL") return "HT_TC_QUOCTE";
        if (lvl === "NAT")  return "HT_TC_QUOCGIA";
        return "HT_TC_HV";
      }
      return "HT_THAM_LUAN";
    case "INTL_PAPER":
      if (data?.intlPaperCategory === "ENG_ACAD") return "BB_TA_HOCVIEN";
      if (data?.intlPaperCategory === "SCOPUS") return "BB_SCOPUS";
      return "BB_WOS_SCOPUS";
    case "VN_PAPER":
      return "BB_TV_HOCVIEN";
    case "PROCEEDING":
      return "BTL_FULL_TEXT";
    case "REVIEW_PAPER":
      return "TONG_QUAN";
    case "TECH_CONSULT":
    case "TECH_PROCEDURE":
      return "TU_VAN_BAN_TIN";
    case "PROPOSAL":
      return "DE_XUAT_BO";
    case "COUNCIL":
      return "HOI_DONG_TV";
    case "EXPERT_INVITE":
      return "MOI_CHUYEN_GIA";
    case "APPROVED_TASK": {
      const level = normalize(data?.taskLevel);
      const role = normalize(data?.taskRole);
      if (role === "HD_SV") return "HD_SVNCKH";
      if (level === "QG") {
        if (role === "THU_KY") return "NHIEM_VU_QG_TK";
        if (role === "THAM_GIA") return "NHIEM_VU_QG_TG";
        return "NHIEM_VU_QG_CHU";
      }
      if (level === "BO") {
        if (role === "THU_KY") return "NHIEM_VU_BO_TK";
        if (role === "THAM_GIA") return "NHIEM_VU_BO_TG";
        return "NHIEM_VU_BO_CHU";
      }
      if (level === "HV") {
        if (role === "THAM_GIA") return "NHIEM_VU_HV_TG";
        return "NHIEM_VU_HV_CHU";
      }
      return "NHIEM_VU_QG_CHU";
    }
    case "OTHER_ACTIVITY":
      return data?.otherActivityType || "CHUONG_SACH";
    default:
      return "";
  }
};

export const getUserList = (raw) => {
  const source = raw?.data?.users || [];

  return source
    .map((it) => ({
      id: it.id ?? it.userId,
      name: it.name || it.fullName || it.username || `User #${it.id}`,
      username: it.username || "",
    }))
    .filter((it) => Number.isFinite(it.id));
};

export const normalizeContributors = (contributors) =>
  contributors
    .map((row) => ({ userId: row.userId, role: row.role }))
    .filter((row) => Number.isFinite(row.userId));

export const getInitialForm = (initialActivityType = "SEMINAR") => ({
  academicYear: new Date().getFullYear(),
  activityType: initialActivityType,
  conferenceRole: "ORG",
  conferenceLevel: "INTL",
  intlPaperCategory: "WOS",
  vnPaperCategory: "ACADEMY",
  proceedingLevel: "INTL",
  proposalLevel: "NAT",
  taskLevel: "QG",
  taskRole: "CHU_NHIEM",
  otherActivityType: "CHUONG_SACH",
  qty: 1,
  title: "",
  description: "",
  publicationName: "",
  activityDate: "",
  venue: "",
  identifierCode: "",
  externalLink: "",
  detailsJson: "",
  extraDetails: {},
});

export const getResettableFields = () => ({
  title: "",
  description: "",
  publicationName: "",
  activityDate: "",
  venue: "",
  identifierCode: "",
  externalLink: "",
  detailsJson: "",
  extraDetails: {},
  qty: 1,
});
