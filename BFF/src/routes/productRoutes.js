const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const verifyToken = require('../middleware/authMiddleware');

/**
 * @openapi
 * /api/v1/products:
 *   get:
 *     summary: Get a list of products
 *     tags:
 *       - Product
 *     parameters:
 *       - name: name
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *       - name: categoryId
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *       - name: supplierId
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *       - name: status
 *         in: query
 *         required: false
 *         schema:
 *            type: string
 * 
 * 
 * 
 *     responses:
 *       200:
 *         description: Product list
 */
router.get('/', productController.getProducts);



/**
 * @openapi
 * /api/v1/products/search:
 *   get:
 *     summary: Advanced search for products
 *     tags:
 *       - Product
 *     parameters:
 *       - name: q
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Search keyword for product name
 *    
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
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
 *                       categoryId:
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
 *                     totalPages:
 *                       type: integer
 *                     limit:
 *                       type: integer
 */
router.get('/search', productController.textSearchProducts);


/**
 * @openapi
 * /api/v1/products/categories:
 *   get:
 *     summary: List all product categories
 *     tags:
 *       - Product
 *     responses:
 *       200:
 *         description: Category list
 */
router.get('/categories', productController.listCategories);

/**
 * @openapi
 * /api/v1/products/{productId}:
 *   get:
 *     summary: Get product by ID
 *     tags:
 *       - Product
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product details
 */
router.get('/:productId', productController.getProductById);


/**
 * @openapi
 * /api/v1/products/categories/{categoryId}:
 *   get:
 *     summary: Get products by category ID
 *     tags:
 *       - Product
 *     parameters:
 *       - name: categoryId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the category to get products from
 *     responses:
 *       200:
 *         description: List of products in the category
 *       404:
 *         description: Category not found
 */
router.get('/categories/:categoryId', productController.getProductsByCategoryId);


module.exports = router;