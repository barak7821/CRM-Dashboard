import React from 'react'
import { useAuth } from './AuthContext'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth()

    if (isAuthenticated === null) {
        return <div>Loading...</div>
    }

    if (!isAuthenticated) {
        localStorage.removeItem("token")
        return <Navigate to="/" />
    }

    return (
        <>
            {children}
        </>
    )
}