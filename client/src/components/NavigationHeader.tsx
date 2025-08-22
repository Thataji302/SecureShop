import React, { useState } from 'react';
import { ShoppingCart, Search, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/contexts/CartContext';

interface NavigationHeaderProps {
  onCartToggle: () => void;
  onAuthModalOpen: (mode: 'signin' | 'signup') => void;
}

export default function NavigationHeader({ onCartToggle, onAuthModalOpen }: NavigationHeaderProps) {
  const { user, isAuthenticated } = useAuth();
  const { state: cartState } = useCart();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSignOut = () => {
    window.location.href = '/api/logout';
  };

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary">
                <i className="fas fa-shopping-bag mr-2"></i>ShopVault
              </h1>
            </div>
            <div className="hidden md:block">
              <div className="flex items-baseline space-x-4">
                <a href="#products" className="text-slate-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Products
                </a>
                <a href="#categories" className="text-slate-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Categories
                </a>
                <a href="#about" className="text-slate-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  About
                </a>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="hidden sm:block w-64 pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                data-testid="input-search"
              />
              <Search className="absolute left-3 top-3 text-slate-400 hidden sm:block w-4 h-4" />
            </div>
            
            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {(user as any)?.profileImageUrl ? (
                    <img
                      src={(user as any).profileImageUrl}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                      data-testid="img-profile"
                    />
                  ) : (
                    <User className="w-8 h-8 text-slate-600" data-testid="icon-profile" />
                  )}
                  <span className="text-slate-700 font-medium" data-testid="text-username">
                    {(user as any)?.firstName || 'User'}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-slate-600 hover:text-primary font-medium transition-colors"
                  data-testid="button-signout"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <button
                  onClick={() => onAuthModalOpen('signin')}
                  className="text-slate-600 hover:text-primary font-medium transition-colors"
                  data-testid="button-signin"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onAuthModalOpen('signup')}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors"
                  data-testid="button-signup"
                >
                  Sign Up
                </button>
              </div>
            )}
            
            <button
              onClick={onCartToggle}
              className="relative p-2 text-slate-600 hover:text-primary transition-colors"
              data-testid="button-cart"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartState.itemCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
                  data-testid="text-cart-count"
                >
                  {cartState.itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
