var express = require('express');
var controller = require('./user-auth.js');
var router = express.Router();


router.post('/signup', controller.signup);
router.post('/login', controller.login);

module.exports = router;