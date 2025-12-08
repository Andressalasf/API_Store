const express = require('express');
const ProductController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// GET /api/v1/products - Obtener todos los productos (público)
router.get('/', ProductController.getAll);

// GET /api/v1/products/:id - Obtener un producto por ID (público)
router.get('/:id', ProductController.getById);

// GET /api/v1/products/category/:categoryId - Obtener productos por categoría (público)
router.get('/category/:categoryId', ProductController.getByCategory);

// GET /api/v1/products/search?title=... - Buscar productos por título (público)
router.get('/search', ProductController.search);

// POST /api/v1/products - Crear un producto (público)
router.post('/', ProductController.create);

// PUT /api/v1/products/:id - Actualizar un producto (público)
router.put('/:id', ProductController.update);

// DELETE /api/v1/products/:id - Eliminar un producto (público)
router.delete('/:id', ProductController.delete);

module.exports = router;
