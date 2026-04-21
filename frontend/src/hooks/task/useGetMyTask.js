import { useQuery } from "@tanstack/react-query";
import { fetchData } from "../../api/axios";

const useGetMyTask = (taskId) => {
  return useQuery({
    queryKey : ['my-tasks','user'],
    queryFn: (data) => fetchData(`/tasks/my-tasks`),
    onSuccess : (data) => {
      window.toastify(data.message,'success');
    },
    onError : (err) => {
      console.log('error : ',err)
      window.toastify(err?.response?.data?.message || 'error occured','error')
    }
  });
};

export default useGetMyTask