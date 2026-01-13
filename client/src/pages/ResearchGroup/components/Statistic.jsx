import { Cancel, CheckCircle, Group, Pending } from "@mui/icons-material";

const Statistic = ({ statistics }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng nhóm</p>
              <p className="text-2xl font-bold text-gray-900">
                {statistics?.totalGroups || 0}
              </p>
            </div>
            <Group className="text-blue-600" fontSize="large" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Chờ duyệt</p>
              <p className="text-2xl font-bold text-yellow-600">
                {statistics?.pendingGroups || 0}
              </p>
            </div>
            <Pending className="text-yellow-600" fontSize="large" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Đã duyệt</p>
              <p className="text-2xl font-bold text-green-600">
                {statistics?.approvedGroups || 0}
              </p>
            </div>
            <CheckCircle className="text-green-600" fontSize="large" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Từ chối</p>
              <p className="text-2xl font-bold text-red-600">
                {statistics?.rejectedGroups || 0}
              </p>
            </div>
            <Cancel className="text-red-600" fontSize="large" />
          </div>
        </div>
      </div>
    </>
  );
};
export default Statistic;
