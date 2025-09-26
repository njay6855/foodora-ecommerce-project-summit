const axios = require('axios');
const { productServiceUrl } = require('../config/config');


const createProduct = (productData) => {
  if (!productData.name || !productData.price || !productData.categoryId) {
    throw new Error('Missing required product fields');
  }
  
  return axios.post(`${productServiceUrl}/api/v1/products`, {
    ...productData,
    status: 'Pending' 
  });
};

const updateProduct = (productId, productData, supplierId) => {
  if (!productId || !supplierId) {
    throw new Error('Product ID and Supplier ID are required');
  }

  return axios.get(`${productServiceUrl}/api/v1/products/${productId}`)
    .then(response => {
      const product = response.data;
      if (product.supplierId !== supplierId) {
        throw new Error('Unauthorized: Product does not belong to this supplier');
      }
      
      return axios.put(`${productServiceUrl}/api/v1/products/${productId}`, {
        ...productData,
        supplierId 
      });
    });
};

const deleteProduct = (productId, supplierId) => {
  if (!productId || !supplierId) {
    throw new Error('Product ID and Supplier ID are required');
  }

  // DELETE /api/v1/products/{productId} with supplier verification
  return axios.delete(`${productServiceUrl}/api/v1/products/${productId}`, {
    params: { supplierId }
  });
};

const getSupplierProducts = async (supplierId, params = {}) => {
  // GET /api/v1/products with supplier filter
  const response = await axios.get(`${productServiceUrl}/api/v1/products`, {
    params: {
      ...params,
      supplierId,
      pageSize: 1000 
    }
  });

  // Filter out deactivated products and apply pagination in memory
  if (response.data && response.data.data) {
    const filteredProducts = response.data.data.filter(product => 
      product.status !== 'Deactivated'
    );

    // Apply pagination after filtering
    const page = params.page || 1;
    const limit = params.limit || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    // Return with pagination metadata
    return {
      data: {
        data: paginatedProducts,
        pagination: {
          total: filteredProducts.length,
          page: page,
          limit: limit,
          totalPages: Math.ceil(filteredProducts.length / limit)
        }
      }
    };
  }

  return response;
};

const updateProductQuantity = async (productId, supplierId, quantity) => {
  if (!productId || !supplierId) {
    throw new Error('Product ID and Supplier ID are required');
  }

  return axios.put(`${productServiceUrl}/api/v1/products/${productId}`, {
    quantity,
    supplierId
  });
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getSupplierProducts,
  updateProductQuantity
};
