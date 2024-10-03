
var models = require('../../models/index');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

exports.signup = async function (req, res) {
    try {
        const { email, password } = req.body;
        // Validate if email or username is missing
        if (!email || !password) {
            return res.send({ error: 'Please provide all required fields.' });
        }
        // Check if the user already exists
        const userExists = await models.User_Auth.findOne({ where: { username: email } });
        if (userExists) {
            return res.send({ success: false, error: 'User already exists with this email.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = await models.User_Auth.create({
            username: email,
            password: hashedPassword,
        });

        const token = jwt.sign({ id: user.id, username: user.email }, JWT_SECRET, { expiresIn: '12h' });
        req.session.user = { username: user.username , id: user.id };
        return res.json({
            success: true,
            message: 'User created successfully!',
            data: {
                id: user.id,
                email: user.username,
                token,
            }
        });
    } catch (e) {
        console.log('error', e);
        console.error('Error creating user: ', e);
        return res.send({ success: false, error: 'Internal server error' });
    }
}

exports.login = async function (req, res) {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.send({ success: false, error: 'Please provide email and password.' });
    }

    try {
        // Find the user by email
        const user = await models.User_Auth.findOne({ where: { username: email } });
        if (!user) {
            return res.send({ success: false, error: 'Invalid email or password.' });
        }

        // Compare password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.send({ success: false, error: 'Invalid email or password.' });
        }

        // Generate a JWT token (valid for 1 hour)
        const token = jwt.sign({ id: user.id, email: user.username }, JWT_SECRET, { expiresIn: '12h' });
        req.session.user = { username: user.username , id: user.id };
        return res.json({
            success: true,
            message: 'Login successful!',
            id: user.id,
            email: user.username,
            token,
        });
    } catch (error) {
        console.error('Error logging in: ', error);
        return res.send({ success: false, error: 'Internal server error' });
    }
}
