import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { nanoid } from 'nanoid';
import * as schema from '../shared/schema-sqlite.js';

// Create SQLite database
const sqlite = new Database('./local.db');
sqlite.exec('PRAGMA foreign_keys = ON;');
const db = drizzle({ client: sqlite, schema });

console.log('🔧 Initializing local SQLite database...');

// Create tables
sqlite.exec(`
CREATE TABLE IF NOT EXISTS sessions (
  sid TEXT PRIMARY KEY,
  sess TEXT NOT NULL,
  expire INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS IDX_session_expire ON sessions(expire);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  first_name TEXT,
  last_name TEXT,
  profile_image_url TEXT,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price REAL NOT NULL,
  sku TEXT NOT NULL UNIQUE,
  image_url TEXT NOT NULL,
  features TEXT,
  category TEXT NOT NULL,
  in_stock INTEGER DEFAULT 1,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  order_number TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending',
  subtotal REAL NOT NULL,
  tax REAL NOT NULL,
  shipping REAL NOT NULL,
  total REAL NOT NULL,
  payment_method TEXT,
  shipping_address TEXT,
  billing_address TEXT,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT REFERENCES orders(id),
  product_id TEXT REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price REAL NOT NULL,
  created_at INTEGER DEFAULT (unixepoch())
);
`);

// Insert sample products
const sampleProducts = [
  {
    id: nanoid(),
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
    price: 129.99,
    sku: 'WBH-001',
    imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500',
    features: JSON.stringify(['Noise Cancellation', '30hr Battery', 'Bluetooth 5.0', 'Fast Charging']),
    category: 'Electronics',
    inStock: true
  },
  {
    id: nanoid(),
    name: 'Smart Fitness Watch',
    description: 'Advanced fitness tracking with heart rate monitor, GPS, and smartphone notifications.',
    price: 249.99,
    sku: 'SFW-002',
    imageUrl: 'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=500',
    features: JSON.stringify(['Heart Rate Monitor', 'GPS Tracking', 'Water Resistant', 'Sleep Tracking']),
    category: 'Wearables',
    inStock: true
  },
  {
    id: nanoid(),
    name: 'Portable Laptop Stand',
    description: 'Ergonomic aluminum laptop stand that improves posture and increases productivity.',
    price: 79.99,
    sku: 'PLS-003',
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
    features: JSON.stringify(['Aluminum Construction', 'Adjustable Height', 'Foldable Design', 'Heat Dissipation']),
    category: 'Accessories',
    inStock: true
  }
];

// Insert products
for (const product of sampleProducts) {
  sqlite.prepare(`
    INSERT OR REPLACE INTO products 
    (id, name, description, price, sku, image_url, features, category, in_stock)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    product.id,
    product.name,
    product.description,
    product.price,
    product.sku,
    product.imageUrl,
    product.features,
    product.category,
    product.inStock ? 1 : 0
  );
}

console.log('✅ Local database initialized with sample products!');
console.log('📦 Added', sampleProducts.length, 'sample products');
console.log('🚀 You can now run: npm run dev');

sqlite.close();