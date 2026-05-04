const {Admin} = require('../../models')
const {hashPassword, comparePassword, generateToken} = require('../utils/helper')
const {v4: uuidv4} = require('uuid')
const {validateRegister, validateLogin} = require('../validations/admin')


const registerAdmin = async (req, res) => {
    const {username,email,password,image_url,role,status} = req.body
    try{
        const { error, value } = validateRegister.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
        const existingAdmin = await Admin.findOne({where:{email}})
        if(existingAdmin){
            throw new Error('Admin with this email already exists')
        }
        const hashedPassword = await hashPassword(password)
        const newAdmin = await Admin.create({
            admin_id: uuidv4(),
            username,
            email,
            password_hash: hashedPassword,
            image_url,
            role,
            status
        })
        res.status(201).json({
            message: 'Admin registered successfully'
        })
        
    }
 catch(error) {
    res.status(500).json({
        message: error.message
    })
}
}

const loginAdmin = async (req, res) => {
    const {email, password} = req.body
    try{
        const { error, value } = validateLogin.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });
        const existingAdmin = await Admin.findOne({where:{email}})
        if(!existingAdmin){
            throw new Error('Admin not found ')
        }
        const isPasswordValid = await comparePassword(password, existingAdmin.password_hash)
        if(!isPasswordValid || !existingAdmin){
            throw new Error('Invalid email or password')
        }
        const token = await generateToken({
            admin_id: existingAdmin.admin_id,
            email: existingAdmin.email,
            role: existingAdmin.role
        })
         res.set("Authorization", `Bearer ${token}`);
        console.log("Token generated:", token);
        res.status(200).json({
            status: true,
            message: 'Login successful',
            token


        })
    } catch(error) {
        res.status(500).json({
            message: error.message
        })
    }
}


const getAllAdmin = async (req, res)=>{
    try {
        const admins = await Admin.findAll()
        res.status(200).json({
            status: true,
            message: 'Admins retrieved successfully',
            data: admins
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}
const getSingleAdmin = async (req, res)=>{
    const {admin_id} = req.params
    try {
        const admin = await Admin.findOne({where:{admin_id}})
        if(!admin){
            throw new Error('Admin not found')
        }
        res.status(200).json({
            status: true,
            message: 'Admin retrieved successfully',
            data: admin
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const deleteAdmin = async (req, res)=>{
    const {admin_id} = req.params
    try {
        const admin = await Admin.findOne({where:{admin_id}})
        if(!admin){
            throw new Error('Admin not found')
        }
        await Admin.destroy({where:{admin_id}})
        res.status(200).json({
            status: true,
            message: 'Admin deleted successfully'
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

module.exports = {
    registerAdmin,
    loginAdmin,
    getAllAdmin,
    getSingleAdmin,
    deleteAdmin
}