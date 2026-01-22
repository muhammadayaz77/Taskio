import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { postData } from "../../api/axios";
import { useNavigate } from "react-router-dom";

export const useCreateWorkspace = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data) => postData("/workspaces", data),
    onSuccess: (data) => {
      console.log('data : ',data)
      

      window.toastify(
        data?.message || "You are logged in",
        "success"
      );
      navigate("/dashboard")
    },
    onError: (err) => {
      window.toastify(
        err?.response?.data?.message || "Login failed",
        "error"
      );
    },
  });
};
