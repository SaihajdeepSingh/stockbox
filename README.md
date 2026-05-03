# 📈 StockBox — Paper Trading Simulator

> Practice NSE stock trading with ₹10,00,000 virtual money and real-time prices. Zero financial risk.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + TypeScript + Vite + Tailwind CSS |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB (via Mongoose ODM) |
| **Auth** | JWT + Bcrypt + Passport.js |
| **Charts** | TradingView Lightweight Charts |
| **Market Data** | Finnhub API (free tier) |
| **Frontend Deploy** | Vercel |
| **Backend Deploy** | Render |

---

## 📁 Project Structure

```
stockbox/
├── frontend/                   # React + Vite app (deploy to Vercel)
│   ├── src/
│   │   ├── components/         # Navbar, Footer, Sidebar, Chart, TradeModal
│   │   ├── pages/              # Home, About, Products, Pricing, Support, Login, Signup
│   │   │   └── dashboard/      # Dashboard, Portfolio, History, News
│   │   ├── context/            # AuthContext (JWT auth state)
│   │   ├── lib/                # Axios API client + formatters
│   │   └── types/              # TypeScript interfaces
│   └── package.json
│
└── backend/                    # Express API (deploy to Render)
    ├── config/                 # MongoDB + Passport setup
    ├── controllers/            # Business logic
    ├── middleware/             # Auth (JWT), validation, logger
    ├── models/                 # User, Portfolio, Trade, Contact
    ├── routes/                 # auth, stocks, portfolio, contact
    └── server.js
```

---

## 🔧 Local Development Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free) OR local MongoDB
- Finnhub API key (free at https://finnhub.io)

---

### 1. Clone & Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

### 2. Configure Backend

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/stockbox
JWT_SECRET=your_long_random_secret_here_min_32_chars
SESSION_SECRET=another_long_random_secret
FINNHUB_API_KEY=your_finnhub_api_key
FRONTEND_URL=http://localhost:5173
```

**Get a free Finnhub API key:**
1. Go to https://finnhub.io
2. Sign up for free
3. Copy your API key from the dashboard

**Get a free MongoDB URI:**
1. Go to https://cloud.mongodb.com
2. Create a free M0 cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string

---

### 3. Configure Frontend

```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:
```
VITE_API_URL=http://localhost:5000/api
```

---

### 4. Run Development Servers

```bash
# Terminal 1: Backend
cd backend
npm run dev
# API starts on http://localhost:5000

# Terminal 2: Frontend
cd frontend
npm run dev
# App opens on http://localhost:5173
```

---

## 🌐 Deployment

### Deploy Backend to Render (Free)

1. Push your `backend/` folder to GitHub
2. Go to https://render.com → New → Web Service
3. Connect your GitHub repo
4. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Environment:** Node
5. Add Environment Variables (same as `.env`):
   - `MONGO_URI`
   - `JWT_SECRET`
   - `SESSION_SECRET`
   - `FINNHUB_API_KEY`
   - `FRONTEND_URL` → your Vercel URL
   - `NODE_ENV=production`
6. Deploy — your API URL will be something like `https://stockbox-api.onrender.com`

### Deploy Frontend to Vercel (Free)

1. Push `frontend/` folder to GitHub
2. Go to https://vercel.com → New Project
3. Import your repo
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
5. Add Environment Variable:
   - `VITE_API_URL` = `https://your-stockbox-api.onrender.com/api`
6. Deploy!

---

## 🎓 Syllabus Coverage

| Topic | Implementation |
|-------|---------------|
| Node.js & Express setup | `server.js` — routes, middleware, error handling |
| REST API design | `/api/auth`, `/api/stocks`, `/api/portfolio`, `/api/contact` |
| Middleware | Auth JWT, validation (express-validator), Morgan logger, Helmet, CORS |
| Error handling | 4-param `errorHandler`, custom HTTP status codes |
| MongoDB + Mongoose | User, Portfolio, Trade, Contact schemas with indexes |
| Schema features | Pre-save hooks, instance methods, virtuals, compound indexes |
| Authentication | JWT (jsonwebtoken) + bcrypt password hashing |
| Passport.js | Local strategy in `config/passport.js` |
| Session management | express-session for Passport, JWT for API |
| Input validation | express-validator rules per route |
| Rate limiting | express-rate-limit on all routes + stricter on auth |
| Security | Helmet headers, CORS whitelist |
| Frontend | React 18, TypeScript, React Router v6, Tailwind CSS |
| State management | React Context (AuthContext) + localStorage |
| API integration | Axios with JWT interceptor, auto-logout on 401 |
| Real-time data | Finnhub API for live NSE stock prices + candles + news |
| Charts | TradingView Lightweight Charts (candlestick) |
| Deployment | Vercel (frontend) + Render (backend) + MongoDB Atlas |

---

## 📱 Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with hero, features, testimonials |
| `/about` | Company story, mission, team |
| `/products` | Feature list with tech stack |
| `/pricing` | Free plan features, FAQ |
| `/support` | Contact form (saves to MongoDB) |
| `/login` | JWT login |
| `/signup` | Registration with ₹10L virtual balance |
| `/dashboard` | Trading terminal with live chart |
| `/dashboard/portfolio` | Holdings with live P&L |
| `/dashboard/history` | Paginated trade history |
| `/dashboard/news` | Finnhub market news |

---

## 🏦 Paper Trading Logic

- Each new user gets **₹10,00,000** virtual balance in their Portfolio document
- **BUY**: Deducts `quantity × livePrice` from `cashBalance`, adds holding with weighted average cost
- **SELL**: Adds `quantity × livePrice` to `cashBalance`, removes/reduces holding, records realised P&L
- All prices fetched live from Finnhub at trade execution time
- Portfolio enriched with live prices on every load

---

## 🔑 API Endpoints

```
POST   /api/auth/register          Create account
POST   /api/auth/login             Login + get JWT
GET    /api/auth/me                Get current user (protected)
PUT    /api/auth/profile           Update profile (protected)

GET    /api/stocks/popular         Top NSE stocks with quotes
GET    /api/stocks/quote/:symbol   Single stock quote
GET    /api/stocks/candles/:symbol OHLCV candle data
GET    /api/stocks/search          Search stocks
GET    /api/stocks/news            Market news
GET    /api/stocks/company-news/:s Company-specific news

GET    /api/portfolio              Get portfolio with live prices
POST   /api/portfolio/trade        Execute BUY or SELL
GET    /api/portfolio/history      Trade history (paginated)
GET    /api/portfolio/stats        Summary statistics
POST   /api/portfolio/reset        Reset to ₹10L

POST   /api/contact                Submit support form
```

---

## ⚠️ Important Notes

- **Paper trading only** — no real money is involved
- Finnhub free tier: 60 API calls/minute (sufficient for demo)
- NSE market hours: 9:15 AM – 3:30 PM IST weekdays
- Stock prices may be delayed ~15 seconds on free tier
- MongoDB Atlas M0 free tier: 512MB storage (more than enough)
- Render free tier sleeps after 15 min inactivity (first request is slow)

---

## 🛠️ Next Steps (Future Enhancements)

- [ ] WebSocket for real-time price streaming
- [ ] Watchlist feature
- [ ] Price alerts via email
- [ ] More stocks (BSE, Nifty 50 full list)
- [ ] Options paper trading
- [ ] Leaderboard among users
- [ ] Technical indicators (RSI, MACD, Bollinger Bands)
- [ ] Mobile app (React Native)

---

*Built with ❤️ as an educational project. Not for real trading.*
