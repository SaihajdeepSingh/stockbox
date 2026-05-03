const router = require('express').Router();
const {
  getPortfolio, executeTrade, getHistory, getStats, resetPortfolio,
} = require('../controllers/portfolioController');
const { requireAuth }                 = require('../middleware/auth');
const { validate, tradeRules }        = require('../middleware/validate');

router.use(requireAuth);

router.get('/',        getPortfolio);
router.get('/history', getHistory);
router.get('/stats',   getStats);
router.post('/trade',  tradeRules, validate, executeTrade);
router.post('/reset',  resetPortfolio);

module.exports = router;
