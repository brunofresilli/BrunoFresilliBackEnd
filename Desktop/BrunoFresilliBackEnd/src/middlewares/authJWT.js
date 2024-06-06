const jwt = require('jsonwebtoken');

const authorize = (requiredRole) => {
    return (req, res, next) => {
        
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ message: 'Acceso no autorizado. Token no proporcionado.' });
        }

        
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                console.error('Error al decodificar el token:', err);
                return res.status(401).json({ message: 'Acceso no autorizado. Token inválido.' });
            }

            console.log('Token decodificado:', decodedToken);

          
            const userRole = decodedToken.role;

            
            console.log('Rol requerido:', requiredRole);
            console.log('Rol del usuario:', userRole);

            if (userRole !== requiredRole) {
                return res.status(403).json({ message: 'Acceso prohibido. No tienes permisos suficientes.' });
            }

            next();
        });
    };
};

module.exports = authorize;
