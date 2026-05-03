import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Zap, Shield, BarChart2, Wallet, List, Newspaper, Lock, Activity } from 'lucide-react';
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

const FEATURES = [
  { icon: Wallet,       text: 'Rs.10,00,000 paper trading balance' },
  { icon: BarChart2,    text: 'Live NSE stock quotes (Yahoo Finance)' },
  { icon: Activity,     text: 'Real-time candlestick charts' },
  { icon: List,         text: '20+ NSE stocks to trade' },
  { icon: Shield,       text: 'Complete portfolio tracker with live P&L' },
  { icon: List,         text: 'Full paginated trade history' },
  { icon: Newspaper,    text: 'Market and company news feed' },
  { icon: Lock,         text: 'Secure JWT authentication' },
  { icon: Zap,          text: 'Portfolio reset anytime' },
  { icon: CheckCircle2, text: 'No credit card required' },
  { icon: CheckCircle2, text: 'No KYC or documents' },
  { icon: CheckCircle2, text: 'Unlimited trades forever' },
];

const FAQ = [
  { q: 'Is StockBox really free?',                 a: 'Yes, 100% free. We built StockBox as an educational project. There are no premium plans, no paywalls, and no ads targeting your trading data.' },
  { q: 'Is any real money involved?',              a: 'Absolutely not. StockBox is a paper trading simulator. All trades use virtual money. No real funds can be deposited or withdrawn under any circumstance.' },
  { q: 'Are the stock prices real?',               a: 'Yes. We use Yahoo Finance API to fetch real NSE stock prices. Prices reflect actual market data. During market hours, quotes are near real-time.' },
  { q: 'Which stocks can I trade?',                a: 'StockBox supports 20+ large-cap NSE stocks including RELIANCE, TCS, INFY, HDFCBANK, SBIN, WIPRO, TATAMOTORS and more.' },
  { q: 'What happens when I reset my portfolio?',  a: 'Your cash balance resets to Rs.10,00,000 and all holdings are cleared. Your trade history is also wiped so you can start completely fresh.' },
  { q: 'Will there ever be a paid plan?',          a: 'No plans for paid tiers on core features. The free plan will always include everything you need to learn trading effectively.' },
];

export default function Pricing() {
  const cardReveal = useReveal();
  const faqReveal  = useReveal();

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Navbar />

      <section className="relative bg-[#060d3a] overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage:'linear-gradient(rgba(59,130,246,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,.07) 1px,transparent 1px)', backgroundSize:'48px 48px' }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-blue-600/20 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative pt-32 pb-24 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-sm font-medium text-blue-300 mb-8">
            <Zap className="w-3.5 h-3.5 text-yellow-400" /> Simple pricing
          </div>
          <h1 className="text-6xl lg:text-7xl font-black text-white mb-5 leading-tight">
            Free.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Forever.</span>
          </h1>
          <p className="text-xl text-blue-100/70 leading-relaxed">
            No subscription. No credit card. No catch. StockBox is and always will be free for everyone.
          </p>
        </div>
        <div className="h-12 bg-gradient-to-b from-transparent to-[#f8fafc]" />
      </section>

      <section className="section bg-[#f8fafc]">
        <div ref={cardReveal.ref}
          className={`max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${cardReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative bg-white border-2 border-blue-600 rounded-3xl overflow-hidden shadow-2xl shadow-blue-100">
            <div className="bg-blue-600 py-3 text-center">
              <span className="text-white text-sm font-bold uppercase tracking-widest">The Only Plan You'll Ever Need</span>
            </div>
            <div className="p-8 md:p-10">
              <div className="flex items-end gap-3 mb-2">
                <span className="text-7xl font-black text-slate-900">Rs.0</span>
                <div className="mb-3">
                  <p className="text-slate-400 text-sm line-through">Rs.999/month</p>
                  <p className="text-blue-600 font-bold text-sm">Always free</p>
                </div>
              </div>
              <p className="text-slate-500 mb-8">No tricks. Every feature included. No trial period.</p>
              <div className="grid sm:grid-cols-2 gap-3 mb-8">
                {FEATURES.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                    <span className="text-sm text-slate-700 font-medium">{text}</span>
                  </div>
                ))}
              </div>
              <Link to="/signup"
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl py-4 text-base transition-all shadow-lg shadow-blue-200 hover:-translate-y-0.5 w-full">
                Start Trading Now. Free <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-center text-xs text-slate-400 mt-4">No credit card. No KYC. Paper trading only.</p>
            </div>
          </div>

          <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-5">
            <p className="text-sm text-slate-600 text-center leading-relaxed">
              Real brokers like Zerodha charge <strong className="text-slate-900">Rs.20/order</strong> plus account opening fees plus annual maintenance.
              StockBox gives you the full experience at <strong className="text-blue-600">Rs.0</strong> because learning should not cost money.
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-[#f8fafc]">
        <div ref={faqReveal.ref}
          className={`max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${faqReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-12">
            <p className="text-blue-600 font-bold text-sm uppercase tracking-widest mb-3">FAQ</p>
            <h2 className="text-4xl font-black text-slate-900">Common questions</h2>
          </div>
          <div className="space-y-4">
            {FAQ.map(({ q, a }, i) => (
              <div key={q} className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-200 hover:shadow-md transition-all"
                style={{ transitionDelay:`${i * 50}ms` }}>
                <h3 className="font-bold text-slate-900 mb-2 flex items-start gap-2">
                  <span className="text-blue-600 font-black shrink-0">Q.</span> {q}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed pl-5">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}