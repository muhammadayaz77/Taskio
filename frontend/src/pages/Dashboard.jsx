import React from 'react'
import { Button } from '../components/ui/button'
import { useDispatch } from 'react-redux'
import { logout } from '../../store/auth/authSlice'

function Dashboard() {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout())
  }
  return (
    <div>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  )
}

export default Dashboard