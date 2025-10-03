const axios = require('axios');
const { productServiceUrl, userServiceUrl } = require('../config/config');

const getPendingProducts = async (params) => {
    // GET /api/v1/products with status=Pending
    const productsResponse = await axios.get(`${productServiceUrl}/api/v1/products`, {
        params: {
            ...params,
            status: 'Pending',
        }
    });

    if (productsResponse.data && productsResponse.data.data && Array.isArray(productsResponse.data.data)) {
        const enrichedProducts = await Promise.all(
            productsResponse.data.data.map(async (product) => {
                let enrichedProduct = { ...product };

                if (product.categoryId) {
                    try {
                        const categoryResponse = await axios.get(`${productServiceUrl}/api/v1/products/categories/${product.categoryId}`);
                        enrichedProduct.categoryName = categoryResponse.data.name;
                    } catch (error) {
                        console.error(`Error fetching category ${product.categoryId}:`, error.message);
                        enrichedProduct.categoryName = 'Unknown Category';
                    }
                }

                if (product.supplierId) {
                    try {
                        const supplierResponse = await axios.get(`${userServiceUrl}/api/v1/users/${product.supplierId}`);
                        enrichedProduct.supplierName = supplierResponse.data.name || supplierResponse.data.email.split('@')[0];
                    } catch (error) {
                        console.error(`Error fetching supplier ${product.supplierId}:`, error.message);
                        enrichedProduct.supplierName = 'Unknown Supplier';
                    }
                }

                return enrichedProduct;
            })
        );

        return {
            ...productsResponse,
            data: {
                ...productsResponse.data,
                data: enrichedProducts
            }
        };
    }

    return productsResponse;
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
        dataStewardId: reviewData.dataStewardId,
        stewardNote: reviewData.stewardNote || ''
    });
};

module.exports = {
    getPendingProducts,
    reviewProduct
};
