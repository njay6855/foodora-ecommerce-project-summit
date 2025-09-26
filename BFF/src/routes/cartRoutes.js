const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');


/**
 * @openapi
 * /api/v1/carts/{userId}:
 *   get:
 *     summary: Get active cart for user
 *     tags:
 *       - Cart
 *      
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cart data
 */
router.get('/:userId', cartController.getCart);

/**
 * @openapi
 * /api/v1/carts/{userId}:
 *   post:
 *     summary: Add item to cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Item added to cart
 */
router.post('/:userId', cartController.addItem);

/**
 * @openapi
 * /api/v1/carts/{userId}/items/{itemId}:
 *   delete:
 *     summary: Remove item from user's cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user whose cart is being modified
 *       - name: itemId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the item to remove
 *     responses:
 *       200:
 *         description: Item removed from cart
 *       404:
 *         description: Item not found in cart
 */
router.delete('/:userId/items/:itemId', cartController.removeItem);

/**
 * @openapi
 * /api/v1/carts/{userId}/items/{itemId}:
 *   patch:
 *     summary: Update quantity of item in user's cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user whose cart is being modified
 *       - name: itemId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the item to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 description: New quantity for the item
 *     responses:
 *       200:
 *         description: Quantity updated successfully
 *       400:
 *         description: Invalid quantity provided
 *       404:
 *         description: Item not found in cart
 */
router.patch('/:userId/items/:itemId', cartController.updateItem);

/**
 * @openapi
 * /api/v1/carts/{userId}:
 *   delete:
 *     summary: Delete user's entire cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user whose cart should be deleted
 *     responses:
 *       200:
 *         description: Cart deleted successfully
 *       404:
 *         description: Cart not found
 */
router.delete('/:userId', cartController.deleteCart);

module.exports = router;