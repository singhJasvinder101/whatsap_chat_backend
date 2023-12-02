const jwt = require("jsonwebtoken")

const verifyIsLoggedIn = (req, res, next) => {
    const token = req.cookies.auth_token
    try {
        if (!token) {
            return res.status(403).send("A token is required for authentication")
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
            req.user = decoded
            next()
        } catch (error) {
            next(error)
        }
    } catch (error) {
        next(error)
    }
}

function verifyIsAdmin(req, res, next) {
    try {
        if (req.user && req.user.isAdmin) {
            next()
        }else{
            return res.status(401).send("Unauthorized. Admin required")
        }
    } catch (error) {
        next(error)
    }
}

module.exports = {
    verifyIsAdmin,
    verifyIsLoggedIn
}
