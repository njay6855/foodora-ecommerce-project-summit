import axios from 'axios';
import Swal from 'sweetalert2';

const authAxios = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token for protected routes
authAxios.interceptors.request.use(
  (config) => {
   
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
authAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Show session expired popup
      await Swal.fire({
        title: 'Session Expired',
        text: 'Your session has expired. Please log in again.',
        icon: 'warning',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#6A994E',
      });

      window.dispatchEvent(new CustomEvent('@food-ecommerce/user-logged-out'));

      window.location.href = '/auth/login';
      
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default authAxios;