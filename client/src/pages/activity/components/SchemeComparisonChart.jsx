import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const formatPct = (v) => `${Number(v || 0).toFixed(1)}%`;

export default function SchemeComparisonChart({ data = [], loading }) {
  const chartData = data.map((row) => ({
    name: row.schemeLabel?.replace(" — ", "\n") || row.scheme,
    shortName: row.schemeLabel || row.scheme,
    memberCount: row.memberCount ?? 0,
    completionPercent: row.completionPercent ?? 0,
  }));

  if (loading) {
    return (
      <div className="flex h-72 items-center justify-center text-sm text-slate-500">
        Đang tải biểu đồ...
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center text-sm text-slate-500">
        Chưa có dữ liệu thống kê theo phương án nhóm.
      </div>
    );
  }

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 12, right: 24, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "#475569" }}
            interval={0}
            height={56}
          />
          <YAxis
            yAxisId="members"
            allowDecimals={false}
            tick={{ fontSize: 11, fill: "#475569" }}
            label={{
              value: "Số thành viên",
              angle: -90,
              position: "insideLeft",
              style: { fontSize: 11, fill: "#64748b" },
            }}
          />
          <YAxis
            yAxisId="percent"
            orientation="right"
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: "#475569" }}
            tickFormatter={(v) => `${v}%`}
            label={{
              value: "% hoàn thành",
              angle: 90,
              position: "insideRight",
              style: { fontSize: 11, fill: "#64748b" },
            }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const row = payload[0]?.payload;
              return (
                <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
                  <p className="mb-1 font-bold text-slate-800">{row.shortName}</p>
                  <p className="text-slate-600">Thành viên: {row.memberCount}</p>
                  <p className="font-semibold text-indigo-600">
                    % hoàn thành: {formatPct(row.completionPercent)}
                  </p>
                </div>
              );
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
            formatter={(value) => {
              if (value === "memberCount") return "Số thành viên tham gia";
              if (value === "completionPercent") return "% hoàn thành định mức";
              return value;
            }}
          />
          <Bar
            yAxisId="members"
            dataKey="memberCount"
            name="memberCount"
            fill="#3b82f6"
            radius={[6, 6, 0, 0]}
            maxBarSize={56}
          />
          <Line
            yAxisId="percent"
            type="monotone"
            dataKey="completionPercent"
            name="completionPercent"
            stroke="#f59e0b"
            strokeWidth={3}
            dot={{ r: 5, fill: "#f59e0b", strokeWidth: 2, stroke: "#fff" }}
            activeDot={{ r: 7 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
