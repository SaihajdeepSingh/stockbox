// src/components/Footer.tsx — Premium fintech footer with custom logo
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Github, Linkedin, Youtube, Instagram, ArrowRight, ArrowUpRight, Shield } from 'lucide-react';
import StockBoxLogo from '@/components/StockBoxLogo';

const COLS = [
  {
    heading: 'Platform',
    links: [
      { label: 'Trading Terminal', to: '/dashboard',           ext: false },
      { label: 'Portfolio',        to: '/dashboard/portfolio', ext: false },
      { label: 'Trade History',    to: '/dashboard/history',   ext: false },
      { label: 'Market News',      to: '/dashboard/news',      ext: false },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About Us',  to: '/about',    ext: false },
      { label: 'Products',  to: '/products', ext: false },
      { label: 'Pricing',   to: '/pricing',  ext: false },
      { label: 'Support',   to: '/support',  ext: false },
    ],
  },
  {
    heading: 'Developers',
    links: [
      { label: 'GitHub Repo',   to: 'https://github.com', ext: true  },
      { label: 'API Reference', to: '/#',                 ext: false },
      { label: 'Changelog',     to: '/#',                 ext: false },
      { label: 'Roadmap',       to: '/#',                 ext: false },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy', to: '/#', ext: false },
      { label: 'Terms of Use',   to: '/#', ext: false },
      { label: 'Cookie Policy',  to: '/#', ext: false },
      { label: 'Disclaimer',     to: '/#', ext: false },
    ],
  },
];

const SOCIALS = [
  { Icon: Twitter,   href: '#', label: 'Twitter'   },
  { Icon: Github,    href: '#', label: 'GitHub'    },
  { Icon: Linkedin,  href: '#', label: 'LinkedIn'  },
  { Icon: Youtube,   href: '#', label: 'YouTube'   },
  { Icon: Instagram, href: '#', label: 'Instagram' },
];

function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [done,  setDone]  = useState(false);

  if (done) return (
    <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold py-2.5">
      <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
      </div>
      You're subscribed. Welcome!
    </div>
  );

  return (
    <form onSubmit={e => { e.preventDefault(); if (email) setDone(true); }} className="flex gap-2">
      <input
        type="email" required value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:bg-white/8 transition-all"
      />
      <button type="submit"
        className="shrink-0 inline-flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-4 py-2.5 transition-all hover:-translate-y-px shadow-lg shadow-blue-950/50">
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
}

export default function Footer() {
  return (
    <footer className="relative bg-[#060d3a] overflow-hidden" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>

      {/* ── Background decoration ── */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(59,130,246,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,.035) 1px,transparent 1px)', backgroundSize: '56px 56px' }} />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[280px] bg-blue-700/10 rounded-full blur-3xl" />
        <div className="absolute top-0 right-0 w-[350px] h-[200px] bg-blue-500/6 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 text-[160px] font-black leading-none select-none tracking-tight pr-4 pb-2"
          style={{ color: 'rgba(255,255,255,0.014)' }}>
          SB
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ══ TOP: brand + newsletter ══ */}
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 items-start py-14 border-b border-white/[0.07]">

          {/* Brand */}
          <div>
            {/* Logo — uses custom SVG component */}
            <Link to="/" className="inline-flex items-center gap-3 mb-5 group">
              <StockBoxLogo size={40} className="group-hover:scale-105 transition-transform duration-200" />
              <span className="text-xl font-black text-white tracking-tight">
                Stock<span className="text-blue-400">Box</span>
              </span>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed max-w-xs mb-6">
              India's premier paper trading simulator. Real NSE prices, ₹10L virtual capital, professional charts. Zero financial risk.
            </p>

            {/* 5 social icons */}
            <div className="flex gap-1.5">
              {SOCIALS.map(({ Icon, href, label }) => (
                <a key={label} href={href} aria-label={label}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-blue-600 border border-white/10 hover:border-blue-500 flex items-center justify-center transition-all hover:-translate-y-0.5 group/social">
                  <Icon className="w-3.5 h-3.5 text-slate-500 group-hover/social:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="lg:pt-1">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Newsletter</p>
            <p className="text-white font-bold text-lg mb-1">Market insights, monthly.</p>
            <p className="text-slate-500 text-xs mb-4 leading-relaxed">
              One email per month. Market analysis, platform updates, and tips. No spam.
            </p>
            <NewsletterForm />
          </div>
        </div>

        {/* ══ MIDDLE: link columns ══ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-b border-white/[0.07]">
          {COLS.map(({ heading, links }) => (
            <div key={heading}>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-5">{heading}</p>
              <ul className="space-y-3.5">
                {links.map(({ label, to, ext }) => (
                  <li key={label}>
                    {ext ? (
                      <a href={to} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-slate-500 hover:text-white transition-colors group/link">
                        {label}
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-all" />
                      </a>
                    ) : (
                      <Link to={to}
                        className="text-sm text-slate-500 hover:text-white transition-colors relative group/link block w-fit">
                        {label}
                        <span className="absolute -bottom-px left-0 h-px w-0 group-hover/link:w-full bg-blue-500 transition-all duration-200" />
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ══ BOTTOM BAR ══ */}
        <div className="py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
            <span>© {new Date().getFullYear()} StockBox Technologies</span>
            <span className="hidden sm:inline w-px h-3 bg-slate-800" />
            <span>Built in India</span>
            <span className="hidden sm:inline w-px h-3 bg-slate-800" />
            <Link to="/support" className="hover:text-slate-400 transition-colors">Contact</Link>
            <Link to="/#" className="hover:text-slate-400 transition-colors">Privacy</Link>
            <Link to="/#" className="hover:text-slate-400 transition-colors">Terms</Link>
          </div>
          <div className="flex items-center gap-2 bg-amber-400/8 border border-amber-400/15 rounded-full px-3.5 py-1.5">
            <Shield className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="text-[11px] font-semibold text-amber-300/80 whitespace-nowrap">Paper trading only. No real funds involved.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
