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

export const supplierService = {
  async getSupplierProducts(supplierId) {
    try {
      const axios = await getAuthAxios();
      const response = await axios.get('/suppliers/products');
      return response.data;
    } catch (error) {
      console.error('Error fetching supplier products:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch products');
    }
  },

  async addProduct(supplierId, productData) {
    try {
      const axios = await getAuthAxios();
      const response = await axios.post('/suppliers/products', productData);
      return response.data;
    } catch (error) {
      console.error('Error adding product:', error);
      throw new Error(error.response?.data?.message || 'Failed to add product');
    }
  },

  async updateProduct(supplierId, productId, productData) {
    try {
      const axios = await getAuthAxios();
      const response = await axios.put(`/suppliers/products/${productId}`, productData);
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw new Error(error.response?.data?.message || 'Failed to update product');
    }
  },

  async deleteProduct(supplierId, productId) {
    try {
      const axios = await getAuthAxios();
      const response = await axios.delete(`/suppliers/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete product');
    }
  },

  async updateProductStock( supplierId, productId, stockQuantity) {
    try {
      const axios = await getAuthAxios();
      const response = await axios.patch(`/suppliers/products/${productId}`, { 
        quantity: stockQuantity 
      });
      return response.data;
    } catch (error) {
      console.error('Error updating product stock:', error);
      throw new Error(error.response?.data?.message || 'Failed to update stock');
    }
  },

  async getCategories() {
    try {
      const axios = await getAuthAxios();
      const response = await axios.get('/products/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
};
