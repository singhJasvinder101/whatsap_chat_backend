const { sendMessage, allMessages } = require("../controllers/messageController")
const { verifyIsLoggedIn } = require("../middleware/VerifyAuthToken")

const router = require("express").Router()


router.use(verifyIsLoggedIn)
router.post('/', sendMessage)
router.get('/:chatId', allMessages)


module.exports = router