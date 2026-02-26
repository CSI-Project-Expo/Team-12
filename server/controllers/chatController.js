const { GoogleGenerativeAI } = require('@google/generative-ai');
const Product = require('../models/Product');

const handleChat = async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, message: 'Message is required' });
        }

        // Mock AI response logic
        // Fetch context: Products (Inventory)
        const products = await Product.find({ isDeleted: false }).select('name category price stock');

        let aiResponse = "I'm a simulated assistant! ";

        const userMsg = message.toLowerCase();

        if (userMsg.includes("inventory") || userMsg.includes("product") || userMsg.includes("stock") || userMsg.includes("price")) {
            if (products.length === 0) {
                aiResponse += "Currently, there are no products available in the inventory.";
            } else {
                aiResponse += "Here is a quick look at the inventory:\n";
                products.slice(0, 5).forEach(p => {
                    aiResponse += `- ${p.name}: $${p.price}, Stock: ${p.stock}\n`;
                });
                if (products.length > 5) {
                    aiResponse += `...and ${products.length - 5} more items.\n`;
                }
                aiResponse += "(Note: This is a simulated response since no Gemini API key was provided.)";
            }
        } else if (userMsg.includes("hello") || userMsg.includes("hi")) {
            aiResponse += "Hello there! You can ask me about products, inventory, stock, or prices.";
        } else {
            aiResponse += "I can help you with inventory queries. Try asking 'What's in stock?' or 'Show me products'.";
        }

        res.json({
            success: true,
            reply: aiResponse
        });

    } catch (error) {
        console.error('Chatbot error:', error);
        res.status(500).json({ success: false, message: 'Error processing chat request' });
    }
};

module.exports = {
    handleChat
};
