const {Customer} = require('../../models')
const {hashPassword, comparePassword, generateToken} = require('../utils/helper')
const {v4: uuidv4} = require('uuid')
const {validateRegister, validateLogin} = require('../validations/customer')

const registerCustomer = async (req, res) => {
    const {full_name,email,password,address,phone} = req.body
    try{
        const { error, value } = validateRegister.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
        const existingCustomer = await Customer.findOne({where:{email}})
        if(existingCustomer){
            throw new Error('Customer with this email already exists')
        }
        const hashedPassword = await hashPassword(password)
        const newCustomer = await Customer.create({
            customer_id: uuidv4(),
            full_name,
            email,
            password_hash: hashedPassword,
            address,
            phone
        })
        res.status(201).json({
            message: 'Customer registered successfully'
        })
        
    }
 catch(error) {
    res.status(500).json({
        message: error.message
    }) 
}
}

const loginCustomer = async (req, res) => {
    const {email, password} = req.body
    try{
        const { error, value } = validateLogin.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });
        const existingCustomer = await Customer.findOne({where:{email}})
        if(!existingCustomer){
            throw new Error('Customer not found ')
        }
        const isPasswordValid = await comparePassword(password, existingCustomer.password_hash)
        if(!isPasswordValid || !existingCustomer){
            throw new Error('Invalid email or password')
        }
        const token = await generateToken({
            customer_id: existingCustomer.customer_id,
            email: existingCustomer.email
        })
         res.set("Authorization", `Bearer ${token}`);
        console.log("Token generated:", token);
        res.status(200).json({
            status: true,
            message: 'Login successful',
            token
        })
    }
    catch(error) {
        res.status(500).json({
            message: error.message
        })
    }
}


const getAllCustomers = async (req, res)=>{
    try {
        const customers = await Customer.findAll()
        res.status(200).json({
            status: true,
            message: 'Customers retrieved successfully',
            data: customers
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const getSingleCustomer = async (req, res)=>{
    const {customer_id} = req.params
    try {
        const customer = await Customer.findOne({where:{customer_id}})
        if(!customer){
            throw new Error('Customer not found')
        }
        res.status(200).json({
            status: true,
            message: 'Customer retrieved successfully',
            data: customer
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const deleteCustomer = async (req, res)=>{
    const {customer_id} = req.params
    try {
        const customer = await Customer.findOne({where:{customer_id}})
        if(!customer){
            throw new Error('Customer not found')
        }
        await Customer.destroy({where:{customer_id}})
        res.status(200).json({
            status: true,
            message: 'Customer deleted successfully'
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

module.exports = {
    registerCustomer,
    loginCustomer,
    getAllCustomers,
    getSingleCustomer,
    deleteCustomer
}