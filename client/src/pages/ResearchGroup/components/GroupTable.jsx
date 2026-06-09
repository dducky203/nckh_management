import {
  Visibility,
  Delete,
  ChevronRight,
  Cancel,
  Circle,
} from "@mui/icons-material";
import { canEditGroup } from "../../../utils/permissions";

const GroupTable = ({
  groups,
  isAdmin,
  currentUser,
  onViewDetail,
  onDelete,
  getStatusBadge,
  onManageMembers = () => {},
  onManageProductsAndCompletion = () => {},
}) => {
  const isActive = true;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto pb-3">
      {groups.map((group) => {
        const statusBadge = getStatusBadge(group.status);
        const StatusIcon = statusBadge.icon;
        const userCanEdit = canEditGroup(currentUser, group);

        return (
          <div
            key={group.id}
            className="group bg-white rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border-2 border-transparent hover:border-mainColor hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
          >
            {/* ===== Header ===== */}
            <div className="p-5 border-b border-gray-100 bg-white group-hover:bg-gray-50/50 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col gap-2">
                  {/* Status */}
                  <p
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-[11px] font-bold uppercase shadow-sm ${statusBadge.color}`}
                  >
                    <StatusIcon style={{ fontSize: 14 }} />
                    {statusBadge.label}
                  </p>

                  {/* Active */}
                  <p
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-[11px] font-bold uppercase shadow-sm ${
                      isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {isActive ? (
                      <Circle sx={{ fontSize: 14 }} />
                    ) : (
                      <Cancel sx={{ fontSize: 14 }} />
                    )}
                    {isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onViewDetail(group)}
                    className="p-2 text-gray-500 hover:text-mainColor hover:bg-mainColor/10 rounded-lg transition-colors"
                    title="Xem chi tiết"
                  >
                    <Visibility fontSize="small" />
                  </button>

                  {userCanEdit && (
                    <button
                      onClick={() => onDelete(group.id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Xóa nhóm"
                    >
                      <Delete fontSize="small" />
                    </button>
                  )}
                </div>
              </div>

              {/* Group name */}
              <h3 className="text-xl font-extrabold text-gray-800 uppercase tracking-tight text-center group-hover:text-mainColor transition-colors px-4">
                {group.groupName}
              </h3>
            </div>

            {userCanEdit && (
              <div className="flex-1 divide-y divide-gray-100">
                <button
                  onClick={() => onManageMembers(group)}
                  className="w-full px-6 py-5 flex items-center justify-between transition-all hover:bg-mainColor/5 group/item"
                >
                  <span className="text-gray-600 font-bold group-hover/item:text-mainColor">
                    Quản lý thành viên
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-gray-400 group-hover/item:text-mainColor/70">
                      ({group.members?.length || 0})
                    </span>
                    <ChevronRight
                      fontSize="small"
                      className="text-gray-300 group-hover/item:text-mainColor group-hover/item:translate-x-1 transition-all"
                    />
                  </div>
                </button>

                <button
                  onClick={() => onManageProductsAndCompletion(group)}
                  className="w-full px-6 py-5 flex items-center justify-between transition-all hover:bg-mainColor/5 group/item"
                >
                  <span className="text-gray-600 font-bold group-hover/item:text-mainColor">
                    {group.type === "student" 
                      ? "Quản lý sản phẩm" 
                      : "Quản lý sản phẩm & mức độ hoàn thành"}
                  </span>
                  <ChevronRight
                    fontSize="small"
                    className="text-gray-300 group-hover/item:text-mainColor group-hover/item:translate-x-1 transition-all"
                  />
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default GroupTable;
