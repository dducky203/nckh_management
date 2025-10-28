const EventsUpcoming = () => {
  const upcomingEvents = [
    {
      id: 1,
      title: "Hội thảo khoa học quốc gia về AI 2024",
      date: "15/10/2024",
      time: "08:00 - 17:00",
      location: "Hội trường A1, FITA",
      type: "Hội thảo",
      participants: "200+",
      description:
        "Hội thảo quy tụ các chuyên gia hàng đầu về trí tuệ nhân tạo tại Việt Nam",
      image:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    },
    {
      id: 2,
      title: "Workshop: Blockchain và ứng dụng thực tế",
      date: "22/10/2024",
      time: "14:00 - 17:00",
      location: "Phòng Lab B2, FITA",
      type: "Workshop",
      participants: "50",
      description:
        "Hands-on workshop về công nghệ blockchain và các ứng dụng trong thực tế",
      image:
        "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    },
    {
      id: 3,
      title: "Cuộc thi lập trình ACM ICPC 2024",
      date: "05/11/2024",
      time: "09:00 - 14:00",
      location: "Phòng máy tính C1-C3",
      type: "Cuộc thi",
      participants: "120",
      description:
        "Cuộc thi lập trình quốc tế dành cho sinh viên các trường đại học",
      image:
        "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    },
    {
      id: 4,
      title: "Seminar: Xu hướng công nghệ 2025",
      date: "12/11/2024",
      time: "19:00 - 21:00",
      location: "Online via Zoom",
      type: "Seminar",
      participants: "300+",
      description: "Thảo luận về các xu hướng công nghệ nổi bật trong năm 2025",
      image:
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    },
  ];

  const getEventTypeColor = (type) => {
    switch (type) {
      case "Hội thảo":
        return "bg-blue-100 text-blue-800";
      case "Workshop":
        return "bg-green-100 text-green-800";
      case "Cuộc thi":
        return "bg-red-100 text-red-800";
      case "Seminar":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sự kiện sắp tới
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Đừng bỏ lỡ những sự kiện thú vị và bổ ích sắp diễn ra tại khoa Công
            nghệ thông tin
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
            Tất cả
          </button>
          <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
            Hội thảo
          </button>
          <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
            Workshop
          </button>
          <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
            Cuộc thi
          </button>
          <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
            Seminar
          </button>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-48 object-cover"
              />

              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getEventTypeColor(
                      event.type
                    )}`}
                  >
                    {event.type}
                  </span>
                  <div className="text-sm text-gray-500">
                    👥 {event.participants} người tham gia
                  </div>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  {event.title}
                </h2>

                <p className="text-gray-600 mb-4">{event.description}</p>

                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {event.date} | {event.time}
                  </div>
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {event.location}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                    Đăng ký tham gia
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                    Chi tiết
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-mainColor rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Nhận thông báo sự kiện mới
          </h2>
          <p className="text-blue-100 mb-6">
            Đăng ký email để không bỏ lỡ những sự kiện hấp dẫn
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="flex-1 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-blue-600 px-6 py-2 rounded-md font-semibold hover:bg-gray-100 transition-colors">
              Đăng ký
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsUpcoming;
