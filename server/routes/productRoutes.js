const express = require('express');
const router = express.Router();
const { getAllProducts, getLowStockProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const tenantMiddleware = require('../middleware/tenantMiddleware');

// All routes are protected
router.get('/', protect, tenantMiddleware, getAllProducts);
router.get('/low-stock', protect, tenantMiddleware, getLowStockProducts);
router.post('/', protect, tenantMiddleware, admin, createProduct);
router.put('/:id', protect, tenantMiddleware, admin, updateProduct);
router.delete('/:id', protect, tenantMiddleware, admin, deleteProduct);


module.exports = router;
