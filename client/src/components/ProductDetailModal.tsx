import React from 'react';
import { X, ShoppingCart, Heart, Check } from 'lucide-react';
import type { Product } from '../data/products';

interface ProductDetailModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductDetailModal({ isOpen, product, onClose, onAddToCart }: ProductDetailModalProps) {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900" data-testid="text-product-detail-title">
              Product Details
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600"
              data-testid="button-close-product-detail"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full rounded-lg shadow-lg"
                data-testid="img-product-detail"
              />
            </div>
            
            <div>
              <h3 className="text-3xl font-bold text-slate-900 mb-4" data-testid="text-product-detail-name">
                {product.name}
              </h3>
              <p className="text-lg text-slate-600 mb-6" data-testid="text-product-detail-description">
                {product.description}
              </p>
              
              <div className="mb-6">
                <span className="text-4xl font-bold text-primary" data-testid="text-product-detail-price">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-sm text-slate-500 ml-2" data-testid="text-product-detail-sku">
                  SKU: {product.sku}
                </span>
              </div>
              
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-slate-900 mb-3">Features:</h4>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-slate-600" data-testid={`text-feature-${index}`}>
                      <Check className="w-5 h-5 text-accent mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => onAddToCart(product)}
                  className="flex-1 bg-primary text-white py-3 px-6 rounded-lg hover:bg-blue-700 font-medium transition-colors"
                  data-testid="button-add-to-cart-detail"
                >
                  <ShoppingCart className="w-5 h-5 mr-2 inline" />
                  Add to Cart
                </button>
                <button className="px-6 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors" data-testid="button-wishlist">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
