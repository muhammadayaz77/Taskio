import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../../store/auth/authSlice.js";
import { postData } from "../../api/axios";
import { useNavigate, useLocation } from "react-router-dom";

export const useLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  return useMutation({
    mutationFn: (data) => postData("/auth/login", data),
    onSuccess: (data) => {
      console.log('data : ',data)
      dispatch(
        loginSuccess({
          user: data.user,
          token: data.token,
        })
      );

      window.toastify(
        data?.message || "You are logged in",
        "success"
      );
      const from = location.state?.from;
      if (from?.pathname) {
        navigate(`${from.pathname}${from.search ?? ""}`, { replace: true });
      } else {
        navigate("/dashboard");
      }
    },
    onError: (err) => {
      window.toastify(
        err?.response?.data?.message || "Login failed",
        "error"
      );
    },
  });
};
