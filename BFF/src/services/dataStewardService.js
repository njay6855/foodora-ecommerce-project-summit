const axios = require('axios');
const { productServiceUrl } = require('../config/config');

const getPendingProducts = async (params) => {
    // GET /api/v1/products with status=Pending
    return axios.get(`${productServiceUrl}/api/v1/products`, {
        params: {
            ...params,
            status: 'Pending',
        }
    });
};

const reviewProduct = async (productId, reviewData) => {
    if (!productId || !reviewData.status || !reviewData.dataStewardId) {
        throw new Error('Product ID, status, and Data Steward ID are required');
    }

    if (!['Approved', 'Rejected'].includes(reviewData.status)) {
        throw new Error('Status must be either Approved or Rejected');
    }

    // Verify the product is in Pending status
    const productResponse = await axios.get(`${productServiceUrl}/api/v1/products/${productId}`);
    const product = productResponse.data;

    if (product.status !== 'Pending') {
        throw new Error('Only pending products can be reviewed');
    }

    // PATCH /api/v1/products/{productId} with review data
    return axios.patch(`${productServiceUrl}/api/v1/products/${productId}`, {
        status: reviewData.status,
        dataStewardId: reviewData.dataStewardId
    });
};

module.exports = {
    getPendingProducts,
    reviewProduct
};
