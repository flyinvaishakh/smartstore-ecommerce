const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const callGemini = async (prompt) => {
  // Replace the retired 1.5 model with the active 2.5 architecture
  const models = ['gemini-2.5-flash', 'gemini-2.5-flash-lite'];
  
  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      return JSON.parse(response.text);
    } catch (err) {
      console.warn(`Model ${model} failed:`, err.message);
      // If 2.5-flash throws a 429 quota error, this smoothly falls back to flash-lite
      continue;
    }
  }
  throw new Error('All AI models failed');
};

router.post('/generate-content', authMiddleware, async (req, res) => {
  try {
    const { title, price } = req.body;
    if (!title) return res.status(400).json({ message: 'Product title is required' });

    const prompt = `Act as an expert e-commerce copywriter. I am selling a product named "${title}" for $${price}.
Please generate a JSON object with the following keys:
- description: A compelling, SEO-friendly product description (about 3-4 sentences).
- tags: An array of 5-7 relevant SEO keywords/tags.
- marketingCaption: A catchy, short social media caption for this product.
Return ONLY valid JSON.`;

    const data = await callGemini(prompt);
    res.json(data);
  } catch (error) {
    console.error('Error generating AI content:', error.message);
    res.status(500).json({ message: 'Failed to generate content', error: error.message });
  }
});

router.post('/sales-insights', authMiddleware, async (req, res) => {
  try {
    const { products } = req.body;
    if (!products || products.length === 0) return res.status(400).json({ message: 'No product data provided' });

    const prompt = `Act as an e-commerce data analyst. Here is a list of our products:
${JSON.stringify(products.map(p => ({ title: p.title, price: p.price, stock: p.stock, sales: p.sales })))}

Analyze this data and provide a JSON object with:
- trendingProducts: Array of the top 3 best selling product titles.
- lowStockAlerts: Array of titles of products with stock <= 5.
- suggestions: Array of 3 actionable business suggestions.
Return ONLY valid JSON.`;

    const data = await callGemini(prompt);
    res.json(data);
  } catch (error) {
    console.error('Error generating insights:', error.message);
    res.status(500).json({ message: 'Failed to generate insights', error: error.message });
  }
});

module.exports = router;
