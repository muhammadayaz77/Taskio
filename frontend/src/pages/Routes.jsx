import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Login from '../components/Auth/Login'
import Signup from '../components/Auth/Signup'
import { ScrollToTop } from '../components/common/ScrollToTop'
import AppLayout from '../layout/AppLayout'
// import Admin from './Admin/Index.jsx'
// import ProtectedRoutes from '../ProtectedRoutes/ProtectedRoutes.jsx'

 function Index() {
  return (
    <>
    <ScrollToTop />
    <Routes>
    <Route element={<AppLayout />}>
      <Route path="/" element={<>Dasboard</>} />
    </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      {/* <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/chat/*" element={<Chat />} />
      <Route path="/auth/*" element={<Auth />} /> */}

      {/* <Route path="/admin/*" element={<ProtectedRoutes><Admin /></ProtectedRoutes>} /> */}
    </Routes>  

    </>
  )
}

export default Index