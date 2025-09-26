const productService = require('../services/productService');
const { error } = require('../utils/logger');
const { handleMicroserviceError } = require('../utils/errorHandler');

const getProducts = async (req, res) => {
  try {
    const params = req.query; // name, categoryId, supplierId, status, page, pageSize
    const response = await productService.searchProducts(params);
    res.json(response.data);
  } catch (err) {
    error('Product search error:', err.message);
    handleMicroserviceError(err, res, 'Failed to fetch products');
  }
};

const textSearchProducts = async (req, res) => {
  try {
    const { q } = req.query; // search text
    if (!q) {
      return res.status(400).json({ message: 'Query param q is required for text search' });
    }
    const response = await productService.searchProducts({ name: q, status: 'Approved' });
    res.json(response.data);
  } catch (err) {
    error('Text search error:', err.message);
    handleMicroserviceError(err, res, 'Failed to perform text search');
  }
};

     

const getProductById = async (req, res) => {
  try {
    const productId = req.params.productId;
    const response = await productService.getProductById(productId);
    res.json(response.data);
  } catch (err) {
    error('Product fetch error:', err.message);
    handleMicroserviceError(err, res, 'Failed to fetch product details');
  }
};

const listCategories = async (req, res) => {
  try {
    const response = await productService.listCategories();
    res.json(response.data);
  } catch (err) {
    error('Category fetch error:', err.message);
    handleMicroserviceError(err, res, 'Failed to fetch categories');
  }
};

const createProduct = async (req, res) => {
  try {
    const productData = req.body;
    const response = await productService.createProduct(productData);
    res.status(201).json(response.data);
  } catch (err) {
    error('Product creation error:', err.message);
    handleMicroserviceError(err, res, 'Failed to create product');
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const updateData = req.body;
    const response = await productService.updateProduct(productId, updateData);
    res.json(response.data);
  } catch (err) {
    error('Product update error:', err.message);
    handleMicroserviceError(err, res, 'Failed to update product');
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const supplierId = req.query.supplierId;

    if (!supplierId) {
      return res.status(400).json({ message: 'supplierId query param is required' });
    }

    await productService.deleteProduct(productId, supplierId);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    error('Product delete error:', err.message);
    handleMicroserviceError(err, res, 'Failed to delete product');
  }
};

const getProductsByCategoryId = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const response = await productService.getProductsByCategoryId(categoryId);
    res.json(response.data);
  } catch (err) {
    error('Products by category fetch error:', err.message);
    handleMicroserviceError(err, res, 'Failed to fetch products by category');
  }
};

module.exports = {
  getProducts,
  textSearchProducts,
  getProductById,
  listCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategoryId
};
