import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Login from '../components/Auth/Login'
import Signup from '../components/Auth/Signup'
import { ScrollToTop } from '../components/common/ScrollToTop'
import AppLayout from '../layout/AppLayout'
import VerifyEmail from '../components/Auth/VerifyEmail'
import AuthProvider from '../providers/AuthProviders'
import Dashboard from './Dashboard'
// import Admin from './Admin/Index.jsx'
// import ProtectedRoutes from '../ProtectedRoutes/ProtectedRoutes.jsx'

 function Index() {
  return (
    <>
    <ScrollToTop />
    
    <AuthProvider>
    <Routes>

    <Route element={<AppLayout />}>
      <Route path="/" element={<>Dasboard</>} />
    </Route>
      <Route path="/sign-in" element={<Login />} />
      <Route path="/sign-up" element={<Signup />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />
      <Route path="/ayaz" element={<>Ayaz</>} />

      <Route path="/dashboard" element={<Dashboard />} />
    {/* <Route element={<ProtectedRoute />}> */}
    {/* <Route element={<ProtectedRoute />}> */}
{/* </Route> */}

      {/* <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/chat/*" element={<Chat />} />
      <Route path="/auth/*" element={<Auth />} /> */}

      {/* <Route path="/admin/*" element={<ProtectedRoutes><Admin /></ProtectedRoutes>} /> */}
      {/* </Route> */}
    </Routes>  
      </AuthProvider> 

    </>
  )
}

export default Index