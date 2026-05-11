import { useQuery } from "@tanstack/react-query";
import { fetchData } from "../../api/axios";

/** GET /workspaces/:id — members + workspace fields for settings UI */
export function useWorkspaceForSettings(workspaceId) {
  return useQuery({
    queryKey: ["workspace", workspaceId, "settings"],
    queryFn: () => fetchData(`/workspaces/${workspaceId}`),
    enabled: Boolean(workspaceId),
    staleTime: 30 * 1000,
  });
}
