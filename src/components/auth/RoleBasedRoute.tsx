import React from "react";
import { Navigate, useLocation } from "react-router-dom";

type UserRole = "admin" | "hr" | "company";

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  userRole: UserRole | null;
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  children,
  allowedRoles,
  userRole,
}) => {
  const location = useLocation();

  if (!userRole) {
    // Redirect to login if no user role is found
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard based on user role
    const redirectPath = `/${userRole}/dashboard`;
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default RoleBasedRoute;
