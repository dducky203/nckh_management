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

// Palette for group header accents
const GROUP_COLORS = [
  "border-violet-400 bg-violet-50/40",
  "border-blue-400 bg-blue-50/40",
  "border-sky-400 bg-sky-50/40",
  "border-cyan-400 bg-cyan-50/40",
  "border-teal-400 bg-teal-50/40",
  "border-emerald-400 bg-emerald-50/40",
  "border-amber-400 bg-amber-50/40",
  "border-orange-400 bg-orange-50/40",
  "border-rose-400 bg-rose-50/40",
  "border-pink-400 bg-pink-50/40",
  "border-indigo-400 bg-indigo-50/40",
  "border-lime-400 bg-lime-50/40",
];

const GROUP_DOT = [
  "bg-violet-400",
  "bg-blue-400",
  "bg-sky-400",
  "bg-cyan-400",
  "bg-teal-400",
  "bg-emerald-400",
  "bg-amber-400",
  "bg-orange-400",
  "bg-rose-400",
  "bg-pink-400",
  "bg-indigo-400",
  "bg-lime-400",
];

export default function ActivityDataTable({ criteria, values, calcHours }) {
  const [openIds, setOpenIds] = useState(() => criteria.map((g) => g.id));

  const toggle = (gid) =>
    setOpenIds((prev) =>
      prev.includes(gid) ? prev.filter((x) => x !== gid) : [...prev, gid],
    );

  const groupTotals = useMemo(() => {
    const map = {};
    for (const g of criteria) {
      map[g.id] = g.children.reduce((s, c) => s + calcHours(c), 0);
    }
    return map;
  }, [criteria, calcHours]);

  const totalRows = useMemo(
    () => criteria.reduce((s, g) => s + g.children.length, 0),
    [criteria],
  );

  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] border border-slate-200 overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-5 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 rounded-full bg-mainColor" />
          <div>
            <h2 className="font-bold text-lg text-slate-800 leading-tight">Dữ liệu hoạt động</h2>
            <p className="text-slate-400 text-xs mt-0.5">
              {criteria.length} nhóm · {totalRows} hoạt động
            </p>
          </div>
        </div>
        <button
          onClick={() =>
            setOpenIds((prev) =>
              prev.length === criteria.length ? [] : criteria.map((g) => g.id),
            )
          }
          className="text-xs font-bold text-slate-500 hover:text-mainColor transition-colors px-3 py-1.5 rounded-lg border border-slate-200 hover:border-mainColor/30 hover:bg-mainColor/5"
        >
          {openIds.length === criteria.length ? "Thu gọn tất cả" : "Mở rộng tất cả"}
        </button>
      </div>

      <div className="divide-y divide-slate-100">
        {criteria.map((g, gIdx) => {
          const colorClass = GROUP_COLORS[gIdx % GROUP_COLORS.length];
          const dotClass = GROUP_DOT[gIdx % GROUP_DOT.length];
          const groupHours = groupTotals[g.id];
          const isOpen = openIds.includes(g.id);

          return (
            <div key={g.id}>
              <button
                onClick={() => toggle(g.id)}
                className={`w-full flex items-center justify-between px-6 py-3.5 transition-colors focus:outline-none border-l-4 ${isOpen ? colorClass : "border-transparent bg-white hover:bg-slate-50"}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${dotClass}`} />
                  <span className={`font-bold text-sm md:text-base transition-colors ${isOpen ? "text-slate-900" : "text-slate-600"}`}>
                    {g.name}
                  </span>
                  {groupHours > 0 && (
                    <span className="text-[11px] font-bold text-mainColor bg-mainColor/10 px-2 py-0.5 rounded-md">
                      {round1(groupHours)} giờ
                    </span>
                  )}
                </div>
                <div className={`p-1 rounded-md transition-all ${isOpen ? "bg-slate-200 rotate-180" : "bg-slate-100"}`}>
                  <IconChevronDown className="w-4 h-4 text-slate-500" />
                </div>
              </button>

              {isOpen && (
                <div className="px-6 pb-5 pt-2 bg-slate-50/40">
                  <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="py-2.5 pl-4 pr-2 min-w-[220px] text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Nội dung</th>
                          <th className="py-2.5 text-center w-20 text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Định mức</th>
                          <th className="py-2.5 text-center w-28 text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Số lượng</th>
                          <th className="py-2.5 text-center w-32 text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Đồng TG</th>
                          <th className="py-2.5 text-center w-36 text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Vai trò</th>
                          <th className="py-2.5 pr-4 text-right w-24 text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Giờ</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm divide-y divide-slate-50">
                        {g.children.map((c, rowIdx) => {
                          const d = values[c.id] || {};
                          const qty = Number(d.qty || 0);
                          const participants = Number(d.participants || 1);
                          const role = d.role || "main";
                          const hours = calcHours(c);
                          const hasQty = qty > 0;

                          return (
                            <tr
                              key={c.id}
                              className={`transition-colors hover:bg-slate-50/80 ${hasQty ? "bg-emerald-50/30" : ""}`}
                            >
                              <td className="py-3 pl-4 pr-2 align-middle">
                                <div className="flex items-start gap-2">
                                  <span className="text-[10px] font-extrabold text-slate-300 mt-0.5 min-w-[18px]">{rowIdx + 1}</span>
                                  <div>
                                    <div className={`font-semibold transition-colors leading-snug ${hasQty ? "text-slate-900" : "text-slate-600"}`}>
                                      {c.name}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                                      {c.unit}{c.isTeam && <span className="ml-1 text-blue-400 font-bold">· Đồng tác giả</span>}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              <td className="py-3 text-center">
                                <span className="text-xs font-extrabold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
                                  {c.quota}
                                </span>
                              </td>

                              <td className="py-3 text-center">
                                <span
                                  className={`inline-block w-16 text-center font-bold py-1.5 rounded-lg text-sm border ${
                                    hasQty
                                      ? "text-mainColor bg-white border-mainColor/20 shadow-sm"
                                      : "text-slate-300 bg-slate-50 border-transparent"
                                  }`}
                                >
                                  {qty}
                                </span>
                              </td>

                              <td className="py-3 text-center">
                                {c.isTeam ? (
                                  <div className={`flex items-center justify-center gap-1.5 ${!hasQty && "opacity-30"}`}>
                                    <IconUserGroup />
                                    <span className="text-sm font-semibold text-slate-600">{participants}</span>
                                  </div>
                                ) : (
                                  <span className="text-slate-200 text-lg">—</span>
                                )}
                              </td>

                              <td className="py-3 text-center">
                                {c.isTeam ? (
                                  <span
                                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border ${!hasQty ? "opacity-30" : ""} ${
                                      role === "main"
                                        ? "bg-blue-50 text-blue-700 border-blue-100"
                                        : "bg-slate-50 text-slate-500 border-slate-100"
                                    }`}
                                  >
                                    {role === "main" ? "Tác giả chính" : "Thành viên"}
                                  </span>
                                ) : (
                                  <span className="text-slate-200 text-lg">—</span>
                                )}
                              </td>

                              <td className="py-3 pr-4 text-right">
                                {hours > 0 ? (
                                  <div className="inline-flex flex-col items-end">
                                    <span className="font-black text-lg text-mainColor leading-none">{round1(hours)}</span>
                                    <span className="text-[10px] text-slate-400 font-medium">giờ</span>
                                  </div>
                                ) : (
                                  <span className="font-bold text-slate-200 text-base">0</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      {groupHours > 0 && (
                        <tfoot>
                          <tr className="bg-slate-50 border-t border-slate-200">
                            <td colSpan={5} className="py-2.5 pl-4 text-xs font-bold text-slate-400 uppercase tracking-wide">
                              Tổng nhóm
                            </td>
                            <td className="py-2.5 pr-4 text-right">
                              <span className="font-black text-base text-mainColor">{round1(groupHours)}</span>
                              <span className="text-[10px] text-slate-400 font-medium ml-1">giờ</span>
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
