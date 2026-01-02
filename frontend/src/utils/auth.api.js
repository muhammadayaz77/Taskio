import api from "./axios";

/* POST – Login */
export const loginApi = async (data) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

/* POST – Register */
export const registerApi = async (data) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

/* GET – Profile */
export const getProfileApi = async () => {
  const res = await api.get("/auth/profile");
  return res.data;
};

/* PUT – Update Profile */
export const updateProfileApi = async (data) => {
  const res = await api.put("/auth/profile", data);
  return res.data;
};
