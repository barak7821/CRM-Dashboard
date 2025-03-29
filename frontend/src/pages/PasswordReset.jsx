import { useState } from "react"
import ForgotPassword from "../components/ForgotPassword"
import VerifyOtp from "../components/VerifyOtp"
import ResetPassword from "../components/ResetPassword"

export default function PasswordReset() {
    const [step, setStep] = useState("email")
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")

    return (
        <div className='bg-gray-200 min-h-screen flex flex-col'>
            {step === "email" && <ForgotPassword onNext={(e) => {
                setEmail(e)
                setStep("otp")
            }} />}

            {step === "otp" && <VerifyOtp email={email} onNext={(o) => {
                setOtp(o)
                setStep("reset")
            }} />}

            {step === "reset" && <ResetPassword email={email} otp={otp} />}
        </div>
    )
}
