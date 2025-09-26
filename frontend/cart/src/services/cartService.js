import  authAxios  from './authAxios'

const API_BASE_URL = '/carts';

export const cartService = {
  async getCart(userId) {
    try {
      const response = await authAxios.get(`${API_BASE_URL}/${userId}`);
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
  },  async updateCartItem(userId, itemId, quantity) {
    try {
      const response = await authAxios.patch(`${API_BASE_URL}/${userId}/items/${itemId}`, { quantity });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async removeCartItem(userId, itemId) {
    try {
      const response = await authAxios.delete(`${API_BASE_URL}/${userId}/items/${itemId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async clearCart(userId) {
    try {
      const response = await authAxios.delete(`${API_BASE_URL}/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async addCartItem(userId, productId, quantity) {
    try {
      const response = await authAxios.post(`${API_BASE_URL}/${userId}`, { productId, quantity });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
