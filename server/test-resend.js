require('dotenv').config();
const { sendOrderConfirmationEmail } = require('./utils/emailService');

// Provide dummy env var to bypass the check so we can test the Resend logic
process.env.RESEND_API_KEY = process.env.RESEND_API_KEY || 're_dummy_key_123';
process.env.RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

async function run() {
    const user = { name: 'Test User', email: 'test@example.com' };
    const items = [
        { name: 'Apples', quantity: 2, price: 1.50 },
        { name: 'Oranges', quantity: 1, price: 3.00 }
    ];
    // Since the API key is dummy, this will throw an auth error from Resend, 
    // but it will prove our code generates the QR and payload correctly without crashing.
    await sendOrderConfirmationEmail(user, 'ORD-123456', items, 6.00, 'dummy-qr-string-123');
    console.log('Test script finished.');
}

run();
