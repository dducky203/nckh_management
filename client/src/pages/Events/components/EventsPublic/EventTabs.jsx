import { Schedule, EventAvailable, CheckCircle } from "@mui/icons-material";

const EventTabs = ({ activeTab, setActiveTab, eventCount  = 0}) => {
  return (
    <div className="flex border-b overflow-x-auto">
      <button
        onClick={() => setActiveTab("upcoming")}
        className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
          activeTab === "upcoming"
            ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
            : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
        }`}
      >
        <Schedule fontSize="small" />
        Sắp diễn ra
        {activeTab === "upcoming" && (
          <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-md">
            {eventCount}
          </span>
        )}
      </button>
      <button
        onClick={() => setActiveTab("ongoing")}
        className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
          activeTab === "ongoing"
            ? "text-green-600 border-b-2 border-green-600 bg-green-50"
            : "text-gray-600 hover:text-green-600 hover:bg-gray-50"
        }`}
      >
        <EventAvailable fontSize="small" />
        Đang diễn ra
        {activeTab === "ongoing" && (
          <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-md">
            {eventCount}
          </span>
        )}
      </button>
      <button
        onClick={() => setActiveTab("completed")}
        className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
          activeTab === "completed"
            ? "text-gray-600 border-b-2 border-gray-600 bg-gray-50"
            : "text-gray-600 hover:text-gray-700 hover:bg-gray-50"
        }`}
      >
        <CheckCircle fontSize="small" />
        Đã kết thúc
        {activeTab === "completed" && (
          <span className="bg-gray-600 text-white text-xs px-2 py-0.5 rounded-md">
            {eventCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default EventTabs;
