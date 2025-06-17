import mysql from 'mysql2'
import dotenv from 'dotenv'

dotenv.config()

export const connection = async () => {
    
    try {
        const conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        })

        console.log('Database connection successful')
        conn.end()

    } catch (err) {
        console.error('Error while connecting to database:', err)
    }

} 