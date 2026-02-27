require('dotenv').config();
const { sendOrderConfirmationEmail } = require('./utils/emailService');

async function testEmail() {
    console.log("Testing email with user:", process.env.EMAIL_USER);

    const mockUser = { name: "Test User", email: process.env.EMAIL_USER }; // Send to self
    const mockOrderId = "ORD-123456";
    const mockItems = [
        { name: "Test Product 1", quantity: 2, price: 50.00 },
        { name: "Test Product 2", quantity: 1, price: 100.00 }
    ];
    const totalAmount = 200.00;
    const mockQrString = "abcd-1234-qr-code-test";

    await sendOrderConfirmationEmail(mockUser, mockOrderId, mockItems, totalAmount, mockQrString);
    console.log("Email test complete");
}

testEmail();
