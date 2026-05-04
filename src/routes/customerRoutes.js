const express = require('express');
const router = express.Router();
const { registerCustomer, loginCustomer, getAllCustomers, getSingleCustomer, deleteCustomer } = require('../controllers/customers');

router.post('/register/customer', registerCustomer )
router.post('/login/customer', loginCustomer)
router.get('/customers', getAllCustomers)
router.get('/customer/:customer_id', getSingleCustomer)
router.delete('/customer/:customer_id', deleteCustomer)

module.exports = router;