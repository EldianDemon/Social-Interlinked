import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { checkDatabaseConnection } from './lib/db.js'
import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js'

dotenv.config()
const app = express()

const PORT = process.env.PORT

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/message', messageRoutes)

const startServer = async () => {
    const isDbConnected = await checkDatabaseConnection()

    if (!isDbConnected) {
        console.log('Server cannot be connected to Database')
    }

    app.listen(PORT, () => {
        console.log(`Server is running on port: ${PORT}`)
    })
}

startServer()
