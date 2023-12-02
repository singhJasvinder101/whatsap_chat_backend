const express = require("express");
const connectDB = require("./config/db");
const app = express();
const PORT = process.env.PORT || 3000;
require("dotenv").config()
const apiRoutes = require("./routes/apiRoutes")
const cors = require("cors")
const cookieParser = require("cookie-parser")

app.use(express.json()); // to accept json data
app.use(cookieParser())
connectDB()


const allowedOrigins = [process.env.BACKEND_URL, process.env.CLIENT_URL];
const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
};

app.use(cors(corsOptions));

app.use((error, req, res, next) => {
    if (error && process.env.NODE_ENV === "development") {
        res.status(500).json({
            message: error.message,
            stack: error.stack
        })
        console.log(error)
    }
    if (error && process.env.NODE_ENV === "production") {
        res.status(500).json({
            message: error.message,
        })
    }

})


app.get('/', (req, res) => {
    res.send("server working")
})

app.use("/api", apiRoutes)


const server = app.listen(PORT, () => {
    console.log(`Server running on PORT http://localhost:${PORT}`)
})

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.CLIENT_URL
    }
})

io.on("connection", (socket) => {
    console.log("socket connected")

    socket.on("setup", (userData) => {
        socket.join(userData._id)
        console.log(userData._id)
        socket.emit("connected")
    })

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
    })

    socket.on("typing", (room) => {
        console.log("typing in",room)
        socket.to(room).emit("typing");
    });
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat

        if (!chat.users) return console.log("chat.users not defined")

        chat.users.forEach((user) => {
            if (user._id === newMessageRecieved.sender._id) return

            socket.in(user._id).emit("message recieved", newMessageRecieved)
        })
    })

})

