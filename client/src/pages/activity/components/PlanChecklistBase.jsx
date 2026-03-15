const IconCheck = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={3}
    stroke="currentColor"
    className="w-4 h-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.5 12.75l6 6 9-13.5"
    />
  </svg>
);
const IconX = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={3}
    stroke="currentColor"
    className="w-4 h-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

function ProgressBar({ got, req }) {
  if (!req) return null;
  const pct = Math.min(100, Math.round((got / req) * 100));
  const isPass = got >= req;
  return (
    <div className="mt-1.5 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${isPass ? "bg-emerald-400" : "bg-rose-300"}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/**
 * Component dùng chung cho 6 phương án.
 * Props:
 *   planLabel  – string, ví dụ "PA0"
 *   result     – { checks, overallOk }
 */
export default function PlanChecklistBase({ planLabel, result }) {
  const passCount = result.checks.filter((c) => c.ok === true).length;
  const totalCount = result.checks.length;
  const evaluableCount = result.checks.filter((c) => c.hasActual).length;
  const hasEvaluable = evaluableCount > 0;

  return (
    <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center gap-3">
          <div
            className={`w-2 h-8 rounded-full ${result.overallOk ? "bg-emerald-400" : "bg-rose-400"}`}
          />
          <div>
            <h3 className="font-bold text-slate-700 text-sm">
              Tiêu chí {planLabel}
            </h3>
            {totalCount > 0 && (
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                {hasEvaluable
                  ? `${passCount}/${evaluableCount} tiêu chí đạt`
                  : `${totalCount} tiêu chí yêu cầu`}
              </p>
            )}
          </div>
        </div>
        {hasEvaluable ? (
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1.5 rounded-lg border ${
              result.overallOk
                ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                : "bg-rose-50 border-rose-200 text-rose-600"
            }`}
          >
            {result.overallOk ? <IconCheck /> : <IconX />}
            {result.overallOk ? "ĐẠT YÊU CẦU" : "CHƯA ĐẠT"}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1.5 rounded-lg border bg-slate-50 border-slate-200 text-slate-500">
            Chưa có dữ liệu thực tế
          </span>
        )}
      </div>

      {/* Checklist body */}
      <div className="p-5 overflow-y-auto max-h-[220px] scrollbar-thin scrollbar-thumb-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
          {result.checks.map((c, idx) => {
            /* --- OR row (Bảng 5) --- */
            if (c.isOr) {
              return (
                <div
                  key={idx}
                  className={`md:col-span-2 rounded-xl p-4 border transition-all ${
                    c.ok
                      ? "bg-emerald-50/60 border-emerald-200"
                      : "bg-rose-50/40 border-rose-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-xs font-black uppercase tracking-wide ${c.ok ? "text-emerald-700" : "text-rose-700"}`}
                    >
                      {c.label}
                    </span>
                    {c.ok ? (
                      <div className="flex items-center gap-1 text-emerald-600 bg-white rounded-lg px-2 py-1 border border-emerald-100 text-xs font-bold shadow-sm">
                        <IconCheck /> Đạt
                      </div>
                    ) : (
                      <span className="text-[10px] text-rose-500 font-bold bg-white px-2.5 py-1 rounded-lg border border-rose-200 shadow-sm">
                        Chưa đạt
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {c.options.map((o, i) => {
                      const isOptPass = o.req > 0 && o.got >= o.req;
                      return (
                        <div
                          key={i}
                          className={`text-xs px-3 py-2 rounded-lg transition-colors border ${
                            isOptPass
                              ? "bg-white shadow-sm text-emerald-700 font-bold border-emerald-100"
                              : "text-slate-500 bg-white/50 border-slate-100"
                          }`}
                        >
                          <div className="flex justify-between">
                            <span className="truncate mr-2">{o.name}</span>
                            <span className="font-extrabold tabular-nums">
                              {o.got}/{o.req}
                            </span>
                          </div>
                          <ProgressBar got={o.got} req={o.req} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }

            /* --- Normal row --- */
            const req = Number(c.req || 0);
            const got = c.got == null ? null : Number(c.got || 0);
            const hasActual = c.hasActual && got != null;
            const isPass = req === 0 || got >= req;

            if (!hasActual) {
              return (
                <div
                  key={idx}
                  className="flex flex-col text-sm py-2.5 px-3 rounded-xl border transition-all bg-slate-50/70 border-slate-200"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-xs font-semibold leading-snug text-slate-700">
                      {c.label}
                    </span>
                    <span className="font-extrabold tabular-nums px-2 py-0.5 rounded-md bg-white text-slate-600 border border-slate-200">
                      ≥ {req}
                    </span>
                  </div>
                  {c.unit && (
                    <p className="text-[11px] text-slate-400 mt-1.5 font-medium">
                      Định mức tối thiểu ({c.unit})
                    </p>
                  )}
                </div>
              );
            }

            return (
              <div
                key={idx}
                className={`flex flex-col text-sm py-2.5 px-3 rounded-xl border transition-all ${
                  isPass
                    ? "bg-emerald-50/60 border-emerald-100"
                    : "bg-rose-50/30 border-rose-100"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`truncate text-xs font-semibold leading-snug ${isPass ? "text-emerald-800" : "text-slate-600"}`}
                  >
                    {c.label}
                  </span>
                  <div className="flex items-center gap-2 text-xs min-w-fit">
                    <span
                      className={`font-extrabold tabular-nums px-2 py-0.5 rounded-md ${isPass ? "bg-white text-emerald-600 shadow-sm border border-emerald-100" : "bg-white text-rose-500 border border-rose-100"}`}
                    >
                      {got}/{req}
                    </span>
                    <div
                      className={`rounded-full p-0.5 ${isPass ? "text-emerald-500 bg-emerald-100" : "text-rose-400 bg-rose-100"}`}
                    >
                      {isPass ? <IconCheck /> : <IconX />}
                    </div>
                  </div>
                </div>
                <ProgressBar got={got} req={req} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
