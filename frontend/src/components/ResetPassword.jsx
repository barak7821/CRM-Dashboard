import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import image from "../assets/test.png"
import { initTheme } from "../utils/DarkMode"

export default function ResetPassword({ email, otp }) {
    const nav = useNavigate()
    const notyf = new Notyf({ position: { x: "center", y: "top" } })
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    // Set theme mode
    initTheme()

    // This is the base URL for the API.
    const baseApiUrl = `${import.meta.env.VITE_BACKEND_URL}/api`

    // This handles the form submission.
    const handleReset = async (e) => {
        e.preventDefault()

        // Checking if password is valid
        if (newPassword.length < 8 || newPassword.length > 20) return notyf.error("Your password must be between 8 and 20 characters long.")

        // Check if passwords match
        if (newPassword !== confirmPassword) return notyf.error("The passwords do not match. Please try again.")

        try {
            const response = await axios.post(`${baseApiUrl}/auth/reset-password`, {
                email,
                otp,
                newPassword
            })
            console.log(response.data)
            notyf.success("Password has been reset successfully.")
            nav("/home")
        } catch (error) {
            console.error("Error resetting password:", error)
            if (error.response?.status === 401)
                return notyf.error("New password cannot be the same as the current password.")
            notyf.error("Something went wrong. Please try again later.")
        }
    }

    return (
        <div className='flex flex-grow lg:items-center justify-center'>
            <div className='lg:bg-gray-50 bg-gray-200 flex flex-row rounded-2xl lg:shadow-2xl max-w-4xl p-5 lg:items-center dark:lg:bg-zinc-800 dark:bg-neutral-900'>

                {/* form section */}
                <div className="md:w-1/2 px-16">
                    <h2 className="text-2xl font-bold text-blue-900 dark:text-white">Reset Your Password</h2>
                    <p className="text-sm mt-4 text-blue-900 dark:text-white">Enter your new password and confirm it</p>

                    <form onSubmit={handleReset} className="flex flex-col gap-4">
                        <input type="password" placeholder="New password" className="p-2 mt-4 rounded-xl bg-white border-1 border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white dark:focus:ring-gray-300" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                        <input type="password" placeholder="Confirm new password" className="p-2 mt-4 rounded-xl bg-white border-1 border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white dark:focus:ring-gray-300" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                        <button type="submit" className="bg-purple-600 text-white py-2 rounded-xl w-full mt-2 hover:scale-105 active:scale-95 duration-300 dark:bg-purple-900">Reset Password</button>
                    </form>
                </div>

                {/* image section */}
                <div className="w-1/2 md:block hidden">
                    <img className="rounded-2xl max-w-full" src={image} alt="reset" />
                </div>
            </div>
        </div>
    )
}