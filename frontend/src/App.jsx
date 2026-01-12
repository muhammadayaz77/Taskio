import Routes from './pages/Routes'
import React from 'react'
import { useSelector } from 'react-redux'

import './config/Global'

import 'react-toastify/dist/ReactToastify.css'
import Toast from './components/Toast/Toast';
import { Navigate } from 'react-router-dom'

const App = () => {
  
  return (
  <>
  <Toast />
  <Routes />
  </>
  )
}

export default App