import Express from "express"
import { createClient, deleteClient, getClientById, getClients, updateClient } from "../controllers/clientController.js"
import authMiddleware from "../middleware/authMiddleware.js"
import Client from "../models/clientModel.js"
const router = Express.Router()

router.get("/", authMiddleware, getClients)
router.post("/", authMiddleware, createClient)
router.delete("/", authMiddleware, deleteClient)
router.get('/:clientId', authMiddleware, getClientById)
router.patch("/:clientId", authMiddleware, updateClient)

export default router