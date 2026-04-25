// useGetWorkspaces.js
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { fetchData } from "../../api/axios";
import { setProjects } from "../../../store/project/projectSlice";
// import { setWorkspaces } from "../../../store/auth/workspaceSlice";

const useGetWorkspacesById = (workspaceId) => {

  return useQuery({
    queryKey: ["workspace",workspaceId,"details"],
    queryFn: async () => {
      const data = await fetchData(`/workspaces/${workspaceId}`);
      console.log("workspace projects : ",data.project)
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export default useGetWorkspacesById;