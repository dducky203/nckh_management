import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { hasNckhStaffAccess, isStrictAdminPortalUser } from "../../utils/permissions";

const ProtectedRoute = ({ children, requiredPower = null }) => {
  const { user, isInitializing } = useContext(AuthContext);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mainColor"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPower === "admin" && !isStrictAdminPortalUser(user)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (requiredPower === "nckhStaff" && !hasNckhStaffAccess(user)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
