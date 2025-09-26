const supplierService = require('../services/supplierService');
const { error } = require('../utils/logger');
const { handleMicroserviceError } = require('../utils/errorHandler');

const createProduct = async (req, res) => {
  try {
    const supplierId = req.user.userId; // Get supplierId from JWT token
    const productData = {
      ...req.body,
      supplierId,
      status: 'Pending'
    };

    const response = await supplierService.createProduct(productData);
    res.status(201).json(response.data);
  } catch (err) {
    error('Product creation error:', err.message);
    handleMicroserviceError(err, res, 'Failed to create product');
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const supplierId = req.user.userId; // Get supplierId from JWT token
    const updateData = {
      ...req.body,
      status: 'Pending', // Reset status to Pending on update
      supplierId 
    };

    const response = await supplierService.updateProduct(productId, updateData, supplierId);
    res.json(response.data);
  } catch (err) {
    error('Product update error:', err.message);
    handleMicroserviceError(err, res, 'Failed to update product');
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const supplierId = req.user.userId; // Get supplierId from JWT token

    await supplierService.deleteProduct(productId, supplierId);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    error('Product delete error:', err.message);
    handleMicroserviceError(err, res, 'Failed to delete product');
  }
};

const getSupplierProducts = async (req, res) => {
  try {
    const supplierId = req.user.userId; // Get supplierId from JWT token
    const { status, page = 1, limit = 10 } = req.query;

    const response = await supplierService.getSupplierProducts(supplierId, {
      supplierId,
      page,
      limit
    });

    res.json(response.data);
  } catch (err) {
    error('Supplier products fetch error:', err.message);
    handleMicroserviceError(err, res, 'Failed to fetch supplier products');
  }
};

const updateProductQuantity = async (req, res) => {
  try {
    
    const productId = req.params.productId;
    const supplierId = req.user.userId;
    const { quantity } = req.body;

    // Validate quantity
    if (typeof quantity !== 'number' || quantity < 0) {
      return res.status(400).json({
        message: 'Quantity must be a non-negative number'
      });
    }

    const response = await supplierService.updateProductQuantity(productId, supplierId, quantity);
    res.json({
      message: 'Product quantity updated successfully',
      data: response.data
    });
  } catch (err) {
    error('Product quantity update error:', err.message);
    handleMicroserviceError(err, res, 'Failed to update product quantity');
  }
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getSupplierProducts,
  updateProductQuantity
};
