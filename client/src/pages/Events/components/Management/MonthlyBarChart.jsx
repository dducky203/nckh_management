import { BarChart } from "@mui/icons-material";

const MonthlyBarChart = ({ events, selectedYear }) => {
  // Tạo dữ liệu đầy đủ cho 12 tháng
  const monthlyData = [];
  const monthNames = [
    "T1",
    "T2",
    "T3",
    "T4",
    "T5",
    "T6",
    "T7",
    "T8",
    "T9",
    "T10",
    "T11",
    "T12",
  ];

  for (let month = 1; month <= 12; month++) {
    const monthEvents = events.filter((e) => {
      const eventDate = new Date(e.date);
      return (
        eventDate.getFullYear() === selectedYear &&
        eventDate.getMonth() + 1 === month
      );
    });

    monthlyData.push({
      month: monthNames[month - 1],
      events: monthEvents.length,
      participants: monthEvents.reduce((sum, e) => sum + e.participants, 0),
    });
  }

  const maxEvents = Math.max(...monthlyData.map((m) => m.events), 1);
  const maxParticipants = Math.max(
    ...monthlyData.map((m) => m.participants),
    1
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-xl font-semibold mb-6 flex items-center">
        <BarChart className="mr-2 text-purple-600" />
        Biểu đồ cột theo tháng ({selectedYear})
      </h3>

      {/* Chart Area */}
      <div className="space-y-8">
        {/* Events Chart */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-4">
            Số lượng sự kiện
          </h4>
          <div className="flex items-end justify-between h-40 px-2 bg-gray-50 rounded-lg p-4">
            {monthlyData.map((data, index) => (
              <div
                key={index}
                className="flex flex-col items-center flex-1 mx-1"
              >
                <div
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-sm transition-all duration-500 hover:from-blue-600 hover:to-blue-500 relative group min-w-[20px]"
                  style={{
                    height: `${(data.events / maxEvents) * 120}px`,
                    minHeight: data.events > 0 ? "8px" : "2px",
                  }}
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    {data.events} sự kiện
                  </div>
                </div>
                <span className="text-xs text-gray-600 mt-2 font-medium">
                  {data.month}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Participants Chart */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-4">
            Số người tham gia
          </h4>
          <div className="flex items-end justify-between h-40 px-2 bg-gray-50 rounded-lg p-4">
            {monthlyData.map((data, index) => (
              <div
                key={index}
                className="flex flex-col items-center flex-1 mx-1"
              >
                <div
                  className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-sm transition-all duration-500 hover:from-green-600 hover:to-green-500 relative group min-w-[20px]"
                  style={{
                    height: `${(data.participants / maxParticipants) * 120}px`,
                    minHeight: data.participants > 0 ? "8px" : "2px",
                  }}
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    {data.participants} người
                  </div>
                </div>
                <span className="text-xs text-gray-600 mt-2 font-medium">
                  {data.month}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center space-x-6 mt-6 pt-4 border-t">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gradient-to-t from-blue-500 to-blue-400 rounded"></div>
          <span className="text-sm text-gray-700">Số sự kiện</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gradient-to-t from-green-500 to-green-400 rounded"></div>
          <span className="text-sm text-gray-700">Người tham gia</span>
        </div>
      </div>

    </div>
  );
};

export default MonthlyBarChart;
