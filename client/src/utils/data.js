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
  {
    id: 1,
    name: "Khai báo Seminar",
    path: "/activity/declarations/seminar",
  },
  {
    id: 2,
    name: "Khai báo Hội thảo",
    path: "/activity/declarations/conference",
  },
  {
    id: 3,
    name: "Khai báo Bài báo Quốc tế",
    path: "/activity/declarations/international-paper",
  },
  {
    id: 4,
    name: "Khai báo Bài báo Tiếng Việt",
    path: "/activity/declarations/vietnamese-paper",
  },
  {
    id: 5,
    name: "Khai báo Bài tham luận kỷ yếu (Fulltext)",
    path: "/activity/declarations/proceeding",
  },
  {
    id: 6,
    name: "Khai báo Bài tổng quan lĩnh vực",
    path: "/activity/declarations/review-paper",
  },
  {
    id: 7,
    name: "Khai báo Tư vấn / Hướng dẫn kỹ thuật",
    path: "/activity/declarations/tech-consult",
  },
  {
    id: 8,
    name: "Khai báo Quy trình / Tiến bộ kỹ thuật",
    path: "/activity/declarations/tech-procedure",
  },
  {
    id: 9,
    name: "Khai báo Đề xuất tuyển chọn",
    path: "/activity/declarations/proposal",
  },
  {
    id: 10,
    name: "Khai báo Nhiệm vụ KH&CN được phê duyệt",
    path: "/activity/declarations/approved-task",
  },
  {
    id: 11,
    name: "Khai báo Hội đồng tư vấn KH",
    path: "/activity/declarations/council",
  },
  {
    id: 12,
    name: "Khai báo Mời chuyên gia",
    path: "/activity/declarations/expert-invite",
  },
  {
    id: 13,
    name: "Khai báo Hoạt động KH&CN khác",
    path: "/activity/declarations/other-activity",
  },
];

export const EVENT_CATEGORIES = [
  { id: 1, name: "Hội thảo", path: "/events?type=conference" },
  { id: 2, name: "Hội nghị", path: "/events?type=conference" },
  {
    id: 3,
    name: "Tham dự hội đồng tư vấn khoa học tư vấn định hướng nghiên cứu, xây dựng các thuyết minh đề tài,dự án",
    path: "/events?type=conference",
  },
  {
    id: 4,
    name: "Tham dự Seminar/ chuyên đề do chuyên gia (quốc tế, trong nước, cơ quan quản lí, doanh nghiệp, ...) trình bày",
    path: "/events?type=conference",
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

export const PLAN_OPTIONS = [
  { id: 1, label: "PA1 - Định mức chuẩn" },
  { id: 2, label: "PA2 - Nhóm nghiên cứu mạnh" },
  { id: 3, label: "PA3 - Nhóm nghiên cứu xuất sắc" },
  { id: 4, label: "PA4 - Nhóm nghiên cứu tinh hoa" },
  { id: 5, label: "PA5 - Chỉ tiêu bài báo/đề tài" },
  { id: 6, label: "PA6 - Chỉ tiêu bài báo KH" },
];

export const CRITERIA_RESEARCH = [
  {
    id: "1",
    name: "Seminar",
    children: [
      { id: "1.1", name: "Trình bày Seminar", unit: "Giờ/bài", quota: 10 },
    ],
  },
  {
    id: "2",
    name: "Hội thảo",
    children: [
      {
        id: "2.1",
        name: "Tổ chức hội thảo",
        children: [
          {
            id: "2.1.1",
            name: "Cấp Quốc tế",
            unit: "Giờ/hội thảo",
            quota: 100,
          },
          {
            id: "2.1.2",
            name: "Cấp Quốc gia",
            unit: "Giờ/hội thảo",
            quota: 60,
          },
          {
            id: "2.1.3",
            name: "Cấp Học viện",
            unit: "Giờ/hội thảo",
            quota: 20,
          },
        ],
      },
      {
        id: "2.2",
        name: "Bài tham luận trình bày",
        children: [
          { id: "2.2.1", name: "Cấp Quốc tế", unit: "Giờ/bài", quota: 50 },
          { id: "2.2.2", name: "Cấp Quốc gia", unit: "Giờ/bài", quota: 30 },
          { id: "2.2.3", name: "Cấp Học viện", unit: "Giờ/bài", quota: 20 },
        ],
      },
    ],
  },
  {
    id: "3",
    name: "Bài báo quốc tế",
    children: [
      { id: "3.1", name: "WoS", unit: "Giờ/bài", quota: 210 },
      { id: "3.2", name: "Scopus", unit: "Giờ/bài", quota: 140 },
      { id: "3.3", name: "Tạp chí Học viện (EN)", unit: "Giờ/bài", quota: 70 },
      { id: "3.4", name: "Không WoS/Scopus", unit: "Giờ/bài", quota: 60 },
      { id: "3.5", name: "Trích dẫn", unit: "Giờ/lượt", quota: 1 },
    ],
  },
  {
    id: "4",
    name: "Bài báo tiếng Việt",
    children: [
      { id: "4.1", name: "Tạp chí Học viện", unit: "Giờ/bài", quota: 40 },
      { id: "4.2", name: "Tạp chí khác", unit: "Giờ/bài", quota: 20 },
    ],
  },
  {
    id: "5",
    name: "Bài tham luận đăng kỷ yếu",
    children: [
      { id: "5.1", name: "Quốc tế", unit: "Giờ/bài", quota: 25 },
      { id: "5.2", name: "Quốc gia", unit: "Giờ/bài", quota: 15 },
      { id: "5.3", name: "Học viện", unit: "Giờ/bài", quota: 10 },
    ],
  },
  {
    id: "6",
    name: "Bài tổng quan lĩnh vực nghiên cứu",
    children: [
      { id: "6.1", name: "Bài tổng quan", unit: "Giờ/bài", quota: 10 },
    ],
  },
  {
    id: "7",
    name: "Bản tin KH&CN Website Học viện",
    children: [{ id: "7.1", name: "Sản phẩm", unit: "Giờ/sản phẩm", quota: 5 }],
  },
  {
    id: "8",
    name: "Quy trình / Tiêu chuẩn kỹ thuật",
    children: [
      { id: "8.1", name: "Sản phẩm", unit: "Giờ/sản phẩm", quota: 10 },
    ],
  },
  {
    id: "9",
    name: "Đề xuất tuyển chọn",
    children: [
      { id: "9.1", name: "Cấp Quốc gia", unit: "Giờ/đề xuất", quota: 10 },
      { id: "9.2", name: "Cấp Bộ", unit: "Giờ/đề xuất", quota: 5 },
      {
        id: "9.3",
        name: "Học viện trọng điểm",
        unit: "Giờ/đề xuất",
        quota: 2.5,
      },
    ],
  },
  {
    id: "10",
    name: "Nhiệm vụ KH&CN được phê duyệt",
    children: [
      {
        id: "10.1",
        name: "Cấp Quốc gia",
        children: [
          { id: "10.1.1", name: "Chủ nhiệm", unit: "Giờ/đề tài", quota: 90 },
          { id: "10.1.2", name: "Thư ký", unit: "Giờ/đề tài", quota: 40 },
          { id: "10.1.3", name: "Tham gia", unit: "Giờ/đề tài", quota: 150 },
        ],
      },
      {
        id: "10.2",
        name: "Cấp Bộ",
        children: [
          { id: "10.2.1", name: "Chủ nhiệm", unit: "Giờ/đề tài", quota: 70 },
          { id: "10.2.2", name: "Thư ký", unit: "Giờ/đề tài", quota: 30 },
          { id: "10.2.3", name: "Tham gia", unit: "Giờ/đề tài", quota: 110 },
        ],
      },
    ],
  },
  {
    id: "11",
    name: "Tổ chức Hội đồng tư vấn",
    children: [
      { id: "11.1", name: "Hội đồng", unit: "Giờ/hội đồng", quota: 20 },
    ],
  },
  {
    id: "12",
    name: "Mời chuyên gia trình bày Seminar",
    children: [{ id: "12.1", name: "Seminar", unit: "Giờ/Seminar", quota: 15 }],
  },
  {
    id: "13",
    name: "Hoạt động KH&CN khác",
    children: [
      { id: "13.1", name: "Chương sách ISBN", unit: "Giờ/chương", quota: 80 },
      { id: "13.2", name: "Đề án Học viện", unit: "Giờ/đề án", quota: 80 },
      { id: "13.3", name: "Bài quảng bá", unit: "Giờ/bài", quota: 10 },
      { id: "13.4", name: "Giáo trình", unit: "Giờ/giáo trình", quota: 50 },
      { id: "13.5", name: "Bài giảng mới", unit: "Giờ/bài giảng", quota: 30 },
      { id: "13.6", name: "Sách chuyên khảo", unit: "Giờ/sách", quota: 40 },
      { id: "13.7", name: "Sách tham khảo", unit: "Giờ/sách", quota: 20 },
      { id: "13.8", name: "Hợp đồng KH&CN", unit: "Giờ/10tr", quota: 1 },
    ],
  },
];

