const Sale = require('../models/Sale');
const Product = require('../models/Product');

// @desc    Get daily sales data for the last 30 days
// @route   GET /api/reports/sales-daily
// @access  Private (admin)
// SAFETY: Read-only — uses only aggregate(), no writes
const getDailySales = async (req, res) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        thirtyDaysAgo.setHours(0, 0, 0, 0);

        const dailySales = await Sale.aggregate([
            {
                $match: {
                    status: 'completed',
                    createdAt: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                    },
                    revenue: { $sum: '$totalAmount' },
                    orders: { $sum: 1 },
                    items: { $sum: { $size: '$items' } }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Fill in missing dates with zeros
        const result = [];
        const today = new Date();
        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(today.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const found = dailySales.find(d => d._id === dateStr);
            result.push({
                date: dateStr,
                label: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
                revenue: found?.revenue || 0,
                orders: found?.orders || 0,
                items: found?.items || 0
            });
        }

        res.json({ success: true, data: result });
    } catch (error) {
        console.error('Daily sales report error:', error.message);
        res.status(500).json({ success: false, message: 'Failed to fetch daily sales data' });
    }
};

// @desc    Get monthly revenue trend for last 12 months
// @route   GET /api/reports/revenue-monthly
// @access  Private (admin)
// SAFETY: Read-only
const getMonthlyRevenue = async (req, res) => {
    try {
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
        twelveMonthsAgo.setDate(1);
        twelveMonthsAgo.setHours(0, 0, 0, 0);

        const monthlyRevenue = await Sale.aggregate([
            {
                $match: {
                    status: 'completed',
                    createdAt: { $gte: twelveMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    revenue: { $sum: '$totalAmount' },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        // Fill in missing months
        const result = [];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        for (let i = 11; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const found = monthlyRevenue.find(d => d._id.year === year && d._id.month === month);
            result.push({
                month: months[month - 1],
                year,
                label: `${months[month - 1]} ${year}`,
                revenue: found?.revenue || 0,
                orders: found?.orders || 0
            });
        }

        res.json({ success: true, data: result });
    } catch (error) {
        console.error('Monthly revenue report error:', error.message);
        res.status(500).json({ success: false, message: 'Failed to fetch monthly revenue data' });
    }
};

// @desc    Get top selling products
// @route   GET /api/reports/top-products
// @access  Private (admin)
// SAFETY: Read-only
const getTopProducts = async (req, res) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const topProducts = await Sale.aggregate([
            {
                $match: {
                    status: 'completed',
                    createdAt: { $gte: thirtyDaysAgo }
                }
            },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.productId',
                    totalQuantity: { $sum: '$items.quantity' },
                    totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.priceAtSale'] } },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { totalRevenue: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    productName: { $ifNull: ['$product.name', 'Deleted Product'] },
                    sku: { $ifNull: ['$product.sku', 'N/A'] },
                    totalQuantity: 1,
                    totalRevenue: 1,
                    orderCount: 1
                }
            }
        ]);

        res.json({ success: true, data: topProducts });
    } catch (error) {
        console.error('Top products report error:', error.message);
        res.status(500).json({ success: false, message: 'Failed to fetch top products' });
    }
};

// @desc    Get sales breakdown by status
// @route   GET /api/reports/sales-breakdown
// @access  Private (admin)
// SAFETY: Read-only
const getSalesBreakdown = async (req, res) => {
    try {
        const breakdown = await Sale.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$totalAmount' }
                }
            }
        ]);

        const result = {
            completed: { count: 0, totalAmount: 0 },
            pending: { count: 0, totalAmount: 0 },
            cancelled: { count: 0, totalAmount: 0 }
        };

        breakdown.forEach(item => {
            if (result[item._id]) {
                result[item._id] = { count: item.count, totalAmount: item.totalAmount };
            }
        });

        res.json({ success: true, data: result });
    } catch (error) {
        console.error('Sales breakdown error:', error.message);
        res.status(500).json({ success: false, message: 'Failed to fetch sales breakdown' });
    }
};

module.exports = {
    getDailySales,
    getMonthlyRevenue,
    getTopProducts,
    getSalesBreakdown
};
