import jwt from "jsonwebtoken"
import User from "../models/userModel.js"

// Middleware to authenticate the user via JWT token
const authMiddleware = async (req, res, next) => {

    // Retrieve the Authorization header
    const authHeader = req.header("Authorization")

    // If no Authorization header, return unauthorized error
    if (!authHeader) return res.status(401).json({ message: "Unauthorized" })

    // Extract the token from the Authorization header
    const token = authHeader.split(" ")[1]

    // If no token found, return unauthorized error
    if (!token) return res.status(401).json({ message: "Unauthorized" })

    try {
        // Check if the JWT secret is defined
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined")
        }

        // Verify the token using the JWT secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!decoded.id) {
            throw new Error("Invalid token")
        }

        req.user = decoded

        // Find the user in the database based on the decoded ID
        const user = await User.findById(decoded.id)
        if (!user) return res.status(404).json({ message: "User not found" })

        req.user.role = user.role

        next()
    } catch (error) {
        console.error("Token verification error:", error.message)
        res.status(403).json({ message: "Unauthorized" })
    }
}

export default authMiddleware