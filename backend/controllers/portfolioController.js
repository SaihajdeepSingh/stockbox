// controllers/portfolioController.js — Paper trading logic
// Uses Yahoo Finance for live prices (free, no API key)
const axios     = require('axios');
const Portfolio = require('../models/Portfolio');
const Trade     = require('../models/Trade');

const YAHOO_CHART = 'https://query1.finance.yahoo.com/v8/finance/chart';

// Fetch live INR price via Yahoo Finance
const getLivePrice = async (symbol) => {
  const yahooSymbol = symbol.toUpperCase().replace('NSE:', '') + '.NS';
  const res = await axios.get(`${YAHOO_CHART}/${yahooSymbol}`, {
    params:  { interval: '1d', range: '1d' },
    timeout: 8000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
  });
  const price = res.data?.chart?.result?.[0]?.meta?.regularMarketPrice;
  if (!price || price === 0) throw new Error(`Live price unavailable for ${symbol}`);
  return parseFloat(price.toFixed(2));
};

// Get or create portfolio for a user (starts with ₹10 lakh)
const getOrCreatePortfolio = async (userId) => {
  let p = await Portfolio.findOne({ userId });
  if (!p) p = await Portfolio.create({ userId, cashBalance: 1000000 });
  return p;
};

// GET /api/portfolio
const getPortfolio = async (req, res, next) => {
  try {
    const portfolio = await getOrCreatePortfolio(req.user._id);

    const enriched = await Promise.allSettled(
      portfolio.holdings.map(async (h) => {
        try {
          const currentPrice = await getLivePrice(h.symbol);
          const currentValue = parseFloat((currentPrice * h.quantity).toFixed(2));
          const profitLoss   = parseFloat((currentValue - h.totalInvested).toFixed(2));
          const profitPct    = parseFloat(((profitLoss / h.totalInvested) * 100).toFixed(2));
          return { ...h.toObject(), currentPrice, currentValue, profitLoss, profitPct };
        } catch {
          return {
            ...h.toObject(),
            currentPrice:  h.avgBuyPrice,
            currentValue:  h.totalInvested,
            profitLoss:    0,
            profitPct:     0,
          };
        }
      })
    );

    const holdings     = enriched.filter(r => r.status === 'fulfilled').map(r => r.value);
    const totalInvest  = holdings.reduce((s, h) => s + h.totalInvested, 0);
    const totalValue   = holdings.reduce((s, h) => s + h.currentValue,  0);
    const totalPnL     = parseFloat((totalValue - totalInvest).toFixed(2));
    const totalPnLPct  = totalInvest > 0 ? parseFloat(((totalPnL / totalInvest) * 100).toFixed(2)) : 0;

    res.json({
      success: true,
      portfolio: {
        cashBalance:    portfolio.cashBalance,
        holdings,
        totalInvested:  parseFloat(totalInvest.toFixed(2)),
        totalValue:     parseFloat(totalValue.toFixed(2)),
        totalPnL,
        totalPnLPct,
        netWorth:       parseFloat((portfolio.cashBalance + totalValue).toFixed(2)),
        totalDeposited: portfolio.totalDeposited,
      },
    });
  } catch (err) { next(err); }
};

// POST /api/portfolio/trade
const executeTrade = async (req, res, next) => {
  try {
    const { symbol, type, quantity, companyName = '', exchange = 'NSE' } = req.body;
    const sym = symbol.toUpperCase();

    // Fetch real-time price
    let price;
    try {
      price = await getLivePrice(sym);
    } catch {
      return res.status(503).json({ success: false, error: 'Unable to fetch live price. Market may be closed.' });
    }

    const total      = parseFloat((price * quantity).toFixed(2));
    const portfolio  = await getOrCreatePortfolio(req.user._id);
    const holdingIdx = portfolio.holdings.findIndex(h => h.symbol === sym);
    let profitLoss   = 0;

    if (type === 'BUY') {
      if (portfolio.cashBalance < total) {
        return res.status(400).json({
          success: false,
          error: `Insufficient balance. Need ₹${total.toLocaleString('en-IN')} but have ₹${portfolio.cashBalance.toLocaleString('en-IN')}.`,
        });
      }

      const balanceBefore       = portfolio.cashBalance;
      portfolio.cashBalance     = parseFloat((portfolio.cashBalance - total).toFixed(2));

      if (holdingIdx >= 0) {
        const ex      = portfolio.holdings[holdingIdx];
        const newQty  = ex.quantity + quantity;
        const newInv  = parseFloat((ex.totalInvested + total).toFixed(2));
        portfolio.holdings[holdingIdx].quantity      = newQty;
        portfolio.holdings[holdingIdx].totalInvested = newInv;
        portfolio.holdings[holdingIdx].avgBuyPrice   = parseFloat((newInv / newQty).toFixed(2));
      } else {
        portfolio.holdings.push({ symbol: sym, companyName, exchange, quantity, avgBuyPrice: price, totalInvested: total });
      }

      await portfolio.save();
      await Trade.create({ userId: req.user._id, symbol: sym, companyName, exchange, type: 'BUY', quantity, price, total, balanceBefore, balanceAfter: portfolio.cashBalance, profitLoss: 0 });

    } else if (type === 'SELL') {
      if (holdingIdx < 0) return res.status(400).json({ success: false, error: `You don't hold any ${sym} shares.` });

      const holding = portfolio.holdings[holdingIdx];
      if (holding.quantity < quantity) {
        return res.status(400).json({ success: false, error: `You have ${holding.quantity} shares but tried to sell ${quantity}.` });
      }

      const costBasis         = parseFloat((holding.avgBuyPrice * quantity).toFixed(2));
      profitLoss              = parseFloat((total - costBasis).toFixed(2));
      const balanceBefore     = portfolio.cashBalance;
      portfolio.cashBalance   = parseFloat((portfolio.cashBalance + total).toFixed(2));

      if (holding.quantity === quantity) {
        portfolio.holdings.splice(holdingIdx, 1);
      } else {
        const remaining = holding.quantity - quantity;
        portfolio.holdings[holdingIdx].quantity      = remaining;
        portfolio.holdings[holdingIdx].totalInvested = parseFloat((holding.avgBuyPrice * remaining).toFixed(2));
      }

      await portfolio.save();
      await Trade.create({ userId: req.user._id, symbol: sym, companyName, exchange, type: 'SELL', quantity, price, total, balanceBefore, balanceAfter: portfolio.cashBalance, profitLoss });
    }

    res.json({
      success: true,
      message: `${type} order executed at ₹${price.toLocaleString('en-IN')}!`,
      trade:   { symbol: sym, type, quantity, price, total, profitLoss },
      newBalance: portfolio.cashBalance,
    });
  } catch (err) { next(err); }
};

// GET /api/portfolio/history
const getHistory = async (req, res, next) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip  = (page - 1) * limit;
    const [trades, total] = await Promise.all([
      Trade.find({ userId: req.user._id }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Trade.countDocuments({ userId: req.user._id }),
    ]);
    res.json({ success: true, trades, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (err) { next(err); }
};

// GET /api/portfolio/stats
const getStats = async (req, res, next) => {
  try {
    const trades      = await Trade.find({ userId: req.user._id }).lean();
    const sellTrades  = trades.filter(t => t.type === 'SELL');
    const winners     = sellTrades.filter(t => t.profitLoss > 0).length;
    const totalPnL    = sellTrades.reduce((s, t) => s + (t.profitLoss || 0), 0);
    res.json({
      success: true,
      stats: {
        totalTrades:  trades.length,
        buyTrades:    trades.filter(t => t.type === 'BUY').length,
        sellTrades:   sellTrades.length,
        totalPnL:     parseFloat(totalPnL.toFixed(2)),
        winRate:      sellTrades.length > 0 ? parseFloat(((winners / sellTrades.length) * 100).toFixed(1)) : 0,
      },
    });
  } catch (err) { next(err); }
};

// POST /api/portfolio/reset
const resetPortfolio = async (req, res, next) => {
  try {
    await Portfolio.findOneAndUpdate({ userId: req.user._id }, { cashBalance: 1000000, holdings: [] });
    await Trade.deleteMany({ userId: req.user._id });
    res.json({ success: true, message: 'Portfolio reset to ₹10,00,000. All trades cleared.' });
  } catch (err) { next(err); }
};

module.exports = { getPortfolio, executeTrade, getHistory, getStats, resetPortfolio };
