import Express from "express"
import { deleteUser, getUser, updateUser } from "../controllers/userController.js"
import authMiddleware from "../middleware/authMiddleware.js"

const router = Express.Router()

router.get("/", authMiddleware, getUser)
router.patch("/", authMiddleware, updateUser)
router.delete("/", authMiddleware, deleteUser)

export default router