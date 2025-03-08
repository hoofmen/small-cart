'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/CheckoutForm';
import { Product, createCheckoutSession } from '@/services/api';
import { darkTheme, commonStyles } from '@/styles/theme';

// Initialize Stripe directly
const stripe = loadStripe('');

export default function CheckoutPage() {
  const [error, setError] = useState<string | null>(null);
  const [orderTotal, setOrderTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const router = useRouter();

  useEffect(() => {
    // Get cart items from localStorage in a real application
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]') as Product[];
    
    if (cartItems.length === 0) {
      // For testing purposes, create a sample cart item if none exists
      const sampleItem: Product = {
        id: "prod_1",
        name: "T-Shirt",
        description: "Comfortable cotton t-shirt",
        price: 1999,
        imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        quantity: 1
      };
      localStorage.setItem('cartItems', JSON.stringify([sampleItem]));
      setOrderTotal(1999);
    } else {
      // Calculate order total
      const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      setOrderTotal(total);
    }
  }, [router]);

  const handleSuccess = () => {
    // Clear cart and redirect to success page
    localStorage.removeItem('cartItems');
    router.push('/checkout/success');
  };

  const handleCancel = () => {
    router.push('/');
  };

  const formatPrice = (price: number) => {
    return `$${(price / 100).toFixed(2)}`;
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrorMessage(undefined);

    try {
      // Create a checkout session with the payment method
      const response = await createCheckoutSession({
        products: JSON.parse(localStorage.getItem('cartItems') || '[]'),
        successUrl: `${window.location.origin}/checkout/success`,
        cancelUrl: `${window.location.origin}/checkout/cancel`,
      });

      return response.clientSecret;
    } catch (err) {
      console.error('Payment error:', err);
      setErrorMessage('An unexpected error occurred.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className={commonStyles.container}>
        <div className={commonStyles.contentWrapper}>
          <div className="max-w-2xl mx-auto">
            <div className={commonStyles.card}>
              <div className={commonStyles.error}>
                {error}
              </div>
              <button
                onClick={() => router.push('/')}
                className={commonStyles.button.danger}
              >
                Return to Shop
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={commonStyles.container}>
      <div className={commonStyles.contentWrapper}>
        <h1 className={commonStyles.heading}>Secure Checkout</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className={commonStyles.card}>
              <Elements 
                stripe={stripe} 
                options={{ 
                  appearance: darkTheme,
                  mode: 'payment',
                  paymentMethodTypes: ['klarna'],
                  amount: orderTotal,
                  currency: 'usd'
                }}
              >
                <CheckoutForm
                  onSuccess={handleSuccess}
                  onCancel={handleCancel}
                  amount={orderTotal}
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                  errorMessage={errorMessage}
                />
              </Elements>
            </div>
          </div>
          
          <div className={commonStyles.card}>
            <h2 className={`${commonStyles.text.primary} text-xl font-medium mb-4 pb-4 ${commonStyles.divider}`}>
              Order Summary
            </h2>
            
            <div className="space-y-4 mb-6">
              {JSON.parse(localStorage.getItem('cartItems') || '[]').map((item: Product) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className={commonStyles.text.secondary}>{item.quantity}x</span>
                    <span className="ml-2">{item.name}</span>
                  </div>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            
            <div className={`${commonStyles.divider} pt-4 mt-4`}>
              <div className="flex justify-between items-center font-medium">
                <span>Subtotal</span>
                <span>{formatPrice(orderTotal)}</span>
              </div>
              <div className="flex justify-between items-center text-zinc-400 text-sm mt-2">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className={`flex justify-between items-center font-bold text-lg mt-4 pt-4 ${commonStyles.divider}`}>
                <span>Total</span>
                <span>{formatPrice(orderTotal)}</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                type="submit"
                form="payment-form"
                disabled={isLoading}
                className={commonStyles.button.primary}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  'Complete Purchase'
                )}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className={commonStyles.button.secondary}
              >
                Cancel and return to shop
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 