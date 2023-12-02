const { registerUser, loginUser, getAllUsers } = require("../controllers/userController")
const { verifyIsLoggedIn, verifyIsAdmin } = require("../middleware/VerifyAuthToken")

const router = require("express").Router()

router.post("/register", registerUser)
router.post("/login", loginUser)

router.use(verifyIsLoggedIn)

router.get('/allusers', getAllUsers);

router.use(verifyIsAdmin)

module.exports = router

