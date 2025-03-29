import Express from "express"
import { login, register, checkUser, googleLogin, requestReset, verifyOtp, resetPassword } from "../controllers/authController.js"
import authMiddleware from "../middleware/authMiddleware.js"

const router = Express.Router()

router.post("/", login)
router.post("/register", register)
router.post("/google", googleLogin)
router.get("/", authMiddleware, checkUser)
router.post("/request-reset", requestReset)
router.post("/verify-otp", verifyOtp)
router.post("/reset-password", resetPassword)

export default router