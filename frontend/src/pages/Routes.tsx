import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Home from './Home/Index'
import Dashboard from './Dashboard/Index'
import Chat from './Chat/Index'
import Auth from './Auth/Index'
// import Admin from './Admin/Index.jsx'
// import ProtectedRoutes from '../ProtectedRoutes/ProtectedRoutes.jsx'

 function Index() {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/*" element={<Home />} />
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/chat/*" element={<Chat />} />
      <Route path="/auth/*" element={<Auth />} />

      {/* <Route path="/admin/*" element={<ProtectedRoutes><Admin /></ProtectedRoutes>} /> */}
    </Routes>   
    </BrowserRouter>

    </>
  )
}

export default Index