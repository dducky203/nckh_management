import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import FolderSharedIcon from "@mui/icons-material/FolderShared";

export default function ResearchGroupProfileHeader({ groupName }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-4 min-w-0">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition shrink-0"
            aria-label="Quay lại"
          >
            <ArrowBackIcon sx={{ fontSize: 20 }} />
          </button>
          <div className="w-1 h-8 rounded-full bg-mainColor hidden sm:block shrink-0" />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <FolderSharedIcon sx={{ fontSize: 22 }} className="text-mainColor shrink-0" />
              <h1 className="text-base font-extrabold text-slate-800 truncate">
                Hồ sơ nhóm{groupName ? `: ${groupName}` : ""}
              </h1>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Quản lý văn bản, tài liệu nhóm nghiên cứu
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 pl-12 sm:pl-0">
          <Link
            to="/research-groups"
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            Danh sách nhóm
            <OpenInNewIcon sx={{ fontSize: 14 }} />
          </Link>
          <Link
            to="/activity/group-quota"
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            Định mức nhóm
            <OpenInNewIcon sx={{ fontSize: 14 }} />
          </Link>
        </div>
      </div>
    </div>
  );
}
