var express = require('express');
var controller = require('./users');
var models = require('../../models/index');
var router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const jwt = require('jsonwebtoken');


function authenticateToken(req, res, next) {
    const token = req.headers['x-at-sessiontoken'];

    if (!token) {
        return res.send({ success: false, error: 'Unauthorized, token is missing' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.send({ success: false, error: 'Invalid token' });
        }
        req.user = user;  // Store user info in request object
        next();
    });
}

router.post('/register',authenticateToken, controller.userRegister);
router.get('/get',authenticateToken, controller.getUsers);
router.put('/update',authenticateToken, controller.updateUser);
router.delete('/delete/:id',authenticateToken, controller.userDelete);

module.exports = router;