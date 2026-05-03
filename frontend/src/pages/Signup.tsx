import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, ArrowLeft, UserPlus, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getErrorMessage } from '@/lib/api';
import StockBoxLogo from '@/components/StockBoxLogo';
import toast from 'react-hot-toast';

const STEPS = [
  { n: '01', label: 'Create account',            done: true  },
  { n: '02', label: 'Get Rs.10L virtual balance', done: false },
  { n: '03', label: 'Start trading NSE stocks',   done: false },
];

export default function Signup() {
  const { register } = useAuth();
  const navigate     = useNavigate();
  const [form, setForm] = useState({ name:'', email:'', password:'', confirmPassword:'', phone:'' });
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [loading,  setLoading]  = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const strength = (() => {
    const p = form.password;
    if (!p) return null;
    let s = 0;
    if (p.length >= 6)           s++;
    if (p.length >= 10)          s++;
    if (/[A-Z]/.test(p))        s++;
    if (/\d/.test(p))           s++;
    if (/[^A-Za-z\d]/.test(p)) s++;
    if (s <= 1) return { label:'Weak',   w:'w-1/4', color:'bg-red-500'    };
    if (s <= 2) return { label:'Fair',   w:'w-2/4', color:'bg-amber-400'  };
    if (s <= 3) return { label:'Good',   w:'w-3/4', color:'bg-blue-500'   };
    return             { label:'Strong', w:'w-full', color:'bg-emerald-500' };
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match.'); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone || undefined);
      toast.success('Account created! Welcome to StockBox.');
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
      <div className="hidden lg:flex lg:w-[45%] flex-col p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-cyan-400/8 rounded-full blur-3xl pointer-events-none" />

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

        <div className="relative space-y-10 flex-1">
          <div>
            <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">Get started free</p>
            <h1 className="text-5xl font-black text-white leading-tight mb-5">
              Trade smarter.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Risk nothing.</span>
            </h1>
            <p className="text-blue-100/60 text-base leading-relaxed max-w-md">
              Join thousands of students and finance professionals who practise on StockBox before committing real capital.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">What happens next</p>
            {STEPS.map(({ n, label, done }) => (
              <div key={n} className="flex items-center gap-4">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black shrink-0 ${done ? 'bg-blue-600 text-white' : 'bg-white/5 border border-white/10 text-slate-500'}`}>
                  {done ? <CheckCircle2 className="w-4 h-4" /> : n}
                </div>
                <span className={`text-sm font-medium ${done ? 'text-white' : 'text-slate-500'}`}>{label}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {['No credit card','No KYC','No real money','Instant access'].map(t => (
              <span key={t} className="text-xs font-semibold text-slate-400 bg-white/5 border border-white/8 rounded-full px-3 py-1">{t}</span>
            ))}
          </div>
        </div>

        <p className="relative text-slate-600 text-xs mt-8">© {new Date().getFullYear()} StockBox. Paper trading only.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-10 relative overflow-y-auto">
        <div className="absolute inset-0 bg-slate-950/70 lg:bg-slate-950/85" />

        {/* Mobile header */}
        <div className="relative w-full max-w-md flex items-center justify-between mb-8 lg:hidden">
          <Link to="/" className="flex items-center gap-2">
            <StockBoxLogo size={34} />
            <span className="text-xl font-black text-white">Stock<span className="text-blue-400">Box</span></span>
          </Link>
          <Link to="/" className="flex items-center gap-1 text-blue-300/70 hover:text-white text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
        </div>

        <div className="relative w-full max-w-md">
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
            <div className="mb-7">
              <h2 className="text-2xl font-black text-white mb-1">Create your account</h2>
              <p className="text-slate-400 text-sm">
                Already have one?{' '}
                <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">Sign in</Link>
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Full Name *</label>
                <input name="name" value={form.name} onChange={handleChange} required autoComplete="name"
                  placeholder="Your name"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:bg-white/8 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email *</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:bg-white/8 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Phone <span className="text-slate-600 normal-case font-normal">(optional)</span></label>
                <input name="phone" value={form.phone} onChange={handleChange} maxLength={10}
                  placeholder="0123456789"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:bg-white/8 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Password *</label>
                <div className="relative">
                  <input name="password" type={showPass ? 'text' : 'password'}
                    value={form.password} onChange={handleChange} required minLength={6}
                    autoComplete="new-password" placeholder="Min 6 characters"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pr-11 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:bg-white/8 transition-all" />
                  <button type="button" onClick={() => setShowPass(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {strength && (
                  <div className="mt-1.5">
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.w}`} />
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{strength.label}</p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Confirm Password *</label>
                <div className="relative">
                  <input name="confirmPassword" type={showConf ? 'text' : 'password'}
                    value={form.confirmPassword} onChange={handleChange} required
                    autoComplete="new-password" placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pr-11 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:bg-white/8 transition-all" />
                  <button type="button" onClick={() => setShowConf(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                    {showConf ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {form.confirmPassword && (
                  <p className={`text-xs mt-1 font-medium ${form.password === form.confirmPassword ? 'text-emerald-400' : 'text-red-400'}`}>
                    {form.password === form.confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                  </p>
                )}
              </div>
              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-xl py-3.5 text-sm transition-all shadow-lg shadow-blue-900/40 hover:-translate-y-px mt-1">
                {loading
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account...</>
                  : <><UserPlus className="w-4 h-4" /> Create Free Account</>
                }
              </button>
            </form>
            <p className="text-center text-xs text-slate-600 mt-5">
              By creating an account you agree to our{' '}
              <a href="#" className="text-slate-500 hover:text-slate-300 underline">Terms</a> and{' '}
              <a href="#" className="text-slate-500 hover:text-slate-300 underline">Privacy Policy</a>.
              Paper trading only. No real money.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
