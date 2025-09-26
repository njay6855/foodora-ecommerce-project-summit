const axios = require('axios');
const { productServiceUrl, userServiceUrl } = require('../config/config');

const searchProducts = (params) => {
  // GET /api/v1/products with query params for public product search
  const searchParams = {
    ...params,
    status:  'Approved' 
  };
  return axios.get(`${productServiceUrl}/api/v1/products`, { params: searchParams });
};


const getProductById = async (productId) => {
  if (!productId) {
    throw new Error('Product ID is required');
  }

  try {
    
    const productResponse = await axios.get(`${productServiceUrl}/api/v1/products/${productId}`);
    const product = productResponse.data;

    if (!product) {
      return null;
    }

    if (!product.categoryId && !product.supplierId) {
      return { data: product };
    }

    let supplier = null;
    let category = null;

    // Fetch supplier details if supplierId exists
    if (product.supplierId) {
      try {
        const supplierResponse = await axios.get(`${userServiceUrl}/api/v1/users/${product.supplierId}`);
        supplier = supplierResponse.data;
      } catch (err) {
        console.error(`Failed to fetch supplier with ID ${product.supplierId}:`, err.message);
        supplier = null;
      }
    }

    // Fetch category details if categoryId exists
    if (product.categoryId) {
      try {
        const categoryResponse = await axios.get(`${productServiceUrl}/api/v1/products/categories/${product.categoryId}`);
        category = categoryResponse.data;
      } catch (err) {
        console.error(`Failed to fetch category with ID ${product.categoryId}:`, err.message);
        category = null;
      }
    }

    return {
      data: {
        ...product,
        categoryName: category?.name || null,
        supplier: {
          name: supplier?.email?.split('@')[0] || 'Unknown',
        },
      },
    };
  } catch (error) {
    console.error(`Failed to fetch product by ID ${productId}:`, error.message);
    throw error;
  }
};

const listCategories = () => {
  // GET /api/v1/products/categories
  return axios.get(`${productServiceUrl}/api/v1/products/categories`);
};

const getProductsByCategoryId = (categoryId) => {
  // GET /api/v1/products?categoryId={categoryId}?status=Approved
  return axios.get(`${productServiceUrl}/api/v1/products`, { params: { categoryId, status: 'Approved' } });
}

module.exports = {
  searchProducts,
  getProductById,
  listCategories,
  getProductsByCategoryId
};
