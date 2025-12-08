const pool = require('../config/database');

class Product {
  static async findAll(limit = 10, offset = 0) {
    const query = `
      SELECT p.*, c.name as category_name, c.image as category_image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.id
      LIMIT $1 OFFSET $2
    `;
    const result = await pool.query(query, [limit, offset]);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT p.*, c.name as category_name, c.image as category_image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async create(productData) {
    const { title, price, description, category_id, images } = productData;
    const query = `
      INSERT INTO products (title, price, description, category_id, images)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const result = await pool.query(query, [title, price, description, category_id, images]);
    return result.rows[0];
  }

  static async update(id, productData) {
    const { title, price, description, category_id, images } = productData;
    const query = `
      UPDATE products
      SET title = COALESCE($1, title),
          price = COALESCE($2, price),
          description = COALESCE($3, description),
          category_id = COALESCE($4, category_id),
          images = COALESCE($5, images)
      WHERE id = $6
      RETURNING *
    `;
    const result = await pool.query(query, [title, price, description, category_id, images, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM products WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByCategory(categoryId, limit = 10, offset = 0) {
    const query = `
      SELECT p.*, c.name as category_name, c.image as category_image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.category_id = $1
      ORDER BY p.id
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [categoryId, limit, offset]);
    return result.rows;
  }

  static async searchByTitle(searchTerm, limit = 10, offset = 0) {
    const query = `
      SELECT p.*, c.name as category_name, c.image as category_image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.title ILIKE $1
      ORDER BY p.id
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [`%${searchTerm}%`, limit, offset]);
    return result.rows;
  }
}

module.exports = Product;
