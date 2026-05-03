import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Target, Users, Lightbulb, Award, TrendingUp } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.12 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

const VALUES = [
  { icon: Target,    title: 'Mission-Driven',  desc: 'Make stock market education accessible to every Indian. Remove the fear of financial loss from the learning curve.' },
  { icon: Users,     title: 'Community First', desc: 'Built for students, finance professionals, and anyone curious about investing in the Indian equity market.' },
  { icon: Lightbulb, title: 'Real Data Only',  desc: 'We use Yahoo Finance API for live NSE prices. Every rupee, every candle on StockBox reflects the actual market.' },
  { icon: Award,     title: 'Zero Cost',       desc: 'StockBox is completely free. No subscriptions, no paywalls, no ads targeting your trading data. Ever.' },
];

const MILESTONES = [
  { year: '2025 Q1', title: 'Idea Born',       desc: 'Started as a college project to help peers learn trading without financial risk.' },
  { year: '2025 Q2', title: 'Core Built',       desc: 'Paper trading engine, live NSE prices via Yahoo Finance, and portfolio tracker launched.' },
  { year: '2025 Q3', title: 'Charts Added',     desc: 'Integrated TradingView Lightweight Charts for professional candlestick analysis.' },
  { year: '2026',    title: 'Open to Everyone', desc: 'Deployed to Vercel and Render. Free for all students and finance enthusiasts.' },
];

export default function About() {
  const valuesReveal   = useReveal();
  const timelineReveal = useReveal();

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-[#060d3a] overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(59,130,246,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,.07) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/20 rounded-full blur-3xl" />
        <div className="container-main relative pt-32 pb-24 lg:pt-40 lg:pb-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-sm font-medium text-blue-300 mb-8">
              <TrendingUp className="w-3.5 h-3.5" /> Our Story
            </div>
            <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              Built by learners,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">for learners.</span>
            </h1>
            <p className="text-xl text-blue-100/70 leading-relaxed max-w-2xl">
              StockBox started as a single question: <em className="text-white not-italic font-semibold">"Why should you need real money to learn how to trade?"</em> We built the answer.
            </p>
          </div>
        </div>
        <div className="h-12 bg-gradient-to-b from-transparent to-[#f8fafc]" />
      </section>

      {/* Story */}
      <section className="section bg-[#f8fafc]">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-blue-600 font-bold text-sm uppercase tracking-widest mb-4">The Origin</p>
              <h2 className="text-4xl font-black text-slate-900 mb-6 leading-tight">
                From a college dorm to a real platform.
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>Our team of finance and technology students from Punjab watched friends lose hard earned money on their first stock market trades simply because they had nowhere to practice first.</p>
                <p>We built StockBox to close that gap. Using Yahoo Finance for live NSE data, React for a fast trading interface, and MongoDB for reliable data persistence, we created what we wish had existed when we started learning.</p>
                <p>Every rupee, every candlestick, every trade on StockBox reflects the real Indian market, just with virtual money so there's no anxiety.</p>
              </div>
            </div>

            {/* Stats card */}
            <div className="bg-slate-950 rounded-3xl p-8 border border-white/10">
              <div className="grid grid-cols-2 gap-5">
                {[
                  { val: '₹10L', label: 'Virtual Capital',  color: 'text-blue-400'    },
                  { val: '20+',  label: 'NSE Stocks',        color: 'text-emerald-400' },
                  { val: '100%', label: 'Free Forever',      color: 'text-amber-400'   },
                  { val: '~0ms', label: 'Execution Delay',   color: 'text-cyan-400'    },
                ].map(({ val, label, color }) => (
                  <div key={label} className="bg-white/5 rounded-2xl p-5 border border-white/10">
                    <p className={`text-3xl font-black font-mono ${color} mb-1`}>{val}</p>
                    <p className="text-slate-400 text-sm font-medium">{label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 bg-white/5 rounded-2xl p-4 border border-white/10 flex items-center gap-3">
                <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse shrink-0" />
                <span className="text-slate-300 text-sm font-medium">Live NSE market data via Yahoo Finance API</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-white">
        <div ref={valuesReveal.ref}
          className={`container-main transition-all duration-700 ${valuesReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="max-w-xl mb-14">
            <p className="text-blue-600 font-bold text-sm uppercase tracking-widest mb-3">Our Principles</p>
            <h2 className="text-4xl font-black text-slate-900 leading-tight">What we stand for.</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map(({ icon: Icon, title, desc }, i) => (
              <div key={title}
                className="bg-[#f8fafc] border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                style={{ transitionDelay: `${i * 70}ms` }}>
                <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-900/20">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section bg-[#060d3a] relative overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(29,78,216,0.15) 0%, transparent 60%)' }} />
        <div ref={timelineReveal.ref}
          className={`container-main relative transition-all duration-700 ${timelineReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="max-w-xl mb-14">
            <p className="text-blue-400 font-bold text-sm uppercase tracking-widest mb-3">Our Journey</p>
            <h2 className="text-4xl font-black text-white leading-tight">How we got here.</h2>
          </div>
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-px bg-blue-800 hidden md:block" />
            <div className="space-y-6">
              {MILESTONES.map(({ year, title, desc }) => (
                <div key={year} className="md:pl-14 relative">
                  <div className="hidden md:flex absolute left-0 w-10 h-10 bg-blue-600 rounded-full items-center justify-center shadow-lg shadow-blue-900/50 z-10">
                    <div className="w-3 h-3 bg-white rounded-full" />
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-colors">
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">{year}</span>
                    <h3 className="font-bold text-white mt-1 mb-2">{title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-[#060d3a] py-28 overflow-hidden">
        {/* Radial glow */}
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(29,78,216,0.4) 0%, transparent 65%)' }} />
        {/* Grid */}
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(59,130,246,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,.05) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
        {/* Side glows */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/8 rounded-full blur-3xl" />

        <div className="container-main relative text-center max-w-2xl mx-auto">
          <p className="text-blue-400 font-bold text-sm uppercase tracking-widest mb-6">Start today</p>

          <h2 className="text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
            Join us on<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              this journey.
            </span>
          </h2>

          <p className="text-blue-100/60 text-lg leading-relaxed mb-10 max-w-md mx-auto">
            Start practising with virtual money today. No sign-up fees. No KYC. No credit card. Ever.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl px-8 py-4 text-base transition-all shadow-xl shadow-blue-900/50 hover:-translate-y-0.5">
              Create Free Account <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/products"
              className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-xl px-8 py-4 text-base transition-all">
              See all features
            </Link>
          </div>

          {/* Trust row */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-10 pt-8 border-t border-white/10">
            {['No credit card', 'No KYC', 'Instant access', 'Free forever'].map(t => (
              <span key={t} className="text-xs font-semibold text-blue-300/60 flex items-center gap-1.5">
                <span className="w-1 h-1 bg-blue-400/50 rounded-full" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}