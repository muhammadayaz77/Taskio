import { Route, Routes } from "react-router-dom"
import Chat from './Chat'
import Navbar from "../../components/shared/Navbar"


function Index() {
  return (
    <div className="flex flex-col h-screen max-w-screen-2xl mx-auto">
      <Navbar />
      <div className="flex-1 overflow-hidden">
        <Routes>
          <Route path="/:id" element={<Chat />} />
        </Routes>
      </div>
    </div>
  )
}


export default Index