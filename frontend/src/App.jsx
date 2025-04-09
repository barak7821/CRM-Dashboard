import { Routes, Route } from 'react-router-dom'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import EditUser from './pages/EditUser'
import NotFound from './pages/NotFound'
import ProtectedRoute from './utils/ProtectedRoute.jsx'
import PasswordReset from './pages/PasswordReset.jsx'
import Clients from './pages/Clients.jsx'
import EditClient from './pages/EditClient.jsx'
import Home from './pages/Home.jsx'
import Users from './pages/Users.jsx'
import AdminRoute from './utils/AdminRoute.jsx'

function App() {
  return (
    <Routes>
      <Route index element={< Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset" element={< PasswordReset />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/home" element={<ProtectedRoute>< Home /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute>< Profile /></ProtectedRoute>} />
      <Route path="/clients" element={<ProtectedRoute>< Clients /></ProtectedRoute>} />
      <Route path="/client/:clientId" element={<ProtectedRoute>< EditClient /></ProtectedRoute>} />
      <Route path="/users" element={<AdminRoute>< Users /></AdminRoute>} />
      <Route path="/edit-user/:userId" element={<AdminRoute><EditUser /></AdminRoute>} />
    </Routes>
  )
}

export default App
