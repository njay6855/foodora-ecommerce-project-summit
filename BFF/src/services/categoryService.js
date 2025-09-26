const axios = require('axios');
const { productServiceUrl } = require('../config/config');

const getAllCategories = async () => {
    // GET /api/v1/products/categories
    return axios.get(`${productServiceUrl}/api/v1/products/categories`);
};

const getCategoryById = async (categoryId) => {
    if (!categoryId) {
        throw new Error('Category ID is required');
    }

    // GET /api/v1/products/categories/{categoryId}
    return axios.get(`${productServiceUrl}/api/v1/products/categories/${categoryId}`);
};

module.exports = {
    getAllCategories,
    getCategoryById
};
