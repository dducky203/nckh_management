import { useState } from "react";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import StarIcon from "@mui/icons-material/Star";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

function MemberCard({ member, isCurrentUser }) {
  const [expanded, setExpanded] = useState(false);
  const coeffItems = (member.quotaItems ?? []).filter(
    (i) => (i.requiredQty ?? i.coefficient) > 0
  );

  return (
    <div className={isCurrentUser ? "bg-mainColor/5" : ""}>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-4 flex items-center gap-4 text-left hover:bg-slate-50/50"
      >
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0
            ${member.isLeader ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-500"}`}
        >
          {member.isLeader ? <StarIcon sx={{ fontSize: 18 }} /> : <PersonIcon sx={{ fontSize: 18 }} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-slate-800 truncate">{member.name}</p>
            {isCurrentUser && (
              <span className="text-[10px] font-bold text-mainColor bg-mainColor/10 px-1.5 py-0.5 rounded">
                Bạn
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {member.chucDanh} · {member.role}
          </p>
        </div>
        <svg
          className={`w-4 h-4 text-slate-300 transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="px-5 pb-4">
          {member.isLeader ? (
            <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2 border border-amber-100">
              Trưởng nhóm: định mức theo sản phẩm tập thể nhóm.
            </p>
          ) : coeffItems.length > 0 ? (
            <table className="w-full text-xs bg-slate-50 rounded-xl overflow-hidden">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left px-3 py-2 font-bold text-slate-500">Tiêu chí</th>
                  <th className="text-center px-3 py-2 font-bold text-slate-500 w-20">ĐM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {coeffItems.map((item) => (
                  <tr key={item.code}>
                    <td className="px-3 py-2 text-slate-700">{item.name}</td>
                    <td className="px-3 py-2 text-center font-bold text-mainColor">
                      {item.requiredQty ?? item.coefficient}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-xs text-slate-400">Không có định mức cá nhân áp dụng.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function MembersTab({
  membersData,
  quota,
  isLeader = false,
  onManageMembers,
  manageLoading = false,
}) {
  if (!membersData?.members?.length) {
    return (
      <div className="p-8 text-center text-slate-400 text-sm">Không có dữ liệu thành viên</div>
    );
  }

  return (
    <div className="divide-y divide-slate-100">
      <div className="px-5 py-4 bg-slate-50/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <PeopleIcon sx={{ fontSize: 18 }} className="text-mainColor" />
              <h3 className="text-sm font-bold text-slate-800">
                Thành viên ({membersData.members.length})
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">Định mức cá nhân theo chức danh từng người</p>
          </div>
          {isLeader && onManageMembers && (
            <button
              type="button"
              onClick={onManageMembers}
              disabled={manageLoading}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-mainColor text-white hover:brightness-110 disabled:opacity-60 shrink-0"
            >
              <ManageAccountsIcon sx={{ fontSize: 16 }} />
              {manageLoading ? "Đang mở..." : "Quản lý & duyệt thành viên"}
            </button>
          )}
        </div>
        {isLeader && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mt-3">
            Trưởng nhóm: thêm/xóa thành viên và duyệt đăng ký tham gia nhóm tại mục trên.
          </p>
        )}
      </div>
      <div className="divide-y divide-slate-100">
        {membersData.members.map((member) => (
          <MemberCard
            key={member.userId}
            member={member}
            isCurrentUser={member.userId === quota?.userId}
          />
        ))}
      </div>
    </div>
  );
}
