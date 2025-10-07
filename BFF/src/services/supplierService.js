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
  // GET /api/v1/products with supplier filter - microservice handles pagination
  const response = await axios.get(`${productServiceUrl}/api/v1/products`, {
    params: {
      ...params,
      supplierId
    }
  });

  // Enrich products with category data
  if (response.data && response.data.data) {
    const enrichedProducts = await Promise.all(
      response.data.data.map(async (product) => {
        try {
          if (product.categoryId) {
            const categoryResponse = await axios.get(`${productServiceUrl}/api/v1/products/categories/${product.categoryId}`);
            return {
              ...product,
              categoryName: categoryResponse.data.name
            };
          }
          return product;
        } catch (error) {
          console.error(`Error fetching category ${product.categoryId}:`, error.message);
          return product; 
        }
      })
    );

    console.log(response.data.meta)
    return {
      data: {
        data: enrichedProducts,
        meta: response.data.meta // Pass through pagination metadata from microservice
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
