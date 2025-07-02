import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js'
import { getMessages, getUsersSidebar, sendMessage } from '../controllers/message.controller.js'
import { uploadMessageImage } from '../middleware/multer.middleware.js'

const router = express.Router()

//get slide bar users
router.get('/users', protectRoute, getUsersSidebar)

//get direct messages
router.get('/:id', protectRoute, getMessages)

//post direct messages
router.post('/send/:id', protectRoute, uploadMessageImage, sendMessage)

export default router