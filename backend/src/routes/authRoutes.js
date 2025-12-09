const express = require('express');
const AuthController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// POST /api/v1/auth/register - Registrar nuevo usuario
router.post('/register', AuthController.register);

// POST /api/v1/auth/login - Iniciar sesión
router.post('/login', AuthController.login);

// GET /api/v1/auth/profile - Obtener perfil del usuario autenticado
router.get('/profile', authMiddleware, AuthController.getProfile);

// POST /api/v1/auth/refresh-token - Refrescar access token
router.post('/refresh-token', AuthController.refreshToken);

// POST /api/v1/auth/logout - Cerrar sesión
router.post('/logout', AuthController.logout);

module.exports = router;
