import mongoose from "mongoose"
import Joi from "joi"

export const localSchema = Joi.object({
    name: Joi.string().min(2).max(10).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(20).required(),
    role: Joi.string().default("user"),
    provider: Joi.string().valid("local").default("local"),
    lastLogin: Joi.date()
})

export const googleSchema = Joi.object({
    name: Joi.string().min(2).max(10).required(),
    email: Joi.string().email().min(5).max(30).required(),
    role: Joi.string().default("user"),
    provider: Joi.string().valid("google"),
    lastLogin: Joi.date()
})

// Define the schema for the User model
const userSchema = new mongoose.Schema(
    {
        name: String,
        email: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true
        },
        // password: optional for Google login
        password: {
            type: String,
            select: false
        },
        // role field: optional, used to assign roles like "admin" or "user"
        role: {
            type: String, default: "user"
        },

        // Account provider (defaults to "local", can be "google", etc.)
        provider: {
            type: String, default: "local"
        },
        lastLogin: Date,
        otpCode: String,
        otpExpiresAt: Date
    },
    { timestamps: true }  // Automatically adds 'createdAt' and 'updatedAt' fields
)

export const User = mongoose.model("User", userSchema)

export default User