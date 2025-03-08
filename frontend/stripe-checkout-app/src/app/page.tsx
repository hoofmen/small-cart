'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product, getProducts } from '@/services/api';
import { commonStyles } from '@/styles/theme';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (product: Product) => {
    const updatedCart = [...cart];
    const existingItem = updatedCart.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      updatedCart.push({ ...product, quantity: 1 });
    }

    setCart(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  };

  const removeFromCart = (productId: string) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;

    const updatedCart = cart.map(item => 
      item.id === productId ? { ...item, quantity } : item
    );
    
    setCart(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  };

  const proceedToCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }
    router.push('/checkout');
  };

  const formatPrice = (price: number) => {
    return `$${(price / 100).toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className={commonStyles.container}>
        <div className={commonStyles.contentWrapper}>
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={commonStyles.container}>
      <div className={commonStyles.contentWrapper}>
        <h1 className={commonStyles.heading}>Our Products</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {products.map((product) => (
                <div key={product.id} className={`${commonStyles.card} flex flex-col`}>
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h2 className={`${commonStyles.text.primary} text-xl font-medium mb-2`}>
                    {product.name}
                  </h2>
                  <p className={`${commonStyles.text.secondary} mb-4 flex-grow`}>
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <span className={`${commonStyles.text.primary} text-lg font-medium`}>
                      ${(product.price / 100).toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className={commonStyles.button.primary}
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
          {cart.length > 0 && (
            <div className={commonStyles.card}>
              <h2 className={`${commonStyles.text.primary} text-xl font-medium mb-4 pb-4 ${commonStyles.divider}`}>
                Your Cart
              </h2>
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <h3 className={commonStyles.text.primary}>{item.name}</h3>
                      <p className={commonStyles.text.secondary}>{formatPrice(item.price)} each</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="bg-zinc-800 px-2 py-1 rounded-l hover:bg-zinc-700 transition-colors"
                        >
                          -
                        </button>
                        <span className="px-4 bg-zinc-800">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="bg-zinc-800 px-2 py-1 rounded-r hover:bg-zinc-700 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className={`${commonStyles.text.secondary} hover:text-red-400 transition-colors`}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className={`${commonStyles.divider} pt-4 mt-4`}>
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total:</span>
                  <span>
                    {formatPrice(cart.reduce((total, item) => total + (item.price * item.quantity), 0))}
                  </span>
                </div>
                <button
                  onClick={proceedToCheckout}
                  className={`${commonStyles.button.primary} mt-4`}
                >
                  Proceed to Checkout with Klarna
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
