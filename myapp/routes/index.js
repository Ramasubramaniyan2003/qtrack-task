var express = require('express');
var router = express.Router();



router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

router.get('/home', function(req, res, next) {
  res.render('home', { title: 'Express' });
});

router.get('/users', function(req, res, next) {
  res.render('user', { title: 'Express' });
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
});});

module.exports = router;
