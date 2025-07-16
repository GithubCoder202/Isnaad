import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import fetch from 'node-fetch';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3000;

const NEWS_API_KEY = process.env.NEWSAPI;
console.log("Test: " + NEWS_API_KEY);

app.use(bodyParser.json());
app.use(express.static('public')); // serve HTML from /public folder

// Gemini AI Proxy Endpoint
app.post('/gemini', async (req, res) => {
  const { contents, model } = req.body;
  const GEMINI_API_KEY = process.env.GEMINIAPI;
  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Gemini API key not set on server.' });
  }
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/${model || 'models/gemini-1.5-flash'}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents })
      }
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Gemini API error:', error);
    res.status(500).json({ error: 'Error contacting Gemini API' });
  }
});

app.get('/news', async (req, res) => {
  try {
    const url = `https://newsapi.org/v2/everything?q=islamic OR allah OR muslim OR islam&language=en&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching news' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
