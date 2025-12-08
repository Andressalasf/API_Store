const express = require('express');
const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');

const router = express.Router();

// Rutas base
router.use('/auth', authRoutes);
router.use('/products', productRoutes);

// Ruta de verificación de API
router.get('/', (req, res) => {
  res.json({
    message: 'API is running',
    version: '1.0.0',
    endpoints: {
      auth: '/api/v1/auth',
      products: '/api/v1/products',
    },
  });
});

module.exports = router;
