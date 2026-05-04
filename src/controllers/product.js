const {Product} =  require('../../models')
const {v4: uuidv4} = require('uuid')

const createProduct = async (req, res) => {
    const {product_name, image_url, unit, unit_price, discount_percentage, stock} = req.body
    try{
        if(!product_name || !unit_price){
            throw new Error( 'Product name and unit price are required')
        }
        const newProduct = await Product.create({
            product_id: uuidv4(),
            product_name,
            image_url,
            unit,
            unit_price,
            discount_percentage,
            stock
        })
        res.status(201).json({
            message: 'Product created successfully',
            data: newProduct
        })
    } catch(error) {
        res.status(500).json({
            message: error.message 
        })
    }
}

const updateProduct = async (req ,res)=>{
    try {
        const {product_id} = req.params
        const {product_name, image_url, unit, unit_price, discount_percentage,stock} = req.body
        const product = await Product.findOne({where:{product_id}})
        if(!product){
            throw new Error('Product not found')
        }
        await Product.update({
            product_name: product_name ?? product.product_name,
            image_url: image_url ?? product.image_url,
            unit: unit ?? product.unit,
            unit_price: unit_price ?? product.unit_price,
            discount_percentage: discount_percentage ?? product.discount_percentage,
            stock: stock ?? product.stock
        }, {where:{product_id}})
        res.status(200).json({
            status: true,
            message: 'Product updated successfully'
        })
    }
 catch(error) {
        res.status(500).json({
            message: error.message
        })
    }
}


const deleteProduct = async (req, res) => {
    try {
        const {product_id} = req.params
        const product = await Product.findOne({where:{product_id}})
        if(!product){
            throw new Error('Product not found')
        }
        await Product.destroy({where:{product_id}})
        res.status(200).json({
            status: true,
            message: 'Product deleted successfully'
        })
    } catch(error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const getProducts = async (req, res) => {
    try {
        const products = await Product.findAll()
        res.status(200).json({
            status: true,
            data: products
        })
    } catch(error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const getSingleProduct = async (req, res) => {
    try {
        const {product_id} = req.params
        const product = await Product.findOne({where:{product_id}})
        if(!product){
            throw new Error('Product not found')
        }
        res.status(200).json({
            status: true,
            data: product
        })
    } catch(error) {
        res.status(500).json({
            message: error.message
        })
    }
}

module.exports = {
    createProduct,
    updateProduct,
    deleteProduct,
    getProducts,
    getSingleProduct
}