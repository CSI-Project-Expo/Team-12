
// @desc    Get all audit logs (stock movements) for the logged-in admin's shop
// @route   GET /api/audit-logs
// @access  Private (admin)
const getAuditLogs = async (req, res) => {
    const { Product, Sale, Bill, AuditLog } = req.tenantDb || {};
    try {
        const logs = await AuditLog.find({ userId: req.user._id })
            .sort({ timestamp: -1 })
            .limit(100); // Limit to recent 100 logs for performance

        // Populate product names if collectionName is "Product"
        const formattedLogs = await Promise.all(logs.map(async (log) => {
            let productName = 'Unknown Product';
            if (log.collectionName === 'Product') {
                const product = await Product.findById(log.documentId);
                if (product) productName = product.name;
            }
            return {
                ...log.toObject(),
                productName
            };
        }));

        res.json(formattedLogs);
    } catch (error) {
        console.error('Error fetching audit logs:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getAuditLogs
};
