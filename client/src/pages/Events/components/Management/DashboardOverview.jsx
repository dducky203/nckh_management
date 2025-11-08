import { Add } from "@mui/icons-material";
import DashboardStats from "./DashboardStats";
import YearlyTrendChart from "./YearlyTrendChart";
import EventTypeChart from "./EventTypeChart";
import MonthlyBarChart from "./MonthlyBarChart";

const DashboardOverview = ({
  events,
  approvedEvents,
  pendingEvents,
  selectedYear,
  setSelectedYear,
  years,
  eventTypes,
  colors,
  setEditingEvent,
  setFormModalOpen,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Tổng quan thống kê
          </h2>
          <p className="text-gray-600">
            Phân tích dữ liệu sự kiện theo năm và loại
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              setEditingEvent(null);
              setFormModalOpen(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-sm"
          >
            <Add className="mr-2" />
            Tạo sự kiện
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <DashboardStats
        events={events}
        approvedEvents={approvedEvents}
        pendingEvents={pendingEvents}
        selectedYear={selectedYear}
      />

      

      {/* Monthly Bar Chart - Full Width */}
      <MonthlyBarChart events={events} selectedYear={selectedYear} />
      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <YearlyTrendChart events={events} years={years} />
        <EventTypeChart
          events={events}
          selectedYear={selectedYear}
          eventTypes={eventTypes}
          colors={colors}
        />
      </div>
    </div>
  );
};

export default DashboardOverview;
