const jwt = require('jsonwebtoken');
const Patient = require('../models/patientModel');

const patientProtect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.user = await Patient.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Patient not found' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = patientProtect;