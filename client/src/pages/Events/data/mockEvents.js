export const getMockEvents = () => {
  return [
    {
      id: 1,
      eventName: "Hội thảo Khoa học Quốc tế về AI và Machine Learning",
      description:
        "Hội thảo tập trung vào các ứng dụng AI trong nông nghiệp thông minh, phân tích dữ liệu lớn và học máy. Các chuyên gia hàng đầu sẽ chia sẻ kinh nghiệm và xu hướng công nghệ mới nhất.",
      dateOfEvent: new Date(
        Date.now() + 10 * 24 * 60 * 60 * 1000
      ).toISOString(),
      endDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
      location: "Hội trường A, Học viện Nông nghiệp Việt Nam",
      organizer: "Khoa Công nghệ Thông tin",
      type: "seminar",
      contactEmail: "contact@vnua.edu.vn",
      contactPhone: "0243.827.6346",
      registrationLink: "https://example.com/register",
      maxParticipants: 200,
      image: "/src/assets/banner.png",
      status: "approved",
    },
    {
      id: 2,
      eventName: "Workshop: Phát triển ứng dụng Web hiện đại với React",
      description:
        "Workshop thực hành về React, Next.js và các công nghệ web hiện đại. Học viên sẽ được hướng dẫn từng bước để xây dựng ứng dụng web hoàn chỉnh.",
      dateOfEvent: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(
        Date.now() + 5 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000
      ).toISOString(),
      location: "Phòng Lab 301, Tòa nhà B",
      organizer: "CLB Lập trình VNUA",
      type: "workshop",
      contactEmail: "clb.laptrinhvnua@gmail.com",
      contactPhone: "0912345678",
      registrationLink: "https://example.com/workshop",
      maxParticipants: 50,
      image: "/src/assets/logo_fita.png",
      status: "approved",
    },
    {
      id: 3,
      eventName: "Hội nghị Khoa học Sinh viên lần thứ 15",
      description:
        "Hội nghị khoa học sinh viên toàn quốc với hơn 500 bài báo khoa học được trình bày. Đây là cơ hội tuyệt vời để sinh viên chia sẻ nghiên cứu và trao đổi kinh nghiệm.",
      dateOfEvent: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
      location: "Trung tâm Hội nghị Quốc gia",
      organizer: "Bộ Giáo dục và Đào tạo",
      type: "conference",
      contactEmail: "hoinghi@moet.edu.vn",
      contactPhone: "0243.821.7346",
      maxParticipants: 500,
      image: "/src/assets/banner.png",
      status: "approved",
    },
    {
      id: 4,
      eventName: "Cuộc thi Lập trình Olympic Sinh viên",
      description:
        "Cuộc thi lập trình dành cho sinh viên các trường đại học trên toàn quốc. Các đội thi sẽ giải quyết các bài toán thuật toán trong thời gian quy định.",
      dateOfEvent: new Date(
        Date.now() + 20 * 24 * 60 * 60 * 1000
      ).toISOString(),
      endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
      location: "Đại học Bách Khoa Hà Nội",
      organizer: "Hội Tin học Việt Nam",
      type: "competition",
      contactEmail: "olympic@vci.org.vn",
      contactPhone: "0243.733.0430",
      registrationLink: "https://example.com/olympic",
      maxParticipants: 300,
      image: "/src/assets/logo_fita.png",
      status: "approved",
    },
    {
      id: 5,
      eventName: "Seminar: Blockchain và Ứng dụng trong Nông nghiệp",
      description:
        "Tìm hiểu về công nghệ Blockchain và các ứng dụng tiềm năng trong lĩnh vực nông nghiệp, từ truy xuất nguồn gốc đến chuỗi cung ứng thông minh.",
      dateOfEvent: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(
        Date.now() - 5 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000
      ).toISOString(),
      location: "Hội trường C, VNUA",
      organizer: "Viện Công nghệ Sinh học",
      type: "seminar",
      contactEmail: "biotech@vnua.edu.vn",
      contactPhone: "0243.827.6346",
      maxParticipants: 150,
      image: "/src/assets/banner.png",
      status: "approved",
    },
    {
      id: 6,
      eventName: "Workshop: IoT và Smart Farming",
      description:
        "Workshop thực hành về Internet of Things và ứng dụng trong nông nghiệp thông minh. Tham gia để học cách xây dựng hệ thống giám sát nông trại tự động.",
      dateOfEvent: new Date(
        Date.now() + 15 * 24 * 60 * 60 * 1000
      ).toISOString(),
      location: "Nhà Thực hành B1, VNUA",
      organizer: "Khoa Cơ điện",
      type: "workshop",
      contactEmail: "codien@vnua.edu.vn",
      contactPhone: "0243.827.6350",
      registrationLink: "https://example.com/iot-workshop",
      maxParticipants: 40,
      image: "/src/assets/logo_fita.png",
      status: "approved",
    },
    {
      id: 7,
      eventName: "Ngày hội Việc làm IT 2025",
      description:
        "Sự kiện kết nối sinh viên IT với các doanh nghiệp hàng đầu. Cơ hội tìm việc làm, thực tập và networking với các chuyên gia trong ngành.",
      dateOfEvent: new Date(
        Date.now() - 10 * 24 * 60 * 60 * 1000
      ).toISOString(),
      location: "Sân vận động VNUA",
      organizer: "Phòng Công tác sinh viên",
      type: "other",
      contactEmail: "career@vnua.edu.vn",
      contactPhone: "0243.827.6340",
      maxParticipants: 1000,
      image: "/src/assets/banner.png",
      status: "approved",
    },
    {
      id: 8,
      eventName: "Hội thảo: Big Data trong Nông nghiệp",
      dateOfEvent: new Date(
        Date.now() + 25 * 24 * 60 * 60 * 1000
      ).toISOString(),
      location: "Trực tuyến qua Zoom",
      organizer: "Khoa Công nghệ Thông tin",
      type: "seminar",
      contactEmail: "fita@vnua.edu.vn",
      maxParticipants: 300,
      status: "approved",
    },
  ];
};
