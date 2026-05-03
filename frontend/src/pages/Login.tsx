import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, ArrowLeft, BarChart2, Shield, Zap, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getErrorMessage } from '@/lib/api';
import StockBoxLogo from '@/components/StockBoxLogo';
import toast from 'react-hot-toast';

const PERKS = [
  { icon: BarChart2,    text: 'Live NSE candlestick charts' },
  { icon: Shield,       text: 'Rs.10,00,000 virtual trading balance' },
  { icon: Zap,          text: 'Instant order execution at real prices' },
  { icon: CheckCircle2, text: '100% free. No credit card ever' },
];

export default function Login() {
  const { login }   = useAuth();
  const navigate    = useNavigate();
  const [form, setForm]         = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#060d3a]"
      style={{ backgroundImage:'linear-gradient(rgba(59,130,246,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,.05) 1px,transparent 1px)', backgroundSize:'48px 48px' }}>

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[52%] flex-col p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[450px] h-[350px] bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[250px] bg-blue-400/8 rounded-full blur-3xl pointer-events-none" />

        {/* Navbar-matching top bar */}
        <div className="relative flex items-center justify-between mb-16">
          <Link to="/" className="flex items-center gap-2.5 group">
            <StockBoxLogo size={38} className="group-hover:scale-105 transition-transform" />
            <span className="text-xl font-black text-white tracking-tight">
              Stock<span className="text-blue-400">Box</span>
            </span>
          </Link>
          <Link to="/" className="flex items-center gap-1.5 text-blue-300/70 hover:text-white text-sm font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
        </div>

        <div className="relative flex-1 flex flex-col justify-between">
          <div className="space-y-8">
            <div>
              <span className="inline-block text-[11px] font-black text-blue-400 uppercase tracking-[0.2em] mb-5">
                Welcome back
              </span>
              <h1 className="text-5xl font-black text-white leading-[1.06] mb-5">
                Your portfolio<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">is waiting.</span>
              </h1>
              <p className="text-blue-100/55 text-base leading-relaxed max-w-sm">
                Jump back into your paper trading terminal. Your virtual balance, holdings, and history are all preserved.
              </p>
            </div>
            <div className="space-y-3">
              {PERKS.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3.5">
                  <div className="w-8 h-8 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <span className="text-sm text-slate-300 font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mock portfolio card */}
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 backdrop-blur-sm mt-10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-1">Cash Balance</p>
                <p className="text-white font-black text-2xl font-mono tracking-tight">Rs.9,76,450.00</p>
              </div>
              <div className="text-right">
                <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-1">Total P&L</p>
                <p className="text-emerald-400 font-black text-2xl font-mono tracking-tight">+Rs.24,830</p>
              </div>
            </div>
            <div className="flex items-end gap-0.5 h-10 mb-3 opacity-60">
              {[35,50,42,65,55,75,60,82,70,78,65,88,74,68,84,90,76,92,82,96].map((h, i) => (
                <div key={i} className="flex-1 rounded-sm"
                  style={{ height:`${h}%`, background: i > 15 ? '#10b981' : '#3b82f6', opacity: 0.6 + (i/20)*0.4 }} />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-slate-500 text-xs">Live NSE prices. Updated 10s ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 relative">
        <div className="absolute inset-0 bg-slate-950/65 lg:bg-slate-950/82" />

        {/* Mobile header matching navbar */}
        <div className="relative w-full max-w-[400px] flex items-center justify-between mb-8 lg:hidden">
          <Link to="/" className="flex items-center gap-2">
            <StockBoxLogo size={34} />
            <span className="text-xl font-black text-white">Stock<span className="text-blue-400">Box</span></span>
          </Link>
          <Link to="/" className="flex items-center gap-1 text-blue-300/70 hover:text-white text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
        </div>

        <div className="relative w-full max-w-[400px]">
          <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl shadow-black/40">
            <div className="mb-8">
              <h2 className="text-[22px] font-black text-white mb-1.5 leading-tight">Sign in to StockBox</h2>
              <p className="text-slate-400 text-sm">
                No account?{' '}
                <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">Create one free</Link>
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:bg-white/8 transition-all" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">Password</label>
                  <button type="button" className="text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors">Forgot password?</button>
                </div>
                <div className="relative">
                  <input name="password" type={showPass ? 'text' : 'password'}
                    value={form.password} onChange={handleChange} required autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-11 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:bg-white/8 transition-all" />
                  <button type="button" onClick={() => setShowPass(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-xl py-3.5 text-sm transition-all shadow-lg shadow-blue-900/40 hover:-translate-y-px mt-1">
                {loading
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</>
                  : <>Sign In <ArrowRight className="w-4 h-4" /></>
                }
              </button>
            </form>
            <p className="text-center text-[11px] text-slate-600 mt-6 leading-relaxed">
              By signing in you agree to our{' '}
              <a href="#" className="text-slate-500 hover:text-slate-300 underline transition-colors">Terms</a>
              {' '}and{' '}
              <a href="#" className="text-slate-500 hover:text-slate-300 underline transition-colors">Privacy Policy</a>
            </p>
          </div>
          <p className="text-center text-[11px] text-slate-700 mt-4">Paper trading only. No real money involved.</p>
        </div>
      </div>
    </div>
  );
}
