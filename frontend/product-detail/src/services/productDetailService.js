const API_BASE_URL = 'http://localhost:3000/api/v1';

export const productDetailService = {
  async getProductById(productId) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Product not found');
        }
        throw new Error('Failed to fetch product details');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  async getRelatedProducts(categoryId, currentProductId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/products/categories/${categoryId}`);
      if (!response.ok) throw new Error('Failed to fetch related products');
      return await response.json();
    } catch (error) {
      throw error;
    }
  }
};
