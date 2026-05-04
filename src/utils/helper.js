require('dotenv').config()
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')



const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(saltRounds)
    const hashedPassword = await bcrypt.hash(password,salt)
    return hashedPassword
}

const comparePassword = async(password, hashedPassword) =>{
    return await bcrypt.compare(password, hashedPassword)
}
const generateToken = async (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};

module.exports = {
    hashPassword,
    comparePassword,
    generateToken
}