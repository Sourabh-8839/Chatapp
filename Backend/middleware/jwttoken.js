const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

const dotenv = require('dotenv');

dotenv.config();

const protect = async (req, res, next) => {
  var token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // token = req.headers.authorization;

      console.log('token>>', token);
      //decodes token id
      const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);

      //   console.log('id>>',decoded);
      req.user = await User.findById(decoded._id).select('-password');

      next();
    } catch (error) {
      res.status(401).json({ success: false, message: error.message });
      console.log(error.message);
    }
  }

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Token is required for authentication',
    });
  }
};

module.exports = { protect };
