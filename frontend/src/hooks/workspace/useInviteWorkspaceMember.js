import { useMutation } from "@tanstack/react-query";
import { postData } from "../../api/axios";

/**
 * @param {string} workspaceId
 */
export function useInviteWorkspaceMember(workspaceId) {
  return useMutation({
    mutationFn: (body) =>
      postData(`/workspaces/${workspaceId}/invitations`, body),
  });
}

export default useInviteWorkspaceMember;
