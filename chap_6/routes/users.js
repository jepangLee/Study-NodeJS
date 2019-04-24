const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

router.get('/flash', (req, res) => {
  req.session.message = "/flash";
  req.flash('message', '/flash/result');
  res.redirect('/users/flash/result');
});

router.get('/flash/result', (req, res) => {
  res.send(`${req.session.message} ${req.flash('message')}`);
});

module.exports = router;
