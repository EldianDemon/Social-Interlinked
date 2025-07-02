import jwt from 'jsonwebtoken'
import { pool } from '../lib/db.js'

export const protectRoute = async (req, res, next) => { //next is calling next func in the /update-profile route

    try {
        const token = req.cookies.jwt //jwt name was set by us in generateToken, dont forget about it like you always do

        if (!token) {
            return res.status(401).json(
                {
                    success: false,
                    message: 'Not authenticated'
                }
            )
        }

        //parsing cookie, grabbing user id
        const decodedCookie = jwt.verify(token, process.env.JWT_SECRET)

        if (!decodedCookie) {
            return res.status(401).json({
                success: false,
                message: 'Not authenticated - Invalid Token'
            })
        }

        const [userId] = await pool.query(
            'SELECT user_id FROM Users WHERE user_id = ?', [decodedCookie.userId]
        )

        if (!userId[0]) {
            return res.status(404).json(
                {
                    success: false,
                    message: 'User not found'
                }
            )
        }

        req.userId = userId[0].user_id

        next() 

    } catch (err) {
        console.log('Error in protectRoute middleware', err.message)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

