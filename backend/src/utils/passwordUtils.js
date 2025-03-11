import bcrypt from "bcrypt"

const SALT_ROUNDS = 12

// Function to hash the password
export async function hashPassword(password) {
    try {
        return await bcrypt.hash(password, SALT_ROUNDS)
    } catch (error) {
        console.log("Error in hashPassword:", error.message)
        throw new Error(`Failed to hash password: ${error.message}`)
    }
}

// Function to compare a plain password with a hashed password
export async function checkPassword(password, hashedPassword) {
    try {
        return await bcrypt.compare(password, hashedPassword)
    } catch (error) {
        console.error("Error in checkPassword:", error.message)
        throw new Error(`Failed to compare password: ${error.message}`)
    }
}