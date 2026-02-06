import { getPool } from './database';

const migrations = [
  // Users table
  `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    telegram_id BIGINT UNIQUE NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255),
    username VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_telegram_id (telegram_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  // Products table
  `CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(512),
    stock INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  // Orders table
  `CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    telegram_user_id BIGINT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'processing', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_telegram_user_id (telegram_user_id),
    INDEX idx_status (status)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  // Order items table
  `CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

  // Insert sample products
  `INSERT INTO products (name, description, price, image_url, stock) VALUES
    ('Smartphone Pro', 'Latest flagship smartphone with amazing features', 699.99, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', 50),
    ('Wireless Headphones', 'Premium noise-cancelling wireless headphones', 249.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', 100),
    ('Laptop Ultra', 'Powerful laptop for work and gaming', 1299.99, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', 30),
    ('Smart Watch', 'Fitness tracker and smartwatch in one', 199.99, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', 75),
    ('Tablet HD', '10-inch tablet with stunning display', 399.99, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400', 60),
    ('Camera Pro', 'Professional mirrorless camera', 1499.99, 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400', 20)
  ON DUPLICATE KEY UPDATE id=id;`,
];

async function runMigrations() {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    console.log('Running database migrations...');
    
    for (const migration of migrations) {
      await connection.query(migration);
    }
    
    console.log('Migrations completed successfully!');
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  } finally {
    connection.release();
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('Database setup complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Failed to run migrations:', error);
      process.exit(1);
    });
}

export default runMigrations;
