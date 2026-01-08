import { useMutation } from "@tanstack/react-query";
import { loginApi } from "../../api/auth.api";
import { setToken } from "../../utils/tokenStorage";

export const useLogin = () => {
  return useMutation({
    mutationFn: (data) => postData('/auth/login',data),
    onSuccess: (data) => {
      window.toastify(data?.message || "Your are logged in",'success')
      setToken(data.token);
    },
    onError : (err) => {
      window.toastify(err?.response?.data?.message,'error')
    }
  });
};
