const express = require('express');
const router = express.Router();
const customerAuthorization = require('../middleware/customerAuthorization');
const {createOrder} = require('../controllers/order')

router.post('/create/order', customerAuthorization, createOrder)

module.exports = router;