const userService = require('../services/userService');
const { error } = require('../utils/logger');
const { handleMicroserviceError } = require('../utils/errorHandler');
require('dotenv').config();

// Temporary: Simple JWT handling for login
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d'; 
console.log('JWT_EXPIRES_IN:', JWT_EXPIRES_IN);

const createUser = async (req, res) => {
  try {
    const userData = req.body; // { email, password, role }
    const response = await userService.createUser(userData);
    res.json(response.data);
  } catch (err) {
    error('User creation error:', err.message);
    handleMicroserviceError(err, res, 'Failed to create user');

  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.userId; // from route param
    const response = await userService.getUserById(userId);
    
    res.json(response.data);
  } catch (err) {
  
    error('User fetch error:', err.message);
    handleMicroserviceError(err, res, 'Failed to fetch user details');

  }
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Authenticate user
    const user = await userService.loginUser(email, password); // Should return user object if valid

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user?.data?.id,
        role: user?.data?.role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } 
    );

    // Extract name from email (part before @)
    const name = email.split('@')[0];

    // Send token back to client
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.data.id,
        name: name,
        role: user.data.role,
      }
    });

  } catch (err) {
    console.error('User login error:', err.message);
    handleMicroserviceError(err, res, 'Failed to login user');
  }
};


module.exports = {
  createUser,
  getUserById,
  loginUser
};
