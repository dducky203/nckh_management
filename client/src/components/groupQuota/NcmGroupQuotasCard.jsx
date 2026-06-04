import GroupsIcon from "@mui/icons-material/Groups";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import CancelIcon from "@mui/icons-material/Cancel";

import { NCM_GROUP_QUOTA_LABELS } from "./constants";



function StatusBadge({ achieved }) {

  if (achieved) {

    return (

      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full">

        <CheckCircleIcon sx={{ fontSize: 12 }} /> Đạt

      </span>

    );

  }

  return (

    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-full">

      <CancelIcon sx={{ fontSize: 12 }} /> Chưa

    </span>

  );

}



function Table2Row({ row }) {

  const isRatio = row.evaluationMode === "SEMINAR_RATIO";

  const required = isRatio

    ? row.requiredLabel ?? "≥70%"

    : `${row.requiredQty ?? "—"}`;

  const actual = isRatio

    ? `${Math.round((row.actualRatio ?? 0) * 100)}% (TB: ${row.presentedQty}, TD: ${row.attendedQty})`

    : `${row.actualQty ?? 0}`;



  return (

    <tr className="hover:bg-slate-50/80">

      <td className="px-3 py-2.5 text-slate-700 font-medium text-[13px]">{row.name}</td>

      <td className="px-2 py-2.5 text-center text-slate-600">{required}</td>

      <td className="px-2 py-2.5 text-center font-semibold text-blue-700">{actual}</td>

      <td className="px-2 py-2.5 text-center">

        <StatusBadge achieved={row.achieved} />

      </td>

    </tr>

  );

}



export default function NcmGroupQuotasCard({ quotas, compact = false }) {

  if (!quotas) return null;



  const table2 = quotas.table2Evaluation ?? [];

  const hasEval = table2.length > 0;



  return (

    <div className={compact ? "" : "bg-white rounded-2xl border border-blue-200 shadow-sm p-5"}>

      <div className="flex flex-wrap items-center gap-2 mb-3">

        <GroupsIcon sx={{ fontSize: 18 }} className="text-blue-600" />

        <h3 className="text-sm font-bold text-slate-800">

          Bảng 2 — Định mức cấp nhóm NCM

          {quotas.sizeBandLabel && (

            <span className="ml-2 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">

              {quotas.sizeBandLabel} ({quotas.memberCount} người)

            </span>

          )}

        </h3>

        {hasEval && (

          <span

            className={`text-xs font-bold px-2 py-0.5 rounded-full ${

              quotas.table2OverallAchieved

                ? "bg-emerald-100 text-emerald-800"

                : "bg-amber-100 text-amber-800"

            }`}

          >

            {quotas.table2AchievedCount}/{quotas.table2TotalCount} chỉ tiêu

            {quotas.table2OverallAchieved ? " — Đạt Bảng 2" : ""}

          </span>

        )}

        {quotas.groupCompletionPercent != null && (
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-violet-100 text-violet-800">
            % nhóm: {Math.round(quotas.groupCompletionPercent)}%
          </span>
        )}

      </div>



      {hasEval ? (

        <div className="overflow-x-auto rounded-xl border border-blue-100 mb-4">

          <table className="w-full text-xs">

            <thead>

              <tr className="bg-blue-50/80">

                <th className="text-left px-3 py-2 font-bold text-slate-500 uppercase">Chỉ tiêu</th>

                <th className="text-center px-2 py-2 font-bold text-slate-500 uppercase">Định mức/năm</th>

                <th className="text-center px-2 py-2 font-bold text-slate-500 uppercase">Thực hiện</th>

                <th className="text-center px-2 py-2 font-bold text-slate-500 uppercase">Kết quả</th>

              </tr>

            </thead>

            <tbody className="divide-y divide-blue-50">

              {table2.map((row) => (

                <Table2Row key={row.code} row={row} />

              ))}

            </tbody>

          </table>

        </div>

      ) : (

        <>

          {quotas.SEMINAR_TRINH_BAY_RATIO && (

            <p className="text-xs text-slate-500 mb-3">{quotas.SEMINAR_TRINH_BAY_RATIO}</p>

          )}

          <div className={`grid gap-2 mb-2 ${compact ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}>

            {Object.entries(NCM_GROUP_QUOTA_LABELS).map(([key, label]) => {

              const val = quotas[key];

              if (val === undefined) return null;

              return (

                <div key={key} className="bg-blue-50/50 rounded-lg px-3 py-2 border border-blue-100">

                  <p className="text-[11px] text-slate-500">{label}</p>

                  <p className="text-sm font-bold text-blue-700">

                    {val}

                    <span className="font-normal text-slate-400 text-xs ml-1">/năm</span>

                  </p>

                </div>

              );

            })}

          </div>

          <p className="text-xs text-slate-400">Mở tab Đánh giá và chọn năm học để xem kết quả tự động.</p>

        </>

      )}

    </div>

  );

}

