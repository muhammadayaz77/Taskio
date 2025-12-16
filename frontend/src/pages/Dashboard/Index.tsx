import { Route, Routes } from 'react-router-dom'
import Dashboard from './Dashboard'
import Navbar from '../../components/shared/Navbar'

function Index() {
  return (
    <div className='flex flex-col h-screen max-w-screen-2xl mx-auto'>
    <Navbar />
    <Routes>
      <Route path='/' element={<Dashboard />} />
    </Routes>
    </div>
  )
}

export default Index