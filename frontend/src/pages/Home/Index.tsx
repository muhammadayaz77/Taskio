import Navbar from '../../components/shared/Navbar'
import Home from './Home'
import { Routes, Route } from 'react-router-dom'

function Index() {
  return (
    <div className='flex flex-col lg:h-screen overflow-hidden'>
    <Navbar />
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path="/*" element={<>No Page Found</>} />
    </Routes>
    </div>
  )
}

export default Index