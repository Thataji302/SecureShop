import React from 'react';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface ShoppingCartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export default function ShoppingCartSidebar({ isOpen, onClose, onCheckout }: ShoppingCartSidebarProps) {
  const { state: cartState, dispatch } = useCart();

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} data-testid="overlay-cart"></div>
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-slate-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900" data-testid="text-cart-title">
                Shopping Cart
              </h2>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600"
                data-testid="button-close-cart"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
            {cartState.items.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-500" data-testid="text-empty-cart">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartState.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-4 p-4 border border-slate-200 rounded-lg"
                    data-testid={`cart-item-${item.id}`}
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                      data-testid={`img-cart-item-${item.id}`}
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900" data-testid={`text-cart-item-name-${item.id}`}>
                        {item.name}
                      </h4>
                      <p className="text-sm text-slate-600" data-testid={`text-cart-item-price-${item.id}`}>
                        ${item.price.toFixed(2)}
                      </p>
                      <div className="flex items-center mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-slate-400 hover:text-slate-600"
                          data-testid={`button-decrease-${item.id}`}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="mx-3 font-medium" data-testid={`text-quantity-${item.id}`}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-slate-400 hover:text-slate-600"
                          data-testid={`button-increase-${item.id}`}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700"
                      data-testid={`button-remove-${item.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {cartState.items.length > 0 && (
            <div className="p-6 border-t border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-slate-900">Total:</span>
                <span className="text-2xl font-bold text-primary" data-testid="text-cart-total">
                  ${cartState.total.toFixed(2)}
                </span>
              </div>
              <button
                onClick={onCheckout}
                className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-medium transition-colors"
                data-testid="button-checkout"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
