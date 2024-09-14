const jwt = require('jsonwebtoken');


const generateToken = (user) => {
    const payload = {
        id: user.id,
        email: user.email,
    };

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = { generateToken };

// const authenticateToken = (req, res, next) => {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];
  
//     if (token == null) return res.sendStatus(401);
  
//     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//         if (err) return res.sendStatus(403);
    
//             req.user = user;
//             next();
//         });
//     };
  
//   module.exports = { authenticateToken };