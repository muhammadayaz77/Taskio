import axios from "axios";
import { getToken } from "../utils/tokenStorage";

const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: false,
});

/* ---------------- REQUEST INTERCEPTOR ---------------- */
api.interceptors.request.use(
  (config) => {
    const token = getToken();

    console.log("token : ",token)

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ---------------- RESPONSE INTERCEPTOR ---------------- */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.dispatchEvent(new Event("force-logout"));
    }
    return Promise.reject(error);
  }
);

/* ---------------- API HELPERS ---------------- */
const postData = async (path, data) => {
  const response = await api.post(path, data);
  return response.data;
};

const fetchData = async (path) => {
  const response = await api.get(path);
  return response.data;
};

const updateData = async (path, data) => {
  const response = await api.put(path, data);
  return response.data;
};

const deleteData = async (path) => {
  const response = await api.delete(path);
  return response.data;
};

export { fetchData, postData, deleteData, updateData };
export default api;
