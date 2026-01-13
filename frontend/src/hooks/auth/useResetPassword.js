import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../../store/auth/authSlice.js";
import { postData } from "../../api/axios";
import { useNavigate } from "react-router-dom";

export const useResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate( )

  return useMutation({
    mutationFn: (data) => postData("/auth/reset-password", data),
    onSuccess: (data) => {
      console.log('data : ',data)

      window.toastify(
        data?.message || "Reset pasword email sent",
        "success"
      );
    },
    onError: (err) => {
      console.log("Error : ",err)
      window.toastify(
        err?.response?.data?.message || "Reset password failed",
        "error"
      );
    },
  });
};
