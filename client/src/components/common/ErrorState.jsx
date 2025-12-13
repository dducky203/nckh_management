const ErrorState = ({
  title = "Không thể tải dữ liệu",
  message = "Vui lòng kiểm tra kết nối mạng hoặc liên hệ quản trị viên",
  onRetry,
  retryText = "Thử lại",
  icon = "⚠️",
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 text-gray-500 ${className}`}
    >
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-lg font-medium mb-2">{title}</p>
      <p className="text-sm mb-4 text-center max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-mainColor text-white rounded-md hover:bg-opacity-90 transition-colors"
        >
          {retryText}
        </button>
      )}
    </div>
  );
};

export default ErrorState;
