import { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Divider,
  Container,
} from "@mui/material";
import {
  School,
  People,
  Insights,
  History,
  CheckCircleOutline,
  ContactPhone,
  Computer,
  Psychology,
  Lightbulb,
  Stars,
  FunctionsRounded,
} from "@mui/icons-material";
import { DEPARTMENTS } from "../utils";
// import { DEPARTMENTS } from "../utils";

const About = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Core values
  const coreValues = [
    {
      title: "Đoàn kết",
      description: '"Đoàn kết chặt chẽ, cố gắng không ngừng để tiến bộ mãi".',
    },
    {
      title: "Trách nhiệm",
      description:
        "Trách nhiệm, tận tâm và cống hiến hết mình là giá trị cao quý của các thế hệ cán bộ Khoa Công nghệ thông tin, Học viện Nông nghiệp Việt Nam.",
    },
    {
      title: "Hội nhập",
      description:
        "Hội nhập quốc tế để tiếp cận chuẩn mực giáo dục đại học khu vực và thế giới, hợp tác Học viện – Khoa – Doanh nghiệp để đáp ứng yêu cầu thực tiễn.",
    },
    {
      title: "Sáng tạo",
      description:
        "Đổi mới sáng tạo dựa trên tiếp thu những tinh hoa tri thức của nhân loại, kế thừa những thành quả đã đạt được và phát huy những giá trị truyền thống tốt đẹp nhằm đạt được chất lượng cao trong đào tạo và nghiên cứu khoa học.",
    },
    {
      title: "Chất lượng",
      description:
        "Chất lượng cao là mục tiêu, là động lực phấn đấu, là yếu tố cốt lõi làm nên thương hiệu Khoa Công nghệ thông tin – Học viện Nông nghiệp Việt Nam.",
    },
  ];

  // Strategic goals
  const strategicGoals = [
    "Chương trình đào tạo linh hoạt giữa đào tạo theo định hướng nghiên cứu và định hướng nghề nghiệp phục vụ nhu cầu xã hội, tạo danh tiếng của cơ sở đào tạo có uy tín cao về công nghệ thông tin ứng dụng trong nông nghiệp và phát triển nông thôn của Việt Nam.",
    "Đội ngũ cán bộ tâm huyết, giỏi chuyên môn, nghiệp vụ, năng lực nghiên cứu, cơ sở vật chất hiện đại, phấn đấu trở thành trung tâm nghiên cứu chuyển giao tiến bộ khoa học kỹ thuật, dịch vụ công nghệ thông tin trong nông nghiệp và phát triển nông thôn vào năm 2030.",
    "Môi trường làm việc, học tập lý tưởng cho cán bộ, giảng viên và sinh viên.",
    "Hợp tác trong nước và quốc tế, đẩy mạnh truyền thông, quảng bá, khẳng định thương hiệu.",
    "Ưu tiên nghiên cứu phát triển các hệ thống thông minh và các ứng dụng công nghệ thông tin công nghệ cao trong nông nghiệp và phát triển nông thôn.",
  ];

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-md bg-mainColor/30 h-12 w-12 mb-4"></div>
          <div className="h-4 bg-mainColor/30 rounded w-32 mb-2"></div>
          <div className="h-3 bg-mainColor/20 rounded w-24"></div>
        </div>
      </Box>
    );
  }

  return (
    <div className="bg-gray-50 py-8">
      {/* Hero section with faculty image */}
      <div className="relative h-64 md:h-80 overflow-hidden mb-8">
        <img
          src="/src/assets/faculty/building.jpg"
          alt="Khoa Công nghệ thông tin"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-mainColor/80 to-transparent flex items-center">
          <div className="container mx-auto px-4">
            <h1 className="text-white text-3xl md:text-4xl font-bold drop-shadow-lg">
              Giới thiệu Khoa Công nghệ Thông tin
            </h1>
            <p className="text-white text-lg mt-2 max-w-xl drop-shadow-md">
              Đào tạo, nghiên cứu và ứng dụng công nghệ thông tin phục vụ nông
              nghiệp và phát triển nông thôn
            </p>
          </div>
        </div>
      </div>

      <Container maxWidth="lg">
        {/* General Information */}
        <Box className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center space-x-2 border-b border-mainColor pb-2 mb-4">
            <School className="text-mainColor" />
            <Typography
              variant="h5"
              component="h2"
              className="font-bold text-mainColor"
            >
              Thông tin chung
            </Typography>
          </div>

          <Typography>
            <strong>Địa chỉ Văn phòng Khoa:</strong> P316, Tầng 3 Nhà Hành
            chính, Học viện Nông nghiệp Việt Nam, Thị trấn Trâu Quỳ, huyện Gia
            Lâm, TP. Hà Nội
          </Typography>
          <Typography>
            <strong>Điện thoại:</strong> (024) 62617701
          </Typography>
          <Typography>
            <strong>Email:</strong> cntt@vnua.edu.vn <strong>Website:</strong>{" "}
            <a
              href="https://fita.vnua.edu.vn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-mainColor hover:underline"
            >
              https://fita.vnua.edu.vn
            </a>
          </Typography>
          <Typography>
            <strong>Ngày thành lập:</strong> 10-10-2005
          </Typography>
          <Typography>
            <strong>Bộ môn:</strong> Hiện nay Khoa có 05 Bộ môn và 01 Tổ văn
            phòng
          </Typography>
        </Box>

        {/* Departments */}
        <Box className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center space-x-2 border-b border-mainColor pb-2 mb-6">
            <School className="text-mainColor" />
            <Typography
              variant="h5"
              component="h2"
              className="font-bold text-mainColor"
            >
              Các Bộ môn
            </Typography>
          </div>

          <Grid container spacing={3}>
            {DEPARTMENTS.map((department, index) => {
              const IconComponent = department.icon;
              return (
                <Grid item xs={4} md={4} key={index}>
                  <Card className="h-full shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-mainColor">
                    <CardContent className="flex items-center">
                      <div className="mr-3 text-mainColor">
                        <IconComponent className="text-mainColor" />
                      </div>
                      <Typography variant="body1" className="font-medium">
                        {department.name}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>

        {/* Facilities */}
        <Box className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center space-x-2 border-b border-mainColor pb-2 mb-4">
            <Computer className="text-mainColor" />
            <Typography
              variant="h5"
              component="h2"
              className="font-bold text-mainColor"
            >
              Cơ sở vật chất
            </Typography>
          </div>

          <Typography>
            Hệ thống giảng đường trung tâm của trường Học viện Nông nghiệp Việt
            Nam đều được trang bị máy chiếu projector. Hệ thống phòng thực hành
            máy tính của khoa CNTT gồm có 05 phòng được trang bị thiết bị máy
            tính hiện đại, màn hình cỡ lớn hoặc projector, kết nối mạng Internet
            thông qua hệ thống mạng nội bộ của trường để đáp ứng nhu cầu học tập
            của sinh viên trong toàn trường.
          </Typography>
        </Box>

        {/* Vision & Mission */}
        <Grid container spacing={4} className="mb-8">
          <Grid item xs={12} md={6}>
            <Card className="h-full shadow-md hover:shadow-lg transition-shadow">
              <CardContent>
                <div className="flex items-center space-x-2 border-b border-[#f6a309] pb-2 mb-4">
                  <Insights className="text-[#f6a309]" />
                  <Typography
                    variant="h5"
                    component="h2"
                    className="font-bold text-gray-800"
                  >
                    Tầm nhìn
                  </Typography>
                </div>
                <Typography>
                  Trở thành một cơ sở đào tạo có uy tín cao trong nước và khu
                  vực về đào tạo nguồn nhân lực có chất lượng cao, NCKH, ứng
                  dụng tri thức và phát triển công nghệ trong lĩnh vực khoa học
                  máy tính, CNTT, trí tuệ nhân tạo, truyền thông và dữ liệu lớn
                  phục vụ công cuộc phát triển nông nghiệp, nông dân, nông thôn
                  góp phần vào sự nghiệp Công nghiệp hóa – Hiện đại hóa đất
                  nước.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card className="h-full shadow-md hover:shadow-lg transition-shadow">
              <CardContent>
                <div className="flex items-center space-x-2 border-b border-[#f6a309] pb-2 mb-4">
                  <History className="text-[#f6a309]" />
                  <Typography
                    variant="h5"
                    component="h2"
                    className="font-bold text-gray-800"
                  >
                    Sứ mệnh
                  </Typography>
                </div>
                <Typography>
                  Đào tạo và cung cấp nguồn nhân lực chất lượng cao, NCKH, phát
                  triển công nghệ, chuyển giao tri thức, sản phẩm mới về khoa
                  học máy tính, CNTT, trí tuệ nhân tạo, truyền thông và dữ liệu
                  lớn. Đồng thời, cung cấp nguồn nhân lực chất lượng cao để có
                  thể ứng dụng CNTT, trí tuệ nhân tạo, truyền thông và dữ liệu
                  lớn trong nông nghiệp & phát triển nông thôn, đóng góp đắc lực
                  và hiệu quả vào sự nghiệp phát triển nông nghiệp, nông dân,
                  nông thôn và hội nhập quốc tế ngày càng sâu rộng của đất nước.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Educational Philosophy */}
        <Box className="bg-gradient-to-r from-mainColor to-[#154c6e] rounded-lg shadow-md p-6 text-white mb-8">
          <Typography
            variant="h5"
            component="h2"
            className="font-bold mb-3 text-center"
          >
            Triết lý giáo dục
          </Typography>

          <Typography
            variant="h4"
            component="div"
            className="text-center mb-4 font-bold"
          >
            "Chuyên nghiệp – Sáng tạo – Hội nhập – Trách nhiệm"
          </Typography>

          <Typography>
            "Chuyên nghiệp – Sáng tạo – Hội nhập – Trách nhiệm" hướng đến mục
            tiêu đào tạo nguồn nhân lực có năng lực chuyên môn tốt và chuyên
            nghiệp, năng động và sáng tạo trong công việc, đáp ứng yêu cầu thực
            tiễn và hội nhập quốc tế, có trách nhiệm với bản thân, gia đình và
            xã hội. Mục tiêu giáo dục của đại học định hướng nghiên cứu không
            chỉ là tiếp cận tri thức và công nghệ tiên tiến mà còn nâng cao năng
            lực sáng tạo tri thức và công nghệ mới, định hướng áp dụng công nghệ
            vị nhân sinh và phát triển bền vững, góp phần hình thành thế hệ công
            dân mới có năng lực và trách nhiệm phụng sự xã hội.
          </Typography>
        </Box>

        {/* Strategic Goals */}
        <Box className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center space-x-2 border-b border-mainColor pb-2 mb-4">
            <Stars className="text-mainColor" />
            <Typography
              variant="h5"
              component="h2"
              className="font-bold text-mainColor"
            >
              Mục tiêu chiến lược
            </Typography>
          </div>

          <Typography className="font-medium">
            Mục tiêu chiến lược đến năm 2030 và tầm nhìn đến năm 2050:
          </Typography>

          <ul className="space-y-3">
            {strategicGoals.map((goal, index) => (
              <li key={index} className="flex items-start">
                <CheckCircleOutline
                  className="text-mainColor mr-2 mt-1 flex-shrink-0"
                  fontSize="small"
                />
                <Typography>{goal}</Typography>
              </li>
            ))}
          </ul>
        </Box>

        {/* Core Values */}
        <Box className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center space-x-2 border-b border-mainColor pb-2 mb-6">
            <People className="text-mainColor" />
            <Typography
              variant="h5"
              component="h2"
              className="font-bold text-mainColor"
            >
              Giá trị cốt lõi
            </Typography>
          </div>

          <Typography className="mb-4 font-medium">
            Khoa Công nghệ thông tin không ngừng phấn đấu để kiến tạo nên "sự
            khác biệt, đặc trưng":
          </Typography>

          <Grid container spacing={3}>
            {coreValues.map((value, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card className="h-full shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-mainColor">
                  <CardContent>
                    <Typography
                      variant="h6"
                      component="h3"
                      className="font-bold mb-2 text-mainColor"
                    >
                      {value.title}
                    </Typography>
                    <Typography variant="body2">{value.description}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Statistics */}
        <Box className="bg-gradient-to-r from-mainColor to-[#154c6e] rounded-lg shadow-md p-6 text-white mb-8">
          <Typography
            variant="h5"
            component="h2"
            className="font-bold mb-6 text-center"
          >
            Khoa Công nghệ Thông tin trong con số
          </Typography>

          <div className="flex justify-center py-4">
            <Grid container spacing={3}>
              <Grid item xs={6} sm={3}>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">2005</div>
                  <Typography variant="body2">Năm thành lập</Typography>
                </div>
              </Grid>
              <Grid item xs={6} sm={3}>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">6</div>
                  <Typography variant="body2">Đơn vị trực thuộc</Typography>
                </div>
              </Grid>
              <Grid item xs={6} sm={3}>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">15+</div>
                  <Typography variant="body2">Phòng thực hành</Typography>
                </div>
              </Grid>
              <Grid item xs={6} sm={3}>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">
                    {new Date().getFullYear() - 2005}+
                  </div>
                  <Typography variant="body2">Năm phát triển</Typography>
                </div>
              </Grid>
            </Grid>
          </div>
        </Box>
      </Container>
    </div>
  );
};

export default About;
