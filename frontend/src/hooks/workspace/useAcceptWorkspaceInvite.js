import { useMutation } from "@tanstack/react-query";
import { postData } from "../../api/axios";

export function useAcceptWorkspaceInvite() {
  return useMutation({
    mutationFn: (payload) =>
      postData("/workspaces/invitations/accept", payload),
  });
}

export default useAcceptWorkspaceInvite;
