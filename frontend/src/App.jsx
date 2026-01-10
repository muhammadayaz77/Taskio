import Routes from './pages/Routes'
import React from 'react'
import { useSelector } from 'react-redux'

import './config/Global'

import 'react-toastify/dist/ReactToastify.css'
import Toast from './components/Toast/Toast';
import { Navigate } from 'react-router-dom'

const App = () => {
  const {isLoading,isAuthenticated} = useSelector(store => store.auth)

  if(isLoading){
    return <>Loading...</>
  }
  if(isAuthenticated){
    // return <Navigate to='/dashbard' />
  }
  
  return (
  <>
  <Toast />
  <Routes />
  </>
  )
}

export default App