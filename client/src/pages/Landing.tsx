import React, { useState } from 'react';
import { PRODUCTS } from '@/data/products';
import NavigationHeader from '@/components/NavigationHeader';
import ProductCard from '@/components/ProductCard';
import AuthModal from '@/components/AuthModal';
import ProductDetailModal from '@/components/ProductDetailModal';
import ShoppingCartSidebar from '@/components/ShoppingCartSidebar';
import CheckoutModal from '@/components/CheckoutModal';
import PaymentSuccessModal from '@/components/PaymentSuccessModal';
import { useCart } from '@/contexts/CartContext';
import type { Product } from '@/data/products';

export default function Landing() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  const { dispatch: cartDispatch } = useCart();

  const handleAuthModalOpen = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleProductView = (product: Product) => {
    setSelectedProduct(product);
    setShowProductDetail(true);
  };

  const handleAddToCart = (product: Product) => {
    cartDispatch({ type: 'ADD_ITEM', payload: product });
  };

  const handleCheckout = () => {
    setShowCart(false);
    setShowCheckout(true);
  };

  const handlePaymentSuccess = (details: any) => {
    setShowCheckout(false);
    setOrderDetails(details);
    setShowPaymentSuccess(true);
  };

  const handleAuthModeSwitch = () => {
    setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <NavigationHeader
        onCartToggle={() => setShowCart(true)}
        onAuthModalOpen={handleAuthModalOpen}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-6" data-testid="text-hero-title">
              Discover Amazing Products
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-slate-300 max-w-3xl mx-auto" data-testid="text-hero-subtitle">
              Shop the latest tech, fashion, and lifestyle products with secure payment processing
            </p>
            <button
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-primary hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors transform hover:scale-105"
              data-testid="button-start-shopping"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </section>

      {/* Product List Section */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4" data-testid="text-products-title">
            Featured Products
          </h2>
          <p className="text-lg text-slate-600" data-testid="text-products-subtitle">
            Discover our handpicked selection of premium products
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {PRODUCTS.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onProductView={handleProductView}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">
                <i className="fas fa-shopping-bag mr-2"></i>ShopVault
              </h3>
              <p className="text-slate-400">
                Your trusted e-commerce platform with secure payment processing and premium products.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Customer Service</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Shipping</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Security</h4>
              <div className="space-y-2 text-slate-400 text-sm">
                <div className="flex items-center">
                  <i className="fas fa-shield-alt text-accent mr-2"></i>
                  SSL Encrypted
                </div>
                <div className="flex items-center">
                  <i className="fas fa-lock text-accent mr-2"></i>
                  RSA Payment Security
                </div>
                <div className="flex items-center">
                  <i className="fas fa-check-circle text-accent mr-2"></i>
                  PCI Compliant
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 ShopVault. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        mode={authMode}
        onClose={() => setShowAuthModal(false)}
        onModeSwitch={handleAuthModeSwitch}
      />

      <ProductDetailModal
        isOpen={showProductDetail}
        product={selectedProduct}
        onClose={() => setShowProductDetail(false)}
        onAddToCart={handleAddToCart}
      />

      <ShoppingCartSidebar
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        onCheckout={handleCheckout}
      />

      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        onSuccess={handlePaymentSuccess}
      />

      <PaymentSuccessModal
        isOpen={showPaymentSuccess}
        orderDetails={orderDetails}
        onClose={() => {
          setShowPaymentSuccess(false);
          setOrderDetails(null);
        }}
      />
    </div>
  );
}
