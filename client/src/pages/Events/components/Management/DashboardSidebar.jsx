import { Dashboard, EventAvailable, PendingActions } from "@mui/icons-material";

const DashboardSidebar = ({
  activeTab,
  setActiveTab,
  pendingEvents,
  events,
  approvedEvents,
}) => {
  const sidebarItems = [
    {
      id: "dashboard",
      label: "Tổng quan",
      icon: Dashboard,
      description: "Thống kê và biểu đồ",
    },
    {
      id: "approved",
      label: "Sự kiện đã duyệt",
      icon: EventAvailable,
      description: "Quản lý sự kiện đã duyệt",
    },
    {
      id: "pending",
      label: "Chờ duyệt",
      icon: PendingActions,
      description: "Duyệt sự kiện mới",
      badge: pendingEvents.length,
    },
  ];

  return (
    <div className="w-80 bg-white shadow-lg border-r">
      <nav className="p-4">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center justify-between p-4 rounded-lg mb-2 transition-all ${
              activeTab === item.id
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : "hover:bg-gray-50 text-gray-700"
            }`}
          >
            <div className="flex items-center">
              <item.icon className="mr-3" />
              <div className="text-left">
                <div className="font-medium">{item.label}</div>
                <div className="text-xs text-gray-500">{item.description}</div>
              </div>
            </div>
            {item.badge && (
              <span className="bg-red-500 text-white text-xs rounded-md px-2 py-1 min-w-[20px] text-center">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Quick Stats in Sidebar */}
      <div className="p-4 border-t">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Thống kê nhanh
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tổng sự kiện:</span>
            <span className="font-medium">{events.length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Đã duyệt:</span>
            <span className="font-medium text-green-600">
              {approvedEvents.length}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Chờ duyệt:</span>
            <span className="font-medium text-yellow-600">
              {pendingEvents.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
