import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchData } from "../../api/axios";
import { useDispatch } from "react-redux";
import { updateUser } from "../../../store/auth/authSlice";

export function useUpdateProfile() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body) => patchData("/auth/profile", body),
    onSuccess: (data) => {
      if (data?.user) dispatch(updateUser(data.user));
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
}
