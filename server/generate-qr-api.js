const axios = require('axios');
const QRCode = require('qrcode');

const API_URL = 'http://localhost:5000/api';

async function run() {
    try {
        console.log('1. Logging in as Admin...');
        const adminRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@admin.com',
            password: 'admin'
        });
        const adminToken = adminRes.data.token;
        const shopId = adminRes.data._id; // admin is the shop

        console.log('2. Adding a test product...');
        let product;
        try {
            const prodRes = await axios.post(`${API_URL}/products`, {
                name: 'Test Apple',
                sku: 'TEST-APP-001',
                category: 'Fruits',
                price: 150,
                stock: 100
            }, { headers: { Authorization: `Bearer ${adminToken}` } });
            product = prodRes.data;
        } catch (err) {
            // Might already exist or validation failed, let's just fetch first product
            const products = await axios.get(`${API_URL}/products/shop/${shopId}`);
            product = products.data[0];
            if (!product) throw new Error("No products available from admin");
        }

        console.log('3. Logging in as User...');
        // First register user if not exist
        let userToken;
        try {
            const regRes = await axios.post(`${API_URL}/auth/register`, {
                name: 'Test User',
                email: 'testuser@user.com',
                password: 'user123',
                role: 'user'
            });
            userToken = regRes.data.token;
        } catch (e) {
            const loginRes = await axios.post(`${API_URL}/auth/login`, {
                email: 'testuser@user.com',
                password: 'user123'
            });
            userToken = loginRes.data.token;
        }

        console.log('4. Creating order...');
        const orderRes = await axios.post(`${API_URL}/orders`, {
            shopId: shopId,
            items: [{ productId: product._id, quantity: 1 }],
            customerName: 'Test User',
            customerEmail: 'testuser@user.com',
            customerPhone: '1234567890'
        }, { headers: { Authorization: `Bearer ${userToken}` } });

        const qrString = orderRes.data.qrString;
        console.log('✅ Order created! Generating QR PNG for string:', qrString);

        await QRCode.toFile('../test-valid.png', qrString);
        console.log('✅ test-valid.png saved in Team-12 root!');

    } catch (err) {
        console.error('Failed to run test:', err.response?.data || err.message);
    }
}

run();
