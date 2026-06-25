import { Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

export default function PageHeader({
  onBack,
  showLinks = true,
  isLeader = false,
  onManageMembers,
  manageLoading = false,
}) {
  return (
    <div className="bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition"
            aria-label="Quay lại"
          >
            <ArrowBackIcon sx={{ fontSize: 20 }} />
          </button>
          <div className="w-1 h-8 rounded-full bg-mainColor hidden md:block" />
          <div>
            <h1 className="text-base font-extrabold text-slate-800 leading-tight">
              Định mức nhóm nghiên cứu
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              NCM · Xuất sắc · Tinh hoa — tính & đánh giá định mức cá nhân
            </p>
          </div>
        </div>
        {showLinks && (
          <div className="flex flex-wrap gap-2 pl-12 sm:pl-0">
            {isLeader && onManageMembers && (
              <button
                type="button"
                onClick={onManageMembers}
                disabled={manageLoading}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg bg-mainColor text-white hover:brightness-110 disabled:opacity-60"
              >
                <ManageAccountsIcon sx={{ fontSize: 14 }} />
                {manageLoading ? "Đang mở..." : "Quản lý thành viên"}
              </button>
            )}
            <Link
              to="/activity/standards"
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              Định mức cá nhân
              <OpenInNewIcon sx={{ fontSize: 14 }} />
            </Link>
            <Link
              to="/research-groups/profile"
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              Hồ sơ nhóm
              <OpenInNewIcon sx={{ fontSize: 14 }} />
            </Link>
            {isLeader && (
              <Link
                to="/research-groups/manager"
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Quản lý nhóm
                <OpenInNewIcon sx={{ fontSize: 14 }} />
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
