// useGetWorkspaces.js
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { fetchData } from "../../api/axios";
import { setWorkspaces } from "../../../store/auth/workspaceSlice";

const useGetWorkspaces = () => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const workspaces = await fetchData("/workspaces");
      dispatch(setWorkspaces(workspaces)); // Keep Redux in sync if needed
      return workspaces;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export default useGetWorkspaces;