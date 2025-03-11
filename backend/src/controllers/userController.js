import User from "../models/userModel.js"
import { hashPassword, checkPassword } from "../utils/passwordUtils.js"

// Controller to get the logged-in user's details
export const getUser = async (req, res) => {
    try {
        // Find user by ID from the JWT token (req.user.id)
        const user = await User.findById(req.user.id).select("userName email name createdAt role")
        if (!user) return res.status(404).json({ message: "User not found" })

        res.status(200).json(user)
    } catch (error) {
        console.error("Error in getUser controller", error.message)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

// Controller to update the logged-in user's details
export const updateUser = async (req, res) => {
    const { userName, name, email, role, password } = req.body
    try {
        const userId = req.user.id
        const updateFields = {}

        // If userName is provided, check if it's available and unique
        if (userName) {
            const user = await User.findById(userId).select("userName")
            if (!user) return res.status(404).json({ message: "User not found" })

            const checkUserName = await User.findOne({ userName: userName.toLowerCase() })
            if (!checkUserName) {
                updateFields.userName = userName
            } else {
                return res.status(409).json({ message: "Username already taken" })
            }
        }
        // Update other fields if provided
        if (name) updateFields.name = name
        if (email) updateFields.email = email.toLowerCase()
        if (role) updateFields.role = role

        // If password is provided, validate it and hash it before updating
        if (password) {
            const user = await User.findById(userId).select("password")
            if (!user) return res.status(404).json({ message: "User not found" })

            // Validate password length
            if (password.length < 8 || password.length > 20) {
                return res.status(400).json({ message: "Password must be between 8 and 20 characters long" })
            }

            // Check if the new password is different from the current password
            const isPasswordCorrect = await checkPassword(password, user.password)
            if (!isPasswordCorrect) {
                const hashedPassword = await hashPassword(password)
                updateFields.password = hashedPassword
            } else {
                return res.status(400).json({ message: "New password cannot be the same as the current password" })
            }
        }

        // If no fields to update, return a bad request response
        if (Object.keys(updateFields).length === 0) return res.status(400).json({ message: "No fields to update" })

        // Update the user data in the database
        const updatedUser = await User.findOneAndUpdate(
            { _id: userId },
            updateFields,
            { new: true }
        )
        if (!updatedUser) return res.status(404).json({ message: "User not found" })

        console.log(`${updatedUser.userName} updated successfully`)
        res.status(200).json({ message: `${updatedUser.userName} updated successfully` })

    } catch (error) {
        console.error("Error in updateUser controller", error.message)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

// Controller to delete the logged-in user's account
export const deleteUser = async (req, res) => {
    try {
        const userId = req.user.id

        // Find and delete the user by ID
        const deletedUser = await User.findByIdAndDelete(userId)
        if (!deletedUser) return res.status(404).json({ message: "User not found" })

        console.log(`User ${deletedUser.userName} deleted successfully`)
        res.status(200).json({ message: "User deleted successfully" })
    } catch (error) {
        console.error("Error in deleteUser controller", error.message)
        res.status(500).json({ message: "Internal Server Error" })
    }
}