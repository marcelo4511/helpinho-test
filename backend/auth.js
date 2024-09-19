const jwt = require('jsonwebtoken');


const generateToken = (user) => {
    const payload = {
        id: user.id,
        email: user.email,
    };

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = { generateToken };

