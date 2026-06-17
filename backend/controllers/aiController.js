const { GoogleGenAI } = require('@google/genai');

// Initialize Gemini AI
// Fallback to empty to avoid crashing if key is missing
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'MISSING_KEY' });

exports.chat = async (req, res) => {
    try {
        const { message, role } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        if (process.env.GEMINI_API_KEY === 'MISSING_KEY' || !process.env.GEMINI_API_KEY) {
            return res.status(200).json({ 
                text: "I am KeyNest AI! However, my creator hasn't set up the GEMINI_API_KEY environment variable yet, so I cannot talk to the real brain. Please add the API key to the .env file!" 
            });
        }

        const systemPrompt = `You are the KeyNest AI Assistant. You help users manage their rental properties. 
The user is currently logged in as a: ${role || 'User'}. 
Be helpful, professional, and concise. You can assist landlords with drafting rent reminders, categorizing maintenance tasks, and analyzing income. You can assist tenants with understanding leases.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: message,
            config: {
                systemInstruction: systemPrompt,
            }
        });

        res.status(200).json({ text: response.text });
    } catch (error) {
        console.error('AI Error:', error);
        res.status(500).json({ error: 'Failed to generate AI response' });
    }
};
