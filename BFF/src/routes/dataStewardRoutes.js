const express = require('express');
const router = express.Router();
const dataStewardController = require('../controllers/dataStewardController');

/**
 * @openapi
 * /api/v1/data-steward/products:
 *   get:
 *     summary: Get list of products pending approval (Data Steward only)
 *     tags:
 *       - Data Steward
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - name: pageSize
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of pending products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       price:
 *                         type: number
 *                       supplierId:
 *                         type: integer
 *                       status:
 *                         type: string
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 */
router.get('/products', dataStewardController.getPendingProducts);

/**
 * @openapi
 * /api/v1/data-steward/products/{productId}:
 *   patch:
 *     summary: Approve or reject a product (Data Steward only)
 *     tags:
 *       - Data Steward
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the product to review
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: New status for the product
 *     responses:
 *       200:
 *         description: Product review completed successfully
 *       400:
 *         description: Invalid status
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
router.patch('/products/:productId', dataStewardController.reviewProduct);

module.exports = router;
