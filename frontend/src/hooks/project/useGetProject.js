import { useQuery } from "@tanstack/react-query";
import { fetchData } from "../../api/axios";

const useGetProject = (projectId) => {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: () => fetchData(`/projects/${projectId}/tasks`),
    enabled: Boolean(projectId),
  });
};

export default useGetProject;
