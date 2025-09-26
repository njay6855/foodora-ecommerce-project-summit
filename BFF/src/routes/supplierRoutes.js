const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');

/**
 * @openapi
 * /api/v1/suppliers/products:
 *   post:
 *     summary: Create a new product (Supplier only)
 *     tags:
 *       - Supplier
 *     security:  
 *       - bearerAuth: []
 *     parameters:
 * 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               quantity:
 *                 type: integer
 *               categoryId:
 *                 type: integer
 *               imageUrls:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/products', supplierController.createProduct);

/**
 * @openapi
 * /api/v1/suppliers/products/{productId}:
 *   put:
 *     summary: Update product (Supplier only)
 *     tags:
 *       - Supplier
 *     security:  
 *       - bearerAuth: []
 *     parameters:
 *       - name: productId
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               quantity:
 *                 type: integer
 *               categoryId:
 *                 type: integer
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 */
router.put('/products/:productId', supplierController.updateProduct);

/**
 * @openapi
 * /api/v1/suppliers/products/{productId}:
 *   patch:
 *     summary: Update product quantity (Supplier only)
 *     tags:
 *       - Supplier
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the product to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 minimum: 0
 *                 description: New quantity of the product
 *     responses:
 *       200:
 *         description: Quantity updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *       400:
 *         description: Invalid quantity
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
router.patch('/products/:productId', supplierController.updateProductQuantity);


/**
 * @openapi
 * /api/v1/suppliers/products/{productId}:
 *   delete:
 *     summary: Soft delete product (Supplier only)
 *     tags:
 *       - Supplier
 *     security:  
 *       - bearerAuth: []
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/products/:productId', supplierController.deleteProduct);

/**
 * @openapi
 * /api/v1/suppliers/products:
 *   get:
 *     summary: Get supplier's products
 *     tags:
 *       - Supplier
 *     security:  
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of supplier's products
 *       401:
 *         description: Unauthorized
 */
router.get('/products', supplierController.getSupplierProducts);


module.exports = router;
