import { Search } from "@mui/icons-material";

const EventFilters = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="p-4 border-b bg-gray-50">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm kiếm sự kiện theo tên, địa điểm, đơn vị tổ chức..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mainColor text-sm"
        />
      </div>
    </div>
  );
};

export default EventFilters;
