import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = ({ children }) => {
  const isAuth = useSelector((state) => state.auth.isAuthenticated);
  return isAuth ? <Navigate to="/" replace /> : children;
};

export default PublicRoute;
