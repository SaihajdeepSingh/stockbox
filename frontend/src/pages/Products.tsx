import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CandlestickChart, Wallet, List, Newspaper, BarChart, CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

const PRODUCTS = [
  {
    icon: CandlestickChart,
    title: 'Live Candlestick Charts',
    tag: 'Core',
    desc: 'Professional OHLCV candlestick charts via TradingView Lightweight Charts. Real NSE stock price action across 1W, 1M, 3M, 6M, and 1Y timeframes using Yahoo Finance daily data.',
    points: ['Daily OHLCV from Yahoo Finance', 'Multi-timeframe: 1W to 1Y', 'Crosshair with OHLC tooltip', 'Auto-fit and smooth zoom'],
    color: 'from-blue-600 to-blue-400',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
  },
  {
    icon: Wallet,
    title: 'Paper Trading Engine',
    tag: 'Core',
    desc: 'Execute real buy and sell orders at live NSE prices using Rs.10,00,000 virtual capital. Balance checks, weighted average cost, and instant confirmation on every trade.',
    points: ['Market orders at live prices', 'Real-time balance tracking', 'Weighted average cost basis', 'Portfolio reset anytime'],
    color: 'from-emerald-600 to-emerald-400',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
  },
  {
    icon: BarChart,
    title: 'Portfolio Dashboard',
    tag: 'Analytics',
    desc: 'Complete holdings view enriched with live prices, current value, unrealised P&L per position, and net worth updated every time you load the page.',
    points: ['Live P&L per holding', 'Net worth tracker', 'Win rate and trade stats', 'Visual allocation bar chart'],
    color: 'from-purple-600 to-purple-400',
    bg: 'bg-purple-50',
    border: 'border-purple-100',
  },
  {
    icon: List,
    title: 'Trade History',
    tag: 'Records',
    desc: 'Full paginated audit trail of every BUY and SELL with prices, quantities, proceeds, balance snapshots, and realised profit or loss per trade.',
    points: ['Complete trade log', 'Realised P&L per SELL', 'Paginated 20 per page', 'Balance before and after'],
    color: 'from-amber-600 to-amber-400',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
  },
  {
    icon: Newspaper,
    title: 'Market News Feed',
    tag: 'Research',
    desc: 'Curated financial news headlines from Finnhub API, refreshed regularly. Stay informed about market events without leaving the StockBox platform.',
    points: ['General market news', 'Source-attributed headlines', 'Summary previews', 'Direct article links'],
    color: 'from-rose-600 to-rose-400',
    bg: 'bg-rose-50',
    border: 'border-rose-100',
  },
];

export default function Products() {
  const productsReveal = useReveal();
  const stackReveal    = useReveal();

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-[#060d3a] overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage:'linear-gradient(rgba(59,130,246,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,.07) 1px,transparent 1px)', backgroundSize:'48px 48px' }} />
        <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-blue-600/20 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative pt-32 pb-24 lg:pt-40 lg:pb-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-sm font-medium text-blue-300 mb-8">
              <BarChart className="w-3.5 h-3.5" /> Platform Features
            </div>
            <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              Every tool a trader<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">actually needs.</span>
            </h1>
            <p className="text-xl text-blue-100/70 leading-relaxed max-w-2xl">
              StockBox packs a full suite of trading, analytics, and research tools. All powered by real market data, completely free.
            </p>
          </div>
        </div>
        <div className="h-12 bg-gradient-to-b from-transparent to-[#f8fafc]" />
      </section>

      {/* Products */}
      <section className="section bg-[#f8fafc]">
        <div ref={productsReveal.ref}
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${productsReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="space-y-6">
            {PRODUCTS.map(({ icon: Icon, title, tag, desc, points, color, bg, border }, i) => (
              <div key={title}
                className={`group grid md:grid-cols-[1fr_1.2fr] gap-8 items-center border ${border} ${bg} rounded-3xl p-8 hover:shadow-xl transition-all duration-300`}
                style={{ transitionDelay: `${i * 50}ms` }}>
                <div className={i % 2 === 1 ? 'md:order-2' : ''}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-11 h-11 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className={`text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-gradient-to-r ${color} text-white`}>{tag}</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-3">{title}</h3>
                  <p className="text-slate-600 leading-relaxed">{desc}</p>
                </div>
                <div className={`grid grid-cols-2 gap-3 ${i % 2 === 1 ? 'md:order-1' : ''}`}>
                  {points.map(p => (
                    <div key={p} className="bg-white rounded-xl px-4 py-3 border border-slate-200 flex items-start gap-2.5 shadow-sm">
                      <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                      <span className="text-sm text-slate-700 font-medium leading-snug">{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage:'radial-gradient(circle at 70% 50%, rgba(29,78,216,0.12) 0%, transparent 60%)' }} />
        <div ref={stackReveal.ref}
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative transition-all duration-700 ${stackReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-blue-400 font-bold text-sm uppercase tracking-widest mb-3">Tech Stack</p>
          <h2 className="text-4xl font-black text-white">Built on proven, modern technology.</h2>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-[#060d3a] py-24 overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage:'radial-gradient(circle at 50% 0%, rgba(29,78,216,0.35) 0%, transparent 65%)' }} />
        <div className="absolute inset-0" style={{ backgroundImage:'linear-gradient(rgba(59,130,246,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,.04) 1px,transparent 1px)', backgroundSize:'48px 48px' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center max-w-2xl mx-auto">
          <p className="text-blue-400 font-bold text-sm uppercase tracking-widest mb-5">Ready to start?</p>
          <h2 className="text-5xl lg:text-6xl font-black text-white leading-tight mb-5">
            See it all<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">in action.</span>
          </h2>
          <p className="text-blue-200/70 text-lg mb-10 max-w-md mx-auto">
            Sign up free and explore every feature in under 60 seconds. No credit card. No KYC.
          </p>
          <Link to="/signup"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl px-8 py-4 text-base transition-all shadow-xl shadow-blue-900/50 hover:-translate-y-0.5">
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}