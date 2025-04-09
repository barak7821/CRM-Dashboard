import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null)
    const [isAdmin, setIsAdmin] = useState(null)

    // This is the base URL for the API.
    const baseApiUrl = `${import.meta.env.VITE_BACKEND_URL}/api`

    // Get token from local storage
    const token = localStorage.getItem("token")

    useEffect(() => {

        // Check if the user is authenticated
        const checkAuth = async () => {
            const token = localStorage.getItem("token")

            if (!token) {
                setIsAuthenticated(false)
                return
            }

            try {
                const response = await axios.get(`${baseApiUrl}/auth/`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setIsAuthenticated(response.data.exist)
            } catch (error) {
                console.error("Error in checkAuth:", error)
                setIsAuthenticated(false)
                return
            }

            // If the user is authenticated, check if they are an admin
            try {
                // Checking if token exists in local storage
                const token = localStorage.getItem("token")
                if (!token) return

                const { data } = await axios.get(`${baseApiUrl}/admin/check`, {
                    headers: { Authorization: `Bearer ${token}` }
                })

                setIsAdmin(data.isAdmin)
            } catch (error) {
                console.error("Failed to check admin status", error)
                setIsAdmin(false)
            }
        }

        checkAuth()
    }, [token])

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, isAdmin, setIsAdmin }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)