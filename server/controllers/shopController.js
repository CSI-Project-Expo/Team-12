const User = require('../models/User');

// @desc    Get all shops (admin users with a storeName)
// @route   GET /api/shops
// @access  Private
const getShops = async (req, res) => {
    try {
        const shops = await User.find({
            role: 'admin',
            storeName: { $exists: true, $ne: '' }
        }).select('name storeName createdAt');

        const formatted = shops.map(shop => ({
            _id: shop._id,
            name: shop.storeName,
            owner: shop.name,
            location: 'Local Store',
            createdAt: shop.createdAt
        }));

        res.json(formatted);
    } catch (error) {
        console.error('Error fetching shops:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get products for a specific shop (admin user)
// @route   GET /api/shops/:id/products
// @access  Private
const getShopProducts = async (req, res) => {
    try {
        const shopId = req.params.id;

        // Verify the shop (admin user) exists
        const shop = await User.findOne({ _id: shopId, role: 'admin' });
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        // Dynamically connect to the specific shop's tenant DB to fetch their products
        const getTenantConnection = require('../utils/tenantConnection');
        const shopTenantDb = getTenantConnection(shopId);
        const ShopProduct = shopTenantDb.model('Product');

        const products = await ShopProduct.find({
            createdBy: shopId,
            isDeleted: false
        })
            .sort({ createdAt: -1 })
            .select('name price stock category sku');

        res.json({
            shop: {
                _id: shop._id,
                name: shop.storeName || shop.name,
                owner: shop.name
            },
            products
        });
    } catch (error) {
        console.error('Error fetching shop products:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getShops,
    getShopProducts
};
