const getTenantConnection = require('../utils/tenantConnection');

const tenantMiddleware = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    try {
        // Currently differentiating tenant by user ID. 
        // If there are different user roles, we'd map them to an admin's ID.
        // Assuming we map admin's ID as the tenantId.
        const tenantId = req.user._id.toString();

        const tenantDb = getTenantConnection(tenantId);

        req.tenantDb = {
            Product: tenantDb.model('Product'),
            Sale: tenantDb.model('Sale'),
            Bill: tenantDb.model('Bill'),
            AuditLog: tenantDb.model('AuditLog')
        };

        console.log('Tenant Middleware ran for', req.user._id); next();
    } catch (error) {
        console.error('Tenant Middleware Error:', error);
        res.status(500).json({ message: 'Error initializing tenant database connection' });
    }
};

module.exports = tenantMiddleware;
