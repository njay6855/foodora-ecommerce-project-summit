const cartService = require('../services/cartService');
const { error } = require('../utils/logger');
const { handleMicroserviceError } = require('../utils/errorHandler');

const getCart = async (req, res) => {
  try {
    const userId = req.params.userId; 
    const response = await cartService.getActiveCartByUserId(userId);
    res.json(response.data);
  } catch (err) {
    error('Cart fetch error:', err.message);
    handleMicroserviceError(err, res, 'Failed to fetch cart');
  }
};

const addItem = async (req, res) => {
  try {
    const userId = req.params.userId; 
    const itemData = req.body;
    const response = await cartService.addItemToCart(userId, itemData);
    res.json(response.data);
  } catch (err) {
    error('Add to cart error:', err.message);
    handleMicroserviceError(err, res, 'Failed to add item to cart');
  }
};

const removeItem = async (req, res) => {
  try {
    const { userId, itemId } = req.params;
    await cartService.removeCartItem(userId, itemId);
    res.status(200).json({ message: 'Item removed from cart' });
  } catch (err) {
    error('Remove cart item error:', err.message);
    handleMicroserviceError(err, res, 'Failed to remove item from cart');
  }
};

const updateItem = async (req, res) => {
  try {
    const { userId, itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be a positive integer' });
    }

    const response = await cartService.updateCartItem(userId, itemId, quantity);
    res.json(response.data);
  } catch (err) {
    error('Update cart item error:', err.message);
    handleMicroserviceError(err, res, 'Failed to update cart item');
  }
};

const deleteCart = async (req, res) => {
  try {
    const { userId } = req.params;
    await cartService.deleteCart(userId);
    res.status(200).json({ message: 'Cart deleted successfully' });
  } catch (err) {
    error('Delete cart error:', err.message);
    handleMicroserviceError(err, res, 'Failed to delete cart');
  }
};

module.exports = {
  getCart,
  addItem,
  removeItem,
  updateItem,
  deleteCart,
};
