import { useMutation } from "@tanstack/react-query";
import {registerApi}  from "../../api/auth/auth.api";
const useRegister = () => {
  return useMutation({
    mutationFn: registerApi,
  });
};

export default useRegister