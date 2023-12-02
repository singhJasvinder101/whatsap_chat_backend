const router = require("express").Router()
const userRoutes = require("./userRoutes")
const chatRoutes = require("./chatRoutes")
const messageRoutes = require("./messageRoutes")
const jwt = require("jsonwebtoken")

router.use("/user", userRoutes)
router.use("/chats", chatRoutes)
router.use("/message", messageRoutes)


router.get("/get-token", (req, res) => {
    try {
        const accessToken = req.cookies.auth_token
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
        return res.json({ token: decoded.name, isAdmin: decoded.isAdmin });
    } catch (err) {
        return res.status(401).send(err);
    }
})


module.exports = router

