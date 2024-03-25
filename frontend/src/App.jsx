import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

//components:
import Login from './components/pages/Auth/Login'
import Register from './components/pages/Auth/Register'
import Home from './components/pages/Home'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Container from './components/layout/Container'
import Message from './components/layout/Message'
import Profile from './components/pages/User/Profile'
import AddPet from './components/pages/Pet/AddPet'
import MyPets from './components/pages/Pet/MyPets'
import EditPet from './components/pages/Pet/EditPet'

import { UserProvider } from './context/UserContext'


function App() {
 return (
    
    <Router>

      <UserProvider>

      <Navbar></Navbar>

      <Message></Message>

      <Container>

        <Routes>
          
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/' element={<Home />} />
          <Route path='/user/profile' element={<Profile />} />
          <Route path='/pet/mypets' element={<MyPets />} />
          <Route path='/pet/add' element={<AddPet />} />
          <Route path='/pet/edit/:id' element={<EditPet />} />
          
        </Routes>

      </Container>
      
      <Footer></Footer>

      </UserProvider>

    </Router>
 )
}

export default App

