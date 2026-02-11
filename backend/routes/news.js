// import express from 'express';
// import { relatedNews } from '../data/products.js';

// const router = express.Router();

// // GET /api/news - Get news, optionally filtered by productId
// router.get('/', (req, res) => {
//   try {
//     const { productId } = req.query;

//     // In a real app, you would filter by productId from a database
//     // For now, return all news
//     const news = productId ? relatedNews.slice(0, 3) : relatedNews;

//     res.json(news);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch news' });
//   }
// });

// // GET /api/news/:id - Get single news article
// router.get('/:id', (req, res) => {
//   try {
//     const newsId = parseInt(req.params.id);
//     const newsItem = relatedNews.find(n => n.id === newsId);

//     if (!newsItem) {
//       return res.status(404).json({ error: 'News not found' });
//     }

//     res.json(newsItem);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch news' });
//   }
// });

// export default router;