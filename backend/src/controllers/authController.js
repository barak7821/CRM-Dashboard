import User from "../models/userModel.js"
import { hashPassword, checkPassword } from "../utils/passwordUtils.js"
import jwt from "jsonwebtoken"
import axios from "axios"
import { sendOtpEmail } from "../utils/sendOtpEmail.js"

// Controller for user login
export const login = async (req, res) => {
    const { email, password } = req.body
    try {
        // Check if both email and password are provided
        if (!email || !password) return res.status(400).json({ error: "Email and password are required." })

        // Check if the email is already registered
        const userData = await User.findOne({ email: email.toLowerCase() })
        if (!userData) return res.status(401).json({ message: "Invalid email or password. Please try again." })

        // Check if the password is correct
        const isPasswordCorrect = await checkPassword(password, userData.password)
        if (!isPasswordCorrect) return res.status(401).json({ message: "Invalid email or password. Please try again." })

        // Ensure JWT_SECRET is defined in the environment variables
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined")
        }

        // Create a JWT token for the user
        const token = jwt.sign({ id: userData._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

        console.log("Login successful.")
        res.status(200).json({ message: "Login successful.", token, exist: true })
    } catch (error) {
        console.error("Error in login controller", error.message)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

// Controller for user registration
export const register = async (req, res) => {
    const { userName, name, email, password } = req.body
    try {
        // Check if all fields are provided
        if (!userName || !name || !email || !password) return res.status(400).json({ message: "All fields are required" })

        // Check if the password length is valid
        if (password.length < 8 || password.length > 20) return res.status(400).json({ message: "Password should be between 8 and 20 characters" })

        // Check if the email is already registered
        const userData = await User.findOne({ email: email.toLowerCase() })
        if (userData) return res.status(409).json({ message: "Email already exists" })

        // Hash the password before saving the user
        const hashedPassword = await hashPassword(password)

        const newUser = new User({
            userName,
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            provider: "local"
        })

        await newUser.save()

        // Create a JWT token for the user
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

        console.log(`${userName} added successfully`)
        res.status(201).json({ message: `${userName} added successfully`, token, exist: true })
    } catch (error) {
        console.error("Error in register controller", error.message)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

// Controller to check if the user is authenticated based on the JWT token
export const checkUser = (req, res) => {
    res.status(200).json({ exist: true })
}

// Controller to login with Google
export const googleLogin = async (req, res) => {
    const { token } = req.body

    try {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined")
        }

        const { data } = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${token}` }
        })

        const { email, name } = data

        let user = await User.findOne({ email })

        if (!user) {
            user = await User.create({
                userName: email,
                email,
                name,
                provider: "google"
            })
        }

        // Create a JWT token for the user
        const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

        res.status(200).json({ token: jwtToken, exist: true })
    } catch (error) {
        console.error("Error in googleLogin controller", error.message)
        if (error.message === "JWT_SECRET is not defined") {
            return res.status(500).json({ message: "Internal Server Error" })
        }
        res.status(400).json({ message: "Invalid token" })
    }
}

// Controller to send OTP
export const requestReset = async (req, res) => {
    const { email } = req.body

    // Check if email is provided
    if (!email) return res.status(400).json({ message: "Email is required" })

    try {
        // Find the user by email
        const user = await User.findOne({ email: email.toLowerCase() })

        // If user doesn't exist, return error
        if (!user) return res.status(404).json({ message: "User not found" })

        // If the user registered via Google (OAuth), they don't have a password set – cannot reset password
        if (!user.password) {
            return res.status(400).json({ code: "reg_google", message: "Cannot reset password for accounts registered with Google" })
        }

        // Generate a 6-digit random OTP code
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString()

        // Set OTP expiration time to 5 minutes from now
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000)

        user.otpCode = otpCode
        user.otpExpiresAt = expiresAt
        await user.save()

        await sendOtpEmail(user.email, otpCode)

        res.status(200).json({ message: "OTP sent to email" })
    } catch (error) {
        console.error("Error in requestReset:", error.message)
        res.status(500).json({ message: "Something went wrong" })
    }
}

// Controller to verify OTP
export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body

    // Check if all required fields are provided
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" })

    try {
        // Find the user by email
        const user = await User.findOne({ email: email.toLowerCase() })

        // Check if user exists and has a valid OTP and expiration
        if (!user || !user.otpCode || !user.otpExpiresAt)
            return res.status(400).json({ message: "Invalid or expired code" })

        // Validate OTP code and expiration time
        const isValid = user.otpCode === otp && user.otpExpiresAt > new Date()
        if (!isValid) return res.status(400).json({ message: "Invalid or expired code" })

        res.status(200).json({ message: "OTP verified" })
    } catch (error) {
        console.error("Error in verifyOtp:", error.message)
        res.status(500).json({ message: "Something went wrong" })
    }
}

// Controller to reset password
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body

    // Check if all required fields are provided
    if (!email || !otp || !newPassword)
        return res.status(400).json({ message: "Email, OTP and new password are required" })

    try {
        // Find the user by email
        const user = await User.findOne({ email: email.toLowerCase() })

        // Check if user exists and has a valid OTP and expiration
        if (!user || !user.otpCode || !user.otpExpiresAt) return res.status(400).json({ message: "Invalid or expired code" })

        // Validate OTP code and expiration time
        const isValid = user.otpCode === otp && user.otpExpiresAt > new Date()
        if (!isValid) return res.status(400).json({ message: "Invalid or expired code" })

        // Validate password length
        if (newPassword.length < 8 || newPassword.length > 20)
            return res.status(400).json({ message: "Password must be 8-20 characters" })

        // Check if the new password is the same as the current one
        const isPasswordCorrect = await checkPassword(newPassword, user.password)

        // If passwords match, reject the request
        if (isPasswordCorrect) {
            return res.status(401).json({ message: "New password cannot be the same as the current password" })
        }

        // Hash the new password
        const hashedPassword = await hashPassword(newPassword)

        user.password = hashedPassword
        user.otpCode = null
        user.otpExpiresAt = null
        await user.save()

        res.status(200).json({ message: "Password reset successful" })
    } catch (error) {
        console.error("Error in resetPassword:", error.message)
        res.status(500).json({ message: "Something went wrong" })
    }
}