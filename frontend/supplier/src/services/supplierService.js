const API_BASE_URL = 'http://localhost:3000/api/v1';

const getAuthHeaders = async () => {
  try {
    const { getCurrentUser } = await System.import('@food-ecommerce/auth');
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    };
  } catch (error) {
    console.error('Error getting auth headers:', error);
    throw new Error('Authentication failed');
  }
};

export const supplierService = {
  async getSupplierProducts(supplierId) {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/suppliers/products`, {
        headers
      });
      if (!response.ok) throw new Error('Failed to fetch products');
      return await response.json();

    } catch (error) {
      throw error;
    }
  },

  async addProduct(supplierId, productData) {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/suppliers/products`, {
        method: 'POST',
        headers,
        body: JSON.stringify(productData),
      });
      if (!response.ok) throw new Error('Failed to add product');
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  async updateProduct(supplierId, productId, productData) {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/suppliers/products/${productId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(productData),
      });
      if (!response.ok) throw new Error('Failed to update product');
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  async deleteProduct(supplierId, productId) {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/suppliers/products/${productId}`, {
        method: 'DELETE',
        headers
      });
      if (!response.ok) throw new Error('Failed to delete product');
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  async updateProductStock(supplierId, productId, stockQuantity) {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/suppliers/products/${productId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ quantity: stockQuantity }),
      });
      if (!response.ok) throw new Error('Failed to update stock');
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  async getCategories() {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/products/categories`, {
        headers
      });
      if (!response.ok) throw new Error('Failed to fetch categories');
      return await response.json();
    } catch (error) {
      throw error;
    }
  }
};
