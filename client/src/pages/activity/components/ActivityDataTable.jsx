import { useMemo, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import GroupIcon from "@mui/icons-material/Group";

const IconChevronDown = ({ className }) => (
  <KeyboardArrowDownIcon className={className} sx={{ fontSize: 18 }} />
);
const IconUserGroup = () => <GroupIcon sx={{ fontSize: 16 }} />;

function round1(x) {
  return Math.round(x * 10) / 10;
}

export default function ActivityDataTable({
  criteria,
  actualStats = [],
}) {
  const [openIds, setOpenIds] = useState(() => criteria.map((g) => g.id));

  const toggle = (gid) =>
    setOpenIds((prev) =>
      prev.includes(gid) ? prev.filter((x) => x !== gid) : [...prev, gid],
    );

  // Create map of actual data by catalogCode (MUST be defined first)
  const actualMap = useMemo(() => {
    const map = {};
    actualStats.forEach((stat) => {
      map[stat.catalogCode] = stat;
    });
    return map;
  }, [actualStats]);

  // Calculate actual statistics summary
  const actualSummary = useMemo(() => {
    const uniqueCatalogCodes = new Set(actualStats.map((s) => s.catalogCode));
    const totalActivities = actualStats.reduce(
      (sum, s) => sum + (s.participationCount || 0),
      0,
    );
    return {
      groupCount: uniqueCatalogCodes.size,
      activityCount: totalActivities,
    };
  }, [actualStats]);

  const groupTotals = useMemo(() => {
    const map = {};
    for (const g of criteria) {
      // Calculate total from actual data
      let total = 0;
      g.children.forEach((c) => {
        const actual = actualMap[c.id];
        if (actual) {
          total += Number(actual.totalQuotaHours || 0);
        }
      });
      map[g.id] = total;
    }
    return map;
  }, [criteria, actualMap]);

  const totalRows = useMemo(
    () => criteria.reduce((s, g) => s + g.children.length, 0),
    [criteria],
  );

  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-200 overflow-hidden">
      <div className="px-6 py-5 flex items-center justify-between bg-slate-50 border-b border-slate-100">
        <div>
          <h2 className="font-bold text-lg text-slate-800">
            Dữ liệu hoạt động
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            {actualSummary.groupCount > 0 ? (
              <>
                {actualSummary.groupCount} nhóm · {actualSummary.activityCount}{" "}
                hoạt động
              </>
            ) : (
              "Chưa có dữ liệu thực tế"
            )}
          </p>
        </div>
        <button
          onClick={() =>
            setOpenIds((prev) =>
              prev.length === criteria.length ? [] : criteria.map((g) => g.id),
            )
          }
          className="text-xs font-bold text-slate-500 hover:text-mainColor transition-colors"
        >
          {openIds.length === criteria.length
            ? "Thu gọn tất cả"
            : "Mở rộng tất cả"}
        </button>
      </div>

      <div className="divide-y divide-slate-100">
        {criteria.map((g) => {
          const groupHours = groupTotals[g.id];
          const isOpen = openIds.includes(g.id);

          return (
            <div key={g.id} className="group">
              {/* <button
                onClick={() => toggle(g.id)}
                className="w-full flex items-center justify-between px-6 py-4 bg-white hover:bg-slate-50 transition-colors focus:outline-none"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`font-bold text-sm md:text-base transition-colors ${isOpen ? "text-slate-900" : "text-slate-600"}`}
                  >
                    {g.name}
                  </span>
                  {groupHours > 0 && (
                    <span className="text-[11px] font-bold text-mainColor bg-mainColor/10 px-2 py-0.5 rounded-md">
                      {round1(groupHours)} giờ
                    </span>
                  )}
                </div>
                <div
                  className={`p-1 rounded-md transition-all ${isOpen ? "bg-slate-200 rotate-180" : "bg-slate-100"}`}
                >
                  <IconChevronDown className="w-4 h-4 text-slate-500" />
                </div> 
              </button>*/}

              {isOpen && (
                <div className="px-6 pb-6 pt-2 bg-slate-50/30 animate-in slide-in-from-top-1 duration-200">
                  <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-50 text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">
                        <tr>
                          <th className="py-3 pl-4 min-w-[220px]">Nội dung</th>
                          <th className="py-3 text-center w-16">Định mức(S)</th>
                          <th className="py-3 text-center w-28">Số lượng</th>
                          <th className="py-3 text-center w-36">Đồng TG</th>
                          <th className="py-3 text-center w-36">Vai trò</th>
                          <th className="py-3 pr-4 text-right w-24">Giờ</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {g.children.map((c) => {
                          // Get actual data from API
                          const actual = actualMap[c.id];
                          const qty = actual ? Number(actual.totalQty || 0) : 0;
                          const hours = actual
                            ? Number(actual.totalQuotaHours || 0)
                            : 0;
                          const participants = actual
                            ? Math.round(Number(actual.avgParticipantsN || 0))
                            : 0;
                          const participationCount = actual
                            ? Number(actual.participationCount || 0)
                            : 0;
                          const hasQty = qty > 0;

                          return (
                            <tr
                              key={c.id}
                              className={`group/row transition-colors border-b border-slate-50 last:border-0 ${hasQty ? "bg-slate-50" : "hover:bg-slate-50"}`}
                            >
                              <td className="py-3 pl-4 align-middle">
                                <div
                                  className={`font-semibold transition-colors ${hasQty ? "text-slate-900" : "text-slate-600"}`}
                                >
                                  {c.name}
                                </div>
                                <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                                  {c.unit}{" "}
                                  {participationCount > 0 &&
                                    `• ${participationCount} hoạt động`}
                                </div>
                              </td>

                              <td className="py-3 text-center">
                                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">
                                  {c.quota}
                                </span>
                              </td>

                              <td className="py-3 text-center">
                                <span
                                  className={`inline-block w-20 text-center font-bold py-1.5 rounded-lg text-sm border shadow-sm ${
                                    hasQty
                                      ? "bg-white border-slate-300 text-mainColor"
                                      : "bg-slate-50 border-slate-200 text-slate-500"
                                  }`}
                                >
                                  {qty}
                                </span>
                              </td>

                              <td className="py-3 text-center">
                                {participants > 0 ? (
                                  <div className="flex items-center justify-center">
                                    <IconUserGroup />
                                    <span className="w-14 ml-1.5 text-center font-semibold text-slate-600">
                                      {participants}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-slate-200">—</span>
                                )}
                              </td>

                              <td className="py-3 text-center">
                                {hasQty ? (
                                  <span className="text-xs font-semibold py-1.5 px-2 rounded-lg border bg-white text-blue-700 border-blue-100">
                                    Thực tế
                                  </span>
                                ) : (
                                  <span className="text-slate-200">—</span>
                                )}
                              </td>

                              <td className="py-3 pr-4 text-right">
                                <span
                                  className={`font-black text-lg transition-colors ${hours > 0 ? "text-mainColor" : "text-slate-200"}`}
                                >
                                  {hours > 0 ? round1(hours) : "0"}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      {groupHours > 0 && (
                        <tfoot>
                          <tr className="bg-slate-50 border-t border-slate-200">
                            <td
                              colSpan={5}
                              className="py-2.5 pl-4 text-xs font-bold text-slate-400 uppercase tracking-wide"
                            >
                              Tổng nhóm
                            </td>
                            <td className="py-2.5 pr-4 text-right">
                              <span className="font-black text-base text-mainColor">
                                {round1(groupHours)}
                              </span>
                              <span className="text-[10px] text-slate-400 font-medium ml-1">
                                giờ
                              </span>
                            </td>
                          </tr>
                        </tfoot>
                      )}
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
