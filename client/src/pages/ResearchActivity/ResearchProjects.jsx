

const ResearchProjects = () => {
  const projects = [
    {
      id: 1,
      title: "Nghiên cứu về trí tuệ nhân tạo trong giáo dục",
      description:
        "Ứng dụng trí tuệ nhân tạo (AI) để cá nhân hóa quá trình học tập và đánh giá học sinh. Dự án tập trung vào việc thu thập hành vi học tập, từ đó xây dựng các mô hình dự đoán và đề xuất lộ trình học tập tối ưu cho từng cá nhân, giảm tải áp lực cho giảng viên và nâng cao chất lượng đào tạo.",
      status: "Đang thực hiện",
      duration: "2024-2025",
      leader: "TS. Nguyễn Văn A",
    },
    {
      id: 2,
      title: "Phát triển hệ thống IoT cho thành phố thông minh",
      description: "Xây dựng hệ thống giám sát và quản lý đô thị thông minh. Thông qua việc tích hợp các cảm biến môi trường, giao thông và năng lượng, dự án đã cung cấp một bản tóm tắt dữ liệu theo thời gian thực, hỗ trợ các nhà quản lý đưa ra quyết định nhanh chóng và chính xác nhằm tối ưu hóa tài nguyên đô thị.",
      status: "Hoàn thành",
      duration: "2023-2024",
      leader: "PGS.TS. Trần Thị B",
    },
    {
      id: 3,
      title: "Blockchain trong quản lý chuỗi cung ứng",
      description:
        "Ứng dụng công nghệ blockchain để minh bạch hóa chuỗi cung ứng. Bằng cách sử dụng sổ cái phân tán, nhóm nghiên cứu kỳ vọng sẽ giải quyết được bài toán truy xuất nguồn gốc sản phẩm nông nghiệp, đảm bảo tính toàn vẹn của dữ liệu từ nông trại đến bàn ăn.",
      status: "Đang thực hiện",
      duration: "2024-2026",
      leader: "TS. Lê Văn C",
    },
  ];

  // Đổi màu sắc cho phù hợp với chữ text thay vì nền background
  const getStatusColor = (status) => {
    switch (status) {
      case "Đang thực hiện":
        return "text-blue-600";
      case "Hoàn thành":
        return "text-green-600";
      case "Tạm dừng":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfdfc] py-12">
      {/* Container hẹp lại để đọc báo không mỏi mắt */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header - Phong cách tiêu đề báo */}
        <header className="border-b-2 border-black pb-8 mb-10 text-center">
          <p className="text-sm font-sans font-bold tracking-widest text-red-700 uppercase mb-4">
            Tập san Nghiên cứu Khoa học
          </p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6 leading-tight">
            Tiến trình cập nhật các dự án nghiên cứu tiên tiến tại Khoa CNTT
          </h1>
          
          <div className="flex flex-wrap justify-center items-center font-sans text-sm text-gray-500 gap-4 uppercase tracking-wider">
            <span className="font-semibold text-gray-800">Ban Biên Tập</span>
            <span>•</span>
            <span>Cập nhật: Tháng 3, 2026</span>
            <span>•</span>
            <span>Thời gian đọc: 5 phút</span>
          </div>
        </header>

        {/* Abstract / Tóm tắt chuyên san (Thay cho 3 cái thẻ card) */}
        <section className="bg-gray-100 p-6 md:p-8 mb-12 border-l-4 border-gray-800">
          <h2 className="font-sans font-bold text-sm uppercase tracking-widest text-gray-900 mb-3">
            Tóm tắt (Abstract)
          </h2>
          <p className="font-serif text-lg leading-relaxed text-gray-700 text-justify italic">
            Trong giai đoạn hiện tại, Khoa Công nghệ thông tin đang duy trì sự phát triển mạnh mẽ với <strong className="text-black">12</strong> dự án đang thực hiện và <strong className="text-black">25</strong> dự án đã nghiệm thu thành công. Đặc biệt, việc mở rộng <strong className="text-black">8</strong> dự án hợp tác quốc tế đánh dấu bước chuyển mình quan trọng. Bài viết dưới đây điểm qua các hướng nghiên cứu mũi nhọn đang được triển khai.
          </p>
        </section>

        {/* Nội dung chính bài báo */}
        <div className="space-y-12">
          {projects.map((project, index) => (
            <section key={project.id} className="relative">
              {/* Tiêu đề mục con */}
              <h3 className="font-serif text-2xl font-bold text-gray-900 mb-3 leading-snug">
                {index + 1}. {project.title}
              </h3>
              
              {/* Meta data của dự án (Tác giả, trạng thái...) */}
              <div className="font-sans text-xs font-semibold text-gray-500 uppercase tracking-widest mb-5 flex flex-wrap gap-x-4 gap-y-2">
                <span>Chủ nhiệm: {project.leader}</span>
                <span className="hidden md:inline">|</span>
                <span>Giai đoạn: {project.duration}</span>
                <span className="hidden md:inline">|</span>
                <span className={`${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>

              {/* Nội dung - Sử dụng Drop cap (Chữ to đầu dòng) cho đoạn văn */}
              <p className="font-serif text-[1.1rem] leading-relaxed text-gray-800 text-justify">
                {/* Lấy ký tự đầu tiên viết to lên (Drop cap) */}
                <span className="float-left font-serif text-6xl font-bold text-gray-900 leading-none pr-3 pt-2">
                  {project.description.charAt(0)}
                </span>
                {/* Hiển thị phần còn lại của chuỗi */}
                {project.description.slice(1)}
              </p>
            </section>
          ))}
        </div>

        {/* Divider báo hiệu hết bài */}
        <div className="flex justify-center items-center space-x-2 my-12 text-gray-400">
          <span>♦</span>
          <span>♦</span>
          <span>♦</span>
        </div>

        {/* Nút Call to Action cuối bài kiểu báo chí */}
        <footer className="border-t border-b border-gray-200 py-8 text-center">
          <h4 className="font-serif text-xl font-bold text-gray-900 mb-2">
            Thư ngỏ hợp tác nghiên cứu
          </h4>
          <p className="font-serif text-gray-600 mb-6 italic">
            Ban khoa học luôn chào đón các ý tưởng đột phá từ sinh viên và giới chuyên môn.
          </p>
          <button className="font-sans font-bold text-sm uppercase tracking-widest border-2 border-gray-900 text-gray-900 px-8 py-3 hover:bg-gray-900 hover:text-white transition-colors duration-300">
            Gửi đề xuất ngay
          </button>
        </footer>

      </article>
    </div>
  );
};

export default ResearchProjects;