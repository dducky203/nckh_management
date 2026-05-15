import { Link } from "react-router-dom";
import HubIcon from "@mui/icons-material/Hub";
import BarChartIcon from "@mui/icons-material/BarChart";
import GroupIcon from "@mui/icons-material/Group";
import CampaignIcon from "@mui/icons-material/Campaign";
import { RESEARCH_CATEGORIES } from "../../utils/data";

const quickCards = [
  {
    title: "Định mức hoạt động",
    description: "Theo dõi đối chiếu định mức và dữ liệu thực tế theo năm học.",
    to: "/activity/standards",
    icon: BarChartIcon,
    tone: "from-amber-500 to-orange-500",
    cta: "Mở định mức",
  },
  {
    title: "Hồ sơ nhóm NCKH",
    description: "Xem thông tin và hồ sơ nhóm nghiên cứu của bạn.",
    to: "/research-groups/profile",
    icon: GroupIcon,
    tone: "from-emerald-500 to-teal-500",
    cta: "Mở hồ sơ nhóm",
  },
  {
    title: "Nhóm NCKH",
    description: "Theo dõi danh sách nhóm nghiên cứu và hoạt động liên quan.",
    to: "/research-groups",
    icon: CampaignIcon,
    tone: "from-indigo-500 to-blue-500",
    cta: "Xem nhóm NCKH",
  },
  {
    title: "Định mức nhóm NCKH",
    description: "Tính giờ quy đổi theo tiêu chí nhóm NCM / Xuất sắc / Tinh hoa.",
    to: "/activity/group-quota",
    icon: GroupIcon,
    tone: "from-violet-500 to-purple-600",
    cta: "Mở định mức nhóm",
  },
];

export default function ActivityUserFeaturePage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      <div className="mx-auto max-w-7xl px-4 pt-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-mainColor/10 p-3 text-mainColor">
              <HubIcon sx={{ fontSize: 28 }} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-800">
                Chức năng NCKH cho người dùng
              </h1>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Trang riêng cho người dùng thường để truy cập các chức năng khai
                báo và theo dõi hoạt động NCKH.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {quickCards.map((card) => {
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
                  <Link
                    to={card.to}
                    className="inline-flex rounded-lg bg-mainColor px-3 py-2 text-xs font-bold text-white transition hover:brightness-110"
                  >
                    {card.cta}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-bold text-slate-800">
            Danh sách chức năng khai báo
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Chọn đúng loại hoạt động để khai báo minh chứng NCKH.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2">
            {RESEARCH_CATEGORIES.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-mainColor hover:bg-white hover:text-mainColor"
              >
                <span>{item.name}</span>
                <span className="text-xs font-bold text-slate-400">Mở</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
