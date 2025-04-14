import Express from "express"
import cors from "cors"
import dotenv from "dotenv"
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import clientRoutes from "./routes/clientRoutes.js"
import setConnectionDB from "./config/dbConfig.js"
import { createDemoClients, demoAdmin, demoUser } from "./utils/DemoData.js"

dotenv.config()

const app = Express()
app.use(Express.json())
app.use(cors({
    origin: "https://crm-dashboard-nu.vercel.app"
}))

// Define route handlers for authentication, user, and admin-related routes
app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/client", clientRoutes)

// Define a simple ping endpoint to check if the server is running
app.get("/api/ping", (req, res) => res.send("Running"))

const PORT = process.env.PORT || 3000 // Get the port number from environment variables

try {
    await setConnectionDB()
    app.listen(PORT, async () => {
        console.log(`listening on ${PORT}...`)
    })
    await demoAdmin() // Call function to create a demo admin
    await demoUser() // Call function to create a demo user
    await createDemoClients() // Call function to create demo clients
} catch (error) {
    console.error("Failed to connect to the database", error)
}
