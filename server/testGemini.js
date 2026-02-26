require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
    try {
        console.log("Key available:", !!process.env.GEMINI_API_KEY);
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const result = await model.generateContent("Hello, respond with a single word: Success");
        console.log("Response:", result.response.text());
    } catch (err) {
        console.error("Gemini Test Failed:", err);
    }
}

testGemini();
