import User from "../models/userModel.js"
import { hashPassword, checkPassword } from "../utils/passwordUtils.js"
import jwt from "jsonwebtoken"

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
        res.status(200).json({ message: "Login successful.", token })
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
            password: hashedPassword
        })

        await newUser.save()
        console.log(`${userName} added successfully`)
        res.status(201).json({ message: `${userName} added successfully` })
    } catch (error) {
        console.error("Error in register controller", error.message)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

// Controller to check if the user is authenticated based on the JWT token
export const checkUser = async (req, res) => {
    const authHeader = req.headers["authorization"]
    // Check if the authorization header exists
    if (!authHeader) return res.status(401).json({ exists: false })

    // Extract the token from the authorization header
    const token = authHeader.split(" ")[1]

    try {
        // Decode the token and verify it
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decode.id)
        console.log("User exists.")
        res.status(200).json({ exists: !!user })
    } catch (error) {
        res.status(401).json({ exists: false })
        console.error("Error in checkUser controller", error.message)
    }
}


