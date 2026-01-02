import { useMutation } from "@tanstack/react-query";
import { loginApi } from "../../api/auth.api";
import { setToken } from "../../utils/tokenStorage";

export const useLogin = () => {
  return useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      setToken(data.token);
    },
  });
};
