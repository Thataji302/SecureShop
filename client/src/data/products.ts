export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sku: string;
  imageUrl: string;
  features: string[];
  category: string;
}

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    description: 'High-quality sound with noise cancellation',
    price: 299.99,
    sku: 'WH-001',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
    features: [
      'Advanced noise cancellation',
      '30-hour battery life', 
      'Premium audio drivers',
      'Wireless Bluetooth 5.0'
    ],
    category: 'Electronics'
  },
  {
    id: '2', 
    name: 'Smart Phone Pro',
    description: 'Latest flagship with advanced camera',
    price: 899.99,
    sku: 'SP-002',
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
    features: [
      'Triple camera system',
      '5G connectivity',
      'All-day battery',
      '6.7" OLED display'
    ],
    category: 'Electronics'
  },
  {
    id: '3',
    name: 'Ergonomic Office Chair', 
    description: 'Comfortable design for long work hours',
    price: 599.99,
    sku: 'OC-003',
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
    features: [
      'Ergonomic lumbar support',
      'Adjustable height',
      'Premium materials',
      '10-year warranty'
    ],
    category: 'Furniture'
  },
  {
    id: '4',
    name: 'Gaming Laptop Ultra',
    description: 'High-performance gaming and work machine',
    price: 1499.99,
    sku: 'GL-004', 
    imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
    features: [
      'RTX 4070 GPU',
      'Intel i7 processor',
      '32GB RAM',
      '144Hz display'
    ],
    category: 'Electronics'
  }
];
