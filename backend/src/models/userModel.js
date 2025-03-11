import mongoose from "mongoose"

// Define the schema for the User model
const userSchema = new mongoose.Schema(
    {
        // userName: unique and required
        userName: {
            type: String,
            required: true,
            unique: true
        },
        // name: required
        name: {
            type: String,
            required: true,
        },
        // email: unique and required
        email: {
            type: String,
            required: true,
            unique: true
        },
        // password field: required and has a minimum length
        password: {
            type: String,
            required: true,
            minlength: 8
        },
        // role field: optional, used to assign roles like "admin" or "user"
        role: {
            type: String
        },
    },
    { timestamps: true }  // Automatically adds 'createdAt' and 'updatedAt' fields
)

const User = mongoose.model("User", userSchema)

export default User