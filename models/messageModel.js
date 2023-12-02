const mongoose = require("mongoose")

const messageSchema = mongoose.Schema({
    // 1) kisne bheja 
    // 2) kya content aya
    // 3) kon si chat/group me aya
    // 4) kisne ab tak read kiya
    // 5) kitne bje ka msg

    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

}, {
    timestamps: true
})

const Message = mongoose.model("Message", messageSchema)
module.exports = Message
