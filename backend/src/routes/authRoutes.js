import Express from "express"
import { login, register, checkUser } from "../controllers/authController.js"

const router = Express.Router()

router.post("/login", login)
router.post("/register", register)
router.get("/checkuser", checkUser)

export default router