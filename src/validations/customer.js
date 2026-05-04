const joi = require('joi')

const validateRegister = joi.object({
    full_name : joi.string().min(2).max(100).required(),
    email: joi.string().email().required(),
    password: joi.string().min(8).required(),
    address: joi.string().allow(null, ''),
    phone: joi.string().required()
})

const validateLogin = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(8).required()
})

module.exports = {
    validateLogin,
    validateRegister
}