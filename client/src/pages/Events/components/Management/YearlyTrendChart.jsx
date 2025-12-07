import { TrendingUp } from "@mui/icons-material";

const YearlyTrendChart = ({ events, years }) => {
  const yearlyStats = years.map((year) => ({
    year,
    events: events.filter((e) => new Date(e.date).getFullYear() === year)
      .length,
    approved: events.filter(
      (e) =>
        new Date(e.date).getFullYear() === year &&
        (e.status === "upcoming" || e.status === "completed")
    ).length,
  }));

  const maxEvents = Math.max(...yearlyStats.map((y) => y.events), 1);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        <TrendingUp className="mr-2 text-blue-600" />
        Xu hướng theo năm
      </h3>
      <div className="space-y-4">
        {yearlyStats.map((yearData) => (
          <div
            key={yearData.year}
            className="flex items-center justify-between"
          >
            <span className="text-sm font-medium w-16">{yearData.year}</span>
            <div className="flex items-center space-x-4 flex-1 mx-4">
              <div className="flex-1 bg-gray-200 rounded-md h-3">
                <div
                  className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-md transition-all duration-300"
                  style={{ width: `${(yearData.events / maxEvents) * 100}%` }}
                ></div>
              </div>
              <div className="text-right min-w-[120px]">
                <span className="text-sm text-gray-600">
                  {yearData.events} sự kiện
                </span>
                <div className="text-xs text-green-600">
                  {yearData.approved} đã duyệt
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YearlyTrendChart;
