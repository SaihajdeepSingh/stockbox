// src/types/index.ts — Shared TypeScript types

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  role: 'user' | 'admin';
  createdAt: string;
  lastLogin?: string;
  avatar?: string;
}

export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
  high: number;
  low: number;
  open: number;
  prevClose: number;
  timestamp?: number;
}

export interface StockListItem {
  symbol: string;
  name: string;
  sector: string;
  price?: number;
  change?: number;
  changePct?: number;
  high?: number;
  low?: number;
  prevClose?: number;
}

export interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface Holding {
  symbol: string;
  companyName: string;
  exchange: string;
  quantity: number;
  avgBuyPrice: number;
  totalInvested: number;
  currentPrice: number;
  currentValue: number;
  profitLoss: number;
  profitPct: number;
}

export interface Portfolio {
  cashBalance: number;
  holdings: Holding[];
  totalInvested: number;
  totalValue: number;
  totalPnL: number;
  totalPnLPct: number;
  netWorth: number;
  totalDeposited: number;
}

export interface Trade {
  _id: string;
  symbol: string;
  companyName: string;
  exchange: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  total: number;
  profitLoss?: number;
  balanceBefore: number;
  balanceAfter: number;
  createdAt: string;
}

export interface NewsArticle {
  id: number;
  headline: string;
  summary: string;
  source: string;
  url: string;
  image?: string;
  datetime: number;
  category?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

export interface TradePayload {
  symbol: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  companyName?: string;
  exchange?: string;
}
