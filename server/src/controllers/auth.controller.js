import { pool } from '../lib/db.js'
import bcrypt from 'bcryptjs'
import { generateToken } from '../lib/utils.js'

export const signup = async (req, res) => {

    const { fullName, email, password } = req.body

    try {

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: 'Fill all the fields' })
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' })
        }

        const [users] = await pool.query(
            'SELECT * FROM Users WHERE email = ?', [email]
        )

        if (users.length > 0) {
            return res.status(400).json({ message: 'User with this Email already exists' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(password, salt)

        //send user to database
        const [result] = await pool.query(
            'INSERT INTO Users (fullName, email, password) VALUES (?, ?, ?)', [fullName, email, hashedPass]
        )

        if (!result.insertId) {
            throw new Error('Failed to create user')
        }

        res.status(201).json({
            message: 'User registered successfully',
            userId: result.insertId,
            fullName,
            email
        })

    } catch (err) {
        console.log('Error in signup controller', err.message)
        res.status(500).json({ message: 'Internal Server Error' })
    }

}

export const login = async (req, res) => {
    const { email, password } = req.body

    try {

        const rows = await pool.query(
            'SELECT * FROM Users WHERE email = ?', [email]
        )

        const user = rows[0][0]

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' })
        }

        const isPassCorrect = await bcrypt.compare(password, user.password)

        if (!isPassCorrect) {
            return res.status(400).json({ message: 'Invalid email or password' })
        }

        generateToken(user.user_id, res)

        return res.status(200).json({
            message: 'You have logged in'
        })

    } catch (err) {
        console.log('Error in login controller', err.message)
        return res.status(500).json({message: 'Internal Server Error'})
    }
}

export const logout = (req, res) => {
    res.send('logout route')
}