// routes/stocks.js — Stock data routes
const router = require('express').Router();
const {
  getPopularStocks, getQuote, getCandles,
  searchStocks, getMarketNews, getCompanyNews,
} = require('../controllers/stockController');
const { requireAuth } = require('../middleware/auth');

// All stock routes require authentication
router.use(requireAuth);

router.get('/popular',                getPopularStocks);
router.get('/search',                 searchStocks);
router.get('/quote/:symbol',          getQuote);
router.get('/candles/:symbol',        getCandles);
router.get('/news',                   getMarketNews);
router.get('/company-news/:symbol',   getCompanyNews);

module.exports = router;
