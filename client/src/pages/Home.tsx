import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import NavigationHeader from '@/components/NavigationHeader';
import ProductCard from '@/components/ProductCard';
import ProductDetailModal from '@/components/ProductDetailModal';
import ShoppingCartSidebar from '@/components/ShoppingCartSidebar';
import CheckoutModal from '@/components/CheckoutModal';
import PaymentSuccessModal from '@/components/PaymentSuccessModal';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { isUnauthorizedError } from '@/lib/authUtils';
import type { Product } from '@/data/products';
import { PRODUCTS } from '@/data/products';

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { dispatch: cartDispatch } = useCart();
  const { toast } = useToast();

  const [showProductDetail, setShowProductDetail] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const handleProductView = (product: Product) => {
    setSelectedProduct(product);
    setShowProductDetail(true);
  };

  const handleAddToCart = (product: Product) => {
    cartDispatch({ type: 'ADD_ITEM', payload: product });
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
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

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <NavigationHeader
        onCartToggle={() => setShowCart(true)}
        onAuthModalOpen={() => {}} // Not needed for authenticated users
      />

      {/* Welcome Section */}
      <section className="bg-gradient-to-r from-primary to-blue-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-welcome-title">
              Welcome back, {(user as any)?.firstName || 'User'}!
            </h1>
            <p className="text-xl text-blue-100" data-testid="text-welcome-subtitle">
              Continue shopping from our premium collection
            </p>
          </div>
        </div>
      </section>

      {/* Product List Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4" data-testid="text-products-title">
            Our Products
          </h2>
          <p className="text-lg text-slate-600" data-testid="text-products-subtitle">
            Discover amazing products with secure checkout
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

      {/* Modals */}
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
