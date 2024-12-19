var express = require('express');
var router = express.Router();
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const { route } = require('.');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', function (req, res, next) {
  res.render('login', { title: 'Login', error: null });
});

router.get('/register', function (req, res, next) {
  res.render('register', { title: 'Register', error: null });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).render('login', { error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).render('login', { error: 'Invalid credentials' });
    }

    // Store user data in session
    req.session.user = { id: user._id, username: user.username };

    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).render('login', { error: 'Server error' });
      }
      res.redirect('/'); // Redirect after the session is saved
    });// Redirect to the homepage or dashboard
  } catch (err) {
    console.error(err);
    res.status(500).render('login', { error: 'Server error' });
  }
});

router.post('/register', async (req, res) => {
  const { username, password1, password2 } = req.body;

  try {
    if (password1 !== password2) {
      return res.status(400).render('register', { error: 'Passwords do not match' });
    }

    if(await User.findOne({ username })) {
      return res.status(400).render('register', { error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password1, 10);

    const user = await User.create({ username, password: hashedPassword });
    req.session.user = { id: user._id, username: user.username };

    res.redirect('/users/login'); // Redirect to the homepage or dashboard
  } catch (err) {
    console.error(err);
    res.status(500).render('register', { error: 'Server error' });
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Session destroy error:', err);
      return res.status(500).send('Server error');
    }
    res.redirect('/');
  });
});


module.exports = router;
