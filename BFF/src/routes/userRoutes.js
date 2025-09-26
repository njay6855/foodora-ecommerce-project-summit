const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken  = require('../middleware/authMiddleware');

/**
 * @openapi
 * /api/v1/users:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: User created
 */
router.post('/', userController.createUser);

/**
 * @openapi
 * /api/v1/users/{userId}:
 *   get:
 *     summary: Get user info
 *     tags:
 *       - User
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User info
 */

router.get('/:userId', verifyToken(),  userController.getUserById);

/**
 * @openapi
 * /api/v1/users/login:
 *   post:
 *     summary: User login
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in
 */

router.post('/login', userController.loginUser);

module.exports = router;