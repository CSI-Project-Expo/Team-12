const Product = require('../models/Product');
const Sale = require('../models/Sale');

// @desc    Get dashboard stats (total products, low stock count, today's sales, monthly revenue)
// @route   GET /api/dashboard/stats
// @access  Private (admin)
// SAFETY: Read-only — uses only countDocuments() and aggregate(), no writes/updates/deletes
const getDashboardStats = async (req, res) => {
    try {
        // Today's date boundaries (UTC)
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        // This month boundaries
        const monthStart = new Date();
        monthStart.setDate(1);
        monthStart.setHours(0, 0, 0, 0);

        // 1. Total product count (non-deleted)
        const totalProducts = await Product.countDocuments({ isDeleted: false });

        // 2. Low stock count
        const lowStockCount = await Product.countDocuments({
            isDeleted: false,
            $expr: { $lt: ['$stock', '$lowStockThreshold'] }
        });

        // 3. Today's sales total
        const todaySalesAgg = await Sale.aggregate([
            {
                $match: {
                    status: 'completed',
                    createdAt: { $gte: todayStart, $lte: todayEnd }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$totalAmount' },
                    count: { $sum: 1 }
                }
            }
        ]);

        // 4. Monthly revenue
        const monthlyRevenueAgg = await Sale.aggregate([
            {
                $match: {
                    status: 'completed',
                    createdAt: { $gte: monthStart, $lte: todayEnd }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$totalAmount' },
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({
            totalProducts,
            lowStockCount,
            todaySales: todaySalesAgg[0]?.total || 0,
            todaySalesCount: todaySalesAgg[0]?.count || 0,
            monthlyRevenue: monthlyRevenueAgg[0]?.total || 0,
            monthlySalesCount: monthlyRevenueAgg[0]?.count || 0
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getDashboardStats
};
