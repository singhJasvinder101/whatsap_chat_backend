const jwt = require("jsonwebtoken")
require("dotenv").config()

function generateAuthToken(_id, name, email, isAdmin) {
    return jwt.sign({ _id, name, email, isAdmin },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "10h" })
}

module.exports = {
    generateAuthToken
}
