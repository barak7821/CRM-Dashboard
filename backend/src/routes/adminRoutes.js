import Express from "express"
import { getUsersAdmin, deleteUserAdmin, updateUserById, getUserById, checkAdmin, getClientsAdmin } from "../controllers/adminController.js"
import authMiddleware from "../middleware/authMiddleware.js"

const router = Express.Router()

router.get("/", authMiddleware, getUsersAdmin)
router.get("/clients", authMiddleware, getClientsAdmin)
router.delete("/", authMiddleware, deleteUserAdmin)
router.get("/check", authMiddleware, checkAdmin)
router.get("/:userId", authMiddleware, getUserById)
router.patch("/:userId", authMiddleware, updateUserById)

export default router 