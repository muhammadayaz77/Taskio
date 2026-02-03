// useGetWorkspaces.js
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { fetchData } from "../../api/axios";
// import { setWorkspaces } from "../../../store/auth/workspaceSlice";

const useGetWorkspacesById = (workspaceId) => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ["workspace",workspaceId],
    queryFn: async () => {
      const workspaces = await fetchData(`/workspace/${workspaceId}`);
      // dispatch(setWorkspaces(workspaces)); // Keep Redux in sync if needed
      return workspaces;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export default useGetWorkspacesById;