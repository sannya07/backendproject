const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Ensure this path is correct

// GET: Login page
router.get('/', (req, res) => {
  res.render('login');
});

// POST: Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await User.findOne({ username });
      if (!user || user.password !== password) {
        return res.redirect('/'); // Invalid credentials
      }
  
      req.session.user = { id: user._id, username: user.username }; // Set the session correctly
      res.redirect('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  

// POST: Logout
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
