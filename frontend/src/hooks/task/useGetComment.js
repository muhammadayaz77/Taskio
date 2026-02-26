import { useQuery } from "@tanstack/react-query";
import { fetchData } from "../../api/axios";

const useGetComment = (taskId) => {
  return useQuery({
    queryKey : ['comment',taskId],

    queryFn: (data) => fetchData(`/tasks/${taskId}/comments`,data),
    onSuccess : (data) => {
      window.toastify(data.message,'success');
    },
    onError : (err) => {
      console.log('error : ',err)
      window.toastify(err?.response?.data?.message || 'error occured','error')
    }
  });
};

export default useGetComment