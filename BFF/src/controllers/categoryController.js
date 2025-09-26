const categoryService = require('../services/categoryService');
const { error } = require('../utils/logger');
const { handleMicroserviceError } = require('../utils/errorHandler');

const getAllCategories = async (req, res) => {
    try {
        const response = await categoryService.getAllCategories();
        res.json(response.data);
    } catch (err) {
        error('Categories fetch error:', err.message);
        handleMicroserviceError(err, res, 'Failed to fetch categories');
    }
};

const getCategoryById = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const response = await categoryService.getCategoryById(categoryId);
        
        if (!response.data) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json(response.data);
    } catch (err) {
        error('Category fetch error:', err.message);
        handleMicroserviceError(err, res, 'Failed to fetch category details');
    }
};

module.exports = {
    getAllCategories,
    getCategoryById
};
