import { useMutation } from "@tanstack/react-query";
import { patchData } from "../../api/axios";

export function useChangePassword() {
  return useMutation({
    mutationFn: (body) => patchData("/auth/password", body),
  });
}
