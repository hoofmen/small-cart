import React from 'react';
import {
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

interface CheckoutFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  amount: number;
  onSubmit: () => Promise<string>;
  isLoading: boolean;
  errorMessage?: string;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ 
  onSuccess, 
  onCancel, 
  amount,
  onSubmit,
  isLoading,
  errorMessage
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    try {
      // Submit the form first
      const { error: submitError } = await elements.submit();
      if (submitError) {
        console.error('Submit error:', submitError);
        return;
      }

      // Get the client secret from the parent component
      const clientSecret = await onSubmit();
      
      // Confirm the payment
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + '/checkout/success',
        },
        redirect: 'if_required',
        clientSecret,
      });

      if (error) {
        console.error('Payment error:', error);
      }
      // Note: We don't call onSuccess here because Klarna will redirect us
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h3 className="text-xl font-medium mb-4 text-white">Payment Method</h3>
        <p className="text-zinc-400 mb-4">Complete your purchase with Klarna</p>
        <PaymentElement options={{
          paymentMethodOrder: ['klarna'],
          layout: {
            type: 'tabs',
            defaultCollapsed: false,
            radios: false,
            spacedAccordionItems: true
          },
          defaultValues: {
            billingDetails: {
              name: '',
              email: '',
            }
          }
        }} />
      </div>

      {errorMessage && (
        <div className="bg-red-900/30 border border-red-500 text-red-300 px-4 py-3 rounded">
          {errorMessage}
        </div>
      )}
    </form>
  );
};

export default CheckoutForm; 