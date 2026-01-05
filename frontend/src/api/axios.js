import axios from "axios";
import { getToken } from "../utils/tokenStorage";

const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

  
api.interceptors.request.use((response) => response ,(error) => {
  const token = getToken();

  if (error.response && error.response.status === 401) {
    window.dispatchEvent(new Event('force-logou'))
  }

  return Promise.reject(error);
});

const postData = async (path,data) => {
  const response = await api.post(path,data);
  return response.data;
}
const fetchData = async (path) => {
  const response = await api.post(path);
  return response.data;
}
const updateData = async (path,data) => {
  const response = await api.post(path,data);
  return response.data;
}
const deleteData = async (path) => {
  const response = await api.post(path);
  return response.data;
}

export {fetchData,postData,deleteData,updateData}
export default api;
  