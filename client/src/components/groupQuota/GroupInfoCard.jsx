import GroupsIcon from "@mui/icons-material/Groups";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import StarIcon from "@mui/icons-material/Star";
import { LEADER_QUOTA_LABELS } from "./constants";

function InfoPill({ label, value }) {
  return (
    <div className="bg-slate-50 rounded-lg px-3 py-1.5">
      <span className="text-slate-400 font-medium text-xs">{label}: </span>
      <span className="font-bold text-slate-700 text-xs">{value}</span>
    </div>
  );
}

export default function GroupInfoCard({ quota, typeConfig }) {
  if (!quota) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-mainColor/10 flex items-center justify-center">
            <GroupsIcon sx={{ fontSize: 22 }} className="text-mainColor" />
          </div>
          <div>
            <p className="text-base font-extrabold text-slate-800">{quota.groupName}</p>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              {quota.memberCount} thành viên
              {typeConfig?.plan && ` · ${typeConfig.plan}`}
            </p>
          </div>
        </div>
        {typeConfig && (
          <div className="flex flex-col items-start sm:items-end gap-1">
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${typeConfig.badge}`}>
              {typeConfig.label}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">{typeConfig.desc}</span>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        <InfoPill label="Vai trò" value={quota.isLeader ? "Trưởng nhóm" : "Thành viên"} />
        <InfoPill label="Chức danh" value={quota.chucDanh} />
        <InfoPill label="Số thành viên" value={quota.memberCount} />
        {quota.memberFactor != null && (
          <InfoPill label="Hệ số định mức" value={`× ${quota.memberFactor}`} />
        )}
      </div>

      {quota.benefits?.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
            <InfoOutlinedIcon sx={{ fontSize: 14 }} /> Quyền lợi & hỗ trợ
          </p>
          <div className="grid sm:grid-cols-2 gap-2">
            {quota.benefits.map((b, i) => (
              <div key={i} className="bg-slate-50 rounded-lg px-3 py-2">
                <p className="text-xs font-bold text-slate-700">{b.title}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {quota.leaderQuota && quota.isLeader && (
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3">
          <p className="text-xs font-bold text-amber-700 mb-2 flex items-center gap-1">
            <StarIcon sx={{ fontSize: 14 }} /> Định mức Trưởng nhóm (theo sản phẩm nhóm)
          </p>
          <ul className="space-y-1">
            {Object.entries(quota.leaderQuota).map(([k, v]) => (
              <li key={k} className="text-xs text-amber-800">
                <span className="font-semibold">{LEADER_QUOTA_LABELS[k] || k}: </span>
                {v}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
