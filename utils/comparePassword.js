const bcrypt = require('bcryptjs')

const hashingPassword = (password) => {
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt)
    return hashedPassword
}

const comparePassword = (password, hashedPassword) => {
    const comparedPassword = bcrypt.compareSync(password, hashedPassword)
    return comparedPassword
}

// console.log(comparePassword("Karan@123", "$2a$10$LetT5YLrXv/zwu6AxH1ogOrDYvAFQSFzt73w3lzlspeS.Y.Wh4.ES"))
// console.log(comparePassword("Karan@123", "$2a$10$Euo1pHfQAkV.Ix1CrBZ2/.rFulhrcMr4Y6cGs1xqaOqMfCpPpdOzS"))

module.exports = {
    hashingPassword,
    comparePassword
}
