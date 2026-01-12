import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );

  if (isLoading) return <div>Loading...</div>;
  let isAuthenticat = true;

  return isAuthenticat ? <Outlet /> : <Navigate to="/sign-in" replace />;
};

export default ProtectedRoute;
