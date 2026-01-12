import React from 'react'
import { Button } from '../components/ui/button'
import { useDispatch } from 'react-redux'
import { logout } from '../../store/auth/authSlice'

function Dashboard() {
  const dispatch = useDispatch();
  return (
    <div>
      <Button onclick={dispatch(logout())}>Logout</Button>
    </div>
  )
}

export default Dashboard