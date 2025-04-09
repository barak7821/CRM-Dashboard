import User from "../models/userModel.js"
import { hashPassword, checkPassword } from "../utils/passwordUtils.js"

// Controller to get the logged-in user's details
export const getUser = async (req, res) => {
    try {
        // Find user by ID from the JWT token (req.user.id)
        const user = await User.findById(req.user.id).select("email name createdAt role")
        if (!user) return res.status(404).json({ message: "User not found" })

        res.status(200).json(user)
    } catch (error) {
        console.error("Error in getUser controller", error.message)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

// Controller to update the logged-in user's details
export const updateUser = async (req, res) => {
    const { name, email, role, password } = req.body
    try {
        const userId = req.user.id
        const updateFields = {}
        const user = await User.findById(userId).select("+password")
        if (!user) return res.status(404).json({ message: "User not found" })

        // Update other fields if provided
        if (name) updateFields.name = name
        if (email) updateFields.email = email.toLowerCase()
        if (role) updateFields.role = role

        // If password is provided, validate it and hash it before updating
        if (password) {
            // Validate password length
            if (password.length < 8 || password.length > 20) {
                return res.status(400).json({ message: "Password must be between 8 and 20 characters long" })
            }

            if (user.provider === "google" && !user.password) {
                const hashedPassword = await hashPassword(password)
                updateFields.password = hashedPassword
            } else if (user.password) {
                // Check if the new password is different from the current password
                const isPasswordCorrect = await checkPassword(password, user.password)

                // if isPasswordCorrect is false, password are not same so hashed it
                if (!isPasswordCorrect) {
                    const hashedPassword = await hashPassword(password)
                    updateFields.password = hashedPassword
                } else {
                    return res.status(400).json({code:"pass_wrong", message: "New password cannot be the same as the current password" })
                }
            } else {
                return res.status(400).json({ message: "Cannot update password for this user" })
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

        console.log(`${updatedUser.name} updated successfully`)
        res.status(200).json({ message: `${updatedUser.name} updated successfully` })

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

        console.log(`User ${deletedUser.name} deleted successfully`)
        res.status(200).json({ message: "User deleted successfully" })
    } catch (error) {
        console.error("Error in deleteUser controller", error.message)
        res.status(500).json({ message: "Internal Server Error" })
    }
}