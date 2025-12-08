const Product = require('../models/Product');

class ProductController {
  // Obtener todos los productos con paginación
  static async getAll(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const offset = parseInt(req.query.offset) || 0;

      const products = await Product.findAll(limit, offset);

      return res.status(200).json(products);
    } catch (error) {
      console.error('Get all products error:', error);
      return res.status(500).json({
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

  // Obtener un producto por ID
  static async getById(req, res) {
    try {
      const { id } = req.params;

      const product = await Product.findById(id);

      if (!product) {
        return res.status(404).json({
          message: 'Product not found',
        });
      }

      return res.status(200).json(product);
    } catch (error) {
      console.error('Get product by id error:', error);
      return res.status(500).json({
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

  // Crear un nuevo producto
  static async create(req, res) {
    try {
      const { title, price, description, category_id, images } = req.body;

      // Validaciones básicas
      if (!title || !price) {
        return res.status(400).json({
          message: 'Title and price are required',
        });
      }

      const productData = {
        title,
        price,
        description: description || null,
        category_id: category_id || null,
        images: images || [],
      };

      const newProduct = await Product.create(productData);

      return res.status(201).json(newProduct);
    } catch (error) {
      console.error('Create product error:', error);
      return res.status(500).json({
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

  // Actualizar un producto
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { title, price, description, category_id, images } = req.body;

      // Verificar que el producto existe
      const existingProduct = await Product.findById(id);
      if (!existingProduct) {
        return res.status(404).json({
          message: 'Product not found',
        });
      }

      const productData = {
        title: title || null,
        price: price || null,
        description: description || null,
        category_id: category_id || null,
        images: images || null,
      };

      const updatedProduct = await Product.update(id, productData);

      return res.status(200).json(updatedProduct);
    } catch (error) {
      console.error('Update product error:', error);
      return res.status(500).json({
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

  // Eliminar un producto
  static async delete(req, res) {
    try {
      const { id } = req.params;

      const deletedProduct = await Product.delete(id);

      if (!deletedProduct) {
        return res.status(404).json({
          message: 'Product not found',
        });
      }

      return res.status(200).json({
        message: 'Product deleted successfully',
        id: deletedProduct.id,
      });
    } catch (error) {
      console.error('Delete product error:', error);
      return res.status(500).json({
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

  // Buscar productos por categoría
  static async getByCategory(req, res) {
    try {
      const { categoryId } = req.params;
      const limit = parseInt(req.query.limit) || 10;
      const offset = parseInt(req.query.offset) || 0;

      const products = await Product.findByCategory(categoryId, limit, offset);

      return res.status(200).json(products);
    } catch (error) {
      console.error('Get products by category error:', error);
      return res.status(500).json({
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

  // Buscar productos por título
  static async search(req, res) {
    try {
      const { title } = req.query;
      const limit = parseInt(req.query.limit) || 10;
      const offset = parseInt(req.query.offset) || 0;

      if (!title) {
        return res.status(400).json({
          message: 'Search term is required',
        });
      }

      const products = await Product.searchByTitle(title, limit, offset);

      return res.status(200).json(products);
    } catch (error) {
      console.error('Search products error:', error);
      return res.status(500).json({
        message: 'Internal server error',
        error: error.message,
      });
    }
  }
}

module.exports = ProductController;
