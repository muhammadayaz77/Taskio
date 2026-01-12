import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  logout,
  restoreAuth,
  setIsLoading,
  setIsAuthenticated,
} from "../../store/auth/authSlice.js";
import { useLocation, useNavigate } from "react-router-dom";
import { publicRoutes } from "../lib/publicRoutes.js";

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isPublicRoute =
  publicRoutes.includes(pathname) ||
  pathname.startsWith("/verify-email/");


  useEffect(() => {
    const checkAuth = async () => {
      dispatch(setIsLoading(true));

      try {
        const user = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        
        if (user && token) {
          dispatch(
            restoreAuth({
              user: JSON.parse(user),
            })
          );
        } else {
          dispatch(setIsAuthenticated(false));
          if (!isPublicRoute) {
            navigate("/sign-in");
          }
        }
      } finally {
        dispatch(setIsLoading(false));
      }
    };

    checkAuth();
  }, [dispatch, navigate, isPublicRoute]);

  useEffect(() => {
    const handleLogout = () => {
      dispatch(logout());
      navigate("/sign-in");
    };

    window.addEventListener("force-logout", handleLogout);
    return () =>
      window.removeEventListener("force-logout", handleLogout);
  }, [dispatch, navigate]);

  return children;
};

export default AuthProvider;
