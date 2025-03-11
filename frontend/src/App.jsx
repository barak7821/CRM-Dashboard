import { Routes, Route } from 'react-router-dom'
import './App.css'
import Main from './pages/Main'
import Login from './pages/Login'
import Register from './pages/Register'
import EditUser from './components/EditUser'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route index element={<Main />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/edit-user/:userId" element={<EditUser />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
