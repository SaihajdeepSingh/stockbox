// server.js — StockBox Express server (Syllabus: Lecture 1-8, 9-12, 13-16, 25-28)
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

require('dotenv').config();

const express       = require('express');
const cors          = require('cors');
const helmet        = require('helmet');
const rateLimit     = require('express-rate-limit');
const session       = require('express-session');
const passport      = require('./config/passport');
const connectDB     = require('./config/db');
const logger        = require('./middleware/logger');
const { errorHandler } = require('./middleware/auth');

// Route imports
const authRoutes      = require('./routes/auth');
const stockRoutes     = require('./routes/stocks');
const portfolioRoutes = require('./routes/portfolio');
const contactRoutes   = require('./routes/contact');

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── Connect to MongoDB ──────────────────────────────────────────────────────
connectDB();

// ─── Security Middleware (Syllabus: Lecture 13-16) ──────────────────────────
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false,
}));

// CORS — allow requests from Vercel frontend
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:3000',
    /\.vercel\.app$/,
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting (Syllabus: Lecture 13-16)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests. Please try again later.' },
});

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: { success: false, error: 'Too many auth attempts. Try again in an hour.' },
});

app.use(limiter);

// ─── Body Parsing ────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ─── Request Logger (Syllabus: Lecture 25-28) ────────────────────────────────
app.use(logger);

// ─── Session & Passport (Syllabus: Lecture 41-44) ────────────────────────────
app.use(session({
  secret:            process.env.SESSION_SECRET || 'stockbox_session_secret',
  resave:            false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production', httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 },
}));
app.use(passport.initialize());
app.use(passport.session());

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'StockBox API', env: process.env.NODE_ENV }));

// ─── API Routes ──────────────────────────────────────────────────────────────
app.use('/api/auth',      authLimiter, authRoutes);
app.use('/api/stocks',    stockRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/contact',   contactRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use('*', (req, res) => {
  res.status(404).json({ success: false, error: `Route ${req.originalUrl} not found.` });
});

// ─── Global Error Handler (Syllabus: Lecture 25-28) ─────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 StockBox API running on port ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Health check: http://localhost:${PORT}/health\n`);
});

module.exports = app;