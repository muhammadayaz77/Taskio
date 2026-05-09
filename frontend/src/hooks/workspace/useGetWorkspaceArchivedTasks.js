import { useQuery } from "@tanstack/react-query";
import { fetchData } from "../../api/axios";

/**
 * @param {string|null|undefined} workspaceId
 * @param {{ enabled?: boolean }} [options] — set enabled false when the user is not a member of that workspace (client guard).
 */
const useGetWorkspaceArchivedTasks = (workspaceId, options = {}) => {
  const { enabled = true } = options;
  return useQuery({
    queryKey: ["workspace", workspaceId, "archived-tasks"],
    queryFn: () => fetchData(`/workspaces/${workspaceId}/archived-tasks`),
    enabled: Boolean(workspaceId) && enabled,
  });
};

export default useGetWorkspaceArchivedTasks;
