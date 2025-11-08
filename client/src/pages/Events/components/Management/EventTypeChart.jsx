import { BarChart } from "@mui/icons-material";

const EventTypeChart = ({ events, selectedYear, eventTypes, colors }) => {
  const typeStats = eventTypes
    .map((type) => ({
      name: type,
      value: events.filter(
        (e) =>
          e.type === type && new Date(e.date).getFullYear() === selectedYear
      ).length,
    }))
    .filter((item) => item.value > 0);

  const maxValue = Math.max(...typeStats.map((t) => t.value), 1);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        <BarChart className="mr-2 text-green-600" />
        Phân bố theo loại ({selectedYear})
      </h3>
      <div className="space-y-4">
        {typeStats.map((type, index) => (
          <div key={type.name} className="flex items-center justify-between">
            <div className="flex items-center space-x-3 min-w-[120px]">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: colors[index % colors.length] }}
              ></div>
              <span className="text-sm font-medium">{type.name}</span>
            </div>
            <div className="flex items-center space-x-3 flex-1 mx-4">
              <div className="flex-1 bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all duration-300"
                  style={{
                    width: `${(type.value / maxValue) * 100}%`,
                    backgroundColor: colors[index % colors.length],
                  }}
                ></div>
              </div>
              <span className="text-sm text-gray-600 w-8 text-right">
                {type.value}
              </span>
            </div>
          </div>
        ))}
      </div>
      {typeStats.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <BarChart className="text-6xl text-gray-300 mb-2" />
          <p>Không có dữ liệu cho năm này</p>
        </div>
      )}
    </div>
  );
};

export default EventTypeChart;
