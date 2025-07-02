import { Routes, Route } from 'react-router-dom'
import Navbar from './components/nav/Navbar'
import Home from './components/content/home/home'
import Profile from './components/content/profile/Profile'
import Signup from './components/content/auth/signup/Signup'

const App = () => {

  return (
    <div >

      <Navbar />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element />
        <Route path='/messages' element />
      </Routes>
    </div>
  )
}

export default App
