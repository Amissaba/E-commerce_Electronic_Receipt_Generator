const express = require('express');
const router = express.Router();
const {createProduct, updateProduct,deleteProduct, getProducts, getSingleProduct} = require('../controllers/product')
const AdminAuthorization = require('../middleware/authorization');

router.post('/create/product', AdminAuthorization, createProduct)
router.put('/update/product/:product_id', AdminAuthorization, updateProduct)
router.delete('/delete/product/:product_id', AdminAuthorization, deleteProduct)
router.get('/products', getProducts)
router.get('/product/:product_id', getSingleProduct)

module.exports = router;