import api from "../axios";

/* POST – Register */
export const registerApi = async (data) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};