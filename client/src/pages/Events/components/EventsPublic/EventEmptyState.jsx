import { Event } from "@mui/icons-material";

const EventEmptyState = ({ message, searchTerm }) => {
  return (
    <div className="text-center py-16 bg-white rounded-lg shadow-sm">
      <Event className="text-gray-300 mx-auto mb-4" sx={{ fontSize: 64 }} />
      <p className="text-gray-500 text-lg mb-2">{message}</p>
      {searchTerm && (
        <p className="text-gray-400 text-sm">
          Thử xóa bộ lọc hoặc tìm kiếm với từ khóa khác
        </p>
      )}
    </div>
  );
};

export default EventEmptyState;
