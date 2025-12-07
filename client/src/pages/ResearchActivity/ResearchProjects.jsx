const ResearchProjects = () => {
  const projects = [
    {
      id: 1,
      title: "Nghiên cứu về trí tuệ nhân tạo trong giáo dục",
      description:
        "Ứng dụng AI để cá nhân hóa quá trình học tập và đánh giá học sinh",
      status: "Đang thực hiện",
      duration: "2024-2025",
      leader: "TS. Nguyễn Văn A",
    },
    {
      id: 2,
      title: "Phát triển hệ thống IoT cho thành phố thông minh",
      description: "Xây dựng hệ thống giám sát và quản lý đô thị thông minh",
      status: "Hoàn thành",
      duration: "2023-2024",
      leader: "PGS.TS. Trần Thị B",
    },
    {
      id: 3,
      title: "Blockchain trong quản lý chuỗi cung ứng",
      description:
        "Ứng dụng công nghệ blockchain để minh bạch hóa chuỗi cung ứng",
      status: "Đang thực hiện",
      duration: "2024-2026",
      leader: "TS. Lê Văn C",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Đang thực hiện":
        return "bg-blue-100 text-blue-800";
      case "Hoàn thành":
        return "bg-green-100 text-green-800";
      case "Tạm dừng":
        return "bg-yellow-100 text-yellow-800";
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
            Dự án nghiên cứu khoa học
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Khám phá các dự án nghiên cứu tiên tiến đang được thực hiện tại khoa
            Công nghệ thông tin
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">12</div>
            <div className="text-gray-600">Dự án đang thực hiện</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">25</div>
            <div className="text-gray-600">Dự án hoàn thành</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-mainColor mb-2">8</div>
            <div className="text-gray-600">Dự án quốc tế</div>
          </div>
        </div>

        {/* Projects List */}
        <div className="space-y-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-2 md:mb-0">
                  {project.title}
                </h2>
                <span
                  className={`inline-flex px-3 py-1 rounded-md text-sm font-medium ${getStatusColor(
                    project.status
                  )}`}
                >
                  {project.status}
                </span>
              </div>

              <p className="text-gray-600 mb-4">{project.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                <div>
                  <span className="font-medium">Thời gian:</span>{" "}
                  {project.duration}
                </div>
                <div>
                  <span className="font-medium">Chủ nhiệm:</span>{" "}
                  {project.leader}
                </div>
              </div>

              <div className="mt-4">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-blue-600 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Có ý tưởng nghiên cứu?
          </h2>
          <p className="text-blue-100 mb-6">
            Hãy liên hệ với chúng tôi để thảo luận về cơ hội hợp tác nghiên cứu
          </p>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors">
            Liên hệ ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResearchProjects;
