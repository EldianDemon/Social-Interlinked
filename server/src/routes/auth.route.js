import express from 'express'
import { signup, login, logout, updateProfile } from '../controllers/auth.controller.js'
import { parseFile } from '../middleware/multer.middleware.js'
import { protectRoute } from '../middleware/auth.middleware..js'


const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.get('/logout', logout)

router.put('/update-profile', protectRoute, parseFile, updateProfile) 

export default router