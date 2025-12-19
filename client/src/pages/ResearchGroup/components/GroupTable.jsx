const GroupTable = ({
  groups,
  isAdmin,
  onViewDetail,
  onDelete,
  onManageMembers,
  onManageProducts,
  onManageCompletion,
  getStatusBadge,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {groups.map((group) => {

        return (
          <div
            key={group.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-200 min-w-0"
          >
            {/* Group Name */}
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {group.groupName}
              </h3>
            </div>

            {/* Management Actions */}
            <div className="space-y-2">
              <button
                onClick={() => onManageMembers && onManageMembers(group)}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors duration-150 whitespace-nowrap overflow-visible"
              >
                Quản lý thành viên
              </button>
              
              <button
                onClick={() => onManageProducts && onManageProducts(group)}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:text-green-600 hover:bg-green-50 rounded transition-colors duration-150 whitespace-nowrap overflow-visible"
              >
                Quản lý sản phẩm
              </button>
              
              <button
                onClick={() => onManageCompletion && onManageCompletion(group)}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors duration-150 whitespace-nowrap overflow-visible"
              >
                Quản lý mức độ hoàn thành
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GroupTable;
