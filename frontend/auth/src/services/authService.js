import authAxios from './authAxios';

// API endpoints
const API_ENDPOINTS = {
  LOGIN: '/users/login',
  REGISTER: '/users',
  FORGOT_PASSWORD: '/users/auth/forgot-password'
};

export const authService = {
  async login(email, password) {
    try {
      const response = await authAxios.post(API_ENDPOINTS.LOGIN, { email, password });
      const data = response.data;
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Dispatch event for other microfrontends
      window.dispatchEvent(new CustomEvent('@food-ecommerce/user-logged-in', {
        detail: data.user
      }));

      // Also dispatch initial cart count if available
      if (data.user.cartCount !== undefined) {
        window.dispatchEvent(new CustomEvent('@food-ecommerce/cart-updated', {
          detail: { count: data.user.cartCount }
        }));
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  async register(userData) {
    try {
      const response = await authAxios.post(API_ENDPOINTS.REGISTER, userData);
      const data = response.data;
      return data;
    } catch (error) {
      throw error;
    }
  },

  async forgotPassword(email) {
    try {
      const response = await authAxios.post(API_ENDPOINTS.FORGOT_PASSWORD, { email });
      const data = response.data;
      return data;
    } catch (error) {
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Dispatch event for other microfrontends
    window.dispatchEvent(new CustomEvent('@food-ecommerce/user-logged-out'));
    
  },

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
};
