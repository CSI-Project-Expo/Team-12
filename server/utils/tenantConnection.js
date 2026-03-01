const mongoose = require('mongoose');
const productSchema = require('../models/Product');
const saleSchema = require('../models/Sale');
const billSchema = require('../models/Bill');
const auditLogSchema = require('../models/AuditLog');

const tenantConnections = {};

const getTenantConnection = (tenantId) => {
    const dbName = `tenant_${tenantId}`;

    if (tenantConnections[dbName]) {
        return tenantConnections[dbName];
    }

    let baseUri = process.env.MONGO_URI;

    // Handle MongoDB Memory Server which provides a full URI string with random DB name
    // e.g. mongodb://127.0.0.1:51341/
    if (baseUri.includes('127.0.0.1')) {
        // Just extract the host and port
        const match = baseUri.match(/mongodb:\/\/[^\/]+/);
        if (match) {
            baseUri = `${match[0]}/${dbName}`;
        }
    } else if (baseUri.includes('mongodb+srv')) {
        // Handle Atlas string
        const url = new URL(baseUri);
        url.pathname = `/${dbName}`;
        baseUri = url.toString();
    } else {
        baseUri = `${baseUri.replace(/\/$/, '')}/${dbName}`;
    }

    const db = mongoose.createConnection(baseUri);

    db.model('Product', productSchema);
    db.model('Sale', saleSchema);
    db.model('Bill', billSchema);
    db.model('AuditLog', auditLogSchema);

    tenantConnections[dbName] = db;
    return db;
};

module.exports = getTenantConnection;
