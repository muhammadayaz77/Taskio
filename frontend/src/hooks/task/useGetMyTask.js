import { useQuery } from "@tanstack/react-query";
import { fetchData } from "../../api/axios";

const useGetMyTask = () => {
  return useQuery({
    queryKey: ['my-tasks', 'user'],
    queryFn: async () => {
      const data = await fetchData('/tasks/my-tasks');
      console.log('data: use get task', data);
      return data;
    }
  });
};
export default useGetMyTask