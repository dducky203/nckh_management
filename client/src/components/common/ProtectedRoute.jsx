import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

/**
 * Bảo vệ các trang yêu cầu xác thực
 * @param {Object} props - Props của component
 * @param {React.ReactNode} props.children - Các thành phần con (trang cần bảo vệ)
 * @param {number} [props.requiredPower] - Quyền tối thiểu để truy cập trang (nếu có)
 */
const ProtectedRoute = ({ children, requiredPower }) => {
  const { isAuthenticated, hasPermission } = useAuth();
  const location = useLocation();

  // Kiểm tra xác thực
  if (!isAuthenticated()) {
    // Lưu lại đường dẫn hiện tại để quay lại sau khi đăng nhập
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Kiểm tra quyền (nếu cần)
  if (requiredPower !== undefined && !hasPermission(requiredPower)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Nếu đã xác thực và có đủ quyền, hiển thị trang
  return children;
};

export default ProtectedRoute;
