import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postData } from "../../api/axios";
import { useNavigate } from "react-router-dom";
const useCreateProject = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => postData(`/projects/${data.workspaceId}/create-project`,data),
    onSuccess : (data) => {
      window.toastify(data.message,'success');
    },
    onError : (err) => {
      console.log('error : ',err)
      window.toastify(err?.response?.data?.message || 'error occured','error')
    }
  });
};

export default useCreateProject