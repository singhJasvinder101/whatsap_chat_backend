const Chat = require("../models/chatModel")
const User = require("../models/userModel")
const Message = require("../models/messageModel")

const sendMessage = async (req, res, next) => {
    const { content, chatId } = req.body
    if (!content || !chatId) {
        return res.status(500).send("all input fields are required")
    }
    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId
    }

    var message = await Message.create(newMessage)

    // as we are fetching just the instance only without path so exact populate
    message = await message.populate("sender", "name pic")
    message = await message.populate("chat")
    message = await User.populate(message, {
        path: 'chat.users',
        select: "name pic email"
    })

    await Chat.findByIdAndUpdate(chatId, {
        latestMessage: message
    })

    res.json(message)
}

const allMessages = async (req, res, next) => {
    try {
        var messages = await Message.find({ chat: req.params.chatId })
            .populate("sender", "name pic email")
            .populate("chat")
        res.json(messages);
    } catch (error) {
        next(error)
    }
}

module.exports = {
    sendMessage,
    allMessages
}

