const jwt = require('jsonwebtoken');
const config = require('../config/config');

const authMiddleware = (req, res, next) => {
  try {
    // Obtener el token del header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: 'Authorization header is missing',
      });
    }

    // Verificar el formato: Bearer <token>
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        message: 'Authorization header format must be: Bearer <token>',
      });
    }

    const token = parts[1];

    // Verificar el token
    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      req.user = decoded; // Guardar la información del usuario en req
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          message: 'Token expired',
        });
      }
      return res.status(401).json({
        message: 'Invalid token',
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

module.exports = authMiddleware;
