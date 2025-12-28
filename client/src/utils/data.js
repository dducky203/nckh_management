import {
  Computer,
  Psychology,
  Calculate,
  Science,
  NetworkCheck,
  Business,
  FunctionsRounded,
  Lightbulb,
  ContactPhone,
} from "@mui/icons-material";

export const RESEARCH_CATEGORIES = [
  { id: 1, name: "Bài báo quốc tế", path: "/research/projects" },
  { id: 2, name: "Bài báo tiếng việt", path: "/research/publications" },
  {
    id: 3,
    name: "Bài tham luận hội thảo đăng kỉ yếu",
    path: "/research/conferences",
  },
  {
    id: 4,
    name: "Bài tổng quan về lĩnh vực nghiên cứu",
    path: "/research/competitions",
  },
  {
    id: 5,
    name: "Các hoạt động tư vấn/ Hướng dẫn kỹ thuật/ Bản tin KH&CN đăng trên website học viện",
    path: "/research/seminars",
  },
  {
    id: 6,
    name: "Quy trình kỹ thuật/ Tiến bộ kỹ thuật/ Tiêu chuẩn kỹ thuật được công nhận cấp cơ sở ",
    path: "/research/seminars",
  },
  { id: 7, name: "Đề xuất nhiệm vụ NCKH", path: "/research/seminars" },
  { id: 8, name: "Nhiệm vụ KH&CN được phê duyệt", path: "/research/seminars" },
  {
    id: 9,
    name: "Xây dựng và triển khai các đề án/ Nhiệm vụ KH&CN của học viện ",
    path: "/research/seminars",
  },
  {
    id: 10,
    name: "Các nhóm NCKH",
    path: "/research-groups",
  },
];

export const EVENT_CATEGORIES = [
  { id: 1, name: "Hội thảo", path: "/events" },
  { id: 2, name: "Hội nghị", path: "/events/conferences" },
  {
    id: 3,
    name: "Tham dự hội đồng tư vấn khoa học tư vấn định hướng nghiên cứu, xây dựng các thuyết minh đề tài,dự án",
    path: "/events/conferences",
  },
  {
    id: 4,
    name: "Tham dự Seminar/ chuyên đề do chuyên gia (quốc tế, trong nước, cơ quan quản lí, doanh nghiệp, ...) trình bày",
    path: "/events/conferences",
  },
];

// Các bộ môn của Khoa
export const DEPARTMENTS = [
  {
    name: "Bộ môn Công nghệ phần mềm",
    icon: Computer,
  },
  {
    name: "Bộ môn Khoa học máy tính",
    icon: Psychology,
  },
  {
    name: "Bộ môn Toán",
    icon: FunctionsRounded,
  },
  {
    name: "Bộ môn Vật lý",
    icon: Lightbulb,
  },

  {
    name: "Bộ môn Mạng và Hệ thống thông tin",
    icon: Computer,
  },
  {
    name: "Tổ văn phòng",
    icon: ContactPhone,
  },
];

export const TIME_SLOTS = [
  { value: 1, label: "Tiết 1 (7:00 - 7:50)" },
  { value: 2, label: "Tiết 2 (8:00 - 8:50)" },
  { value: 3, label: "Tiết 3 (9:00 - 9:50)" },
  { value: 4, label: "Tiết 4 (10:00 - 10:50)" },
  { value: 5, label: "Tiết 5 (11:00 - 11:50)" },
  { value: 6, label: "Tiết 6 (13:00 - 13:50)" },
  { value: 7, label: "Tiết 7 (14:00 - 14:50)" },
  { value: 8, label: "Tiết 8 (15:00 - 15:50)" },
  { value: 9, label: "Tiết 9 (16:00 - 16:50)" },
  { value: 10, label: "Tiết 10 (17:00 - 17:50)" },
];
