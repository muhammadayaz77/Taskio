import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../../store/auth/authSlice.js";
import { postData } from "../../api/axios";

export const useLogin = () => {
  const dispatch = useDispatch();

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
    },
    onError: (err) => {
      window.toastify(
        err?.response?.data?.message || "Login failed",
        "error"
      );
    },
  });
};
