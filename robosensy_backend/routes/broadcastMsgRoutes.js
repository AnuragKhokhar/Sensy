import express from 'express'
import { BroadcastMsgController } from '../controllers/broadcastController.js'
import { adminAuth } from '../middlewares/validation/auth.js'
import { broadcastMsgValidator } from '../middlewares/validation/broadcast.js'

const router = express.Router()
const broadcastMsgController = new BroadcastMsgController()


router.post('/broadcastMsg', [adminAuth, broadcastMsgValidator], broadcastMsgController.broadcastSameMsg)

export default router