import { Add, Event as EventIcon } from "@mui/icons-material";
import Button from "../../../../components/common/Button";
import DashboardStats from "./DashboardStats";
import EventTypeChart from "./EventTypeChart";
import MonthlyBarChart from "./MonthlyBarChart";
import YearlyTrendChart from "./YearlyTrendChart";

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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <EventIcon className="text-blue-600" />
            Tổng quan sự kiện
          </h1>
          <p className="text-gray-600 mt-1">
            Thống kê, biểu đồ và danh sách nhanh
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                Năm {y}
              </option>
            ))}
          </select>

          <Button
            onClick={() => {
              setEditingEvent(null);
              setFormModalOpen(true);
            }}
            className="flex items-center gap-2"
          >
            <Add fontSize="small" />
            Tạo sự kiện
          </Button>
        </div>
      </div>

      <DashboardStats
        events={events}
        approvedEvents={approvedEvents}
        pendingEvents={pendingEvents}
        selectedYear={selectedYear}
      />

      <EventTypeChart
        events={events}
        selectedYear={selectedYear}
        eventTypes={eventTypes}
        colors={colors}
      />

      <MonthlyBarChart events={events} selectedYear={selectedYear} />
      <YearlyTrendChart events={events} years={years} />
    </div>
  );
};

export default DashboardOverview;
