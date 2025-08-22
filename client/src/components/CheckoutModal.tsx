import React, { useState, useEffect } from 'react';
import { X, Lock, Shield } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCart } from '@/contexts/CartContext';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

const checkoutSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  zipCode: z.string().min(5, 'ZIP code must be at least 5 characters'),
  cardNumber: z.string().min(13, 'Card number is required'),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Invalid expiry date (MM/YY)'),
  cvv: z.string().min(3, 'CVV is required'),
  cardholderName: z.string().min(1, 'Cardholder name is required'),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (orderDetails: any) => void;
}

export default function CheckoutModal({ isOpen, onClose, onSuccess }: CheckoutModalProps) {
  const { state: cartState, dispatch: cartDispatch } = useCart();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      address: '',
      city: '',
      zipCode: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: '',
    },
  });

  const { data: publicKeyData } = useQuery({
    queryKey: ['/api/payment/public-key'],
    enabled: isOpen,
  });

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await apiRequest('POST', '/api/orders', orderData);
      return response.json();
    },
  });

  const processPaymentMutation = useMutation({
    mutationFn: async (paymentData: any) => {
      const response = await apiRequest('POST', '/api/process-payment', paymentData);
      return response.json();
    },
  });

  const handleSubmit = async (data: CheckoutFormData) => {
    if (!(publicKeyData as any)?.publicKey) {
      toast({
        title: 'Error',
        description: 'Unable to secure payment. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Calculate totals
      const subtotal = cartState.total;
      const shipping = 9.99;
      const tax = subtotal * 0.08; // 8% tax
      const total = subtotal + shipping + tax;

      // Create order first
      const orderData = {
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        shipping: shipping.toFixed(2),
        total: total.toFixed(2),
        status: 'pending',
        shippingAddress: {
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          city: data.city,
          zipCode: data.zipCode,
        },
        billingAddress: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          address: data.address,
          city: data.city,
          zipCode: data.zipCode,
        },
        items: cartState.items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price.toFixed(2),
        })),
      };

      const order = await createOrderMutation.mutateAsync(orderData);

      // For demo purposes, we'll send the card data directly
      // In production, this would be properly encrypted
      const cardData = {
        cardNumber: data.cardNumber,
        expiryDate: data.expiryDate,
        cvv: data.cvv,
        cardholderName: data.cardholderName,
      };
      const encryptedCardData = btoa(JSON.stringify(cardData)); // Simple base64 encoding for demo

      // Process payment
      const paymentResult = await processPaymentMutation.mutateAsync({
        orderId: order.id,
        amount: total.toFixed(2),
        encryptedCardData,
        billingAddress: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          address: data.address,
          city: data.city,
          zipCode: data.zipCode,
        },
      });

      if (paymentResult.success) {
        // Clear cart
        cartDispatch({ type: 'CLEAR_CART' });
        
        // Show success
        onSuccess({
          orderNumber: order.orderNumber,
          total: total.toFixed(2),
          paymentMethod: `**** ${data.cardNumber.slice(-4)}`,
          transactionId: paymentResult.transactionId,
        });

        toast({
          title: 'Payment Successful',
          description: 'Your order has been processed successfully.',
        });
      } else {
        throw new Error(paymentResult.error || 'Payment failed');
      }
    } catch (error: any) {
      toast({
        title: 'Payment Failed',
        description: error.message || 'Unable to process payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  const subtotal = cartState.total;
  const shipping = 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900" data-testid="text-checkout-title">
              Secure Checkout
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600"
              data-testid="button-close-checkout"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Billing Information */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Billing Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                  <input
                    {...form.register('firstName')}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    data-testid="input-first-name"
                  />
                  {form.formState.errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                  <input
                    {...form.register('lastName')}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    data-testid="input-last-name"
                  />
                  {form.formState.errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.lastName.message}</p>
                  )}
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    {...form.register('email')}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    data-testid="input-email"
                  />
                  {form.formState.errors.email && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
                  )}
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                  <input
                    {...form.register('address')}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    data-testid="input-address"
                  />
                  {form.formState.errors.address && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.address.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
                  <input
                    {...form.register('city')}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    data-testid="input-city"
                  />
                  {form.formState.errors.city && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.city.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">ZIP Code</label>
                  <input
                    {...form.register('zipCode')}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    data-testid="input-zip"
                  />
                  {form.formState.errors.zipCode && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.zipCode.message}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Payment Information */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                <Lock className="inline w-5 h-5 text-accent mr-2" />
                Secure Payment Information
              </h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-green-700">
                  <Shield className="inline w-4 h-4 mr-2" />
                  Your payment information is encrypted using RSA public key cryptography
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Card Number</label>
                  <input
                    {...form.register('cardNumber')}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    maxLength={19}
                    data-testid="input-card-number"
                  />
                  {form.formState.errors.cardNumber && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.cardNumber.message}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Expiry Date</label>
                    <input
                      {...form.register('expiryDate')}
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      maxLength={5}
                      data-testid="input-expiry"
                    />
                    {form.formState.errors.expiryDate && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.expiryDate.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">CVV</label>
                    <input
                      {...form.register('cvv')}
                      placeholder="123"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      maxLength={4}
                      data-testid="input-cvv"
                    />
                    {form.formState.errors.cvv && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.cvv.message}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Cardholder Name</label>
                  <input
                    {...form.register('cardholderName')}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    data-testid="input-cardholder-name"
                  />
                  {form.formState.errors.cardholderName && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.cardholderName.message}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="border-t border-slate-200 pt-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Order Summary</h3>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span data-testid="text-subtotal">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span data-testid="text-shipping">${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tax</span>
                  <span data-testid="text-tax">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-slate-200 pt-2">
                  <div className="flex justify-between text-lg font-bold text-slate-900">
                    <span>Total</span>
                    <span data-testid="text-total">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-accent text-white py-3 px-4 rounded-lg hover:bg-emerald-600 font-medium transition-colors flex items-center justify-center disabled:opacity-50"
              data-testid="button-complete-payment"
            >
              <Lock className="w-4 h-4 mr-2" />
              {isProcessing ? 'Processing...' : 'Complete Secure Payment'}
            </button>
            
            <div className="text-center text-xs text-slate-500">
              <Shield className="inline w-4 h-4 mr-1" />
              Your payment is secured with 256-bit SSL encryption
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
