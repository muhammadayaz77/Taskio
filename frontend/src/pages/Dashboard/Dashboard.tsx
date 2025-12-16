import { useAuth } from "@clerk/clerk-react"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatList from "../../components/ChatList";
import DashboardPage from "../../components/DashboardPage";


function Dashboard() {
  let {userId,isLoaded} = useAuth();
  let navigate = useNavigate()
  useEffect(() => {
    if(isLoaded && !userId){
        navigate('/auth/sign-in')
    }
  },[isLoaded,userId,navigate])

  if(!isLoaded)
    return <h1>Loading...</h1>
  return (
    <div className="grid grid-cols-12 h-full">
      <div className="col-span-3">   
        <ChatList />
      </div>
      <div className="col-span-9 bg-[#12101b]">
        <DashboardPage />
      </div>
    </div>
  )
}

export default Dashboard

