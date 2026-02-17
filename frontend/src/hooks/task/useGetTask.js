import { useQuery } from "@tanstack/react-query";
import { fetchData } from "../../api/axios";

const useGetTask = (taskId) => {
  return useQuery({
    queryKey : ['task',taskId],

    queryFn: (data) => fetchData(`/tasks/${taskId}`,data),
    onSuccess : (data) => {
      window.toastify(data.message,'success');
    },
    onError : (err) => {
      console.log('error : ',err)
      window.toastify(err?.response?.data?.message || 'error occured','error')
    }
  });
};

export default useGetTask