import { useMutation } from "@tanstack/react-query";
import { registerApi } from "../../api/auth.api";

export const useRegister = () => {
  return useMutation({
    mutationFn: registerApi,
  });
};
