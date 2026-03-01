const fs = require('fs');
const path = require('path');

const controllersDir = path.join(__dirname, 'controllers');
const files = fs.readdirSync(controllersDir).filter(f => f.endsWith('.js') && f !== 'authController.js');

files.forEach(file => {
    const filePath = path.join(controllersDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Remove old model imports (except User, since it remains in main DB)
    content = content.replace(/const\s+(Product|Sale|Bill|AuditLog)\s*=\s*require\('\.\.\/models\/(Product|Sale|Bill|AuditLog)'\);\r?\n?/g, '');

    // Inject destructuring
    content = content.replace(/(const\s+\w+\s*=\s*async\s*\(\s*req\s*,\s*res\s*(?:,\s*next)?\s*\)\s*=>\s*\{)/g,
        '$1\n    const { Product, Sale, Bill, AuditLog } = req.tenantDb;');

    fs.writeFileSync(filePath, content, 'utf8');
});
console.log('Refactored controllers.');
