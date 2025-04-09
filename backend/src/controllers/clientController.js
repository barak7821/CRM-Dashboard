import ClientModel, { schema, updateSchema } from "../models/clientModel.js"
import User from "../models/userModel.js"

// This controller handles the creation of a new client
export const createClient = async (req, res) => {
    const { name, email, phone, type, note } = req.body
    const assignedTo = req.user.id

    try {
        // Validate the request body using Joi schema
        await schema.validateAsync({ assignedTo, name, email, phone, type, note })

        const user = await User.findById(assignedTo)
        if (!user) return res.status(400).json({ message: "Assigned user does not exist" })

        // Check if the email is already registered
        const existingUser = await User.findOne({ email: email.toLowerCase() })
        if (existingUser) return res.status(409).json({ message: "Email already exists" })

        const newClient = new ClientModel({
            assignedTo,
            name,
            email: email.toLowerCase(),
            phone,
            type,
            note,
            status: "pending"
        })

        await newClient.save()

        console.log(`${name} added successfully`)
        res.status(201).json({ message: `${name} added successfully` })
    } catch (error) {
        console.error("Error in createClient controller", error.message)
        res.status(500).json({ message: error.message || "Internal Server Error" })
    }
}

// This controller get of all clients assigned to the user
export const getClients = async (req, res) => {
    try {
        const userId = req.user.id
        const clients = await ClientModel.find({ assignedTo: userId })
        res.status(200).json(clients)
    } catch (error) {
        console.error("Error in getClients controller", error.message)
        res.status(500).json({ message: error.message || "Internal Server Error" })
    }
}

// This controller get client by its ID
export const getClientById = async (req, res) => {
    const { clientId } = req.params
    console.log(clientId)
    try {
        const client = await ClientModel.findById(clientId)
        if (!client) return res.status(404).json({ message: "Client not found" })
        res.status(200).json(client)
    } catch (error) {
        console.error("Error in getClientById controller", error.message)
        res.status(500).json({ message: error.message || "Internal Server Error" })
    }
}

// This controller handles the update of client by its ID
export const updateClient = async (req, res) => {
    const { name, email, phone, type, note, status, dealValue } = req.body
    const { clientId } = req.params
    try {
        // Validate the request body using Joi schema
        await updateSchema.validateAsync({ name, email, phone, type, note, status, dealValue })

        const updateFields = {}
        const client = await ClientModel.findById(clientId)
        if (!client) return res.status(404).json({ message: "Client not found" })

        // Update other fields if provided
        if (name) updateFields.name = name
        if (email) updateFields.email = email.toLowerCase()
        if (phone) updateFields.phone = phone
        if (type) updateFields.type = type
        if (note) updateFields.note = note
        if (status) updateFields.status = status
        if (dealValue !== undefined) updateFields.dealValue = dealValue

        // If no fields to update, return a bad request response
        if (Object.keys(updateFields).length === 0) return res.status(400).json({ message: "No fields to update" })

        // Update the user data in the database
        const updatedUser = await ClientModel.findOneAndUpdate(
            { _id: clientId },
            updateFields,
            { new: true }
        )
        if (!updatedUser) return res.status(404).json({ message: "User not found" })

        console.log(`${updatedUser.name} updated successfully`)
        res.status(200).json({ message: `${updatedUser.name} updated successfully` })
    } catch (error) {
        console.error("Error in updateUser controller", error.message)
        res.status(500).json({ message: error.message || "Internal Server Error" })
    }
}

// This controller handles the delete of client by its ID
export const deleteClient = async (req, res) => {
    const clientId = req.body.id
    console.log(clientId)
    try {
        const deletedUser = await ClientModel.findByIdAndDelete(clientId)
        if (!deletedUser) return res.status(404).json({ message: "Client not found" })

        console.log(`User ${deletedUser.name} deleted successfully`)
        res.status(200).json({ message: "Client deleted successfully" })
    } catch (error) {
        console.error("Error in deleteClient controller", error.message)
        res.status(500).json({ message: error.message || "Internal Server Error" })
    }
}