const Groq = require('groq-sdk');

const handleChat = async (req, res) => {
    const { Product } = req.tenantDb || {};
    try {
        const { message, history } = req.body;
        console.log("Incoming message:", message);
        console.log("API KEY exists:", !!process.env.GROQ_API_KEY);

        if (!message) {
            return res.status(400).json({ success: false, message: 'Message is required' });
        }

        if (!process.env.GROQ_API_KEY) {
            return res.json({
                success: true,
                reply: "Hello! I am Antigravity. Please add your GROQ_API_KEY to the backend .env file to fully activate my capabilities."
            });
        }

        if (!Product) {
            return res.status(500).json({
                success: false,
                message: "Tenant database not initialized properly"
            });
        }

        const products = await Product.find({ isDeleted: false })
            .select('name category price stock');

        console.log("Products count:", products.length);

        const inventoryContext = (products || [])
            .map(p => `- ${p.name} (${p.category || 'N/A'}): $${p.price}, Stock: ${p.stock}`)
            .join('\n');

        const systemPrompt = `You are Antigravity, a highly intelligent and helpful AI assistant for the StockSmart Inventory Management System. 
Your goal is to help users manage their inventory, answer questions about stock, prices, products, and provide general assistance. 
Be concise, professional, and friendly.

Here is the current real-time inventory data context:
${inventoryContext || 'No products available currently.'}

Answer the user's questions based on this inventory data. If they ask about something not in the inventory, politely inform them.`;

        // Format history for Groq
        const formattedHistory = (history || [])
            .map(msg => ({
                role: msg.role === 'model' ? 'assistant' : 'user',
                content: msg.text
            }));

        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        let aiResponse = "Sorry, I couldn't generate a response.";

        try {
            const result = await groq.chat.completions.create({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: systemPrompt },
                    ...formattedHistory,
                    { role: "user", content: message }
                ],
                max_tokens: 1000
            });

            aiResponse = result.choices[0].message.content || "No response from AI";

        } catch (groqError) {
            console.error("Groq ERROR:", groqError);
            if (groqError.status === 429) {
                aiResponse = "⏳ Too many requests. Please wait a moment and try again.";
            } else {
                aiResponse = "Sorry, AI service is currently unavailable.";
            }
        }

        res.json({ success: true, reply: aiResponse });

    } catch (error) {
        console.error('Chatbot error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error processing chat request',
            errorDetail: error.message
        });
    }
};

module.exports = { handleChat };