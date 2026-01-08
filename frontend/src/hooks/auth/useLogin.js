import { useMutation } from "@tanstack/react-query";
import { setToken } from "../../utils/tokenStorage";
import { postData } from "../../api/axios";

export const useLogin = () => {
  return useMutation({
    mutationFn: (data) => postData('/auth/login',data),
    onSuccess: (data) => {
      console.log('login',data)
      window.toastify(data?.message || "Your are logged in",'success')
      setToken(data.token);
    },
    onError : (err) => {
      console.log("Error : ",err)
      window.toastify(err?.response?.data?.message,'error')
    }
  });
};
