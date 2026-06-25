import { useState, useEffect, useCallback, useContext } from "react";
import {
  CheckCircle,
  Cancel,
  School,
  Groups,
  HourglassEmpty,
  FilterList,
  Refresh,
  Person,
  CalendarMonth,
  Info,
  Visibility,
} from "@mui/icons-material";
import researchGroupService from "../../services/researchGroupService";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import GroupDetailModal from "./components/GroupDetailModal";
import { getResearchGroupStatusBadge } from "../../constants";
import { AuthContext } from "../../context/AuthContext";
import noAvatarImg from "../../assets/no-avatar-user.png";

// ─── Sub-components ────────────────────────────────────────────────────────────

const StatusBadge = ({ status }) => {
  const config = {
    PENDING_ADVISOR: {
      label: "Chờ GV duyệt",
      cls: "bg-amber-50 text-amber-700 border border-amber-200",
    },
    PENDING_ADMIN: {
      label: "Chờ Admin duyệt",
      cls: "bg-blue-50 text-blue-700 border border-blue-200",
    },
    APPROVED: {
      label: "Đã duyệt",
      cls: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    },
    REJECTED: {
      label: "Đã từ chối",
      cls: "bg-red-50 text-red-700 border border-red-200",
    },
    PENDING: {
      label: "Chờ duyệt",
      cls: "bg-slate-50 text-slate-600 border border-slate-200",
    },
  };
  const c = config[status] || config.PENDING;
  return (
    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide ${c.cls}`}>
      {c.label}
    </span>
  );
};

// ─── Reject Dialog ─────────────────────────────────────────────────────────────

const RejectDialog = ({ group, onConfirm, onCancel, loading }) => {
  const [reason, setReason] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md mx-4">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
            <Cancel className="text-red-600" sx={{ fontSize: 22 }} />
          </div>
          <div>
            <h3 className="font-black text-slate-800 text-lg">Từ chối nhóm</h3>
            <p className="text-sm text-slate-500 font-medium">{group.groupName}</p>
          </div>
        </div>
        <label className="block text-sm font-bold text-slate-700 mb-2">
          Lý do từ chối (tùy chọn)
        </label>
        <textarea
          id="reject-reason-input"
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Nhập lý do từ chối để thông báo cho sinh viên..."
          className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 resize-none bg-slate-50"
        />
        <div className="flex gap-3 mt-6">
          <button
            id="cancel-reject-btn"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            id="confirm-reject-btn"
            onClick={() => onConfirm(group.id, reason)}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold text-sm shadow hover:brightness-110 transition-all disabled:opacity-50"
          >
            {loading ? "Đang xử lý..." : "Xác nhận từ chối"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

const normalizeGroupForModal = (group) => ({
  ...group,
  members: Array.isArray(group?.members)
    ? group.members
    : group?.members
      ? Object.values(group.members)
      : [],
});

// ─── Group Card ────────────────────────────────────────────────────────────────

const GroupCard = ({ group, onApprove, onReject, onViewDetail, actionLoading }) => {
  const members = Array.isArray(group.members)
    ? group.members
    : group.members
      ? Object.values(group.members)
      : [];
  const leader = members.find((m) => m.role === "Trưởng nhóm") || group.leader;
  const createdAt = group.createdAt
    ? new Date(group.createdAt).toLocaleDateString("vi-VN")
    : "—";
  const isPending = group.status === "PENDING_ADVISOR";

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
      {/* Top accent line */}
      <div className={`h-1 w-full ${isPending ? "bg-mainColor" : "bg-slate-200"}`} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <StatusBadge status={group.status} />
              {group.type === "student" && (
                <span className="text-[10px] bg-indigo-50 text-indigo-600 border border-indigo-100 font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                  Nhóm SV
                </span>
              )}
            </div>
            <h3 className="font-extrabold text-slate-800 text-[15px] leading-snug mb-1 line-clamp-2">
              {group.groupName}
            </h3>
            <p className="text-[13px] text-slate-500 font-medium line-clamp-1">
              {group.topicName}
            </p>
          </div>
        </div>

        {/* Info rows */}
        <div className="space-y-2 mb-4">
          {leader && (
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full overflow-hidden border border-slate-100 flex-shrink-0">
                <img
                  src={leader.avatar || noAvatarImg}
                  alt={leader.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-[12px] font-bold text-slate-700">{leader.name || leader.fullName}</p>
                <p className="text-[11px] text-slate-400">Trưởng nhóm</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 text-[12px] text-slate-500 font-medium pt-1 border-t border-slate-50">
            <span className="flex items-center gap-1">
              <Groups sx={{ fontSize: 14 }} />
              {members.length || 0} thành viên
            </span>
            <span className="flex items-center gap-1">
              <CalendarMonth sx={{ fontSize: 14 }} />
              {createdAt}
            </span>
          </div>
        </div>

        {/* Description */}
        {group.description && (
          <p className="text-[12px] text-slate-500 line-clamp-2 mb-4 bg-slate-50/60 rounded-lg px-3 py-2 border border-slate-100">
            {group.description.replace(/\n\n\[GV.*/, "")}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-2.5">
          <button
            id={`view-group-${group.id}`}
            onClick={() => onViewDetail(group)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-sm hover:bg-slate-50 hover:border-mainColor/40 transition-colors"
          >
            <Visibility sx={{ fontSize: 17 }} />
            Xem chi tiết
          </button>

          {isPending ? (
            <div className="flex gap-2.5">
              <button
                id={`approve-group-${group.id}`}
                onClick={() => onApprove(group.id)}
                disabled={actionLoading === group.id}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-mainColor text-white font-bold text-sm shadow-[0_4px_15px_rgb(0,0,0,0.1)] hover:brightness-110 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:transform-none"
              >
                <CheckCircle sx={{ fontSize: 17 }} />
                {actionLoading === group.id ? "Đang xử lý..." : "Chấp thuận"}
              </button>
              <button
                id={`reject-group-${group.id}`}
                onClick={() => onReject(group)}
                disabled={actionLoading === group.id}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-200 bg-red-50 text-red-700 font-bold text-sm hover:bg-red-100 transition-colors disabled:opacity-50"
              >
                <Cancel sx={{ fontSize: 17 }} />
                Từ chối
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-[12px] text-slate-400 font-medium px-1">
              <Info sx={{ fontSize: 14 }} />
              {group.status === "PENDING_ADMIN"
                ? "Bạn đã chấp thuận — đang chờ Admin duyệt cuối."
                : group.status === "APPROVED"
                ? "Nhóm đã được Admin phê duyệt."
                : "Nhóm đã bị từ chối."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────

const AdvisorGroupApprovalPage = () => {
  const { user } = useContext(AuthContext);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // groupId đang xử lý
  const [statusFilter, setStatusFilter] = useState("PENDING_ADVISOR");
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchGroups = useCallback(async () => {
    try {
      setLoading(true);
      const res = await researchGroupService.getAdvisorGroups(statusFilter);
      setGroups(res?.data || []);
    } catch (err) {
      console.error("Error fetching advisor groups:", err);
      showToast("Không thể tải danh sách nhóm.", "error");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const handleApprove = async (groupId) => {
    try {
      setActionLoading(groupId);
      await researchGroupService.advisorApproveGroup(groupId);
      showToast("Đã chấp thuận nhóm! Nhóm đang chờ Admin xét duyệt.");
      fetchGroups();
    } catch (err) {
      showToast(err?.response?.data?.message || "Có lỗi xảy ra, thử lại sau.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectConfirm = async (groupId, reason) => {
    try {
      setRejectLoading(true);
      await researchGroupService.advisorRejectGroup(groupId, reason);
      showToast("Đã từ chối nhóm.");
      setRejectTarget(null);
      setDetailModalOpen(false);
      fetchGroups();
    } catch (err) {
      showToast(err?.response?.data?.message || "Có lỗi xảy ra, thử lại sau.", "error");
    } finally {
      setRejectLoading(false);
    }
  };

  const handleViewDetail = async (group) => {
    try {
      setDetailLoading(true);
      const res = await researchGroupService.getGroupById(group.id);
      const fullGroup = res?.data ?? res;
      setSelectedGroup(normalizeGroupForModal(fullGroup));
      setDetailModalOpen(true);
    } catch (err) {
      console.error("Error loading group detail:", err);
      setSelectedGroup(normalizeGroupForModal(group));
      setDetailModalOpen(true);
      showToast("Không tải được đầy đủ chi tiết, hiển thị thông tin cơ bản.", "error");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleApproveFromDetail = async (groupId) => {
    setDetailModalOpen(false);
    await handleApprove(groupId);
  };

  const handleRejectFromDetail = (group) => {
    setDetailModalOpen(false);
    setRejectTarget(group);
  };

  const filterOptions = [
    { value: "PENDING_ADVISOR", label: "Chờ tôi duyệt", icon: HourglassEmpty },
    { value: "PENDING_ADMIN", label: "Đã duyệt", icon: CheckCircle },
    { value: "REJECTED", label: "Đã từ chối", icon: Cancel },
    { value: "ALL", label: "Tất cả", icon: FilterList },
  ];

  const pendingCount = groups.filter((g) => g.status === "PENDING_ADVISOR").length;

  return (
    <div className="min-h-screen bg-slate-50/60 px-4 py-6 md:px-8 font-sans">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-5 py-3.5 rounded-2xl shadow-lg text-sm font-bold text-white transition-all duration-300 ${
            toast.type === "error" ? "bg-red-500" : "bg-emerald-500"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Reject dialog */}
      {rejectTarget && (
        <RejectDialog
          group={rejectTarget}
          onConfirm={handleRejectConfirm}
          onCancel={() => setRejectTarget(null)}
          loading={rejectLoading}
        />
      )}

      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-11 h-11 rounded-xl bg-mainColor/10 flex items-center justify-center border border-mainColor/20">
            <School className="text-mainColor" sx={{ fontSize: 26 }} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              Xét duyệt Nhóm NCKH
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              Các nhóm sinh viên đăng ký với bạn làm giảng viên hướng dẫn
            </p>
          </div>
        </div>

        {/* Summary stats */}
        {pendingCount > 0 && (
          <div className="mt-4 inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-xl text-sm font-bold">
            <HourglassEmpty sx={{ fontSize: 16 }} />
            Có {pendingCount} nhóm đang chờ bạn xét duyệt
          </div>
        )}
      </div>

      {/* Filter tabs + refresh */}
      <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
        <div className="flex gap-2 bg-white/60 backdrop-blur-md rounded-xl p-1.5 shadow-sm border border-white">
          {filterOptions.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              id={`filter-${value.toLowerCase()}`}
              onClick={() => setStatusFilter(value)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
                statusFilter === value
                  ? "bg-mainColor text-white shadow-md shadow-mainColor/20"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/80"
              }`}
            >
              <Icon sx={{ fontSize: 16 }} />
              {label}
            </button>
          ))}
        </div>
        <button
          id="refresh-groups-btn"
          onClick={fetchGroups}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          <Refresh sx={{ fontSize: 18 }} className={loading ? "animate-spin" : ""} />
          Làm mới
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : groups.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-16 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-5">
            <Person sx={{ fontSize: 40 }} className="text-slate-300" />
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-2">Không có nhóm nào</h3>
          <p className="text-[15px] text-slate-500 font-medium max-w-sm">
            {statusFilter === "PENDING_ADVISOR"
              ? "Không có nhóm nào đang chờ bạn xét duyệt."
              : "Không có nhóm nào phù hợp với bộ lọc đã chọn."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onApprove={handleApprove}
              onReject={setRejectTarget}
              onViewDetail={handleViewDetail}
              actionLoading={actionLoading}
            />
          ))}
        </div>
      )}

      {detailModalOpen && selectedGroup && (
        <GroupDetailModal
          isOpen={detailModalOpen}
          onClose={() => {
            setDetailModalOpen(false);
            setSelectedGroup(null);
          }}
          group={selectedGroup}
          isAdmin={false}
          canAdvisorApprove={selectedGroup.status === "PENDING_ADVISOR"}
          currentUserId={user?.id}
          onApprove={handleApproveFromDetail}
          onReject={handleRejectFromDetail}
          getStatusBadge={getResearchGroupStatusBadge}
        />
      )}

      {detailLoading && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
          <LoadingSpinner size="lg" />
        </div>
      )}
    </div>
  );
};

export default AdvisorGroupApprovalPage;
