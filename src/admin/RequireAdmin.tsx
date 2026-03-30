import { Navigate, Outlet } from "react-router-dom";

const RequireAdmin = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
  if (!token) return <Navigate to="/admin-login" replace />;
  return <Outlet />;
};

export default RequireAdmin;


