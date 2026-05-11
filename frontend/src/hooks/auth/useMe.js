import { useQuery } from "@tanstack/react-query";
import { fetchData } from "../../api/axios";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await fetchData("/auth/me");
      return res.user;
    },
  });
}
