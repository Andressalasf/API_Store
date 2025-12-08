const pool = require('../config/database');

class RefreshToken {
  static async create(userId, token, expiresAt) {
    const query = `
      INSERT INTO refresh_tokens (user_id, token, expires_at)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const result = await pool.query(query, [userId, token, expiresAt]);
    return result.rows[0];
  }

  static async findByToken(token) {
    const query = 'SELECT * FROM refresh_tokens WHERE token = $1';
    const result = await pool.query(query, [token]);
    return result.rows[0];
  }

  static async deleteByToken(token) {
    const query = 'DELETE FROM refresh_tokens WHERE token = $1';
    await pool.query(query, [token]);
  }

  static async deleteExpiredTokens() {
    const query = 'DELETE FROM refresh_tokens WHERE expires_at < NOW()';
    await pool.query(query);
  }

  static async deleteByUserId(userId) {
    const query = 'DELETE FROM refresh_tokens WHERE user_id = $1';
    await pool.query(query, [userId]);
  }
}

module.exports = RefreshToken;
