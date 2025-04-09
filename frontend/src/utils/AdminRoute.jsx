import React from 'react'
import { useAuth } from './AuthContext'
import { Navigate } from 'react-router-dom'
import Loading from '../components/Loading'

export default function AdminRoute({ children }) {
    const { isAuthenticated, isAdmin, loading } = useAuth()

    if (loading || isAuthenticated === null) {
        return <Loading />
    }

    if (!isAuthenticated) {
        localStorage.removeItem("token")
        return <Navigate to="/" />
    }

    if (!isAdmin) {
        return <Navigate to="/home" />
    }

    return (
        <>
            {children}
        </>
    )
}
