import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GroupsIcon from "@mui/icons-material/Groups";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PageHeader from "./PageHeader";
import groupQuotaService from "../../services/groupQuotaService";
import LoadingSpinner from "../common/LoadingSpinner";

const REASON_HINT = {
  NOT_IN_ANY_GROUP: "Bạn chưa có trong danh sách thành viên nhóm nghiên cứu nào.",
  GROUP_NOT_APPROVED: "Nhóm của bạn đang chờ duyệt — cần trạng thái APPROVED.",
  GROUP_TYPE_NOT_QUOTA:
    "Cần nhóm giảng viên (type = lecturer) và phương án định mức (group_type = NCM, XUAT_SAC hoặc TINH_HOA) — liên hệ admin/trưởng nhóm cập nhật.",
};

export default function EmptyGroupQuota({ onBack }) {
  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    groupQuotaService
      .getMyMembership()
      .then(setMembership)
      .catch(() => setMembership(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans">
      <PageHeader onBack={onBack} showLinks={false} />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
          {loading ? (
            <LoadingSpinner size="md" />
          ) : (
            <>
          <GroupsIcon sx={{ fontSize: 48 }} className="text-slate-200 mb-4 mx-auto" />
          <p className="text-base font-semibold text-slate-600">
            {membership?.message || "Bạn chưa thuộc nhóm NCM / Xuất sắc / Tinh hoa"}
          </p>
          {membership?.reason && REASON_HINT[membership.reason] && (
            <p className="text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-4 py-2 mt-3 max-w-lg mx-auto flex items-start gap-2 text-left">
              <InfoOutlinedIcon sx={{ fontSize: 18 }} className="shrink-0 mt-0.5" />
              {REASON_HINT[membership.reason]}
            </p>
          )}
          {membership?.allMemberships?.length > 0 && (
            <div className="mt-6 text-left max-w-lg mx-auto">
              <p className="text-xs font-bold text-slate-500 uppercase mb-2">Nhóm bạn đang tham gia</p>
              <ul className="space-y-2 text-sm">
                {membership.allMemberships.map((m) => (
                  <li key={m.groupId} className="bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
                    <span className="font-semibold text-slate-700">{m.groupName}</span>
                    <span className="text-slate-400 mx-1">·</span>
                    <span className="text-slate-500">
                      {m.type || "—"}
                      {m.groupType ? ` · ${m.groupType}` : ""}
                    </span>
                    <span className="text-slate-400 mx-1">·</span>
                    <span className={m.countsForQuota ? "text-emerald-600 font-bold" : "text-slate-400"}>
                      {m.status}
                      {m.countsForQuota ? " ✓ định mức" : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className="text-sm text-slate-400 mt-4 max-w-md mx-auto">
            Điều kiện: (1) thành viên nhóm, (2) <strong>APPROVED</strong>, (3) <strong>type = lecturer</strong>, (4){" "}
            <strong>group_type</strong> là <strong>NCM</strong>, <strong>XUAT_SAC</strong> hoặc <strong>TINH_HOA</strong>.
          </p>
            </>
          )}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/research-groups"
              className="px-4 py-2 rounded-xl bg-mainColor text-white text-sm font-bold hover:brightness-110"
            >
              Xem danh sách nhóm
            </Link>
            <Link
              to="/activity"
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50"
            >
              Về chức năng NCKH
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
