import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
import fs from 'fs/promises'
import path from 'path'

dotenv.config()

export const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    queueLimit: 0
})

export const checkDatabaseConnection = async () => {
    let conn;
    try {
        conn = await pool.getConnection()
        await conn.ping()
        console.log('Database connection successful')

        return true
    } catch (err) {
        console.log('Database connection failed', err)

        return false
    } finally {
        if (conn) conn.release()
    }
}

//Handlers

export const getUsers = async (userId) => {

    try {
        const [userRows] = await pool.query(
            'SELECT * FROM Users'
        )

        return userRows.filter(user => user.user_id !== userId)

    } catch (err) {
        console.log('getUsers Error', err)
    }

}

export const getUser = async (userId) => {

    try {
        const [userRows] = await pool.query(
            'SELECT * FROM Users WHERE user_id = ?', [userId]
        )

        return userRows[0]

    } catch (err) {
        console.log('getUser Error', err)
    }

}

export const getUserAvatar = async (userId) => {
    try {
        const [userRows] = await pool.query(
            'SELECT profilePic FROM Users WHERE user_id = ?',
            [userId]
        )

        if (userRows.length === 0 || !userRows[0].profilePic) {
            return false
        }

        const avatarPath = userRows[0].profilePic

        const absolutePath = path.join(
            process.cwd(),
            avatarPath.startsWith('/') ? avatarPath.substring(1) : avatarPath
        )

        try {
            await fs.access(absolutePath)
        } catch (err) {
            console.error('File access error:', absolutePath, err)
            return false
        }

        const fileBuffer = await fs.readFile(absolutePath)
        return fileBuffer.toString('base64')

    } catch (err) {
        console.error('getUserAvatar error:', err)
        return false
    }
}

export const updateUserAvatar = async (userId, newProfilePic, oldProfilePic) => {
    try {
        await pool.query(
            'UPDATE Users SET profilePic = ? WHERE user_id = ?', [newProfilePic, userId]
        )

        if (oldProfilePic) {
            try {

                const absolutePath = path.join(
                    process.cwd(),
                    oldProfilePic.replace('', '/')
                )

                await fs.unlink(absolutePath)

                return true

            } catch (err) {
                console.log('Error while deleting previous avatar:', err.message)
            }
        }

        return false

    } catch (err) {
        console.log('updateUserAvarat Error', err)
    }

}

export const getDirectMessages = async (userId, friendId) => {
    try {
        const [messages] = await pool.query(
            `SELECT * FROM Messages WHERE (sender_id = ? AND receiver_id = ?) 
                OR (sender_id = ? AND receiver_id = ?)`,
            [userId, friendId, friendId, userId]
        )

        return messages
        
    } catch (err) {
        console.log('getDirectMessages Error', err)
    }
}

export const sendDirectMessage = async (userId, friendId, text, image) => {


}