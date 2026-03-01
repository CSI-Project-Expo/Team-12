const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, 'routes');
const files = fs.readdirSync(routesDir).filter(f => f.endsWith('.js') && f !== 'authRoutes.js');

files.forEach(file => {
    const filePath = path.join(routesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Add import if not exists
    if (!content.includes('tenantMiddleware')) {
        content = content.replace(/(const .* = require\('\.\.\/middleware\/authMiddleware'\);)/,
            '$1\nconst tenantMiddleware = require(\'../middleware/tenantMiddleware\');');

        // Replace "protect," with "protect, tenantMiddleware," where it appears as a middleware argument
        // Note: authRoutes is excluded so we don't accidentally touch it
        content = content.replace(/\bprotect\s*,/g, 'protect, tenantMiddleware,');

        fs.writeFileSync(filePath, content, 'utf8');
    }
});
console.log('Refactored routes.');
