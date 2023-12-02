const mongoose = require("mongoose");

const chatModel = mongoose.Schema(
    {
        chatName: { type: String, trim: true },

        // to define private or group chat 
        isGroupChat: { type: Boolean, default: false },

        // current users of chat
        users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

        // to show on frontend
        latestMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
        },
        groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

const Chat = mongoose.model("Chat", chatModel);

module.exports = Chat;