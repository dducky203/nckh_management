import { Event, CheckCircle, Schedule, Group } from "@mui/icons-material";

const DashboardStats = ({
  events,
  approvedEvents,
  pendingEvents,
  selectedYear,
}) => {
  const currentYearEvents = events.filter(
    (e) => new Date(e.date).getFullYear() === selectedYear
  );
  const totalParticipants = events.reduce((sum, e) => sum + e.participants, 0);

  const statsCards = [
    {
      title: `Tổng sự kiện ${selectedYear}`,
      value: currentYearEvents.length,
      icon: Event,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Đã duyệt",
      value: approvedEvents.length,
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      title: "Chờ duyệt",
      value: pendingEvents.length,
      icon: Schedule,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Tổng người tham gia",
      value: totalParticipants,
      icon: Group,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {statsCards.map((stat, index) => (
        <div
          key={index}
          className={`${stat.bgColor} p-6 rounded-lg shadow-sm border`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
            <stat.icon className={`${stat.color} text-4xl`} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
