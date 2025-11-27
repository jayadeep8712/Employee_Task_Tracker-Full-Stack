const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getUserByEmail } = require('../models/userModel');
const { appConfig } = require('../config');

function login(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = getUserByEmail(email.toLowerCase());
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isValid = bcrypt.compareSync(password, user.passwordHash);
  if (!isValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const payload = {
    id: user.id,
    role: user.role,
    employeeId: user.employeeId,
    email: user.email,
    employeeName: user.employeeName,
  };

  const token = jwt.sign(payload, appConfig.jwtSecret, {
    expiresIn: '8h',
  });

  return res.json({
    data: {
      token,
      user: payload,
    },
  });
}

module.exports = { login };

