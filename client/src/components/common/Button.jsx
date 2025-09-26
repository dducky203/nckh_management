const Button = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  onClick,
  type = "button",
  className = "",
  ...props
}) => {
  const baseClasses =
    "font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-mainColor text-white hover:bg-mainColor/90 focus:ring-mainColor/70",
    secondary:
      "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    outline:
      "border-2 border-mainColor text-mainColor hover:bg-mainColor/10 focus:ring-mainColor/50",
    custom: "", // Thêm variant custom để cho phép tùy chỉnh hoàn toàn thông qua className
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseClasses} ${
        variant !== "custom" ? variants[variant] : ""
      } ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center -wte">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
          Đang xử lý...
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
