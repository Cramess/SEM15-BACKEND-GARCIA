const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

// Rutas públicas
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Rutas protegidas — solo ADMIN
router.post('/', verifyToken, requireRole('ADMIN'), productController.createProduct);
router.put('/:id', verifyToken, requireRole('ADMIN'), productController.updateProduct);
router.delete('/:id', verifyToken, requireRole('ADMIN'), productController.deleteProduct);

module.exports = router;
