/**
 * Test: Duplicate Email Prevention
 * 
 * Verifies that the User model correctly prevents
 * two users from registering with the same email address.
 */

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../models/User');

async function run() {
    console.log('\n═══════════════════════════════════════════');
    console.log('  TEST: Duplicate Email Prevention');
    console.log('═══════════════════════════════════════════\n');

    let mongoServer;
    let passed = 0;
    let failed = 0;

    try {
        // Setup — in-memory database
        mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());
        console.log('  ✓ Connected to in-memory MongoDB\n');

        // ── Test 1: First registration should succeed ──
        console.log('  [1] Registering first user with email test@example.com...');
        const user1 = await User.create({
            name: 'User One',
            email: 'test@example.com',
            password: 'password123',
            role: 'user'
        });

        if (user1 && user1.email === 'test@example.com') {
            console.log('      ✅ PASS — First user created successfully');
            passed++;
        } else {
            console.log('      ❌ FAIL — First user was not created');
            failed++;
        }

        // ── Test 2: Duplicate email should be rejected ──
        console.log('\n  [2] Attempting to register second user with same email...');
        try {
            await User.create({
                name: 'User Two',
                email: 'test@example.com',
                password: 'password456',
                role: 'user'
            });

            // If we reach here, the duplicate was NOT prevented
            console.log('      ❌ FAIL — Duplicate user was created (should have been rejected)');
            failed++;
        } catch (err) {
            if (err.code === 11000 || err.message.includes('duplicate') || err.message.includes('E11000')) {
                console.log('      ✅ PASS — Duplicate email correctly rejected (E11000)');
                passed++;
            } else {
                console.log(`      ❌ FAIL — Unexpected error: ${err.message}`);
                failed++;
            }
        }

        // ── Test 3: Different email should succeed ──
        console.log('\n  [3] Registering user with a different email...');
        const user3 = await User.create({
            name: 'User Three',
            email: 'different@example.com',
            password: 'password789',
            role: 'admin',
            storeName: 'Test Store'
        });

        if (user3 && user3.email === 'different@example.com') {
            console.log('      ✅ PASS — User with different email created successfully');
            passed++;
        } else {
            console.log('      ❌ FAIL — User with different email was not created');
            failed++;
        }

        // ── Test 4: Verify password is hashed (not stored as plain text) ──
        console.log('\n  [4] Verifying password is hashed (bcrypt)...');
        const savedUser = await User.findOne({ email: 'test@example.com' });

        if (savedUser.password !== 'password123' && savedUser.password.startsWith('$2')) {
            console.log('      ✅ PASS — Password is bcrypt-hashed, not stored as plain text');
            passed++;
        } else {
            console.log('      ❌ FAIL — Password was stored as plain text!');
            failed++;
        }

        // ── Test 5: Verify matchPassword works ──
        console.log('\n  [5] Verifying matchPassword() works correctly...');
        const correctMatch = await savedUser.matchPassword('password123');
        const wrongMatch = await savedUser.matchPassword('wrongpassword');

        if (correctMatch === true && wrongMatch === false) {
            console.log('      ✅ PASS — matchPassword correctly validates passwords');
            passed++;
        } else {
            console.log('      ❌ FAIL — matchPassword returned wrong results');
            failed++;
        }

    } catch (error) {
        console.error(`\n  ❌ Unexpected error: ${error.message}`);
        failed++;
    } finally {
        // Cleanup
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

// Allow running directly
if (require.main === module) {
    run().then(({ failed }) => process.exit(failed > 0 ? 1 : 0));
}
