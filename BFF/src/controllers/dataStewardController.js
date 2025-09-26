const dataStewardService = require('../services/dataStewardService');
const { error } = require('../utils/logger');
const { handleMicroserviceError } = require('../utils/errorHandler');

const getPendingProducts = async (req, res) => {
    try {
        const { page = 1, pageSize = 10 } = req.query;
        
        const response = await dataStewardService.getPendingProducts({
            page,
            pageSize
        });

        res.json(response.data);
    } catch (err) {
        error('Pending products fetch error:', err.message);
        handleMicroserviceError(err, res, 'Failed to fetch pending products');
    }
};

const reviewProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        const dataStewardId = req.user.userId;
        const { status } = req.body;

        // Validate status
        if (!['Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({
                message: 'Status must be either Approved or Rejected'
            });
        }

        const response = await dataStewardService.reviewProduct(productId, {
            status,
            dataStewardId
        });

        res.json({
            message: `Product ${status.toLowerCase()} successfully`,
            data: response.data
        });
    } catch (err) {
        error('Product review error:', err.message);
        handleMicroserviceError(err, res, 'Failed to review product');
    }
};

module.exports = {
    getPendingProducts,
    reviewProduct
};
