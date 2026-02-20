import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

// Custom hook to use cart anywhere in the app
export const useCart = () => {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  
  return context;
};
