const axios = require('axios');
const { cartServiceUrl, productServiceUrl } = require('../config/config');

const getActiveCartByUserId = async (userId) => {
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
};

const addItemToCart = (userId, itemData) => {
  // POST /api/v1/carts/{userId} with body { productId, quantity }
  return axios.post(`${cartServiceUrl}/api/v1/carts/${userId}`, itemData);
};

const removeCartItem = (userId, itemId) => {
  // DELETE /api/v1/carts/{userId}/items/{itemId}
  return axios.delete(`${cartServiceUrl}/api/v1/carts/${userId}/items/${itemId}`);
};

const updateCartItem = (userId, itemId, quantity) => {
  // PATCH /api/v1/carts/{userId}/items/{itemId} with body { quantity }
  return axios.patch(`${cartServiceUrl}/api/v1/carts/${userId}/items/${itemId}`, { quantity });
};

const deleteCart = (userId) => {
  // DELETE /api/v1/carts/{userId}
  return axios.delete(`${cartServiceUrl}/api/v1/carts/${userId}`);
}
module.exports = {
  getActiveCartByUserId,
  addItemToCart,
  removeCartItem,
  updateCartItem,
  deleteCart
};
