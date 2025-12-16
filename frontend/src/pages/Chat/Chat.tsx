import ChatList from "../../components/ChatList"
import ChatPage from "../../components/ChatPage"


function Chat() {
  return (
    <div className="grid grid-cols-12 h-full overflow-hidden">
    <div className="col-span-3">   
      <ChatList />
    </div>
    <div className="col-span-9 bg-[#12101b] overflow-y-auto h-full">
      <ChatPage />
    </div>
  </div>
  )
}

export default Chat