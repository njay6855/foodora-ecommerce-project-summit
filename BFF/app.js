const express = require('express');
const cors = require('cors');
const verifyToken = require('./src/middleware/authMiddleware');
const { server } = require('./src/config/config');
const logger = require('./src/utils/logger');
const requestLogger = require('./src/middleware/requestLogger');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');

const productRoutes = require('./src/routes/productRoutes');
const cartRoutes = require('./src/routes/cartRoutes');
const userRoutes = require('./src/routes/userRoutes');
const supplierRoutes = require('./src/routes/supplierRoutes');
const dataStewardRoutes = require('./src/routes/dataStewardRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use(requestLogger);


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});


//Some routes are protected
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);

app.use('/api/v1/carts', verifyToken(), cartRoutes);
app.use('/api/v1/suppliers', verifyToken(['Supplier']), supplierRoutes);
app.use('/api/v1/data-steward', verifyToken(['DataSteward']), dataStewardRoutes);
app.use('/api/v1/categories', categoryRoutes);


// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// Global error handler
app.use((err, req, res, next) => {
  error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(server.port, () => {
  logger.info(`BFF Server running on port ${server.port}`);

});
