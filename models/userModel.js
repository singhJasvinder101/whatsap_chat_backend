const mongoose = require("mongoose")
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = mongoose.Schema({
    name: { type: "String", required: true },
    email: {
        type: "String",
        unique: true,
        required: true,
        validate: {
            validator: validator.isEmail,
            message: 'Enter the valid email'
        }
    },
    password: {
        type: "String",
        required: true,
        trim: true,
        match: [/^(?=.*[!@#$%^&*?])(?=.*[A-Z])(?=.*\d).{5,}$/, "invalid password"]
    },
    pic: {
        type: "String",
        required: true,
        default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
},
    { timestaps: true }
)

userSchema.pre("save", async function (next) {
    if (!this.isModified) {
        next()
    }
    
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hashSync(this.password, salt);
})

const User = mongoose.model("User", userSchema);

module.exports = User;
