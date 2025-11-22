import { Search, FilterList } from "@mui/icons-material";

const EventFilters = ({
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
}) => {
  return (
    <div className="p-4 border-b bg-gray-50">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm sự kiện theo tên, địa điểm, đơn vị tổ chức..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor text-sm"
          />
        </div>

        {/* Filter by type */}
        <div className="flex items-center gap-2">
          <FilterList className="text-gray-400" fontSize="small" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor text-sm"
          >
            <option value="all">Tất cả loại</option>
            <option value="seminar">Hội thảo</option>
            <option value="workshop">Workshop</option>
            <option value="conference">Hội nghị</option>
            <option value="other">Khác</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default EventFilters;
