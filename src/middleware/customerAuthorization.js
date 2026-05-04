
const jwt = require('jsonwebtoken');
const { Customer } = require('../../models'); // adjust path if needed

const CustomerAuthorization = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Access denied, token missing.'
      });
    }

    const token = authorization.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err || !decoded) {
        return res.status(403).json({
          message: 'Access denied, invalid token.'
        });
      }

      const checkDB = await Customer.findOne({
        where: { email: decoded.email }
      });

      if (!checkDB) {
        return res.status(404).json({
          message: 'Customer not found.'
        });
      }

      req.customer = checkDB;

      next();
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = CustomerAuthorization;