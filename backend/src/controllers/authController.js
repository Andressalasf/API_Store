const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const config = require('../config/config');

class AuthController {
  // Registro de nuevo usuario
  static async register(req, res) {
    try {
      const { name, email, password, role = 'customer', avatar } = req.body;

      // Validaciones básicas
      if (!name || !email || !password) {
        return res.status(400).json({
          message: 'Name, email and password are required',
        });
      }

      // Verificar si el usuario ya existe
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          message: 'User with this email already exists',
        });
      }

      // Hashear la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear el usuario
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
        avatar: avatar || `https://api.lorem.space/image/face?w=640&h=480&r=${Math.floor(Math.random() * 1000)}`,
      });

      return res.status(201).json({
        message: 'User created successfully',
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          avatar: newUser.avatar,
        },
      });
    } catch (error) {
      console.error('Register error:', error);
      return res.status(500).json({
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

  // Login - Obtener access y refresh tokens
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validar que existan email y password
      if (!email || !password) {
        return res.status(400).json({
          message: 'Email and password are required',
        });
      }

      // Buscar usuario por email (incluyendo password para validación)
      const user = await User.findByEmail(email);
      
      if (!user) {
        return res.status(401).json({
          message: 'Invalid credentials',
        });
      }

      // Verificar password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({
          message: 'Invalid credentials',
        });
      }

      // Generar access token (válido por 20 días)
      const accessToken = jwt.sign(
        { sub: user.id, email: user.email, role: user.role },
        config.jwt.secret,
        { expiresIn: config.jwt.accessExpiration }
      );

      // Generar refresh token (válido por 10 horas)
      const refreshToken = jwt.sign(
        { sub: user.id },
        config.jwt.secret,
        { expiresIn: config.jwt.refreshExpiration }
      );

      // Guardar refresh token en la base de datos
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 10); // 10 horas
      await RefreshToken.create(user.id, refreshToken, expiresAt);

      // Retornar tokens
      return res.status(201).json({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

  // Obtener perfil del usuario autenticado
  static async getProfile(req, res) {
    try {
      const userId = req.user.sub;

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          message: 'User not found',
        });
      }

      return res.status(200).json({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      });
    } catch (error) {
      console.error('Get profile error:', error);
      return res.status(500).json({
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

  // Refrescar access token usando refresh token
  static async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          message: 'Refresh token is required',
        });
      }

      // Verificar que el refresh token exista en la BD
      const storedToken = await RefreshToken.findByToken(refreshToken);

      if (!storedToken) {
        return res.status(401).json({
          message: 'Invalid refresh token',
        });
      }

      // Verificar que no haya expirado
      if (new Date(storedToken.expires_at) < new Date()) {
        await RefreshToken.deleteByToken(refreshToken);
        return res.status(401).json({
          message: 'Refresh token expired',
        });
      }

      // Verificar y decodificar el refresh token
      let decoded;
      try {
        decoded = jwt.verify(refreshToken, config.jwt.secret);
      } catch (error) {
        await RefreshToken.deleteByToken(refreshToken);
        return res.status(401).json({
          message: 'Invalid refresh token',
        });
      }

      // Obtener información del usuario
      const user = await User.findById(decoded.sub);

      if (!user) {
        return res.status(404).json({
          message: 'User not found',
        });
      }

      // Generar nuevos tokens
      const newAccessToken = jwt.sign(
        { sub: user.id, email: user.email, role: user.role },
        config.jwt.secret,
        { expiresIn: config.jwt.accessExpiration }
      );

      const newRefreshToken = jwt.sign(
        { sub: user.id },
        config.jwt.secret,
        { expiresIn: config.jwt.refreshExpiration }
      );

      // Eliminar el refresh token anterior y guardar el nuevo
      await RefreshToken.deleteByToken(refreshToken);
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 10);
      await RefreshToken.create(user.id, newRefreshToken, expiresAt);

      return res.status(200).json({
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      });
    } catch (error) {
      console.error('Refresh token error:', error);
      return res.status(500).json({
        message: 'Internal server error',
        error: error.message,
      });
    }
  }
}

module.exports = AuthController;
