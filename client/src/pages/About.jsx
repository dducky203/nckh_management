import { useState, useEffect } from "react";
import {
  School,
  People,
  Insights,
  History,
  CheckCircleOutline,
  Computer,
  Stars,
} from "@mui/icons-material";
import { DEPARTMENTS } from "../utils";

const About = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const coreValues = [
    {
      title: "Đoàn kết",
      description: '"Đoàn kết chặt chẽ, cố gắng không ngừng để tiến bộ mãi".',
    },
    {
      title: "Trách nhiệm",
      description:
        "Trách nhiệm, tận tâm và cống hiến hết mình là giá trị cao quý của các thế hệ cán bộ Khoa Công nghệ thông tin.",
    },
    {
      title: "Hội nhập",
      description:
        "Hội nhập quốc tế để tiếp cận chuẩn mực giáo dục đại học khu vực và thế giới, hợp tác Học viện – Khoa – Doanh nghiệp.",
    },
    {
      title: "Sáng tạo",
      description:
        "Đổi mới sáng tạo dựa trên tiếp thu tinh hoa tri thức, kế thừa thành quả và phát huy giá trị truyền thống tốt đẹp.",
    },
    {
      title: "Chất lượng",
      description:
        "Chất lượng cao là mục tiêu, là động lực phấn đấu, là yếu tố cốt lõi làm nên thương hiệu Khoa CNTT.",
    },
  ];

  const strategicGoals = [
    "Chương trình đào tạo linh hoạt giữa định hướng nghiên cứu và nghề nghiệp.",
    "Đội ngũ cán bộ tâm huyết, giỏi chuyên môn, cơ sở vật chất hiện đại.",
    "Môi trường làm việc, học tập lý tưởng cho cán bộ, giảng viên và sinh viên.",
    "Hợp tác trong nước và quốc tế, đẩy mạnh truyền thông, khẳng định thương hiệu.",
    "Ưu tiên nghiên cứu hệ thống thông minh và ứng dụng CNTT trong nông nghiệp.",
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] bg-gray-100">
        <div className="flex flex-col items-center animate-pulse">
          <div className="rounded-md bg-mainColor/30 h-12 w-12 mb-4"></div>
          <div className="h-4 bg-mainColor/30 rounded w-32 mb-2"></div>
          <div className="h-3 bg-mainColor/20 rounded w-24"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen font-sans text-gray-700 pb-16">
      <div className="relative h-64 md:h-80 overflow-hidden mb-10 group">
        <img
          src="/src/assets/banner23.png"
          alt="Khoa Công nghệ thông tin"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-mainColor/90 via-mainColor/40 to-transparent flex items-center">
          <div className="container mx-auto px-4">
            <h1 className="text-white text-3xl md:text-5xl font-bold drop-shadow-md mb-2">
              Giới thiệu Khoa CNTT
            </h1>
            <p className="text-white text-lg md:text-xl font-light max-w-xl drop-shadow-sm border-l-4 border-white pl-4">
              Đào tạo, nghiên cứu và ứng dụng CNTT phục vụ nông nghiệp và phát triển nông thôn
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
          <div className="flex items-center space-x-2 border-b border-gray-200 pb-3 mb-4">
            <School className="text-mainColor" />
            <h2 className="text-xl font-bold text-mainColor uppercase">
              Thông tin chung
            </h2>
          </div>

          <div className="space-y-3 text-sm md:text-base">
            <p>
              <strong className="font-semibold text-gray-900">Địa chỉ:</strong>Tầng 3 Tòa Bùi Huy Đáp, Học viện Nông nghiệp Việt Nam, Trâu Quỳ, Gia Lâm, Hà Nội.
            </p>
            <p>
              <strong className="font-semibold text-gray-900">Điện thoại:</strong> (024) 62617701
            </p>
            <p>
              <strong className="font-semibold text-gray-900">Email:</strong> cntt@vnua.edu.vn -{" "}
              <strong className="font-semibold text-gray-900">Website:</strong>{" "}
              <a
                href="https://fita.vnua.edu.vn"
                target="_blank"
                rel="noopener noreferrer"
                className="text-mainColor hover:underline font-medium"
              >
                https://fita.vnua.edu.vn
              </a>
            </p>
            <p>
              <strong className="font-semibold text-gray-900">Ngày thành lập:</strong> 10-10-2005
            </p>
            <p>
              <strong className="font-semibold text-gray-900">Quy mô:</strong> 05 Bộ môn và 01 Tổ văn phòng.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
          <div className="flex items-center space-x-2 border-b border-gray-200 pb-3 mb-6">
            <School className="text-mainColor" />
            <h2 className="text-xl font-bold text-mainColor uppercase">
              Các bộ môn
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {DEPARTMENTS.map((department, index) => {
              const IconComponent = department.icon;
              return (
                <div
                  key={index}
                  className="flex flex-col md:flex-row items-center p-4 rounded-lg border-l-4 border-mainColor bg-gray-50 hover:bg-white hover:shadow-md transition-all duration-300 border-r border-t border-b border-gray-200"
                >
                  <div className="mb-2 md:mb-0 md:mr-3 text-mainColor">
                    <IconComponent fontSize="medium" />
                  </div>
                  <span className="font-semibold text-gray-800 text-center md:text-left text-sm">
                    {department.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
          <div className="flex items-center space-x-2 border-b border-gray-200 pb-3 mb-4">
            <Computer className="text-mainColor" />
            <h2 className="text-xl font-bold text-mainColor uppercase">
              Cơ sở vật chất
            </h2>
          </div>
          <p className="text-gray-600 leading-relaxed text-justify">
            Hệ thống giảng đường trung tâm hiện đại, trang bị đầy đủ máy chiếu. 
            Khoa CNTT sở hữu <strong>05 phòng thực hành computer lab</strong> cấu hình cao, 
            kết nối Internet tốc độ cao qua mạng nội bộ, đáp ứng tốt nhu cầu học tập 
            và nghiên cứu của sinh viên toàn trường.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border-t-4 border-[#f6a309] border-x border-b border-gray-200">
            <div className="flex items-center space-x-2 mb-4">
              <Insights className="text-[#f6a309]" />
              <h2 className="text-xl font-bold text-gray-800">Tầm nhìn</h2>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed text-justify">
              Trở thành cơ sở đào tạo uy tín trong khu vực về CNTT, AI và Big Data. 
              Ứng dụng công nghệ phục vụ phát triển nông nghiệp, nông thôn, góp phần 
              vào sự nghiệp Công nghiệp hóa – Hiện đại hóa đất nước.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border-t-4 border-[#f6a309] border-x border-b border-gray-200">
            <div className="flex items-center space-x-2 mb-4">
              <History className="text-[#f6a309]" />
              <h2 className="text-xl font-bold text-gray-800">Sứ mệnh</h2>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed text-justify">
              Đào tạo nhân lực chất lượng cao, nghiên cứu và chuyển giao công nghệ. 
              Cung cấp giải pháp thông minh cho nông nghiệp & phát triển nông thôn, 
              đóng góp vào sự hội nhập quốc tế sâu rộng.
            </p>
          </div>
        </div>

        <div className="rounded-xl shadow-md p-8 text-white mb-8 bg-gradient-to-r from-mainColor to-blue-800 text-center relative overflow-hidden">
            <Stars className="absolute top-2 right-2 opacity-10 text-6xl" />
            
            <h2 className="text-xl font-bold mb-4 uppercase tracking-wider opacity-90">
                Triết lý giáo dục
            </h2>
            <div className="text-2xl md:text-3xl font-bold mb-6 font-serif">
                "Chuyên nghiệp – Sáng tạo – Hội nhập – Trách nhiệm"
            </div>
            <div className="w-16 h-1 bg-yellow-400 mx-auto mb-6"></div>
            <p className="max-w-4xl mx-auto opacity-90 leading-relaxed text-sm md:text-base font-light">
                Hướng đến mục tiêu đào tạo nguồn nhân lực chuyên nghiệp, năng động, 
                sáng tạo, đáp ứng yêu cầu thực tiễn và hội nhập quốc tế. Hình thành 
                thế hệ công dân mới có năng lực và trách nhiệm phụng sự xã hội.
            </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
          <div className="flex items-center space-x-2 border-b border-gray-200 pb-3 mb-4">
            <Stars className="text-mainColor" />
            <h2 className="text-xl font-bold text-mainColor uppercase">
              Mục tiêu chiến lược
            </h2>
          </div>
          
          <p className="font-semibold text-gray-700 mb-4">
             Đến năm 2030 và tầm nhìn 2050:
          </p>

          <ul className="space-y-3">
            {strategicGoals.map((goal, index) => (
              <li key={index} className="flex items-start text-gray-600">
                <CheckCircleOutline
                  className="text-mainColor mr-3 mt-0.5 flex-shrink-0"
                  fontSize="small"
                />
                <span className="text-sm md:text-base">{goal}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <People className="text-mainColor" /> 
                <span className="uppercase text-mainColor">Giá trị cốt lõi</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {coreValues.map((value, index) => (
                    <div key={index} className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:border-mainColor transition-colors duration-300">
                        <h3 className="font-bold text-mainColor text-lg mb-2">
                            {value.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                            {value.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border-t-4 border-mainColor border-x border-b border-gray-200">
             <h2 className="text-xl font-bold text-center text-gray-800 mb-8 uppercase">
                Khoa Công nghệ Thông tin trong con số
             </h2>
             
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                    <div className="text-3xl font-bold text-mainColor mb-1">2005</div>
                    <div className="text-xs font-semibold text-gray-500 uppercase">Năm thành lập</div>
                </div>
                <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                    <div className="text-3xl font-bold text-mainColor mb-1">6</div>
                    <div className="text-xs font-semibold text-gray-500 uppercase">Đơn vị trực thuộc</div>
                </div>
                <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                    <div className="text-3xl font-bold text-mainColor mb-1">15+</div>
                    <div className="text-xs font-semibold text-gray-500 uppercase">Phòng thực hành</div>
                </div>
                <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                    <div className="text-3xl font-bold text-mainColor mb-1">
                        {new Date().getFullYear() - 2005}+
                    </div>
                    <div className="text-xs font-semibold text-gray-500 uppercase">Năm phát triển</div>
                </div>
             </div>
        </div>

      </div>
    </div>
  );
};

export default About;