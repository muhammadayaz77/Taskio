import { useMutation } from "@tanstack/react-query";
import { postData } from "../../api/axios";
import { useNavigate, useLocation } from "react-router-dom";
const useRegister = () => {
  const navigate = useNavigate()
  const location = useLocation()
  return useMutation({
    mutationFn: (data) => postData('/auth/register',data),
    onSuccess : (data) => {
      window.toastify(data.message,'success');
      console.log("data : ",data);
      navigate("/sign-in", { state: location.state ?? undefined });
      
    },
    onError : (err) => {
      console.log('error : ',err)
      window.toastify(err?.response?.data?.message || 'error occured','error')
    }
  });
};

export default useRegister