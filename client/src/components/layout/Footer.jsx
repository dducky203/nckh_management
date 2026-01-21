import { FacebookOutlined, Instagram, YouTube } from "@mui/icons-material";
import logoFita from "../../assets/logo_fita.png";

const Footer = () => {
  const socialLinks = [
    {
      id: "facebook",
      url: "https://www.facebook.com/FITA.VNUA",
      icon: <FacebookOutlined className="text-[#0b6d3a] text-xl" />,
    },
    {
      id: "youtube",
      url: "https://www.youtube.com/channel/UC_O9ofPYoZ_zYvWuE8ITMeg",
      icon: <YouTube className="text-[#0b6d3a] text-xl" />,
    },
    {
      id: "instagram",
      url: "https://www.instagram.com/hocviennongnghiepvietnam/",
      icon: <Instagram className="text-[#0b6d3a] text-xl" />,
    },
  ];

  const contactInfo = [
    "Địa chỉ Văn phòng Khoa: P316, Tầng 3 Nhà Hành chính, Học viện Nông nghiệp Việt Nam",
    "Điện thoại: (024) 62617701 – Fax: (024) 38276554",
    "Email: cntt@vnua.edu.vn - Website: https://fita.vnua.edu.vn",
  ];

  return (
    <footer className="w-full">
      {/* Dải màu trang trí */}
      <div className="flex flex-col">
        <div className="bg-[#f6a309] h-[5px]"></div>
        <div className="bg-[#066140] h-[5px]"></div>
        <div className="bg-[#4e3636] h-[5px]"></div>
      </div>

      <div className="w-full md:w-3/4 mx-auto py-6 px-4 md:px-0 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Thông tin liên hệ */}
        <div className="text-sm ">
          <h1 className="font-bold mb-2 text-center md:text-left">
            KHOA CÔNG NGHỆ THÔNG TIN - HỌC VIỆN NÔNG NGHIỆP VIỆT
            NAM
          </h1>
          {contactInfo.map((info, index) => (
            <p key={index} className="mb-1 text-center md:text-left">
              {info}
            </p>
          ))}
        </div>

        <div className="w-28 h-14 flex items-center justify-center">
          <img
            src={logoFita}
            alt="Logo FITA"
            className="object-contain"
            loading="lazy"
          />
        </div>

        <div className="flex gap-3">
          {socialLinks.map((social) => (
            <div
              key={social.id}
              className="border-2 border-[#0b6d3a] rounded-full p-1.5 transition-colors duration-300"
            >
              <a
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center"
                aria-label={`Visit our ${social.id} page`}
              >
                {social.icon}
              </a>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
