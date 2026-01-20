import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { restoreAuth, setIsLoading, setIsAuthenticated, logout } from "../../store/auth/authSlice.js";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { publicRoutes } from "../lib/publicRoutes.js";
import Loader from "../components/common/Loader.jsx";

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isAuthenticated, isLoading } = useSelector(state => state.auth);

  
  // List of routes that should only be accessible to public users
  const authPages = ["/sign-in", "/sign-up", "/forgot-password"];


  const isPublicRoute =
    publicRoutes.includes(pathname) || pathname.startsWith("/verify-email/");

  // ✅ Restore auth from localStorage on mount
  useEffect(() => {
    const checkAuth = () => {
      dispatch(setIsLoading(true));
      const user = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (user && token) {
        dispatch(restoreAuth({ user: JSON.parse(user) }));
      } else {
        dispatch(setIsAuthenticated(false));
      }

      dispatch(setIsLoading(false));
    };

    checkAuth();
  }, [dispatch]);

  // ✅ Listen for force logout events
  useEffect(() => {
    const handleLogout = () => {
      dispatch(logout());
      navigate("/sign-in", { replace: true });
    };
    window.addEventListener("force-logout", handleLogout);
    return () => window.removeEventListener("force-logout", handleLogout);
  }, [dispatch, navigate]);

  // ✅ Show loader while checking auth
  if (isLoading) return <Loader />;

  // ✅ Navigate only if not authenticated & not on public route
  if (!isAuthenticated && !isPublicRoute) {
    return <Navigate to="/sign-in" replace />;
  }

   // ✅ Redirect authenticated users away from auth pages
   if (isAuthenticated && authPages.includes(pathname)) {
    return <Navigate to="/dashboard" replace />; // or any dashboard/home route
  }

  return children;
};

export default AuthProvider;
