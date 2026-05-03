import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogIn, LayoutDashboard, Home } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import StockBoxLogo from '@/components/StockBoxLogo';

const NAV_LINKS = [
  { to: '/',         label: 'Home',     icon: Home },
  { to: '/about',    label: 'About',    icon: null },
  { to: '/products', label: 'Products', icon: null },
  { to: '/pricing',  label: 'Pricing',  icon: null },
  { to: '/support',  label: 'Support',  icon: null },
];

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [open,     setOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const darkPages = ['/', '/about', '/products', '/pricing', '/support', '/login', '/signup'];
  const onDarkPage = darkPages.includes(location.pathname);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);
  const handleLogout = () => { logout(); navigate('/'); };

  const navBg = onDarkPage
    ? scrolled
      ? 'bg-[#060d3a]/96 backdrop-blur-md shadow-xl shadow-black/30 border-b border-white/8'
      : 'bg-[#060d3a]/30 backdrop-blur-sm border-b border-white/10'
    : 'bg-white/95 backdrop-blur-sm border-b border-slate-200/80 shadow-sm';

  const isDark = onDarkPage;

  const linkBase   = isDark
    ? 'text-blue-100/85 hover:text-white hover:bg-white/10 font-medium'
    : 'text-slate-900 hover:text-blue-700 hover:bg-blue-50 font-bold';

  const linkActive = isDark
    ? 'text-white bg-white/15 font-semibold'
    : 'text-blue-700 bg-blue-50 font-bold';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${navBg}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between">

        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
          <StockBoxLogo size={38} className="group-hover:scale-105 transition-transform duration-200" />
          <span className={`font-black text-[20px] tracking-tight leading-none transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Stock<span className={isDark ? 'text-blue-400' : 'text-blue-600'}>Box</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-0.5">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink key={to} to={to} end={to === '/'}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-[14px] transition-all duration-150 ${isActive ? linkActive : linkBase}`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2.5">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard"
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
                  isDark ? 'border-white/15 text-white hover:bg-white/10' : 'border-blue-300 text-blue-700 hover:bg-blue-50'
                }`}>
                <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
              </Link>
              <div className="flex items-center gap-2 pl-1">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-black shadow-sm">
                  {user?.name?.charAt(0).toUpperCase() ?? 'U'}
                </div>
                <button onClick={handleLogout}
                  className={`text-sm font-medium transition-colors ${isDark ? 'text-blue-200/80 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>
                  Log out
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login"
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[14px] font-semibold transition-all ${
                  isDark ? 'text-blue-100/85 hover:text-white hover:bg-white/10' : 'text-slate-900 hover:text-blue-700 hover:bg-blue-50 font-bold'
                }`}>
                <LogIn className="w-3.5 h-3.5" /> Sign In
              </Link>
              <Link to="/signup"
                className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[14px] font-bold rounded-xl px-5 py-2.5 transition-all shadow-lg shadow-blue-900/30 hover:-translate-y-px">
                Get Started Free
              </Link>
            </>
          )}
        </div>

        <button
          className={`md:hidden p-2 rounded-lg transition-colors ${isDark ? 'text-white hover:bg-white/10' : 'text-slate-700 hover:bg-slate-100'}`}
          onClick={() => setOpen(v => !v)} aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-[#060d3a]/98 border-t border-white/10 shadow-2xl backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink key={to} to={to} end={to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${isActive ? 'text-white bg-white/15' : 'text-blue-100/80 hover:text-white hover:bg-white/10'}`
                }
              >
                {label}
              </NavLink>
            ))}
            <div className="border-t border-white/10 mt-2 pt-3 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="flex items-center justify-center gap-2 bg-blue-600 text-white font-bold rounded-xl py-2.5 text-sm hover:bg-blue-500 transition-colors">
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Link>
                  <button onClick={handleLogout} className="text-sm font-medium text-blue-200 hover:text-white py-2 transition-colors">Log out</button>
                </>
              ) : (
                <>
                  <Link to="/login"  className="text-center py-2.5 text-sm font-semibold text-blue-100 border border-white/15 rounded-xl hover:bg-white/10 transition-colors">Sign In</Link>
                  <Link to="/signup" className="text-center py-2.5 text-sm font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors">Get Started Free</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}