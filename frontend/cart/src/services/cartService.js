const API_BASE_URL = '/carts';

// Import authAxios from auth MFE
let authAxios;
let authAxiosPromise;

const getAuthAxios = async () => {
  if (!authAxiosPromise) {
    authAxiosPromise = (async () => {
      try {
        const authModule = await System.import('@food-ecommerce/auth');
        authAxios = authModule.authAxios;
        return authAxios;
      } catch (error) {
        console.error('Failed to import authAxios from auth MFE:', error);
        authAxiosPromise = null; // Reset promise to allow retry
        throw new Error('Authentication service unavailable');
      }
    })();
  }
  return authAxiosPromise;
};

export const cartService = {
  async getCart(userId) {
    try {
      const axios = await getAuthAxios();
      const response = await axios.get(`${API_BASE_URL}/${userId}`);
      const cart = response.data;
      
      // Normalize cart items to include all required product information
      const items = (cart.data?.items || []).map(item => ({
        productId: item.productId,
        itemId: item.itemId,
        name: item.product?.name || 'Unknown Product',
        imageUrl: item.product?.imageUrl || '',
        price: item.product?.price || 0,
        quantity: item.quantity || 0
      }));
      return { items };
    } catch (error) {
      return { items: [] };
    }
  },  
  
  async updateCartItem(userId, itemId, quantity) {
    try {
      const axios = await getAuthAxios();
      const response = await axios.patch(`${API_BASE_URL}/${userId}/items/${itemId}`, { quantity });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async removeCartItem(userId, itemId) {
    try {
      const axios = await getAuthAxios();
      const response = await axios.delete(`${API_BASE_URL}/${userId}/items/${itemId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async clearCart(userId) {
    try {
      const axios = await getAuthAxios();
      const response = await axios.delete(`${API_BASE_URL}/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async addCartItem(userId, productId, quantity) {
    try {
      const axios = await getAuthAxios();
      const response = await axios.post(`${API_BASE_URL}/${userId}`, { productId, quantity });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
