import React from 'react';
import { Check } from 'lucide-react';

interface PaymentSuccessModalProps {
  isOpen: boolean;
  orderDetails: {
    orderNumber: string;
    total: string;
    paymentMethod: string;
    transactionId?: string;
  } | null;
  onClose: () => void;
}

export default function PaymentSuccessModal({ isOpen, orderDetails, onClose }: PaymentSuccessModalProps) {
  if (!isOpen || !orderDetails) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="text-white w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2" data-testid="text-success-title">
            Payment Successful!
          </h2>
          <p className="text-slate-600 mb-6" data-testid="text-success-message">
            Your order has been processed successfully.
          </p>
          
          <div className="bg-slate-50 rounded-lg p-4 mb-6">
            <div className="text-sm text-slate-600 space-y-1">
              <div className="flex justify-between">
                <span>Order Number:</span>
                <span className="font-medium" data-testid="text-order-number">
                  {orderDetails.orderNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="font-medium" data-testid="text-order-total">
                  ${orderDetails.total}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <span className="font-medium" data-testid="text-payment-method">
                  {orderDetails.paymentMethod}
                </span>
              </div>
              {orderDetails.transactionId && (
                <div className="flex justify-between">
                  <span>Transaction ID:</span>
                  <span className="font-medium text-xs" data-testid="text-transaction-id">
                    {orderDetails.transactionId}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-medium transition-colors"
            data-testid="button-continue-shopping"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
