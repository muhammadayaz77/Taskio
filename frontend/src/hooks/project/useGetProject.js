import { useMutation, useQuery } from "@tanstack/react-query";
import { postData } from "../../api/axios";
const useGetProject = (projectId) => {
  return useQuery({
    queryKey : ['project',projectId],
    queryFn: (data) => postData(`/projects/${projectId}/tasks`,data),
    onSuccess : (data) => {
      window.toastify(data.message,'success');
    },
    onError : (err) => {
      console.log('error : ',err)
      window.toastify(err?.response?.data?.message || 'error occured','error')
    }
  });
};

export default useGetProject