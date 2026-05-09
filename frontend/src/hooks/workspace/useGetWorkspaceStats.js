// useGetWorkspaces.js
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { fetchData } from "../../api/axios";
import { setWorkspaces } from "../../../store/auth/workspaceSlice";

const useGetWorkspaceStats = (workspaceId, options = {}) => {
  const { enabled = true } = options;

  return useQuery({
    queryKey: ["workspace", workspaceId, "stats"],
    queryFn: async () => fetchData(`/workspaces/${workspaceId}/stats`),
    enabled: Boolean(workspaceId) && enabled,
  });
};

export default useGetWorkspaceStats;