// import api from "../axios";
import axios from "axios";

export const registerApi = async (payload) => {
  try {
    
    console.log("auth.api data : ",payload.fullName)
    const response = await axios.post(
      "http://localhost:3000/api/v1/auth/register",
      payload,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  
  console.log('res : ',response.data)
  return response.data;
} catch (error) {
  console.log(error)
}
};
