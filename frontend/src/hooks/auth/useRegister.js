import { useMutation } from "@tanstack/react-query";
import { postData } from "../../api/axios";
const useRegister = () => {
  return useMutation({
    mutationFn: (data) => postData('/auth/register',data),
    onSuccess : (data) => {
      window.toastify(data.message,'success')
      console.log("data : ",data)
    },
    onError : (err) => {
      console.log('error : ',err)
      window.toastify(err?.response?.data?.message || 'error occured','error')

    }
  });
};

export default useRegister