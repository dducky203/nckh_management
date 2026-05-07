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
      return data?.conferenceRole === "ORG" ? "HT_THAM_GIA" : "HT_THAM_LUAN";
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
