import { useMutation } from "@tanstack/react-query";
import { postData } from "../../api/axios";
import { useNavigate } from "react-router-dom";
const useRegister = () => {
  const navigate = useNavigate()
  return useMutation({
    mutationFn: (data) => postData('/auth/register',data),
    onSuccess : (data) => {
      window.toastify(data.message,'success');
      console.log("data : ",data);
      navigate("/sign-in");
      
    },
    onError : (err) => {
      console.log('error : ',err)
      window.toastify(err?.response?.data?.message || 'error occured','error')
    }
  });
};

export default useRegister