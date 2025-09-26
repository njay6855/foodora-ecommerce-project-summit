const API_BASE_URL = 'http://localhost:3000/api/v1';

export const homeService = {
  async getRandomProducts() {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) throw new Error('Failed to fetch random products');
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching random products:', error);
      throw error;
    }
  },

  async getCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  async getCategoryProducts(categoryId) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/categories/${categoryId}`);
      if (!response.ok) throw new Error('Failed to fetch category products');
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching category products:', error);
      throw error;
    }
  },

  async searchProducts(query) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to search products');
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }
};
