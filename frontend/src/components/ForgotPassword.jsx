import { useState } from "react"
import axios from "axios"
import SideBar from "../components/SideBar"
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import { Link } from 'react-router-dom';
import image from "../assets/test.png"

export default function ForgotPassword({ onNext }) {
    const notyf = new Notyf({ position: { x: 'center', y: 'top' } })
    const [email, setEmail] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Check if all fields are filled
        if (!email) return notyf.error("Email is required. Please fill it in.")

        // Check if email is valid
        if (!email.includes("@")) return notyf.error("Please enter a valid email address.")

        try {
            const response = await axios.post(`http://localhost:${import.meta.env.VITE_PORT}/api/auth/request-reset`, { email })
            console.log(response.data)
            notyf.success("Code sent to your email.")
            onNext(email)
        } catch (error) {
            console.error("Error while requesting password reset:", error)
            if (error?.response?.status === 400 && error.response.data?.code === "reg_google") return notyf.error("It looks like this account was created with Google. To sign in, please continue with Google.")
            notyf.error("Something went wrong. Please try again later.")
        }
    }

    return (
        <>
            <SideBar />
            <div className='flex flex-grow items-center justify-center'>
                <div className='bg-gray-100 flex flex-row rounded-2xl shadow-lg max-w-4xl p-5 items-center'>

                    {/* form section */}
                    <div className='md:w-1/2 px-16'>
                        <h2 className='text-2xl font-bold text-blue-900'>Reset Password</h2>
                        <p className='text-sm mt-4 text-blue-900'>Enter your email and we’ll send you an OTP</p>

                        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                            <input type="email" placeholder="Enter your email" className="p-2 mt-4 rounded-xl bg-white" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            <button type="submit" className="bg-blue-900 rounded-xl text-white py-2 w-full mt-5 cursor-pointer hover:scale-105 active:scale-95 duration-300" >Send OTP</button>
                        </form>

                        <div className='mt-5 text-sm flex justify-between items-center'>
                            <p>Back to login?</p>
                            <Link to="/" className='py-2 px-5 bg-white rounded-xl cursor-pointer hover:scale-110 active:scale-95 duration-300'>Login</Link>
                        </div>
                    </div>

                    {/* image section */}
                    <div className='w-1/2 md:block hidden'>
                        <img className='rounded-2xl max-w-full' src={image} />
                    </div>
                </div>
            </div>
        </>

    )
}
