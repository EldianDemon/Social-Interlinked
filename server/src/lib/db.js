import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

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