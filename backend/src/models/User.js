const pool = require('../config/database');

class User {
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT id, name, email, role, avatar, created_at FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async create(userData) {
    const { name, email, password, role = 'customer', avatar } = userData;
    const query = `
      INSERT INTO users (name, email, password, role, avatar) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING id, name, email, role, avatar, created_at
    `;
    const result = await pool.query(query, [name, email, password, role, avatar]);
    return result.rows[0];
  }

  static async update(id, userData) {
    const { name, email, role, avatar } = userData;
    const query = `
      UPDATE users 
      SET name = COALESCE($1, name), 
          email = COALESCE($2, email), 
          role = COALESCE($3, role), 
          avatar = COALESCE($4, avatar)
      WHERE id = $5 
      RETURNING id, name, email, role, avatar, updated_at
    `;
    const result = await pool.query(query, [name, email, role, avatar, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findAll(limit = 10, offset = 0) {
    const query = `
      SELECT id, name, email, role, avatar, created_at 
      FROM users 
      ORDER BY id 
      LIMIT $1 OFFSET $2
    `;
    const result = await pool.query(query, [limit, offset]);
    return result.rows;
  }
}

module.exports = User;
