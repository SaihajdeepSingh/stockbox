# StockBox

A paper trading simulator for NSE stocks. Practice buying and selling with Rs.10,00,000 virtual money at real market prices. No real money involved.

Built as a full-stack web application for learning purposes.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB via Mongoose |
| Auth | JWT, Bcrypt, Passport.js |
| Charts | TradingView Lightweight Charts |
| Market Data | Yahoo Finance (prices), Finnhub (news) |
| Deployment | Vercel (frontend), Render (backend) |

---

## Project Structure

```
stockbox/
├── frontend/
│   └── src/
│       ├── components/     Navbar, Footer, Sidebar, Chart, TradeModal, StockBoxLogo
│       ├── pages/          Home, About, Products, Pricing, Support, Login, Signup
│       │   └── dashboard/  Dashboard, Portfolio, History, NewsPage
│       ├── context/        AuthContext
│       ├── lib/            Axios client, formatters
│       └── types/          TypeScript interfaces
│
└── backend/
    ├── config/             MongoDB connection, Passport setup
    ├── controllers/        authController, stockController, portfolioController
    ├── middleware/         JWT auth, validation, logger, errorHandler
    ├── models/             User, Portfolio, Trade, Contact
    ├── routes/             auth, stocks, portfolio, contact
    └── server.js
```

---

## Local Development

### Requirements

- Node.js 18 or higher
- MongoDB Atlas account (free M0 tier works fine)
- Finnhub API key (free at finnhub.io, used for news feed)

### Install

```bash
cd backend && npm install
cd ../frontend && npm install
```

### Backend config

Create `backend/.env`:

```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/stockbox
JWT_SECRET=your_jwt_secret_at_least_32_chars
SESSION_SECRET=your_session_secret
FINNHUB_API_KEY=your_finnhub_key
FRONTEND_URL=http://localhost:5173
```

### Frontend config

Create `frontend/.env`:

```
VITE_API_URL=http://localhost:5000/api
```

### Run

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

Frontend runs on http://localhost:5173. Backend runs on http://localhost:5000.

---

## Deployment

### Backend on Render

1. Go to render.com and create a new Web Service
2. Connect this GitHub repo
3. Set Root Directory to `backend`
4. Build command: `npm install`
5. Start command: `node server.js`
6. Add environment variables: `MONGO_URI`, `JWT_SECRET`, `SESSION_SECRET`, `FINNHUB_API_KEY`, `FRONTEND_URL`, `NODE_ENV=production`
7. Deploy and copy the service URL

### Frontend on Vercel

1. Go to vercel.com and import this GitHub repo
2. Set Root Directory to `frontend`
3. Framework preset: Vite
4. Add environment variable: `VITE_API_URL=https://your-render-url.onrender.com/api`
5. Deploy

After both are live, update `FRONTEND_URL` on Render to your Vercel URL and redeploy.

---

## API Reference

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

GET    /api/stocks/popular
GET    /api/stocks/quote/:symbol
GET    /api/stocks/candles/:symbol
GET    /api/stocks/news

GET    /api/portfolio
POST   /api/portfolio/trade
GET    /api/portfolio/history
GET    /api/portfolio/stats
POST   /api/portfolio/reset

POST   /api/contact
```

---

## Pages

| Route | Description |
|---|---|
| / | Landing page |
| /about | Origin story |
| /products | Feature breakdown |
| /pricing | Free plan details and FAQ |
| /support | Contact form |
| /login | Sign in |
| /signup | Create account |
| /dashboard | Trading terminal with live candlestick chart |
| /dashboard/portfolio | Holdings, P&L, allocation |
| /dashboard/history | Paginated trade log |
| /dashboard/news | Market news from Finnhub |

---

## Trading Logic

Every new account starts with Rs.10,00,000 virtual cash.

Buy orders deduct `quantity x live price` from cash and add the holding using weighted average cost basis. Sell orders credit `quantity x live price` back to cash, reduce the holding, and record realised P&L. Prices are fetched live from Yahoo Finance at trade execution time. The portfolio is enriched with current prices on every load.

---

## Notes

- Paper trading only. No real money, no real orders.
- Yahoo Finance is used for NSE stock prices and candlestick data.
- Finnhub free tier handles up to 60 API calls per minute.
- NSE market hours are 9:15 AM to 3:30 PM IST on weekdays. Prices outside market hours are the last closing price.
- Render free tier spins down after 15 minutes of inactivity. The first request after sleep takes around 30 seconds.
- MongoDB Atlas M0 provides 512 MB storage which is sufficient for development and light use.

---

## Possible Future Work

- WebSocket streaming for real-time price updates
- Watchlist with price alerts
- Full Nifty 50 stock coverage
- Technical indicators such as RSI, MACD, and Bollinger Bands
- User leaderboard
- Mobile app