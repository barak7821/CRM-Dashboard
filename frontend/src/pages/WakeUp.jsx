import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export default function WakeUp() {
    const nav = useNavigate()
    const notyf = new Notyf({ position: { x: 'center', y: 'top' } })

    // This is the base URL for the API.
    const baseApiUrl = `${import.meta.env.VITE_BACKEND_URL}/api`

    const pingServer = async () => {
        try {
            await axios.get(`${baseApiUrl}/ping`)
            nav("/login")
        } catch (error) {
            console.error("Error pinging server:", error)
            notyf.error("Server is not ready. Please wait...")

            // Retry after a delay if the server is not ready
            setTimeout(() => {
                pingServer()
            }, 5000) // Retry after 5 seconds
        }
    }

    useEffect(() => {
        pingServer()
    }, [])

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-200 dark:bg-neutral-900">

            <div className="text-center text-2xl m-10">
                <p>Waking up the server...</p>
                <p>Please wait a few seconds</p>
            </div>

            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-600 text-lg dark:text-white">Loading...</p>
            </div>
        </div>
    )
}
