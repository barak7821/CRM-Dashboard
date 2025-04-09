import { useState } from "react"
import axios from "axios"
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import image from "../assets/test.png"

export default function VerifyOtp({ email, onNext }) {
    const notyf = new Notyf({ position: { x: 'center', y: 'top' } })
    const [otp, setOtp] = useState("")

    // This is the base URL for the API.
    const baseApiUrl = `${import.meta.env.VITE_BACKEND_URL}/api`

    // This handles the form submission.
    const handleVerify = async (e) => {
        e.preventDefault()

        // Check if OTP field are filled
        if (!otp) return notyf.error("OTP is required. Please fill it in.")

        try {
            const response = await axios.post(`${baseApiUrl}/auth/verify-otp`,
                { email, otp }
            )
            console.log(response.data)
            notyf.success("Code verified successfully.")
            onNext(otp)
        } catch (error) {
            console.error("Error verifying code:", error)
            notyf.error("Invalid or expired code. Please try again.")
        }
    }

    return (
        <div className='flex flex-grow lg:items-center justify-center'>
            <div className='lg:bg-gray-50 bg-gray-200 flex flex-row rounded-2xl lg:shadow-2xl max-w-4xl p-5 lg:items-center dark:lg:bg-zinc-800 dark:bg-neutral-900'>

                {/* form section */}
                <div className="md:w-1/2 px-16">
                    <h2 className="text-2xl font-bold text-blue-900 dark:text-white">Verify Code</h2>
                    <p className="text-sm mt-4 text-blue-900 dark:text-white"> Enter the 6-digit code we sent to your email</p>

                    <form onSubmit={handleVerify} className="flex flex-col gap-4">
                        <input type="text" placeholder="Enter code" className="p-2 mt-4 rounded-xl bg-white border-1 border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:bg-zinc-800 dark:border-zinc-600 dark:text-white dark:focus:ring-gray-300" value={otp} onChange={(e) => setOtp(e.target.value)} required />
                        <button type="submit" className="bg-green-600 text-white py-2 rounded-xl w-full mt-2 hover:scale-105 active:scale-95 duration-300 dark:bg-green-800">Verify</button>
                    </form>
                </div>

                {/* image section */}
                <div className="w-1/2 md:block hidden">
                    <img className="rounded-2xl max-w-full" src={image} alt="verify" />
                </div>
            </div>
        </div>
    )
}