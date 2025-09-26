// Menu data for the about section
export const ABOUT_MENU = [
  {
    id: 'intro',
    name: 'Giới thiệu',
    path: '/about',
    children: [
      {
        id: 'overview',
        name: 'Tổng quan',
        path: '/about',
      },
      {
        id: 'history',
        name: 'Lịch sử phát triển',
        path: '/about/history',
      },
      {
        id: 'mission-vision',
        name: 'Tầm nhìn & Sứ mệnh',
        path: '/about/mission-vision',
      },
      {
        id: 'values',
        name: 'Giá trị cốt lõi',
        path: '/about/values',
      },
      {
        id: 'departments',
        name: 'Các bộ môn & Phòng ban',
        path: '/about/departments',
        children: [
          {
            id: 'dept-software',
            name: 'Bộ môn Công nghệ phần mềm',
            path: '/about/departments/software',
          },
          {
            id: 'dept-cs',
            name: 'Bộ môn Khoa học máy tính',
            path: '/about/departments/computer-science',
          },
          {
            id: 'dept-math',
            name: 'Bộ môn Toán',
            path: '/about/departments/mathematics',
          },
          {
            id: 'dept-physics',
            name: 'Bộ môn Vật lý',
            path: '/about/departments/physics',
          },
          {
            id: 'dept-network',
            name: 'Bộ môn Mạng và Hệ thống thông tin',
            path: '/about/departments/network',
          },
          {
            id: 'dept-office',
            name: 'Tổ văn phòng',
            path: '/about/departments/office',
          }
        ]
      },
      {
        id: 'contact',
        name: 'Thông tin liên hệ',
        path: '/about/contact',
      }
    ]
  },
  {
    id: 'staff',
    name: 'Nhân sự',
    path: '/about/staff',
    children: [
      {
        id: 'leadership',
        name: 'Ban lãnh đạo',
        path: '/about/staff/leadership',
      },
      {
        id: 'faculty',
        name: 'Giảng viên',
        path: '/about/staff/faculty',
      },
      {
        id: 'support',
        name: 'Nhân viên hỗ trợ',
        path: '/about/staff/support',
      }
    ]
  },
  {
    id: 'facilities',
    name: 'Cơ sở vật chất',
    path: '/about/facilities',
  },
  {
    id: 'partners',
    name: 'Đối tác',
    path: '/about/partners',
  }
];

// Export other data...