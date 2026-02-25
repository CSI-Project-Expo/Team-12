/**
 * Test: Simultaneous Sales — Concurrency Check
 * 
 * Verifies that atomic stock reduction prevents overselling
 * when multiple sales happen simultaneously for the same product.
 */

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Product = require('../models/Product');
const User = require('../models/User');

async function run() {
    console.log('\n═══════════════════════════════════════════');
    console.log('  TEST: Simultaneous Sales Concurrency');
    console.log('═══════════════════════════════════════════\n');

    let mongoServer;
    let passed = 0;
    let failed = 0;

    try {
        // Setup
        mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());
        console.log('  ✓ Connected to in-memory MongoDB\n');

        // Create an admin user to own the products
        const admin = await User.create({
            name: 'Test Admin',
            email: 'admin@test.com',
            password: 'password123',
            role: 'admin',
            storeName: 'Test Store'
        });

        // ── Test 1: Atomic stock reduction — 10 concurrent requests for 5 items ──
        console.log('  [1] Creating product with stock = 5...');
        const product = await Product.create({
            name: 'Limited Item',
            sku: 'LIM-001',
            price: 100,
            stock: 5,
            lowStockThreshold: 2,
            createdBy: admin._id
        });

        console.log('      Stock set to: 5');
        console.log('      Firing 10 simultaneous purchase attempts (1 unit each)...\n');

        // Simulate 10 concurrent atomic stock reductions
        const purchaseAttempts = Array.from({ length: 10 }, (_, i) =>
            Product.findOneAndUpdate(
                { _id: product._id, stock: { $gte: 1 } },  // Only if stock >= 1
                { $inc: { stock: -1 } },
                { new: true }
            ).then(result => ({
                attempt: i + 1,
                success: result !== null,
                remainingStock: result ? result.stock : null
            }))
        );

        const results = await Promise.all(purchaseAttempts);

        const successes = results.filter(r => r.success);
        const failures = results.filter(r => !r.success);

        console.log(`      Successful purchases: ${successes.length}`);
        console.log(`      Rejected purchases:   ${failures.length}`);

        // Verify exactly 5 succeeded
        if (successes.length === 5) {
            console.log('      ✅ PASS — Exactly 5 out of 10 purchases succeeded');
            passed++;
        } else {
            console.log(`      ❌ FAIL — Expected 5 successes, got ${successes.length}`);
            failed++;
        }

        // Verify exactly 5 failed
        if (failures.length === 5) {
            console.log('      ✅ PASS — Exactly 5 out of 10 purchases were rejected');
            passed++;
        } else {
            console.log(`      ❌ FAIL — Expected 5 rejections, got ${failures.length}`);
            failed++;
        }

        // ── Test 2: Final stock should be exactly 0 ──
        console.log('\n  [2] Checking final stock...');
        const finalProduct = await Product.findById(product._id);

        if (finalProduct.stock === 0) {
            console.log(`      ✅ PASS — Final stock is 0 (no overselling occurred)`);
            passed++;
        } else {
            console.log(`      ❌ FAIL — Final stock is ${finalProduct.stock} (expected 0)`);
            failed++;
        }

        // ── Test 3: No purchase should succeed when stock is 0 ──
        console.log('\n  [3] Attempting purchase when stock is 0...');
        const zeroPurchase = await Product.findOneAndUpdate(
            { _id: product._id, stock: { $gte: 1 } },
            { $inc: { stock: -1 } },
            { new: true }
        );

        if (zeroPurchase === null) {
            console.log('      ✅ PASS — Purchase correctly rejected when stock is 0');
            passed++;
        } else {
            console.log(`      ❌ FAIL — Purchase succeeded with stock 0! New stock: ${zeroPurchase.stock}`);
            failed++;
        }

        // ── Test 4: High contention — 50 concurrent requests for 10 items ──
        console.log('\n  [4] High contention test: 50 concurrent requests for 10 items...');
        const product2 = await Product.create({
            name: 'Popular Item',
            sku: 'POP-001',
            price: 200,
            stock: 10,
            lowStockThreshold: 3,
            createdBy: admin._id
        });

        const highContentionAttempts = Array.from({ length: 50 }, (_, i) =>
            Product.findOneAndUpdate(
                { _id: product2._id, stock: { $gte: 1 } },
                { $inc: { stock: -1 } },
                { new: true }
            ).then(result => ({ attempt: i + 1, success: result !== null }))
        );

        const highResults = await Promise.all(highContentionAttempts);
        const highSuccesses = highResults.filter(r => r.success).length;
        const highFinalProduct = await Product.findById(product2._id);

        console.log(`      Successful: ${highSuccesses}/50, Final stock: ${highFinalProduct.stock}`);

        if (highSuccesses === 10 && highFinalProduct.stock === 0) {
            console.log('      ✅ PASS — Exactly 10 succeeded, stock is 0, no overselling');
            passed++;
        } else {
            console.log(`      ❌ FAIL — Expected 10 successes and stock 0`);
            failed++;
        }

        // ── Test 5: Stock can never go negative ──
        console.log('\n  [5] Verifying stock never went negative at any point...');
        const allProducts = await Product.find({ createdBy: admin._id });
        const anyNegative = allProducts.some(p => p.stock < 0);

        if (!anyNegative) {
            console.log('      ✅ PASS — No product has negative stock');
            passed++;
        } else {
            console.log('      ❌ FAIL — Found product(s) with negative stock!');
            failed++;
        }

    } catch (error) {
        console.error(`\n  ❌ Unexpected error: ${error.message}`);
        failed++;
    } finally {
        await mongoose.disconnect();
        if (mongoServer) await mongoServer.stop();
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
