const axios = require('axios');
async function run() {
    try {
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', { email: 'admin@test.com', password: 'password123' });
        const token = loginRes.data.token;

        const res = await axios.put('http://localhost:5000/api/auth/profile', {
            phone: '1234567890',
            notificationEmail: 'test@notification.com',
            email: 'admin@test.com'
        }, { headers: { Authorization: `Bearer ${token}` } });
        console.log("Success:", res.data);
    } catch (e) {
        if (e.response) {
            console.error("HTTP Error:", e.response.status, e.response.data);
        } else {
            console.error("Error:", e.message);
        }
    }
}
run();
