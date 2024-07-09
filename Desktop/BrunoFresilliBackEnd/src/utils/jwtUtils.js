const jwt = require('jsonwebtoken');

const JWT_SECRET = "1234"

const generateToken = (user) => {
    if (!user.role) {
        throw new Error('User role is not defined');
      }
    const payload = {
        cart: user.cart,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role, 
      };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); 
    
    return token;
}
const passwordValidation = async (user,password) => bcrypt.compare(password,user.password);
const createToken = (payload, duration) => jwt.sign(payload, JWT_SECRET, { expiresIn: duration });

const verifyToken = (req, res, next) => {
  // Obtener el token desde diferentes fuentes
  const headerToken = req.headers.authorization ? req.headers.authorization.split(' ')[1] : undefined;
  const cookieToken = req.cookies && req.cookies['bf_cookie'] ? req.cookies['bf_cookie'] : undefined;
  const queryToken = req.query.access_token ? req.query.access_token : undefined;
  const receivedToken = headerToken || cookieToken || queryToken;

  if (!receivedToken) {
    return res.status(401).json({ status: 'error', message: 'Token JWT no proporcionado' });
  }

  // Verificar el token JWT
  jwt.verify(receivedToken, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ status: 'error', message: 'Token JWT inválido' });
    }
    req.user = decoded; // Almacena la información del usuario decodificado si es necesario
    next();
  });
};

 const rateLimiter = (mins, limit) => {
    return rateLimit({
        windowMs: mins * 60 * 1000,
        limit: limit, // por ip por ventana
        standardHeaders: 'draft-7',
        legacyHeaders: false,
        message: { status: 'ERR', data: 'Demasiadas solicitudes de acceso, por favor reintente más tarde' }
    });
}



module.exports = {generateToken, 
                  rateLimiter, 
                  verifyToken, 
                  createToken, 
                  passwordValidation };