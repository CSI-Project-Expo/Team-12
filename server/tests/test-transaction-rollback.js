/**
 * Test: Transaction Rollback Behavior
 * 
 * Verifies that the createSaleTransaction() service correctly
 * rolls back all changes when any step in the transaction fails.
 * 
 * Uses MongoMemoryReplSet because MongoDB transactions require a replica set.
 */

const mongoose = require('mongoose');
const { MongoMemoryReplSet } = require('mongodb-memory-server');
const Product = require('../models/Product');
const Sale = require('../models/Sale');
const Bill = require('../models/Bill');
const AuditLog = require('../models/AuditLog');
const User = require('../models/User');
const { createSaleTransaction } = require('../services/saleService');

async function run() {
    console.log('\n═══════════════════════════════════════════');
    console.log('  TEST: Transaction Rollback Behavior');
    console.log('═══════════════════════════════════════════\n');

    let replSet;
    let passed = 0;
    let failed = 0;

    try {
        // Setup — replica set required for transactions
        console.log('  Starting MongoDB Replica Set (required for transactions)...');
        replSet = await MongoMemoryReplSet.create({
            replSet: { count: 1 }  // Single-node replica set for testing
        });
        const uri = replSet.getUri();
        await mongoose.connect(uri);
        console.log('  ✓ Connected to replica set\n');

        // Create test data
        const admin = await User.create({
            name: 'Test Admin',
            email: 'admin@test.com',
            password: 'password123',
            role: 'admin',
            storeName: 'Test Store'
        });

        const customer = await User.create({
            name: 'Test Customer',
            email: 'customer@test.com',
            password: 'password123',
            role: 'user'
        });

        // ── Test 1: Successful transaction — all steps complete ──
        console.log('  [1] Testing successful transaction...');

        const product1 = await Product.create({
            name: 'Widget A',
            sku: 'WA-001',
            price: 500,
            stock: 10,
            lowStockThreshold: 3,
            createdBy: admin._id
        });

        const result = await createSaleTransaction({
            customerId: customer._id,
            items: [{ productId: product1._id, quantity: 2 }]
        }, admin._id);

        const updatedProduct1 = await Product.findById(product1._id);
        const saleCount = await Sale.countDocuments();
        const billCount = await Bill.countDocuments();

        if (
            result.success === true &&
            updatedProduct1.stock === 8 &&
            saleCount === 1 &&
            billCount === 1
        ) {
            console.log('      ✅ PASS — Sale created, stock reduced 10→8, bill generated');
            passed++;
        } else {
            console.log(`      ❌ FAIL — stock: ${updatedProduct1.stock}, sales: ${saleCount}, bills: ${billCount}`);
            failed++;
        }

        // ── Test 2: Rollback on insufficient stock ──
        console.log('\n  [2] Testing rollback on insufficient stock...');

        const product2 = await Product.create({
            name: 'Widget B',
            sku: 'WB-001',
            price: 300,
            stock: 3,
            lowStockThreshold: 1,
            createdBy: admin._id
        });

        const stockBefore = product2.stock;
        const salesBefore = await Sale.countDocuments();
        const billsBefore = await Bill.countDocuments();

        try {
            await createSaleTransaction({
                customerId: customer._id,
                items: [{ productId: product2._id, quantity: 100 }]  // Way more than available
            }, admin._id);

            console.log('      ❌ FAIL — Transaction should have thrown an error');
            failed++;
        } catch (err) {
            // Transaction should have been aborted — verify nothing changed
            const stockAfter = (await Product.findById(product2._id)).stock;
            const salesAfter = await Sale.countDocuments();
            const billsAfter = await Bill.countDocuments();

            if (stockAfter === stockBefore && salesAfter === salesBefore && billsAfter === billsBefore) {
                console.log('      ✅ PASS — Transaction rolled back: stock unchanged, no sale/bill created');
                passed++;
            } else {
                console.log(`      ❌ FAIL — Rollback incomplete: stock ${stockBefore}→${stockAfter}, sales ${salesBefore}→${salesAfter}, bills ${billsBefore}→${billsAfter}`);
                failed++;
            }
        }

        // ── Test 3: Rollback on non-existent product ──
        console.log('\n  [3] Testing rollback on non-existent product...');

        const fakeProductId = new mongoose.Types.ObjectId();
        const salesBefore3 = await Sale.countDocuments();

        try {
            await createSaleTransaction({
                customerId: customer._id,
                items: [{ productId: fakeProductId, quantity: 1 }]
            }, admin._id);

            console.log('      ❌ FAIL — Transaction should have thrown an error');
            failed++;
        } catch (err) {
            const salesAfter3 = await Sale.countDocuments();

            if (salesAfter3 === salesBefore3 && err.message.includes('not found')) {
                console.log('      ✅ PASS — Transaction rolled back: no orphan records, correct error message');
                passed++;
            } else {
                console.log(`      ❌ FAIL — sales ${salesBefore3}→${salesAfter3}, error: ${err.message}`);
                failed++;
            }
        }

        // ── Test 4: Multi-item rollback — one bad item cancels entire order ──
        console.log('\n  [4] Testing multi-item rollback (one bad item cancels all)...');

        const goodProduct = await Product.create({
            name: 'Good Item',
            sku: 'GI-001',
            price: 100,
            stock: 20,
            lowStockThreshold: 5,
            createdBy: admin._id
        });

        const lowStockProduct = await Product.create({
            name: 'Low Stock Item',
            sku: 'LS-001',
            price: 200,
            stock: 1,
            lowStockThreshold: 1,
            createdBy: admin._id
        });

        const goodStockBefore = goodProduct.stock;
        const lowStockBefore = lowStockProduct.stock;
        const salesBefore4 = await Sale.countDocuments();

        try {
            await createSaleTransaction({
                customerId: customer._id,
                items: [
                    { productId: goodProduct._id, quantity: 5 },    // This would succeed alone
                    { productId: lowStockProduct._id, quantity: 10 } // This will fail — only 1 in stock
                ]
            }, admin._id);

            console.log('      ❌ FAIL — Transaction should have thrown an error');
            failed++;
        } catch (err) {
            // BOTH products' stock should be unchanged
            const goodStockAfter = (await Product.findById(goodProduct._id)).stock;
            const lowStockAfter = (await Product.findById(lowStockProduct._id)).stock;
            const salesAfter4 = await Sale.countDocuments();

            if (
                goodStockAfter === goodStockBefore &&
                lowStockAfter === lowStockBefore &&
                salesAfter4 === salesBefore4
            ) {
                console.log('      ✅ PASS — Both products rolled back, no sale created');
                console.log(`             Good Item: ${goodStockBefore}→${goodStockAfter} (unchanged)`);
                console.log(`             Low Stock: ${lowStockBefore}→${lowStockAfter} (unchanged)`);
                passed++;
            } else {
                console.log(`      ❌ FAIL — Rollback incomplete`);
                console.log(`             Good Item: ${goodStockBefore}→${goodStockAfter}`);
                console.log(`             Low Stock: ${lowStockBefore}→${lowStockAfter}`);
                failed++;
            }
        }

        // ── Test 5: Verify audit log is created on successful transaction ──
        console.log('\n  [5] Verifying audit log was created for successful transaction...');
        const auditLogs = await AuditLog.find({ actionType: 'TRANSACTION' });

        if (auditLogs.length >= 1) {
            console.log(`      ✅ PASS — Found ${auditLogs.length} TRANSACTION audit log(s)`);
            passed++;
        } else {
            console.log('      ❌ FAIL — No TRANSACTION audit logs found');
            failed++;
        }

    } catch (error) {
        console.error(`\n  ❌ Unexpected error: ${error.message}`);
        console.error(error.stack);
        failed++;
    } finally {
        await mongoose.disconnect();
        if (replSet) await replSet.stop();
    }

    // Summary
    console.log('\n  ─────────────────────────────────────────');
    console.log(`  Results: ${passed} passed, ${failed} failed out of ${passed + failed}`);
    console.log('  ─────────────────────────────────────────\n');

    return { passed, failed };
}

module.exports = run;

if (require.main === module) {
    run().then(({ failed }) => process.exit(failed > 0 ? 1 : 0));
}
