const { GoogleGenerativeAI } = require('@google/generative-ai');
const Product = require('../models/Product');

const handleChat = async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, message: 'Message is required' });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.json({
                success: true,
                reply: "Hello! I am Antigravity. Please add your GEMINI_API_KEY to the backend `.env` file to fully activate my capabilities."
            });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        // Fetch context: Products (Inventory)
        const products = await Product.find({ isDeleted: false }).select('name category price stock');

        const inventoryContext = products.map(p => `- ${p.name} (${p.category || 'N/A'}): $${p.price}, Stock: ${p.stock}`).join('\n');

        const systemPrompt = `You are Antigravity, a highly intelligent and helpful AI assistant for the StockSmart Inventory Management System. 
Your goal is to help users manage their inventory, answer questions about stock, prices, products, and provide general assistance. 
Be concise, professional, and friendly.

Here is the current real-time inventory data context:
${inventoryContext || 'No products available currently.'}

Answer the user's questions based on this inventory data. If they ask about something not in the inventory, politely inform them.`;

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: systemPrompt
        });

        // Map the frontend history to the Gemini format
        let formattedHistory = (history || []).map(msg => ({
            role: msg.role === 'model' ? 'model' : 'user',
            parts: [{ text: msg.text }]
        }));

        // Gemini requires the first message in history to be from the 'user'
        while (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
            formattedHistory.shift();
        }

        const chat = model.startChat({
            history: formattedHistory
        });

        const result = await chat.sendMessage(message);
        const aiResponse = result.response.text();

        res.json({
            success: true,
            reply: aiResponse
        });

    } catch (error) {
        console.error('Chatbot error object:', error);
        console.error('Chatbot error message:', error.message);
        console.error('Chatbot error stack:', error.stack);
        res.status(500).json({ success: false, message: 'Error processing chat request', errorDetail: error.message });
    }
};

module.exports = {
    handleChat
};
