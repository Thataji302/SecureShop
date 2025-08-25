import React from 'react';
import { Eye, ShoppingCart } from 'lucide-react';
import type { Product } from '../data/products';

interface ProductCardProps {
  product: Product;
  onProductView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onProductView, onAddToCart }: ProductCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        data-testid={`img-product-${product.id}`}
      />
      <div className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-2" data-testid={`text-product-name-${product.id}`}>
          {product.name}
        </h3>
        <p className="text-slate-600 text-sm mb-3" data-testid={`text-product-description-${product.id}`}>
          {product.description}
        </p>
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-primary" data-testid={`text-product-price-${product.id}`}>
            ${product.price.toFixed(2)}
          </span>
          <span className="text-xs text-slate-500" data-testid={`text-product-sku-${product.id}`}>
            SKU: {product.sku}
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onAddToCart(product)}
            className="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            data-testid={`button-add-to-cart-${product.id}`}
          >
            <ShoppingCart className="w-4 h-4 mr-2 inline" />
            Add to Cart
          </button>
          <button
            onClick={() => onProductView(product)}
            className="px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            data-testid={`button-view-product-${product.id}`}
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
