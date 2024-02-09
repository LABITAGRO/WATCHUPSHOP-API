// routes/profile.js

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {
  try {
    const token = req.query.token;
    const decoded = jwt.verify(token, 'your_secret_key');
    // Verify token and send response
    res.json({ message: 'Welcome to your profile page', userId: decoded.userId });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;
