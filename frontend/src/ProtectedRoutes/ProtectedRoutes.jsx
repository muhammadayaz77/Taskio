import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({children}) => {
  const { isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );

  console.log("protected auth : ",isAuthenticated)
  // ⏳ Wait until auth is restored
  if (isLoading) return <div>Loading...</div>; // or spinner

  return <>
  {isAuthenticated}
    ? {children}
    : <Navigate to="/sign-in" replace />;
  </>
};

export default ProtectedRoute;
