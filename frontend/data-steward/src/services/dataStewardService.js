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

export const dataStewardService = {
  async getPendingProducts() {
    try {
      const axios = await getAuthAxios();
      const response = await axios.get('/data-steward/products');
      return Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error) {
      console.error('Error in getPendingProducts:', error);
      throw error;
    }
  },

  async approveProduct(productId, stewardNote) {
    try {
      const axios = await getAuthAxios();
      const payload = {
        status: 'Approved'
      };
      
      if (stewardNote && stewardNote.trim()) {
        payload.stewardNote = stewardNote.trim();
      }
      
      const response = await axios.patch(`/data-steward/products/${productId}`, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async rejectProduct(productId, stewardNote) {
    try {
      const axios = await getAuthAxios();
      const payload = {
        status: 'Rejected'
      };
  
      if (stewardNote && stewardNote.trim()) {
        payload.stewardNote = stewardNote.trim();
      }
      
      const response = await axios.patch(`/data-steward/products/${productId}`, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },


};
