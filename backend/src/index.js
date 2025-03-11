import Express from "express"
import cors from "cors"
import dotenv from "dotenv"
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import setConnectionDB from "./config/dbConfig.js"
import defaultAdminUser from './utils/defaultAdminUser.js'

dotenv.config()

const app = Express()
app.use(Express.json())
app.use(cors({
    origin: "*"
}))

// Define route handlers for authentication, user, and admin-related routes
app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/admin", adminRoutes)

const PORT = process.env.PORT // Get the port number from environment variables

try {
    await setConnectionDB()
    app.listen(PORT, async () => {
        console.log(`listening on ${PORT}...`)
    })
    defaultAdminUser() // Call function to create a default admin user
} catch (error) {
    console.error("Failed to connect to the database", error)
}
