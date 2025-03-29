import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import SideBar from "../components/SideBar"
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import image from "../assets/test.png"

export default function ResetPassword({ email, otp }) {
    const nav = useNavigate()
    const notyf = new Notyf({ position: { x: "center", y: "top" } })
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const handleReset = async (e) => {
        e.preventDefault()

        // Checking if password is valid
        if (newPassword.length < 8 || newPassword.length > 20) return notyf.error("Your password must be between 8 and 20 characters long.")

        // Check if passwords match
        if (newPassword !== confirmPassword) return notyf.error("The passwords do not match. Please try again.")

        try {
            const response = await axios.post(`http://localhost:${import.meta.env.VITE_PORT}/api/auth/reset-password`, {
                email,
                otp,
                newPassword
            })
            console.log(response.data)
            notyf.success("Password has been reset successfully.")
            nav("/main")
        } catch (error) {
            console.error("Error resetting password:", error)
            if (error.response?.status === 401)
                return notyf.error("New password cannot be the same as the current password.")
            notyf.error("Something went wrong. Please try again later.")
        }
    }

    return (
        <>
            <SideBar />
            <div className='flex flex-grow items-center justify-center'>
                <div className="bg-gray-100 flex flex-row rounded-2xl shadow-lg max-w-4xl p-5 items-center">

                    {/* form section */}
                    <div className="md:w-1/2 px-16">
                        <h2 className="text-2xl font-bold text-blue-900">Reset Your Password</h2>
                        <p className="text-sm mt-4 text-blue-900">Enter your new password and confirm it</p>

                        <form onSubmit={handleReset} className="flex flex-col gap-4">
                            <input type="password" placeholder="New password" className="p-2 mt-4 rounded-xl bg-white" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                            <input type="password" placeholder="Confirm new password" className="p-2 rounded-xl bg-white" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                            <button type="submit" className="bg-purple-600 text-white py-2 rounded-xl w-full mt-2 hover:scale-105 active:scale-95 duration-300">Reset Password</button>
                        </form>
                    </div>

                    {/* image section */}
                    <div className="w-1/2 md:block hidden">
                        <img className="rounded-2xl max-w-full" src={image} alt="reset" />
                    </div>
                </div>
            </div>
        </>
    )
}