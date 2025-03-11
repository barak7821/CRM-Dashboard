import User from "../models/userModel.js"

// Controller to get all users for admin
export const getUsersAdmin = async (req, res) => {
    try {
        // Check if the user is an admin
        if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" })

        // Retrieve all users, but only return the fields we need
        const users = await User.find().select("userName email name createdAt role")
        if (users.length === 0) return res.status(404).json({ message: "No users found" })

        res.status(200).json(users)
    } catch (error) {
        console.error("Error in getUsersAdmin controller", error.message)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

// Controller to delete a user by admin
export const deleteUserAdmin = async (req, res) => {
    try {
        // Check if the user is an admin
        if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" })

        const { userId } = req.body
        // Check if the userId is provided
        if (!userId) return res.status(400).json({ message: "User ID is required" })

        // Try to find and delete the user by ID
        const deletedUser = await User.findByIdAndDelete(userId)
        if (!deletedUser) return res.status(404).json({ message: "User not found" })

        console.log(`User ${deletedUser.userName} deleted successfully`)
        res.status(200).json({ message: "User deleted successfully" })
    } catch (error) {
        console.error("Error in deleteUserAdmin controller", error.message)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

// Controller to update a user by ID by admin
export const updateUserById = async (req, res) => {
    const { userName, name, email, role } = req.body
    const { userId } = req.params

    try {
        // Check if the user is an admin
        if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" })

        const updateFields = {}

        if (userName) updateFields.userName = userName
        if (name) updateFields.name = name
        if (email) updateFields.email = email.toLowerCase()
        if (role) updateFields.role = role

        if (Object.keys(updateFields).length === 0) return res.status(400).json({ message: "No fields to update" })

        // Try to find and update the user by ID
        const updatedUser = await User.findOneAndUpdate(
            { _id: userId },
            updateFields,
            { new: true } // Return the updated user document
        )

        if (!updatedUser) return res.status(404).json({ message: "User not found" })

        res.status(200).json({ message: `${updatedUser.userName} updated successfully` })

    } catch (error) {
        console.error("Error in updateUserById controller", error.message)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

// Controller to get a single user by ID for admin
export const getUserById = async (req, res) => {
    const { userId } = req.params

    try {
        // Check if the user is an admin
        if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" })

        // Try to find the user by ID and select specific fields
        const user = await User.findById(userId).select("userName email name createdAt role")
        if (!user) return res.status(404).json({ message: "User not found" })

        res.status(200).json(user)
    } catch (error) {
        console.error("Error in getUserById controller", error.message)
        res.status(500).json({ message: "Internal Server Error" })
    }
}