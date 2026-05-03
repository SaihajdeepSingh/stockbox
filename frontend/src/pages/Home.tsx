import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, TrendingUp, TrendingDown, BarChart2,
  Shield, Zap, Globe, BookOpen, ChevronRight,
  Star, Lock, Activity,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function Counter({ to, prefix = '', suffix = '' }: { to: number; prefix?: string; suffix?: string }) {
  const [val, setVal] = useState(0);
  const { ref, visible } = useReveal();
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = to / 60;
    const id = setInterval(() => {
      start += step;
      if (start >= to) { setVal(to); clearInterval(id); } else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(id);
  }, [visible, to]);
  return <span ref={ref}>{prefix}{val.toLocaleString('en-IN')}{suffix}</span>;
}

function TerminalPreview() {
  return (
    <div className="relative w-full max-w-lg mx-auto select-none">
      <div className="absolute -inset-4 bg-blue-500/20 rounded-3xl blur-2xl" />

      <div className="relative bg-[#0f1729] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
          </div>
          <span className="text-white/40 text-xs font-mono ml-2">StockBox — Trading Terminal</span>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/40 text-xs uppercase tracking-wider">Cash Balance</p>
              <p className="text-white font-bold text-xl font-mono">₹9,76,450.00</p>
            </div>
            <div className="text-right">
              <p className="text-white/40 text-xs uppercase tracking-wider">Net Worth</p>
              <p className="text-green-400 font-bold text-xl font-mono">₹10,24,830.00</p>
            </div>
          </div>

          <div className="flex items-end gap-0.5 h-16 bg-white/5 rounded-lg px-3 py-2">
            {[40,55,45,70,60,80,65,90,75,85,70,95,80,72,88,92,78,96,85,100,88,94].map((h, i) => (
              <div key={i} className="flex-1 rounded-sm transition-all"
                style={{ height: `${h}%`, background: i > 18 ? '#10b981' : i > 12 ? '#3b82f6' : '#1d4ed8', opacity: 0.7 + (i / 22) * 0.3 }} />
            ))}
          </div>

          {[
            { s: 'RELIANCE', p: '₹1,436.20', c: '+1.55%', up: true },
            { s: 'TCS',      p: '₹2,474.80', c: '+0.00%', up: true },
            { s: 'HDFCBANK', p: '₹774.75',   c: '-0.55%', up: false },
          ].map(row => (
            <div key={row.s} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-8 rounded-full ${row.up ? 'bg-green-400' : 'bg-red-400'}`} />
                <div>
                  <p className="text-white text-sm font-semibold font-mono">{row.s}</p>
                  <p className="text-white/40 text-xs">NSE</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white text-sm font-mono">{row.p}</p>
                <p className={`text-xs font-semibold ${row.up ? 'text-green-400' : 'text-red-400'}`}>{row.c}</p>
              </div>
            </div>
          ))}

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg py-2 text-center">
              <span className="text-green-400 text-sm font-bold tracking-wide">BUY</span>
            </div>
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg py-2 text-center">
              <span className="text-red-400 text-sm font-bold tracking-wide">SELL</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -top-4 -right-4 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-bounce">
        +₹24,830 profit
      </div>

      <div className="absolute -bottom-4 -left-4 bg-white text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse inline-block" />
        Live NSE prices
      </div>
    </div>
  );
}

const TICKER_STOCKS = [
  { s: 'RELIANCE', p: '₹1,436', c: '+1.55%', up: true },
  { s: 'TCS',      p: '₹2,474', c: '+0.00%', up: true },
  { s: 'INFY',     p: '₹1,182', c: '+1.29%', up: true },
  { s: 'HDFCBANK', p: '₹774',   c: '-0.55%', up: false },
  { s: 'WIPRO',    p: '₹201',   c: '+0.26%', up: true },
  { s: 'SBIN',     p: '₹792',   c: '+2.14%', up: true },
  { s: 'ITC',      p: '₹435',   c: '+0.68%', up: true },
  { s: 'TITAN',    p: '₹3,245', c: '-1.12%', up: false },
  { s: 'BAJFINANCE', p: '₹939', c: '+1.04%', up: true },
  { s: 'TATAMOTORS', p: '₹656', c: '+0.87%', up: true },
];

const FEATURES = [
  { icon: BarChart2, title: 'Live Candlestick Charts', desc: 'Real OHLCV data from Yahoo Finance. Daily, weekly, monthly and yearly views for all 20+ NSE stocks.', color: 'from-blue-600 to-blue-400' },
  { icon: Shield,    title: '₹10 Lakh Paper Balance', desc: 'Start with ₹10,00,000 virtual money. Execute real trades at real prices with zero financial risk.', color: 'from-emerald-600 to-emerald-400' },
  { icon: Zap,       title: 'Instant Order Execution', desc: 'Market orders execute at live prices the moment you click. No delays, no queue, no settlement.', color: 'from-amber-600 to-amber-400' },
  { icon: Globe,     title: 'Complete Portfolio Tracker', desc: 'Holdings enriched with live prices, unrealised P&L per stock, allocation percentages and net worth.', color: 'from-purple-600 to-purple-400' },
  { icon: BookOpen,  title: 'Market News Feed', desc: 'Curated financial news from Finnhub, refreshed live. Stay informed without leaving the platform.', color: 'from-rose-600 to-rose-400' },
  { icon: Activity,  title: 'Full Trade History', desc: 'Paginated audit trail of every buy and sell with realised P&L, win rate and balance snapshots.', color: 'from-cyan-600 to-cyan-400' },
];

const STEPS = [
  { n: '01', title: 'Create Free Account', desc: 'Sign up in under 60 seconds. No credit card, no KYC, no documents required.' },
  { n: '02', title: 'Get ₹10 Lakh Balance', desc: 'Your paper trading wallet is credited instantly on signup.' },
  { n: '03', title: 'Trade NSE Stocks', desc: 'Pick from 20+ real NSE stocks and execute at live market prices.' },
  { n: '04', title: 'Track & Improve', desc: 'Review portfolio performance, P&L history and market news to sharpen your strategy.' },
];

const TESTIMONIALS = [
  { name: 'Priya Mehta',    role: 'B.Tech Student, BITS Pilani', text: 'StockBox gave me the confidence to understand market movements without any financial anxiety. The charts are genuinely professional.', rating: 5, initials: 'PM' },
  { name: 'Arjun Sharma',   role: 'MBA, IIM Ahmedabad',          text: 'I simulated an entire market cycle on StockBox before investing real capital. The paper trading logic is exactly how real brokers work.', rating: 5, initials: 'AS' },
  { name: 'Divya Krishnan', role: 'CA Finalist',                  text: 'The live NSE prices and Finnhub news integration make this feel like a real terminal. An essential tool for any finance student.', rating: 5, initials: 'DK' },
];

export default function Home() {
  const featuresReveal = useReveal();
  const stepsReveal    = useReveal();
  const testReveal     = useReveal();

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Navbar />

      <section className="relative bg-[#060d3a] overflow-hidden">
        <div className="absolute inset-0"
          style={{ backgroundImage: 'linear-gradient(rgba(59,130,246,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,.07) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/20 rounded-full blur-3xl" />

        <div className="container-main relative pt-32 pb-20 lg:pt-36 lg:pb-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-sm font-medium text-blue-300 mb-8">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                NSE live data · Zero real money · 100% free
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.08] tracking-tight mb-6">
                Master the<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                  Indian Market.
                </span><br />
                Risk Nothing.
              </h1>

              <p className="text-lg text-blue-100/70 leading-relaxed mb-10 max-w-lg">
                Practice trading real NSE stocks with <strong className="text-white">₹10,00,000</strong> virtual money.
                Live prices, professional charts, zero financial risk.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link to="/signup"
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl px-7 py-3.5 text-base transition-all shadow-lg shadow-blue-900/40 hover:shadow-blue-600/30 hover:-translate-y-0.5">
                  Start Trading Free <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/products"
                  className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-xl px-7 py-3.5 text-base transition-all">
                  See how it works <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="flex flex-wrap gap-x-8 gap-y-4 pt-8 border-t border-white/10">
                {[
                  { val: '₹10L', label: 'Starting Capital' },
                  { val: '20+',  label: 'NSE Stocks' },
                  { val: '100%', label: 'Free Forever' },
                  { val: 'Live', label: 'Market Prices' },
                ].map(({ val, label }) => (
                  <div key={label}>
                    <p className="text-2xl font-black text-white">{val}</p>
                    <p className="text-xs text-blue-300/60 mt-0.5 font-medium uppercase tracking-wider">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden lg:block">
              <TerminalPreview />
            </div>
          </div>
        </div>

        <div className="h-16 bg-gradient-to-b from-transparent to-[#060d3a]" />
      </section>

      <div className="bg-[#040b2e] border-t border-white/8 py-3 overflow-hidden">
        <div className="ticker-content">
          {[...TICKER_STOCKS, ...TICKER_STOCKS].map((s, i) => (
            <span key={i} className="inline-flex items-center gap-3 px-7 text-[13px] whitespace-nowrap">
              <span className="font-bold text-white font-mono tracking-wide">{s.s}</span>
              <span className="text-slate-400 font-mono">{s.p}</span>
              <span className={`font-bold font-mono ${s.up ? 'text-emerald-400' : 'text-red-400'}`}>{s.c}</span>
              <span className="text-white/10 text-lg leading-none">|</span>
            </span>
          ))}
        </div>
      </div>

      <section className="section bg-[#f8fafc]">
        <div
          ref={featuresReveal.ref}
          className={`container-main transition-all duration-700 ${featuresReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="max-w-2xl mb-14">
            <p className="text-blue-600 font-bold text-sm uppercase tracking-widest mb-3">Platform Features</p>
            <h2 className="text-4xl font-black text-slate-900 leading-tight mb-4">
              Every tool a serious<br />trader needs.
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed">
              Built to mirror a real trading terminal. Without putting your capital at risk.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc, color }, i) => (
              <div
                key={title}
                className="group relative bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-50/0 to-blue-50/0 group-hover:from-blue-50/80 group-hover:to-transparent transition-all duration-300" />

                <div className="relative">
                  <div className={`inline-flex w-11 h-11 rounded-xl bg-gradient-to-br ${color} items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2 text-base">{title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(29,78,216,0.15) 0%, transparent 60%), radial-gradient(circle at 80% 50%, rgba(16,185,129,0.08) 0%, transparent 60%)' }} />

        <div
          ref={stepsReveal.ref}
          className={`container-main relative transition-all duration-700 ${stepsReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="text-center mb-16">
            <p className="text-blue-400 font-bold text-sm uppercase tracking-widest mb-3">Simple Process</p>
            <h2 className="text-4xl font-black text-white mb-4">Live in 60 seconds</h2>
            <p className="text-slate-400 max-w-md mx-auto">No lengthy onboarding. No KYC. No credit card. Just create an account and start trading.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {STEPS.map(({ n, title, desc }, i) => (
              <div key={n} className="relative group">
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(50%+28px)] right-0 h-px bg-gradient-to-r from-blue-800 to-transparent" />
                )}
                <div className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-6 transition-all duration-300 group-hover:border-blue-500/30 group-hover:-translate-y-1">
                  <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-blue-900/40">
                    <span className="text-lg font-black text-white font-mono">{n}</span>
                  </div>
                  <h3 className="font-bold text-white mb-2">{title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/signup"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl px-8 py-3.5 text-base transition-all shadow-lg shadow-blue-900/50">
              Create Free Account <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700">
        <div className="container-main grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
          {[
            { to: 1000000, prefix: '₹', suffix: '', label: 'Starting Virtual Capital' },
            { to: 20,      prefix: '',  suffix: '+', label: 'NSE Stocks Available' },
            { to: 100,     prefix: '',  suffix: '%', label: 'Free, No Hidden Fees' },
            { to: 0,       prefix: '',  suffix: 'ms', label: 'Order Execution Delay' },
          ].map(({ to, prefix, suffix, label }) => (
            <div key={label}>
              <p className="text-4xl font-black mb-1 font-mono">
                {to === 0 ? '~0' : <Counter to={to} prefix={prefix} suffix={suffix} />}
                {to !== 0 && ''}
              </p>
              <p className="text-blue-200 text-sm font-medium">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section bg-[#f8fafc]">
        <div
          ref={testReveal.ref}
          className={`container-main transition-all duration-700 ${testReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="text-center mb-14">
            <p className="text-blue-600 font-bold text-sm uppercase tracking-widest mb-3">Social Proof</p>
            <h2 className="text-4xl font-black text-slate-900">Trusted by learners</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, role, text, rating, initials }) => (
              <div key={name} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="flex gap-0.5 mb-5">
                  {Array(rating).fill(0).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed mb-6 italic">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-700 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {initials}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{name}</p>
                    <p className="text-xs text-slate-500">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-[#060d3a] py-24 overflow-hidden">
        <div className="absolute inset-0"
          style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(29,78,216,0.3) 0%, transparent 70%)' }} />
        <div className="container-main relative text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-sm font-medium text-blue-300 mb-8">
            <Lock className="w-3.5 h-3.5" /> No credit card · No KYC · Cancel anytime
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-5 leading-tight">
            Ready to trade smarter?
          </h2>
          <p className="text-blue-200/70 text-lg mb-10">
            Join thousands of students and finance professionals who practice on StockBox before risking real capital.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl px-8 py-4 text-base transition-all shadow-xl shadow-blue-900/50 hover:-translate-y-0.5">
              Create Free Account <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/about"
              className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-xl px-8 py-4 text-base transition-all">
              Learn more about us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}