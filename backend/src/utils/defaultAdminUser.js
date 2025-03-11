import User from "../models/userModel.js"
import { hashPassword } from "./passwordUtils.js"

// Function to create a default admin user if it doesn't already exist
const defaultAdminUser = async () => {
    try {
        const adminPassword = "123456789"
        const userName = "admin"
        const hashedPassword = await hashPassword(adminPassword)

        // Check if an admin user already exists
        const existingAdmin = await User.findOne({ userName: userName.toLowerCase() })
        if (existingAdmin) {
            return
        }

        // Create a new admin user
        const defaultAdmin = new User({
            userName: userName,
            name: "Admin",
            email: "admin@admin",
            password: hashedPassword,
            role: "admin"
        })
        await defaultAdmin.save()
        console.log("Default admin user added successfully")
    } catch (error) {
        console.error("Error in defaultAdminUser function:", error.message)
    }
}

export default defaultAdminUser