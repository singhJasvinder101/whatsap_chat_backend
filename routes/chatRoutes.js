const { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup } = require("../controllers/chatController")
const { verifyIsLoggedIn } = require("../middleware/VerifyAuthToken")

const router = require("express").Router()

router.use(verifyIsLoggedIn)
router.post('/', accessChat)
router.get('/', fetchChats)
router.post("/group", createGroupChat);
router.patch("/rename", renameGroup);
router.patch("/groupremove", removeFromGroup);
router.patch("/groupadd", addToGroup);

module.exports = router
