import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = 3000;

const mySecret = process.env["news"];
const NEWS_API_KEY = mySecret;

app.use(express.static('public')); // serve HTML from /public folder

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
