import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  canAccessQuotaPages,
  canCreateSeminarEvent,
  canViewAdminGroupQuotaStats,
  hasNckhStaffAccess,
  isStrictAdminPortalUser,
} from "../../utils/permissions";
import researchGroupService from "../../services/researchGroupService";
import LoadingSpinner from "../common/LoadingSpinner";

/**
 * Bảo vệ route theo đăng nhập + quyền nghiệp vụ.
 *
 * @param {string|null} requiredPower
 *   - null: chỉ cần đăng nhập
 *   - "admin": STRICT admin (không gồm assistant)
 *   - "nckhStaff": admin / lãnh đạo / assistant
 *   - "seminarCreator": trưởng nhóm/thư ký hoặc nckh staff
 * @param {boolean} requireQuotaAccess - cấm sinh viên
 * @param {boolean} requireGroupQuotaStats - stats định mức nhóm
 */
const ProtectedRoute = ({
  children,
  requiredPower = null,
  requireQuotaAccess = false,
  requireGroupQuotaStats = false,
}) => {
  const { user, isInitializing } = useContext(AuthContext);
  const [seminarPermissions, setSeminarPermissions] = useState(null);

  useEffect(() => {
    if (!user || requiredPower !== "seminarCreator") {
      setSeminarPermissions(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const data = await researchGroupService.getMyPermissions();
        if (!cancelled) setSeminarPermissions(data);
      } catch {
        if (!cancelled) {
          setSeminarPermissions({ canCreateSeminar: hasNckhStaffAccess(user) });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, requiredPower]);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
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

  if (requiredPower === "seminarCreator") {
    if (seminarPermissions === null) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      );
    }
    if (
      !canCreateSeminarEvent(seminarPermissions) &&
      !hasNckhStaffAccess(user)
    ) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  if (requireQuotaAccess && !canAccessQuotaPages(user)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (requireGroupQuotaStats && !canViewAdminGroupQuotaStats(user)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
