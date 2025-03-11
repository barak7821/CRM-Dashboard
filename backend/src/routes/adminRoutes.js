import Express from "express"
import { getUsersAdmin, deleteUserAdmin, updateUserById, getUserById } from "../controllers/adminController.js"
import authMiddleware from "../middleware/authMiddleware.js"

const router = Express.Router()

router.get("/", authMiddleware, getUsersAdmin)
router.get("/:userId", authMiddleware, getUserById)
router.patch("/:userId", authMiddleware, updateUserById)
router.delete("/", authMiddleware, deleteUserAdmin)

export default router 