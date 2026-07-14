import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;
const TMDB_API_KEY = 'd5ce1d8a4f90be42feb1f870322f2739';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Enable CORS for frontend integration
app.use(cors());
app.use(express.json());

// Forwarding all GET requests under /api to TMDB API
app.get('/api/*', async (req, res) => {
  try {
    const path = req.params[0]; // Gets the wild card part, e.g. "trending/movie/week"
    const queryParams = new URLSearchParams(req.query);
    queryParams.set('api_key', TMDB_API_KEY);

    const url = `${TMDB_BASE_URL}/${path}?${queryParams.toString()}`;

    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ 
        error: `TMDB responded with status ${response.status}` 
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error forwarding to TMDB:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend proxy server running on http://localhost:${PORT}`);
});
