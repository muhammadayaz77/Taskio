import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../../store/auth/authSlice.js";
import { postData } from "../../api/axios";
import { useNavigate } from "react-router-dom";

export const useForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate( )

  return useMutation({
    mutationFn: (data) => postData("/auth/reset-password-request", data),
    onSuccess: (data) => {
      console.log('data : ',data)
      dispatch(
        loginSuccess({
          user: data.user,
          token: data.token,
        })
      );

      window.toastify(
        data?.message || "Reset pasword email sent",
        "success"
      );
    },
    onError: (err) => {
      window.toastify(
        err?.response?.data?.message || "Login failed",
        "error"
      );
    },
  });
};
