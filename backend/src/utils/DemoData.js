import User from "../models/userModel.js"
import ClientModel from "../models/clientModel.js"
import { hashPassword } from "./passwordUtils.js"

// Function to create a demo admin if it doesn't already exist
export const demoAdmin = async () => {
    try {
        const email = "admin@admin"
        const adminPassword = "123456789"
        const hashedPassword = await hashPassword(adminPassword)

        // Check if an admin user already exists
        const existingAdmin = await User.findOne({ email: email.toLowerCase() })
        if (existingAdmin) return


        // Create a new admin user
        const defaultAdmin = new User({
            name: "Admin",
            email: email.toLowerCase(),
            password: hashedPassword,
            role: "admin"
        })
        await defaultAdmin.save()
        console.log("Demo admin user added successfully")
    } catch (error) {
        console.error("Error in demoAdmin function:", error.message)
    }
}

// Function to create a default user if it doesn't already exist
export const demoUser = async () => {
    try {
        const email = "test@test.com"
        const password = "123456789"
        const hashedPassword = await hashPassword(password)

        // Check if the user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() })
        if (existingUser) return


        // Create a new user
        const defaultUser = new User({
            name: "Test User",
            email: email.toLowerCase(),
            password: hashedPassword,
        })
        await defaultUser.save()
        console.log("Demo user added successfully")
    } catch (error) {
        console.error("Error in demoUser function:", error.message)
    }
}

// Function to create demo clients
export const createDemoClients = async () => {
    const email = "test@test.com"

    const existingUser = await User.findOne({ email: email })
    if (!existingUser) throw new Error("Demo user not found")

    const demoClients = [
        {
            name: "Alice Cohen",
            email: "alice@demo.com",
            phone: "0501234567",
            type: "client",
            note: "Potential lead",
            status: "closed",
            dealValue: 5000
        },
        {
            name: "Boaz Levi",
            email: "boaz@demo.com",
            phone: "0527654321",
            type: "potential",
            note: "",
            status: "pending"
        },
        {
            name: "Charlie Mizrahi",
            email: "charlie@demo.com",
            phone: "0542223333",
            type: "supplier",
            note: "Asked for a quote",
            status: "cancelled"
        },
        {
            name: "Dana Azulay",
            email: "dana@demo.com",
            phone: "0534445555",
            type: "other",
            note: "Old client",
            status: "closed",
            dealValue: 2000
        },
        {
            name: "Eyal Silverman",
            email: "eyal@demo.com",
            phone: "0516667777",
            type: "client",
            note: "Met at conference",
            status: "pending"
        }
    ]

    for (const client of demoClients) {
        const existingClient = await ClientModel.findOne({ email: client.email.toLowerCase() })
        if (existingClient) {
            console.log(`Client already exists: ${client.name}`)
            continue
        }

        await ClientModel.create({
            ...client,
            email: client.email.toLowerCase(),
            assignedTo: existingUser._id
        })
        console.log(`Created demo client: ${client.name}`)
    }
}