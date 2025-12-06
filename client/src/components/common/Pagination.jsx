import {
  ChevronLeft,
  ChevronRight,
  FirstPage,
  LastPage,
} from "@mui/icons-material";

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  startIndex,
  endIndex,
  onPageChange,
  onFirstPage,
  onLastPage,
  onPreviousPage,
  onNextPage,
  getPageNumbers,
  itemName = "mục", 
  className = "",
}) => {
  if (totalItems === 0) return null;

  return (
    <div className={`px-6 py-4 border-t border-gray-200 ${className}`}>
      <div className="flex items-center justify-between">
        {/* Info text */}
        <div className="text-sm text-gray-700">
          Hiển thị <span className="font-medium">{startIndex + 1}</span> đến{" "}
          <span className="font-medium">{endIndex}</span> trong tổng số{" "}
          <span className="font-medium">{totalItems}</span> {itemName}
        </div>

        {/* Pagination controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={onFirstPage}
            disabled={currentPage === 0}
            className="min-w-[32px] h-8 flex items-center justify-center rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-600"
            title="Trang đầu"
          >
            <FirstPage fontSize="sm" />
          </button>

          <button
            onClick={onPreviousPage}
            disabled={currentPage === 0}
            className="min-w-[32px] h-8 flex items-center justify-center rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-600"
            title="Trang trước"
          >
            <ChevronLeft fontSize="sm" />
          </button>

          <div className="flex gap-1 mx-2">
            {getPageNumbers().map((page, index) =>
              page === "..." ? (
                <span
                  key={`ellipsis-${index}`}
                  className="min-w-[32px] h-8 flex items-center justify-center text-sm text-gray-500"
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`min-w-[32px] h-8 px-3 text-sm rounded-md transition-colors ${
                    currentPage + 1 === page
                      ? "bg-mainColor text-white font-medium shadow-sm"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              )
            )}
          </div>

          <button
            onClick={onNextPage}
            disabled={currentPage === totalPages - 1}
            className="min-w-[32px] h-8 flex items-center justify-center rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-600"
            title="Trang sau"
          >
            <ChevronRight fontSize="sm" />
          </button>

          <button
            onClick={onLastPage}
            disabled={currentPage === totalPages - 1}
            className="min-w-[32px] h-8 flex items-center justify-center rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-600"
            title="Trang cuối"
          >
            <LastPage fontSize="sm" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
