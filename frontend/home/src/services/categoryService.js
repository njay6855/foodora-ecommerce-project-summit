const API_BASE_URL = 'http://localhost:3000/api/v1';

export const categoryService = {
  async getCategoryName(categoryId) {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`);
      if (!response.ok) throw new Error('Failed to fetch category');
      const category = await response.json();
      return category.name;
    } catch (error) {
      console.error(`Error fetching category ${categoryId}:`, error);
      throw error;
    }
  },

  async getCategoryProducts(categoryId) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/categories/${categoryId}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error(`Error fetching products for category ${categoryId}:`, error);
      throw error;
    }
  }
}


