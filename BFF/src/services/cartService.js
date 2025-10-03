const axios = require('axios');
const { cartServiceUrl, productServiceUrl } = require('../config/config');

const addItemToCart = async (userId, itemData) => {
  try {
    // POST /api/v1/carts/{userId} with body { productId, quantity }
    return await axios.post(`${cartServiceUrl}/api/v1/carts/${userId}`, itemData);
  } catch (error) {
    console.error('Error adding item to cart:', error.message);
    throw error;
  }
};

const removeCartItem = async (userId, itemId) => {
  try {
    // DELETE /api/v1/carts/{userId}/items/{itemId}
    return await axios.delete(`${cartServiceUrl}/api/v1/carts/${userId}/items/${itemId}`);
  } catch (error) {
    console.error('Error removing cart item:', error.message);
    throw error;
  }
};

const updateCartItem = async (userId, itemId, quantity) => {
  try {
    // PATCH /api/v1/carts/{userId}/items/{itemId} with body { quantity }
    return await axios.patch(`${cartServiceUrl}/api/v1/carts/${userId}/items/${itemId}`, { quantity });
  } catch (error) {
    console.error('Error updating cart item:', error.message);
    throw error;
  }
};

const deleteCart = async (userId) => {
  try {
    // DELETE /api/v1/carts/{userId}
    return await axios.delete(`${cartServiceUrl}/api/v1/carts/${userId}`);
  } catch (error) {
    console.error('Error deleting cart:', error.message);
    throw error;
  }
};

const getActiveCartByUserId = async (userId) => {
  try {
    // GET /api/v1/carts/{userId}
    const cartResponse = await axios.get(`${cartServiceUrl}/api/v1/carts/${userId}`);
    
    const cart = cartResponse.data.data; 

    if (cart && cart.items && Array.isArray(cart.items)) {
      
      const enrichedItems = await Promise.all(
        cart.items.map(async (item) => {
          try {
            // Fetch product details for each item
            const productResponse = await axios.get(`${productServiceUrl}/api/v1/products/${item.productId}`);
            const productData = productResponse.data; 
            
            return {
              ...item,
              product: {
                name: productData.name,
                imageUrl: productData.imageUrls?.[0],
                price: productData.price
              }
            };
          } catch (error) {
            console.error(`Failed to fetch product details for product ${item.productId}:`, error.message);
            return item;
          }
        })
      );

      return {
        data: {
          data: {
            ...cart,
            items: enrichedItems
          }
        }
      };
    }

    return cartResponse;
  } catch (error) {
    console.error('Error fetching cart:', error.message);
    throw error;
  }
};

module.exports = {
  getActiveCartByUserId,
  addItemToCart,
  removeCartItem,
  updateCartItem,
  deleteCart
};
