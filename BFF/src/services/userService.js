const axios = require('axios');
const { userServiceUrl } = require('../config/config');

const createUser = (userData) => {
  // POST /api/v1/users
  return axios.post(`${userServiceUrl}/api/v1/users`, userData);
};

const getUserById = (userId) => {
  // GET /api/v1/users/{userId}
  return axios.get(`${userServiceUrl}/api/v1/users/${userId}`);
};

const loginUser = (email, password) => {
  // POST /api/v1/users/login
  return axios.post(`${userServiceUrl}/api/v1/users/login`, { email, password });
}

module.exports = {
  createUser,
  getUserById,
  loginUser
};
