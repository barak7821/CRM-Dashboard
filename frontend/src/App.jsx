import { Routes, Route } from 'react-router-dom'
import Main from './pages/Main'
import Login from './pages/Login'
import Register from './pages/Register'
import EditUser from './components/EditUser'
import NotFound from './pages/NotFound'
import ProtectedRoute from './utils/ProtectedRoute.jsx'
import PasswordReset from './pages/PasswordReset.jsx'

function App() {
  return (
    <Routes>
      <Route index element={< Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset" element={< PasswordReset />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/main" element={<ProtectedRoute>< Main /></ProtectedRoute>} />
      <Route path="/edit-user/:userId" element={<ProtectedRoute><EditUser /></ProtectedRoute>} />
    </Routes>
  )
}

export default App
