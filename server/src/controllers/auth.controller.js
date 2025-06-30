import { pool } from '../lib/db.js'
import bcrypt from 'bcryptjs'
import multer from 'multer'
import path from 'path'
import fs from 'fs/promises'
import { generateToken } from '../lib/utils.js'

export const signup = async (req, res) => {

    if (!req.body) {
        return res.status(400).json({ message: 'Body is Empty' })
    }

    const { fullName, email, password } = req.body

    if (!fullName || !email || !password) {
        return res.status(400).json({ message: 'Fill all the fields' })
    }

    const lowerEmail = email.toLowerCase()

    try {

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' })
        }

        const [users] = await pool.query(
            'SELECT * FROM Users WHERE email = ?', [lowerEmail]
        )

        if (users.length > 0) {
            return res.status(400).json({ message: 'User with this Email already exists' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(password, salt)

        //send user to database
        const [result] = await pool.query(
            'INSERT INTO Users (fullName, email, password) VALUES (?, ?, ?)', [fullName, lowerEmail, hashedPass]
        )

        if (!result.insertId) {
            throw new Error('Failed to create user')
        }

        res.status(201).json({
            message: 'User registered successfully',
            userId: result.insertId,
            fullName,
            email: lowerEmail
        })

    } catch (err) {
        console.log('Error in signup controller', err.message)
        res.status(500).json({ message: 'Internal Server Error' })
    }

}

export const login = async (req, res) => {

    if (!req.body) {
        return res.status(400).json({ message: 'Body is Empty' })
    }

    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: 'Fill all the fields' })
    }

    const lowerEmail = email.toLowerCase()

    try {

        const rows = await pool.query(
            'SELECT * FROM Users WHERE email = ?', [lowerEmail]
        )

        const user = rows[0][0]

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' })
        }

        const isPassCorrect = await bcrypt.compare(password, user.password)

        if (!isPassCorrect) {
            return res.status(400).json({ message: 'Invalid email or password' })
        }

        //generate jwt and send it to the user
        generateToken(user.user_id, res)

        //then send profile data
        return res.status(200).json({
            message: 'You have logged in',
            userId: user.user_id,
            fullName: user.fullName,
            email: lowerEmail,
            profilePic: user?.profilePic || ''
        })

    } catch (err) {
        console.log('Error in login controller', err.message)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const logout = (req, res) => {

    try {
        res.cookie('jwt', '', { maxAge: 0 })
        res.status(200).json({ message: 'Logged out successfully' })
    } catch (err) {
        console.log('Error in logout controller', err.message)
        res.status(500).json({ message: 'Internal Server Error' })
    }

}

export const updateProfile = async (req, res) => {

    try {

        const user = req.user
      
        const [userRows] = await pool.query(
            'SELECT profilePic FROM Users WHERE user_id = ?',
            [user.user_id]
        )

        let oldProfilePic = null

        if(userRows.length > 0) {
            oldProfilePic = userRows[0].profilePic
        }

        if (req.file) {

            const newProfilePic = `/public/avatars/${req.file.filename}`

            await pool.query(
                'UPDATE Users SET profilePic = ? WHERE user_id = ?', [newProfilePic, user.user_id]
            )

            console.log(oldProfilePic)

            if(oldProfilePic) {
                try {
                    const absolutePath = path.join(
                        process.cwd(),
                        oldProfilePic.replace('/', 'src/')
                    )

                    await fs.unlink(absolutePath)
                    console.log(`Previous avatar has been deleted: ${absolutePath}`)
                    
                } catch(err) {
                    console.log('Error while deleting previous avatar:', err.message)
                }
            }

        }

        return res.status(201).json({
            message: 'You have updated profile avatar',
            userId: user.user_id,
            fullName: user.fullName,
            email: user.email
        })

    } catch (err) {

        if (err instanceof multer.MulterError) {

            return res.status(400).json(
                {
                    success: false,
                    message: `Error while uploading file: ${err.message}`
                }
            )
        }

        return res.status(500).json({ message: 'Internal Server Error' })
    }
}