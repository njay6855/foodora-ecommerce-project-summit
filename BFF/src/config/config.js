require('dotenv').config();

module.exports = {
  productServiceUrl: process.env.PRODUCT_SERVICE_URL,
  cartServiceUrl: process.env.CART_SERVICE_URL,
  userServiceUrl: process.env.USER_SERVICE_URL,

  cognito: {
    region: process.env.COGNITO_REGION,
    userPoolId: process.env.COGNITO_USER_POOL_ID,
    appClientId: process.env.COGNITO_APP_CLIENT_ID,
  },

  server: {
    port: process.env.PORT || 3000,
  }
};
