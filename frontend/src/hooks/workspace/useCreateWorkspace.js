import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { postData } from "../../api/axios";
import { useNavigate } from "react-router-dom";

export const useCreateWorkspace = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data) => postData("/workspaces", data),
    onSuccess: (data) => {
      
      window.toastify(
        data?.message || "Workspace created successfully",
        "success"
      );
      navigate(`/workspaces/${data.workspace._id}`)
    },
    onError: (err) => {
      window.toastify(
        err?.response?.data?.message || "Workspace create failed",
        "error"
      );
    },
  });
};
