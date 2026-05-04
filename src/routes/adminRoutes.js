const express = require('express');
const router = express.Router();
const AdminAuthorization = require('../middleware/authorization');
const { registerAdmin,loginAdmin,getAllAdmin,getSingleAdmin,deleteAdmin } = require('../controllers/admin');

router.post('/register/admin', registerAdmin )
router.post('/login/admin', loginAdmin)
router.get('/admins', AdminAuthorization, getAllAdmin)
router.get('/admin/:admin_id', AdminAuthorization, getSingleAdmin)
router.delete('/admin/:admin_id', AdminAuthorization, deleteAdmin)


module.exports = router;
