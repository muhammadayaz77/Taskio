import { Route, Routes } from 'react-router-dom'
import Signin from './Signin'
import Signup from './Signup'
import Navbar from '../../components/shared/Navbar'
function Index() {  

  return (
    <div>
      <Navbar />  
        <div className='h-[100vh] flex items-center justify-center'>
      <Routes>
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/sign-up" element={<Signup />} />
       
      <Route path="/*" element={<>No Page Found</>} />
      </Routes>
        </div>
    </div>
  )
}

export default Index