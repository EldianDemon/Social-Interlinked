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

        res.status(200).json(
            {
                message: 'get Messages success',
                messages
            }
        )

    } catch (err) {
        console.log('getMessages controller Error:', err)
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const sendMessage = async (req, res) => {

    try {

        const userId = req.userId
        const { id: friendId } = req.params
        const { text, image } = req.body

        //save message to src/public/messages and then save root in database

        await sendDirectMessage(userId, friendId, text, image)

    } catch (err) {
        console.log('sendMessage controller Error:', err)
        return res.status(500).json({ message: 'Internal Server Error' })
    }

}