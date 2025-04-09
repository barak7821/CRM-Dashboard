import mongoose from "mongoose"
import Joi from "joi"

// This schema is used for validating the request body when creating or updating a client
export const schema = Joi.object({
    assignedTo: Joi.string().required(),
    name: Joi.string().min(2).max(20).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^[0-9+\-()\s]+$/).optional(),
    type: Joi.string().valid("client", "potential", "supplier", "other").optional(),
    note: Joi.string().max(500).optional(),
    status: Joi.string().valid("pending", "closed", "cancelled").optional(),
    dealValue: Joi.number().when("status", {
        is: "closed",
        then: Joi.required(),
        otherwise: Joi.optional()
    })
})

// The update schema allows for optional fields, meaning they can be omitted in the request body
export const updateSchema = schema.fork(
    ["assignedTo", "name", "email"],
    field => field.optional()
)

// Define the schema for the User model
const clientSchema = new mongoose.Schema(
    {
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        name: String,
        email: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true
        },
        phone: String,
        type: String,
        note: String,
        status: String,
        dealValue: Number
    },
    { timestamps: true }  // Automatically adds 'createdAt' and 'updatedAt' fields
)

export const ClientModel = mongoose.model("Client", clientSchema)

export default ClientModel