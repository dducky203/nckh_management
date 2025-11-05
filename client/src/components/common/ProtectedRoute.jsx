import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

const ProtectedRoute = ({ children, requiredPower }) => {
  const { isAuthenticated, hasPermission, isInitializing } = useAuth();
  const location = useLocation();

  // Hiển thị loading trong khi đang khởi tạo
  if (isInitializing) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Loading...
      </div>
    );
  }

  // Kiểm tra xác thực
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Kiểm tra quyền (nếu cần)
  if (requiredPower !== undefined && !hasPermission(requiredPower)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;