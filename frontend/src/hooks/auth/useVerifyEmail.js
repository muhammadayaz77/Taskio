import { useMutation } from "@tanstack/react-query";
import { postData } from "../../api/axios";
import { useNavigate } from "react-router-dom";
const useVerifyEmail = () => {
  const navigate = useNavigate()
  return useMutation({
    mutationFn: (data) => postData('/auth/verify-email',data),
    onSuccess : (data) => {
      // window.toastify(data.message,'success');
      console.log("data : ",data);
      // navigate("/login");
    },
    onError : (err) => {
      console.log('error : ',err)
      window.toastify(err?.response?.data?.message || 'error occured','error')
    }
  });
};

export default useVerifyEmail