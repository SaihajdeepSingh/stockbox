const axios = require('axios');

const cache = new Map();
const CACHE_TTL = 15 * 1000;

const yahooGet = async (url, params = {}) => {
  const key = url + JSON.stringify(params);
  const hit = cache.get(key);
  if (hit && Date.now() - hit.ts < CACHE_TTL) return hit.data;

  const res = await axios.get(url, {
    params,
    timeout: 10000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json',
    },
  });

  cache.set(key, { data: res.data, ts: Date.now() });
  return res.data;
};

const toYahoo = (symbol) => {
  const s = symbol.toUpperCase().replace('NSE:', '').trim();
  return `${s}.NS`;
};

const POPULAR_STOCKS = [
  { symbol: 'NSE:RELIANCE',    name: 'Reliance Industries',      sector: 'Energy'   },
  { symbol: 'NSE:TCS',         name: 'Tata Consultancy Services', sector: 'IT'       },
  { symbol: 'NSE:INFY',        name: 'Infosys',                   sector: 'IT'       },
  { symbol: 'NSE:HDFCBANK',    name: 'HDFC Bank',                 sector: 'Banking'  },
  { symbol: 'NSE:ICICIBANK',   name: 'ICICI Bank',                sector: 'Banking'  },
  { symbol: 'NSE:BAJFINANCE',  name: 'Bajaj Finance',             sector: 'Finance'  },
  { symbol: 'NSE:WIPRO',       name: 'Wipro',                     sector: 'IT'       },
  { symbol: 'NSE:TATAMOTORS',  name: 'Tata Motors',               sector: 'Auto'     },
  { symbol: 'NSE:SBIN',        name: 'State Bank of India',       sector: 'Banking'  },
  { symbol: 'NSE:ITC',         name: 'ITC Limited',               sector: 'FMCG'     },
  { symbol: 'NSE:MARUTI',      name: 'Maruti Suzuki',             sector: 'Auto'     },
  { symbol: 'NSE:TITAN',       name: 'Titan Company',             sector: 'Consumer' },
  { symbol: 'NSE:HINDUNILVR',  name: 'Hindustan Unilever',        sector: 'FMCG'     },
  { symbol: 'NSE:AXISBANK',    name: 'Axis Bank',                 sector: 'Banking'  },
  { symbol: 'NSE:KOTAKBANK',   name: 'Kotak Mahindra Bank',       sector: 'Banking'  },
  { symbol: 'NSE:LT',          name: 'Larsen & Toubro',           sector: 'Infra'    },
  { symbol: 'NSE:ASIANPAINT',  name: 'Asian Paints',              sector: 'Paint'    },
  { symbol: 'NSE:BHARTIARTL',  name: 'Bharti Airtel',             sector: 'Telecom'  },
  { symbol: 'NSE:SUNPHARMA',   name: 'Sun Pharmaceutical',        sector: 'Pharma'   },
  { symbol: 'NSE:ONGC',        name: 'ONGC',                      sector: 'Energy'   },
];

const YAHOO_CHART = 'https://query1.finance.yahoo.com/v8/finance/chart';

const fetchQuote = async (yahooSymbol) => {
  const data   = await yahooGet(`${YAHOO_CHART}/${yahooSymbol}`, { interval: '1d', range: '1d' });
  const result = data?.chart?.result?.[0];
  if (!result) return null;

  const meta      = result.meta;
  const price     = meta.regularMarketPrice                    || 0;
  const prev      = meta.previousClose || meta.chartPreviousClose || price;
  const change    = parseFloat((price - prev).toFixed(2));
  const changePct = prev ? parseFloat(((change / prev) * 100).toFixed(2)) : 0;

  return {
    price,
    change,
    changePct,
    high:      meta.regularMarketDayHigh || price,
    low:       meta.regularMarketDayLow  || price,
    open:      meta.regularMarketOpen    || price,
    prevClose: prev,
  };
};

const getPopularStocks = async (req, res, next) => {
  try {
    const results = await Promise.allSettled(
      POPULAR_STOCKS.map(async (stock) => {
        try {
          const q = await fetchQuote(toYahoo(stock.symbol));
          return { ...stock, ...(q || { price: 0, change: 0, changePct: 0 }) };
        } catch {
          return { ...stock, price: 0, change: 0, changePct: 0 };
        }
      })
    );
    res.json({ success: true, stocks: results.filter(r => r.status === 'fulfilled').map(r => r.value) });
  } catch (err) { next(err); }
};

const getQuote = async (req, res, next) => {
  try {
    const { symbol } = req.params;
    const q = await fetchQuote(toYahoo(symbol));
    if (!q || q.price === 0) return res.status(404).json({ success: false, error: 'Symbol not found.' });

    const info = POPULAR_STOCKS.find(s => s.symbol === symbol.toUpperCase());
    res.json({ success: true, quote: { symbol: symbol.toUpperCase(), name: info?.name || symbol, ...q } });
  } catch (err) { next(err); }
};

const getCandles = async (req, res, next) => {
  try {
    const { symbol } = req.params;
    const yahooSymbol = toYahoo(symbol);

    const to   = req.query.to   ? parseInt(req.query.to)   : Math.floor(Date.now() / 1000);
    const from = req.query.from ? parseInt(req.query.from) : to - 90 * 24 * 60 * 60;

    const data   = await yahooGet(`${YAHOO_CHART}/${yahooSymbol}`, {
      interval: '1d',
      period1:  from,
      period2:  to,
    });
    const result = data?.chart?.result?.[0];

    if (!result?.timestamp) {
      return res.status(404).json({ success: false, error: 'No candle data available.' });
    }

    const ts = result.timestamp;
    const q  = result.indicators.quote[0];

    const candles = ts
      .map((t, i) => ({
        time:   t,
        open:   q.open[i]   != null ? parseFloat(q.open[i].toFixed(2))   : null,
        high:   q.high[i]   != null ? parseFloat(q.high[i].toFixed(2))   : null,
        low:    q.low[i]    != null ? parseFloat(q.low[i].toFixed(2))    : null,
        close:  q.close[i]  != null ? parseFloat(q.close[i].toFixed(2))  : null,
        volume: q.volume[i] || 0,
      }))
      .filter(c => c.open && c.high && c.low && c.close);

    res.json({ success: true, candles, symbol: symbol.toUpperCase() });
  } catch (err) { next(err); }
};

const searchStocks = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.json({ success: true, results: POPULAR_STOCKS });
    const t = q.toLowerCase();
    const results = POPULAR_STOCKS.filter(
      s => s.name.toLowerCase().includes(t) || s.symbol.toLowerCase().includes(t)
    );
    res.json({ success: true, results: results.length ? results : POPULAR_STOCKS });
  } catch (err) { next(err); }
};

const getMarketNews = async (req, res, next) => {
  try {
    const key = process.env.FINNHUB_API_KEY;
    if (!key) return res.json({ success: true, news: [] });

    const data = await yahooGet('https://finnhub.io/api/v1/news', { category: 'general', token: key });
    const news = (data || []).slice(0, 20).map(n => ({
      id: n.id, headline: n.headline, summary: n.summary,
      source: n.source, url: n.url, image: n.image,
      datetime: n.datetime, category: n.category,
    }));
    res.json({ success: true, news });
  } catch (err) { next(err); }
};

const getCompanyNews = async (req, res, next) => {
  try {
    const key = process.env.FINNHUB_API_KEY;
    if (!key) return res.json({ success: true, news: [] });

    const { symbol } = req.params;
    const to   = new Date().toISOString().split('T')[0];
    const from = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const data = await yahooGet('https://finnhub.io/api/v1/company-news', { symbol: symbol.toUpperCase(), from, to, token: key });
    res.json({ success: true, news: (data || []).slice(0, 10) });
  } catch (err) { next(err); }
};

module.exports = { getPopularStocks, getQuote, getCandles, searchStocks, getMarketNews, getCompanyNews };