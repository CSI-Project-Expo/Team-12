const { sendOrderConfirmationEmail } = require('./utils/emailService');

const testRun = async () => {
    console.log("Starting Ethereal email test...");

    // Dummy user
    const user = {
        name: "Test Customer",
        email: "test.customer@example.com"
    };

    // Dummy items
    const items = [
        { name: "Wireless Headphones", quantity: 1, price: 99.99 },
        { name: "USB-C Cable", quantity: 2, price: 15.00 }
    ];

    // Dummy data
    const orderId = "TEST-ORDER-12345";
    const totalAmount = 129.99;
    const qrString = "mocked-qr-hash-123456";

    console.log("Sending mock email payload...");

    try {
        await sendOrderConfirmationEmail(user, orderId, items, totalAmount, qrString);
        console.log("Test finished.");
        process.exit(0);
    } catch (err) {
        console.error("Test failed:", err);
        process.exit(1);
    }
};

testRun();
