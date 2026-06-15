import {
  Close,
  CheckCircle,
  Cancel,
  People,
  School,
  Mail,
  Link,
  CalendarToday,
  Update,
  Home,
  HourglassTop,
  AdminPanelSettings,
  Notes,
  OpenInNew,
  BookmarkBorder,
} from "@mui/icons-material";
import { formatDateTime, getSemesterFromDate, getResearchGroupStatusBadge } from "../../../constants";
import Button from "../../../components/common/Button";

const GroupDetailModal = ({
  isOpen,
  onClose,
  group,
  isAdmin,
  onApprove,
  onReject,
  getStatusBadge,
}) => {
  if (!isOpen || !group) return null;

  // Resolve status badge safely
  const resolveStatusBadge = (status) => {
    if (typeof getStatusBadge === "function") {
      const badge = getStatusBadge(status);
      if (badge) return badge;
    }
    return getResearchGroupStatusBadge(status);
  };

  const statusBadge = resolveStatusBadge(group.status);
  const StatusIcon = statusBadge.icon || HourglassTop;

  // Group members safely
  const advisor = group.advisor;
  const leader = group.leader;
  const membersList = group.members || [];
  const leaderDetail = membersList.find((m) => m.id === leader?.id) || leader;
  const regularMembers = membersList.filter((m) => m.id !== leader?.id);

  // Stepper steps configuration
  const getApprovalSteps = () => {
    const isStudent = group.type === "student";
    const status = group.status;

    if (isStudent) {
      const steps = [
        {
          label: "Đăng ký nhóm",
          status: "completed",
          icon: CheckCircle,
          desc: "Đã tạo hồ sơ",
        },
        {
          label: "GVHD duyệt",
          status: "pending",
          icon: HourglassTop,
          desc: "Chờ GVHD xác nhận",
        },
        {
          label: "Admin duyệt",
          status: "pending",
          icon: AdminPanelSettings,
          desc: "Chờ quản trị viên",
        },
      ];

      // Update GVHD step (Index 1)
      if (status === "PENDING_ADVISOR") {
        steps[1].status = "active";
        steps[1].desc = "Đang chờ duyệt";
      } else if (
        status === "PENDING_ADMIN" ||
        status === "APPROVED" ||
        (status === "REJECTED" && !group.rejectionReason?.includes("[GV")) // Just a heuristic
      ) {
        steps[1].status = "completed";
        steps[1].desc = "Đã phê duyệt";
        steps[1].icon = CheckCircle;
      }

      // Update Admin step (Index 2)
      if (status === "PENDING_ADMIN") {
        steps[2].status = "active";
        steps[2].desc = "Đang chờ duyệt";
      } else if (status === "APPROVED") {
        steps[2].status = "completed";
        steps[2].desc = "Đã phê duyệt";
        steps[2].icon = CheckCircle;
      } else if (status === "PENDING_ADVISOR") {
        steps[2].status = "pending";
        steps[2].desc = "Chờ bước trước";
      } else if (status === "REJECTED") {
        // Mark active step as failed if rejection matches
        if (group.rejectionReason && group.rejectionReason.includes("giảng viên")) {
          steps[1].status = "failed";
          steps[1].desc = "GV từ chối";
          steps[1].icon = Cancel;
          steps[2].status = "pending";
        } else {
          steps[2].status = "failed";
          steps[2].desc = "Admin từ chối";
          steps[2].icon = Cancel;
        }
      }

      return steps;
    } else {
      const steps = [
        {
          label: "Đăng ký nhóm",
          status: "completed",
          icon: CheckCircle,
          desc: "Đã đăng ký",
        },
        {
          label: "Admin duyệt",
          status: "pending",
          icon: AdminPanelSettings,
          desc: "Chờ Admin phê duyệt",
        },
      ];

      if (status === "PENDING") {
        steps[1].status = "active";
        steps[1].desc = "Đang chờ duyệt";
      } else if (status === "APPROVED") {
        steps[1].status = "completed";
        steps[1].desc = "Đã phê duyệt";
        steps[1].icon = CheckCircle;
      } else if (status === "REJECTED") {
        steps[1].status = "failed";
        steps[1].desc = "Bị từ chối";
        steps[1].icon = Cancel;
      }

      return steps;
    }
  };

  const steps = getApprovalSteps();

  const canAdminApprove = isAdmin && (
    (group.type === "student" && group.status === "PENDING_ADMIN") ||
    (group.type === "lecturer" && group.status === "PENDING")
  );

  const getLecturerGroupTypeName = (type) => {
    switch (type) {
      case "NCM":
        return "Nhóm nghiên cứu mạnh (NCM)";
      case "XUAT_SAC":
        return "Nhóm nghiên cứu xuất sắc";
      case "TINH_HOA":
        return "Nhóm nghiên cứu tinh hoa";
      default:
        return type || "Không phân loại";
    }
  };

  const renderMemberCard = (member, isLeaderCard = false) => {
    const avatarLetter = member.name?.charAt(0)?.toUpperCase() || "?";
    
    let cardClass = "bg-white border border-gray-100 hover:border-emerald-200 shadow-sm hover:shadow-md";
    let avatarClass = "bg-emerald-600 text-white";
    let roleBadgeClass = "bg-emerald-50 text-emerald-700 border border-emerald-200";

    if (isLeaderCard) {
      cardClass = "bg-gradient-to-r from-blue-50/40 to-white border border-blue-200 hover:border-blue-300 shadow-sm hover:shadow-md";
      avatarClass = "bg-blue-600 text-white";
      roleBadgeClass = "bg-blue-600 text-white";
    }

    return (
      <div
        key={member.id}
        className={`flex gap-4 p-4 rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5 ${cardClass}`}
      >
        <div className="flex items-center justify-center shrink-0">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-inner ${avatarClass}`}>
            {avatarLetter}
          </div>
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="font-extrabold text-gray-800 text-[15px] truncate">
              {member.name}
            </h4>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${roleBadgeClass}`}>
              {isLeaderCard ? "Trưởng nhóm" : (member.role || "Thành viên")}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-gray-600">
            {member.email && (
              <div className="flex items-center gap-2 min-w-0">
                <Mail className="text-gray-400 shrink-0" sx={{ fontSize: 14 }} />
                <a href={`mailto:${member.email}`} className="hover:text-mainColor truncate">
                  {member.email}
                </a>
              </div>
            )}
            
            {member.title && (
              <div className="flex items-center gap-2 min-w-0">
                <School className="text-gray-400 shrink-0" sx={{ fontSize: 14 }} />
                <span className="truncate">{member.title}</span>
              </div>
            )}

            {member.address && (
              <div className="flex items-center gap-2 col-span-1 sm:col-span-2 min-w-0">
                <Home className="text-gray-400 shrink-0" sx={{ fontSize: 14 }} />
                <span className="truncate" title={member.address}>{member.address}</span>
              </div>
            )}
          </div>

          {typeof member.participationRate === "number" && (
            <div className="pt-2 border-t border-gray-50 flex items-center justify-between gap-3">
              <span className="text-xs text-gray-500 font-medium">Tỷ lệ đóng góp</span>
              <div className="flex items-center gap-2 flex-1 max-w-[140px]">
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${isLeaderCard ? 'bg-blue-600' : 'bg-emerald-500'}`} 
                    style={{ width: `${member.participationRate}%` }}
                  />
                </div>
                <span className={`text-xs font-black shrink-0 ${isLeaderCard ? 'text-blue-600' : 'text-emerald-600'}`}>
                  {member.participationRate}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderAdvisorCard = (adv) => {
    if (!adv) return null;
    const avatarLetter = adv.name?.charAt(0)?.toUpperCase() || "?";

    return (
      <div className="bg-gradient-to-r from-purple-50/40 to-white border border-purple-200 hover:border-purple-300 shadow-sm hover:shadow-md rounded-2xl p-4 flex gap-4 transition-all duration-300 transform hover:-translate-y-0.5">
        <div className="flex items-center justify-center shrink-0">
          <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-inner">
            {avatarLetter}
          </div>
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="font-extrabold text-gray-800 text-[15px] truncate">
              {adv.name}
            </h4>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-700 border border-purple-200">
              Giảng viên hướng dẫn
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-gray-600">
            {adv.email && (
              <div className="flex items-center gap-2 min-w-0">
                <Mail className="text-gray-400 shrink-0" sx={{ fontSize: 14 }} />
                <a href={`mailto:${adv.email}`} className="hover:text-purple-600 truncate">
                  {adv.email}
                </a>
              </div>
            )}
            
            {adv.title && (
              <div className="flex items-center gap-2 min-w-0">
                <School className="text-gray-400 shrink-0" sx={{ fontSize: 14 }} />
                <span className="truncate">{adv.title}</span>
              </div>
            )}

            {adv.address && (
              <div className="flex items-center gap-2 col-span-1 sm:col-span-2 min-w-0">
                <Home className="text-gray-400 shrink-0" sx={{ fontSize: 14 }} />
                <span className="truncate" title={adv.address}>{adv.address}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-gray-100 transition-all transform scale-100">
        
        {/* Header Hero Section */}
        <div className="relative p-6 md:p-8 bg-gradient-to-r from-mainColor/10 via-mainColor/5 to-transparent border-b border-gray-100 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm ${statusBadge.color}`}>
                  <StatusIcon sx={{ fontSize: 14 }} />
                  {statusBadge.label}
                </span>
                
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-700">
                  {group.type === "student" ? "Sinh viên" : "Giảng viên"}
                </span>

                {group.type === "lecturer" && group.groupType && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {getLecturerGroupTypeName(group.groupType)}
                  </span>
                )}
              </div>

              <h2 className="text-xl md:text-2xl font-black text-gray-900 leading-snug tracking-tight">
                {group.groupName}
              </h2>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all shrink-0 shadow-sm bg-white"
            >
              <Close />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar">
          

          {/* Rejection Reason Box */}
          {group.status === "REJECTED" && group.rejectionReason && (
            <div className="flex gap-3 p-4 bg-rose-50 border-l-4 border-rose-500 text-rose-800 rounded-r-2xl shadow-sm">
              <Cancel className="text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-extrabold text-sm uppercase tracking-wide text-rose-900">
                  Hồ sơ bị từ chối phê duyệt
                </p>
                <p className="text-sm mt-1 text-rose-800 leading-relaxed font-medium">
                  Lý do: {group.rejectionReason.replace(/\[GV.*\]\s*/, "")}
                </p>
              </div>
            </div>
          )}

          {/* Topic & Description Box */}
          <div className="grid grid-cols-1 gap-6">
            <div className="p-5 md:p-6 bg-mainColor/[0.03] border-l-4 border-mainColor rounded-r-2xl space-y-3">
              <div className="flex items-center gap-2 text-mainColor font-bold">
                <BookmarkBorder fontSize="small" />
                <h3 className="text-xs uppercase tracking-wider">Đề tài nghiên cứu khoa học</h3>
              </div>
              <h4 className="text-lg font-black text-gray-900 leading-snug">
                {group.topicName}
              </h4>
              
              {group.description && (
                <div className="pt-3 border-t border-mainColor/10 space-y-2">
                  <div className="flex items-center gap-2 text-gray-400 font-bold">
                    <Notes fontSize="small" />
                    <h5 className="text-[11px] uppercase tracking-wider">Mô tả chi tiết</h5>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-medium">
                    {group.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Google Sheet Link Banner */}
          {group.googleSheetLink && (
            <div className="bg-emerald-50/50 border border-emerald-200/60 rounded-3xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:bg-emerald-50">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 bg-emerald-600 text-white rounded-2xl shadow-md shrink-0">
                  <Link />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-emerald-800 text-sm">Bảng tính Google Sheet quản lý</p>
                  <p className="text-xs text-emerald-600 truncate mt-0.5 font-medium max-w-[250px] sm:max-w-md md:max-w-lg">
                    {group.googleSheetLink}
                  </p>
                </div>
              </div>
              <a
                href={group.googleSheetLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md shadow-emerald-600/10 transition-all shrink-0"
              >
                <span>Mở sheet</span>
                <OpenInNew sx={{ fontSize: 14 }} />
              </a>
            </div>
          )}

          {/* Info Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50/40 rounded-3xl border border-gray-100">
            <div className="space-y-1">
              <h5 className="text-[11px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-1">
                <CalendarToday sx={{ fontSize: 12 }} />
                {group.type === "student" ? "Học kỳ đăng ký" : "Ngày đăng ký"}
              </h5>
              <p className="text-sm font-bold text-gray-800">
                {group.createdAt ? (
                  group.type === "student" ? getSemesterFromDate(group.createdAt) : formatDateTime(group.createdAt)
                ) : "N/A"}
              </p>
            </div>
            
            <div className="space-y-1">
              <h5 className="text-[11px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-1">
                <Update sx={{ fontSize: 12 }} />
                Cập nhật lần cuối
              </h5>
              <p className="text-sm font-bold text-gray-800 font-medium">
                {group.updatedAt ? formatDateTime(group.updatedAt) : "N/A"}
              </p>
            </div>

            <div className="space-y-1">
              <h5 className="text-[11px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-1">
                <People sx={{ fontSize: 12 }} />
                Thành viên
              </h5>
              <p className="text-sm font-bold text-gray-800">
                {membersList.length} thành viên
              </p>
            </div>

            <div className="space-y-1">
              <h5 className="text-[11px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-1">
                <BookmarkBorder sx={{ fontSize: 12 }} />
                Trạng thái nhóm
              </h5>
              <p className="text-sm font-extrabold text-mainColor uppercase tracking-tight">
                {statusBadge.label}
              </p>
            </div>
          </div>

          {/* Advisor Section */}
          {group.type === "student" && advisor && (
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-gray-700 flex items-center gap-2">
                <School className="text-purple-600" fontSize="small" />
                Giảng viên hướng dẫn
              </h3>
              {renderAdvisorCard(advisor)}
            </div>
          )}

          {/* Members Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-gray-700 flex items-center gap-2">
              <People className="text-emerald-600" fontSize="small" />
              Danh sách thành viên ({membersList.length})
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Always display leader first if available */}
              {leaderDetail && renderMemberCard(leaderDetail, true)}
              
              {/* Display other members */}
              {regularMembers.length > 0 ? (
                regularMembers.map((member) => renderMemberCard(member, false))
              ) : (
                !leaderDetail && (
                  <p className="text-gray-500 italic text-sm py-2 text-center col-span-2">
                    Chưa có thành viên nào
                  </p>
                )
              )}
            </div>
          </div>

        </div>

        {/* Action Buttons Footer */}
        <div className="flex items-center gap-3 p-6 bg-gray-50 border-t border-gray-100 shrink-0">
          {canAdminApprove && (
            <>
              <button
                onClick={() => {
                  onClose();
                  onApprove(group.id);
                }}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-600/10 transition-all"
              >
                <CheckCircle fontSize="small" />
                Duyệt nhóm
              </button>
              <button
                onClick={() => {
                  onClose();
                  onReject(group.id);
                }}
                className="flex items-center gap-2 px-6 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg shadow-rose-600/10 transition-all"
              >
                <Cancel fontSize="small" />
                Từ chối
              </button>
            </>
          )}

          <Button
            onClick={onClose}
            variant="outline"
            className="ml-auto px-6 py-2.5 border border-gray-200 text-gray-700 hover:bg-gray-100 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
          >
            Đóng
          </Button>
        </div>
        
      </div>
    </div>
  );
};

export default GroupDetailModal;
