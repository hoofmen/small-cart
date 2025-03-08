import axios from 'axios';

const API_URL = 'https://localhost:7201/api';

// Configure axios for development environment
axios.defaults.httpsAgent = {
  rejectUnauthorized: false // Ignore SSL certificate validation in development
};

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

export interface CreateCheckoutSessionRequest {
  products: Product[];
  successUrl: string;
  cancelUrl: string;
}

export interface CreateCheckoutSessionResponse {
  clientSecret: string;
  publishableKey: string;
  sessionId: string;
}

export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get<Product[]>(`${API_URL}/checkout/products`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const createCheckoutSession = async (
  request: CreateCheckoutSessionRequest
): Promise<CreateCheckoutSessionResponse> => {
  try {
    const response = await axios.post<CreateCheckoutSessionResponse>(
      `${API_URL}/checkout/create-payment-intent`,
      request
    );
    return response.data;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}; 