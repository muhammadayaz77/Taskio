import { useQuery } from "@tanstack/react-query";
import api from "../../api/axios";

/**
 * @param {string | null} token from URL (?token=)
 */
export function useWorkspaceInvitePreview(token) {
  return useQuery({
    queryKey: ["workspace-invite-preview", token],
    enabled: Boolean(token),
    queryFn: async () => {
      const response = await api.get("/workspaces/invitations/preview", {
        params: { token },
      });
      return response.data;
    },
    retry: false,
  });
}

export default useWorkspaceInvitePreview;
