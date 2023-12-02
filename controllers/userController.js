const User = require('../models/userModel')
const { comparePassword, hashingPassword } = require('../utils/comparePassword')
const { generateAuthToken } = require('../utils/generateAuthToken')
const bcrypt = require('bcryptjs')

const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, pic } = req.body
        if (!name && !lastname && !email && !password) {
            return res.status(400).send("All inputs are required")
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "user already exists"
            })
        } else {
            // const hashedPassword = hashingPassword(password.toString())
            const newUser = await User.create({
                name: req.body.name,
                lastname: req.body.lastname,
                email: req.body.email.toLowerCase(),
                password: password,
                isAdmin: req.body.isAdmin,
                pic
            })
            return res.cookie("auth_token", generateAuthToken(
                newUser._id, newUser.name, newUser.email, newUser.isAdmin, newUser.pic
            ), {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "strict"
            })
                .status(201).json({
                    success: "user created",
                    userCreated: {
                        _id: newUser._id,
                        name: newUser.name,
                        email: newUser.email,
                        isAdmin: newUser.isAdmin,
                        pic: newUser.pic
                    }
                })
        }
    } catch (error) {
        next(error)
    }
}
const loginUser = async (req, res, next) => {
    try {
        const { email, password, donotlogout } = req.body
        if (!(email && password)) {
            return res.status(400).send("All input fields are required")
        }
        const userExists = await User.findOne({ email }).orFail();
        // console.log( password, userExists.password, comparePassword(password.toString(), userExists.password))
        if (userExists && comparePassword(password, userExists.password)) {
            const cookieParams = {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "strict"
            }
            if (donotlogout) {
                cookieParams = { ...cookieParams, maxAge: 1000 * 60 * 60 * 24 * 7 }
            }
            return res.cookie('auth_token', generateAuthToken(
                userExists._id, userExists.name, userExists.email, userExists.isAdmin, userExists.pic
            ), cookieParams)
                .json({
                    success: true,
                    userLoggedIn: {
                        _id: userExists._id,
                        name: userExists.name,
                        email: userExists.email,
                        isAdmin: userExists.isAdmin,
                        donotlogout,
                        pic: userExists.pic
                    }
                })
        } else {
            return res.status(401).send("wrong credentials")
        }
    } catch (error) {
        next(error)
    }
}

async function getAllUsers(req, res, next) {
    try {
        // /api/user?search=jasvinder
        const keyword = req.query.search ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } },
            ]
        } : {}

        const users = await User.find({ ...keyword, _id: { $ne: req.user._id } })
        return res.send(users)
    } catch (error) {
        next(error)
    }
}



module.exports = {
    registerUser,
    loginUser,
    getAllUsers,
}
