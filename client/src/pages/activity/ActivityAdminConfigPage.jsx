import { Link } from "react-router-dom";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import BarChartIcon from "@mui/icons-material/BarChart";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import PeopleIcon from "@mui/icons-material/People";
import EventNoteIcon from "@mui/icons-material/EventNote";
import ArticleIcon from "@mui/icons-material/Article";
import GroupIcon from "@mui/icons-material/Group";
import HubIcon from "@mui/icons-material/Hub";
import SmartToyIcon from "@mui/icons-material/SmartToy";

const adminCards = [
  {
    title: "Định mức theo năm",
    description:
      "Xem dữ liệu định mức toàn hệ thống theo năm học để chuẩn bị chỉnh sửa.",
    to: "/activity/admin/year-quota",
    icon: EditCalendarIcon,
    tone: "from-sky-500 to-cyan-500",
    cta: "Mở định mức theo năm",
  },
  {
    title: "Duyệt khai báo",
    description:
      "Kiểm tra, phê duyệt hoặc từ chối các khai báo hoạt động NCKH.",
    to: "/activity/admin/approval",
    icon: FactCheckIcon,
    tone: "from-emerald-500 to-teal-500",
    cta: "Đi tới duyệt khai báo",
  },
  {
    title: "Thống kê phương án",
    description:
      "Theo dõi thống kê chọn phương án của cán bộ theo từng năm học.",
    to: "/activity/admin/plan-statistics",
    icon: QueryStatsIcon,
    tone: "from-indigo-500 to-blue-500",
    cta: "Đi tới thống kê",
  },
  {
    title: "Định mức hoạt động",
    description:
      "Xem đối chiếu định mức và dữ liệu thực tế của hoạt động NCKH.",
    to: "/activity/standards",
    icon: BarChartIcon,
    tone: "from-amber-500 to-orange-500",
    cta: "Đi tới định mức",
  },
  {
    title: "Chức năng người dùng",
    description:
      "Xem trang tách biệt cho user thường với các chức năng khai báo NCKH.",
    to: "/activity/user",
    icon: HubIcon,
    tone: "from-violet-500 to-fuchsia-500",
    cta: "Mở trang user",
  },
  {
    title: "Quản lý nhân sự",
    description:
      "Quản trị tài khoản, quyền và thông tin cán bộ trong hệ thống.",
    to: "/user/manager",
    icon: PeopleIcon,
    tone: "from-rose-500 to-pink-500",
    cta: "Đi tới quản lý nhân sự",
  },
  {
    title: "Quản lý sự kiện",
    description:
      "Tạo, cập nhật, duyệt và theo dõi các sự kiện nghiên cứu khoa học.",
    to: "/events/manage",
    icon: EventNoteIcon,
    tone: "from-cyan-500 to-sky-500",
    cta: "Đi tới quản lý sự kiện",
  },
  {
    title: "Quản lý tin tức",
    description:
      "Quản lý nội dung, xuất bản và điều phối bài viết tin tức.",
    to: "/news/manager",
    icon: ArticleIcon,
    tone: "from-lime-500 to-green-500",
    cta: "Đi tới quản lý tin tức",
  },
  {
    title: "Quản lý nhóm NCKH",
    description:
      "Điều phối hồ sơ, thành viên và tài liệu của các nhóm nghiên cứu.",
    to: "/research-groups/manager",
    icon: GroupIcon,
    tone: "from-blue-500 to-indigo-500",
    cta: "Đi tới quản lý nhóm",
  },
  {
    title: "Phân tích Chatbot (AI)",
    description:
      "Dùng AI phân tích lịch sử chat để tìm ra các khó khăn của người dùng.",
    to: "/admin/chat-analysis",
    icon: SmartToyIcon,
    tone: "from-purple-500 to-indigo-600",
    cta: "Mở phân tích AI",
  },
];

export default function ActivityAdminConfigPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      <div className="mx-auto max-w-7xl px-4 pt-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-mainColor/10 p-3 text-mainColor">
              <SettingsSuggestIcon sx={{ fontSize: 28 }} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-800">
                Cấu hình chức năng NCKH
              </h1>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Các chức năng quản trị tập trung.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {adminCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`inline-flex rounded-xl bg-gradient-to-br ${card.tone} p-2 text-white`}
                  >
                    <Icon sx={{ fontSize: 20 }} />
                  </div>
                  <h2 className="text-base font-bold text-slate-800">
                    {card.title}
                  </h2>
                </div>

                <p className="mt-3 text-sm font-medium text-slate-500">
                  {card.description}
                </p>

                <div className="mt-4">
                  {card.disabled ? (
                    <span className="inline-flex rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-400">
                      {card.cta}
                    </span>
                  ) : (
                    <Link
                      to={card.to}
                      className="inline-flex rounded-lg bg-mainColor px-3 py-2 text-xs font-bold text-white transition hover:brightness-110"
                    >
                      {card.cta}
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
