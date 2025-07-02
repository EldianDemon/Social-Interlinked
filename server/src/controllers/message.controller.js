import path from 'path'
import fs from 'fs/promises'
import { pool } from '../lib/db.js'
import { getUsers, getDirectMessages, sendDirectMessage } from '../lib/db.js'

export const getUsersSidebar = async (req, res) => {

    try {
        const users = await getUsers(req.userId)

        if (users) {
            return res.status(200).json(
                {
                    message: 'Users avaible',
                    users
                }
            )
        }
    } catch (err) {
        console.log('getUsersSlidebar Error', err)
        return res.status(500).json({ message: 'Internal Server Error' })
    }

}

export const getMessages = async (req, res) => {

    try {

        const userId = req.userId
        const { id: friendId } = req.params

        const messages = await getDirectMessages(userId, friendId)

        const messagesWithImages = await Promise.all(

            messages.map(async (message) => {

                if (!message.image) return message

                try {
                    const absolutePath = path.join(
                        process.cwd(),
                        message.image.startsWith('/') ? message.image.substring(1) : message.image
                    )

                    await fs.access(absolutePath)

                    const fileBuffer = await fs.readFile(absolutePath)

                    return {
                        ...message,
                        image: fileBuffer.toString('base64')
                    }
                } catch (err) {
                    console.log('getMessages controller Error:', err)
                    return res.status(500).json({ message: 'Internal Server Error' })
                }
            })
        )



        return res.status(200).json(
            {
                message: 'get Messages success',
                messages: messagesWithImages
            }
        )

    } catch (err) {
        console.log('getMessages controller Error:', err)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const sendMessage = async (req, res) => {

    const userId = req.userId
    const { id: friendId } = req.params
    const text = req.body?.text
    const file = req.file

    try {

        let messageImgRoot = null

        if (file) {
            messageImgRoot = `public/messages/${file.filename}`
        }

        await pool.query(
            'INSERT INTO Messages (sender_id, receiver_id, text, image) VALUES (?, ?, ?, ?)',
            [userId, friendId, text ? text : null, messageImgRoot]
        )

        return res.status(200).json({ message: 'Message sent success' })

    } catch (err) {
        console.log('sendMessage controller Error:', err)
        return res.status(500).json({ message: 'Internal Server Error' })
    }

}