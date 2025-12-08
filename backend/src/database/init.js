const bcrypt = require('bcryptjs');
const pool = require('../config/database');

async function initDatabase() {
  try {
    console.log('🔄 Initializing database...');

    // Verificar conexión
    await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful');

    // Crear usuario de ejemplo con password hasheado
    const hashedPassword = await bcrypt.hash('changeme', 10);
    
    try {
      await pool.query(`
        INSERT INTO users (name, email, password, role, avatar)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (email) DO NOTHING
      `, [
        'John Doe',
        'john@mail.com',
        hashedPassword,
        'customer',
        'https://api.lorem.space/image/face?w=640&h=480&r=867'
      ]);
      console.log('✅ Sample user created (email: john@mail.com, password: changeme)');
    } catch (error) {
      console.log('ℹ️ Sample user might already exist');
    }

    console.log('✅ Database initialization completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

initDatabase();
