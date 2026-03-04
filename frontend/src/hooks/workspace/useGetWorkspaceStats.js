// useGetWorkspaces.js
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { fetchData } from "../../api/axios";
import { setWorkspaces } from "../../../store/auth/workspaceSlice";

const useGetWorkspaceStats = (workspaceId) => {

  return useQuery({
    queryKey: ["workspace",workspaceId,'stats'],
    queryFn: async () => fetchData(`/workspaces/${workspaceId}/stats`)
  });
};

export default useGetWorkspaceStats;