import { getStore } from '../store';
import { addItem, setError } from '../store/cartSlice';
import { cartService } from '../services/cartService';

export const initializeCartEvents = (getCurrentUser) => {
  // Handle add to cart events from other microfrontends
  const handleAddToCart = async (event) => {
    
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        window.location.href = '/auth/login';
        return;
      }

      const { productId, quantity, product } = event.detail;
      
      await cartService.addCartItem(currentUser.id, productId, quantity);
      
      const store = getStore();
      store.dispatch(addItem({
        productId,
        quantity,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl
      }));

      // Dispatch a success event that other MFEs can listen to
      window.dispatchEvent(new CustomEvent('@food-ecommerce/cart-updated', {
        detail: {
          count: getStore().getState().cart.items.reduce((total, item) => total + item.quantity, 0)
        }
      }));
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      store.dispatch(setError('Failed to add item to cart'));
    }
  };

  // Add event listener
  window.addEventListener('@food-ecommerce/add-to-cart', handleAddToCart);

  // Return cleanup function
  return () => {
    window.removeEventListener('@food-ecommerce/add-to-cart', handleAddToCart);
  };
};
