/**
 * Test Runner — Runs all test suites sequentially
 * 
 * Usage: node tests/run-all-tests.js
 *   or:  npm test (from server directory)
 */

const testDuplicateEmail = require('./test-duplicate-email');
const testConcurrentSales = require('./test-concurrent-sales');
const testTransactionRollback = require('./test-transaction-rollback');

async function runAll() {
    console.log('\n╔═══════════════════════════════════════════╗');
    console.log('║     Smart Inventory — Test Suite          ║');
    console.log('╚═══════════════════════════════════════════╝');

    let totalPassed = 0;
    let totalFailed = 0;

    const suites = [
        { name: 'Duplicate Email Prevention', fn: testDuplicateEmail },
        { name: 'Concurrent Sales Safety', fn: testConcurrentSales },
        { name: 'Transaction Rollback', fn: testTransactionRollback }
    ];

    for (const suite of suites) {
        try {
            const { passed, failed } = await suite.fn();
            totalPassed += passed;
            totalFailed += failed;
        } catch (error) {
            console.error(`\n  ❌ Suite "${suite.name}" crashed: ${error.message}`);
            totalFailed++;
        }
    }

    // Final summary
    console.log('\n╔═══════════════════════════════════════════╗');
    console.log('║           FINAL RESULTS                   ║');
    console.log('╠═══════════════════════════════════════════╣');
    console.log(`║  Total Passed:  ${String(totalPassed).padStart(3)}                       ║`);
    console.log(`║  Total Failed:  ${String(totalFailed).padStart(3)}                       ║`);
    console.log(`║  Total Tests:   ${String(totalPassed + totalFailed).padStart(3)}                       ║`);
    console.log('╠═══════════════════════════════════════════╣');

    if (totalFailed === 0) {
        console.log('║  ✅ ALL TESTS PASSED                      ║');
    } else {
        console.log('║  ❌ SOME TESTS FAILED                     ║');
    }

    console.log('╚═══════════════════════════════════════════╝\n');

    process.exit(totalFailed > 0 ? 1 : 0);
}

runAll();
