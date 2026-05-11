import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Login from '../components/Auth/Login'
import Signup from '../components/Auth/Signup'
import { ScrollToTop } from '../components/common/ScrollToTop'
import AppLayout from '../layout/AppLayout'
import VerifyEmail from '../components/Auth/VerifyEmail'
import AuthProvider from '../providers/AuthProviders'
import Dashboard from './Dashboard'
import ForgotPassword from '../components/Auth/ForgotPassword'
import ResetPassword from '../components/Auth/ResetPassword'
import Workspaces from './WorkSpace'
import WorkspaceDetails from './WorkSpace/WorkspaceDetails'
import ProjectDetails from './Project/ProjectDetails'
import TaskDetails from './Task/TaskDetails'
import MyTasks from './Task/MyTasks'
import Archive from './Task/Archive'
import Members from './Members'
import WorkspaceInviteAccept from './WorkspaceInviteAccept'
import ProfileSettings from './ProfileSettings'
import WorkspaceSettings from './WorkSpace/WorkspaceSettings'
import WorkspaceChat from './WorkSpace/WorkspaceChat'

 function Index() {
  return (
    <>
    <ScrollToTop />
    
    <AuthProvider>
    <Routes>

    <Route path="/workspace-invite" element={<WorkspaceInviteAccept />} />

    <Route element={<AppLayout />}>
      <Route path="/workspaces" element={<Workspaces />} />
      <Route path="/settings" element={<ProfileSettings />} />
      <Route path="/workspaces/:workspaceId/settings" element={<WorkspaceSettings />} />
      <Route path="/workspaces/:workspaceId/chat" element={<WorkspaceChat />} />
      <Route path="/workspaces/:workspaceId" element={<WorkspaceDetails />} />
      <Route path="/workspaces/:workspaceId/projects/:projectId" element={<ProjectDetails />} />
      <Route path="/workspaces/:workspaceId/projects/:projectId/tasks/:taskId" element={<TaskDetails />} />
      <Route path="/my-tasks" element={<MyTasks />} />
      <Route path="/archive" element={<Archive />} />
      <Route path="/members" element={<Members />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/" element={<>Home</>} />
    </Route>
      <Route path="/sign-in" element={<Login />} />
      <Route path="/sign-up" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

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