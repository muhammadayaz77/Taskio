import { useQuery } from "@tanstack/react-query";
import { fetchData } from "../../api/axios";

const useGetActivity = (taskId) => {
  return useQuery({
    queryKey : ['activity',taskId],

    queryFn: (data) => fetchData(`/tasks/${taskId}/activity`,data),
    onSuccess : (data) => {
      window.toastify(data.message,'success');
    },
    onError : (err) => {
      console.log('error : ',err)
      window.toastify(err?.response?.data?.message || 'error occured','error')
    }
  });
};

export default useGetActivity