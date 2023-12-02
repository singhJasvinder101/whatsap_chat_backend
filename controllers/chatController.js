const Chat = require("../models/chatModel")
const User = require("../models/userModel")

// Create or fetch One to One Chat and front page details latest message sender name pic and email
const accessChat = async (req, res, next) => {
    const { userId } = req.body
    if (!userId) {
        res.status(400).send("please provide userId as params")
    }

    var isChat = await Chat.find({
        // bcoz accessing one to one chat
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: userId } } },
            { users: { $elemMatch: { $eq: req.user._id } } },
        ]
    }).populate("users").populate("latestMessage")


    // accessing user info by latest message sender populating
    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email"
    })
    if (isChat.length > 0) {
        return res.send(isChat[0]) // bcoz its array of only one element
    } else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId]
        }
        try {
            const createdChat = await Chat.create(chatData)
            const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
                "users", "-password"
            )
            return res.status(200).send(fullChat)
        } catch (error) {
            next(error)
        }
    }
}
const fetchChats = async (req, res, next) => {
    try {
        let chats = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users")
            .populate("groupAdmin")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
        chats = await User.populate(chats, {
            path: "latestMessage.sender",
            select: "name pic email"
        })
        return res.status(200).send(chats)
    } catch (error) {
        next(error)
    }
}

const createGroupChat = async (req, res, next) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send("please fill all the fields group name and users")
    }

    var users = JSON.parse(req.body.users);
    if (users.length < 2) {
        return res.status(400).send("More then 2 users required")
    }
    users.push(req.user)

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user
        })

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users").populate("groupAdmin")

        return res.status(200).json(fullGroupChat)

    } catch (error) {
        next(error)
    }
}

const renameGroup = async (req, res, next) => {
    const { chatId, chatName } = req.body
    try {
        const updatedChat = await Chat.findByIdAndUpdate(chatId, {
            chatName: chatName
        }, { new: true })
            .populate("users").populate("groupAdmin")

        if (!updatedChat) {
            res.status(404).send("chat not found")
        } else {
            res.status(200).send(updatedChat)
        }
    } catch (error) {
        next(error)
    }
}

const addToGroup = async (req, res, next) => {
    try {
        const { chatId, userId } = req.body
        const added = await Chat.findByIdAndUpdate(chatId, {
            $push: { users: userId },
        }, { new: true })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
        if (!added) {
            res.status(404).send("chat not found")
        } else {
            res.status(200).send(added);
        }

    } catch (error) {
        next(error)
    }
}

const removeFromGroup = async (req, res, next) => {
    try {
        const { chatId, userId } = req.body
        const removed = await Chat.findByIdAndUpdate(chatId, {
            $pull: { users: userId },
        }, { new: true })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
        if (!removed) {
            res.status(404);
            throw new Error("Chat Not Found");
        } else {
            res.json(removed);
        }

    } catch (error) {
        next(error)
    }
}

module.exports = {
    accessChat,
    fetchChats,
    createGroupChat,
    renameGroup,
    addToGroup,
    removeFromGroup,
}
