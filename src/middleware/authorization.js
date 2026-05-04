const jwt = require('jsonwebtoken');
const { Admin } = require('../../models'); // adjust path if needed
const AdminAuthorization = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    // Check if token exists and starts with Bearer
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied, token missing.' });
    }
    const token = authorization.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err || !decoded) {
        return res.status(403).json({ message: 'Access denied, invalid token.' });
      }
      const checkDB = await Admin.findOne({ where: { email: decoded.email } });
      if (!checkDB) {
        return res.status(404).json({ message: 'Admin not found.' });
      }
      const validRoles = ['admin', 'superadmin'];
      if (!validRoles.includes(checkDB.role.toLowerCase())) {
        return res.status(403).json({ message: 'Access denied, not an admin.' });
      }
      req.admin = checkDB;
      next(); 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
module.exports = 
    AdminAuthorization