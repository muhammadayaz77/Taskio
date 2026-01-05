import { useMutation } from "@tanstack/react-query";
import { postData } from "../../api/axios";
const useRegister = () => {
  return useMutation({
    mutationFn: (data) => postData('/auth/register',data),
    onSuccess : (data) => {
      console.log("data : ",data)
    },
    onError : (err) => {
      console.log('error : ',err)
    }
  });
};

export default useRegister