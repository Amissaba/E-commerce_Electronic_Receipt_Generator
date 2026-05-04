const joi = require('joi')

const validateRegister = joi.object({
    username : joi.string().min(2).max(50).required(),
    email: joi.string().email().required(),
    password: joi.string().min(8).required(),
    role: joi.string().valid('superadmin', 'admin').default('admin'),
    image_url: joi.string().uri().allow(null, ''),
    status: joi.string().valid('active', 'inactive').default('active')
})

const validateLogin = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(8).required()
})

module.exports = {
    validateLogin,
    validateRegister
}