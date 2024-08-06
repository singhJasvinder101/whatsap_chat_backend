const { sendMessage, allMessages, deleteMessage, editMessage } = require("../controllers/messageController")
const { verifyIsLoggedIn } = require("../middleware/VerifyAuthToken")

const router = require("express").Router()


router.use(verifyIsLoggedIn)
router.post('/', sendMessage)
router.get('/:chatId', allMessages)
router.delete('/delete', deleteMessage)
router.patch('/edit', editMessage)


module.exports = router