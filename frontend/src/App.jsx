import Routes from './pages/Routes'
import React from 'react'

import './config/Global'

import 'react-toastify/dist/ReactToastify.css'
import Toast from './components/Toast/Toast';

const App = () => {
  return (
  <>
  <Toast />
  <Routes />
  </>
  )
}

export default App