const mongoose = require('mongoose');
const ProductModel = require('../models/Product');
const SaleModel = require('../models/Sale');
const BillModel = require('../models/Bill');
const AuditLogModel = require('../models/AuditLog');

const tenantConnections = {};

/**
 * Extract the schema from a model export.
 * Supports both compiled Mongoose models (model.schema) and raw Schema objects.
 */
const getSchema = (modelOrSchema) => {
    if (modelOrSchema.schema && modelOrSchema.schema instanceof mongoose.Schema) {
        return modelOrSchema.schema;
    }
    if (modelOrSchema instanceof mongoose.Schema) {
        return modelOrSchema;
    }
    throw new Error('Invalid model export: expected a Mongoose Model or Schema');
};

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

    db.model('Product', getSchema(ProductModel));
    db.model('Sale', getSchema(SaleModel));
    db.model('Bill', getSchema(BillModel));
    db.model('AuditLog', getSchema(AuditLogModel));

    tenantConnections[dbName] = db;
    return db;
};

module.exports = getTenantConnection;
