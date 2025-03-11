import mongoose from "mongoose"

// Function to establish a connection to MongoDB
const setConnectionDB = async () => {
    try {
        const MongoDBConnection = await mongoose.connect(process.env.MongoDB_URL)
        console.log(`MongoDB connected: ${MongoDBConnection.connection.host}`)
    } catch (error) {
        console.log("MongoDB connection error:", error)
        throw error
    }
}

export default setConnectionDB