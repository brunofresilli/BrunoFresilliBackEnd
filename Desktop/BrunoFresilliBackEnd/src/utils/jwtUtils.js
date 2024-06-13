const jwt = require('jsonwebtoken');

const JWT_SECRET = "1234"

const generateToken = (user) => {
    if (!user.role) {
        throw new Error('User role is not defined');
      }
    const payload = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role, 
      };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); 
    
    return token;
}



module.exports = {generateToken };