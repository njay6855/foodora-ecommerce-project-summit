import  authAxios  from './authAxios'

export const dataStewardService = {
  async getPendingProducts() {
    try {
      // Check if user is a Data Steward
      const currentUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
      if (!currentUser || currentUser.role !== 'DataSteward') {
        throw new Error('Unauthorized: Data Steward access required');
      }

      const response = await authAxios.get('/data-steward/products');
      return Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error) {
      console.error('Error in getPendingProducts:', error);
      throw error;
    }
  },

  async approveProduct(productId) {
    try {
      // Check if user is a Data Steward
      const currentUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
      if (!currentUser || currentUser.role !== 'DataSteward') {
        throw new Error('Unauthorized: Data Steward access required');
      }

      const response = await authAxios.patch(`/data-steward/products/${productId}`, {
        status: 'Approved'
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async rejectProduct(productId) {
    try { 
      // Check if user is a Data Steward
      const currentUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
      if (!currentUser || currentUser.role !== 'DataSteward') {
        throw new Error('Unauthorized: Data Steward access required');
      }

      const response = await authAxios.patch(`/data-steward/products/${productId}`, {
        status: 'Rejected'
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },


};
