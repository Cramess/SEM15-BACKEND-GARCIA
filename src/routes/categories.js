const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

router.get('/', categoryController.getAllCategories);
router.post('/', verifyToken, requireRole('ADMIN'), categoryController.createCategory);
router.put('/:id', verifyToken, requireRole('ADMIN'), categoryController.updateCategory);
router.delete('/:id', verifyToken, requireRole('ADMIN'), categoryController.deleteCategory);

module.exports = router;
