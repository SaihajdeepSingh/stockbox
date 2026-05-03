import { NavLink, useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, Briefcase, History, Newspaper, LogOut, X, Home } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import StockBoxLogo from '@/components/StockBoxLogo';

const NAV_ITEMS = [
  { to: '/',                    icon: Home,            label: 'Home',        end: true  },
  { to: '/dashboard',           icon: LayoutDashboard, label: 'Trade',       end: true  },
  { to: '/dashboard/portfolio', icon: Briefcase,       label: 'Portfolio',   end: false },
  { to: '/dashboard/history',   icon: History,         label: 'History',     end: false },
  { to: '/dashboard/news',      icon: Newspaper,       label: 'Market News', end: false },
];

interface SidebarProps { onClose?: () => void; }

export default function Sidebar({ onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <aside className="w-64 h-full flex flex-col bg-[#060d3a] border-r border-white/8">

      <div className="px-5 py-5 flex items-center justify-between border-b border-white/8">
        <Link to="/" className="flex items-center gap-2.5 group">
          <StockBoxLogo size={34} className="group-hover:scale-105 transition-transform duration-200" />
          <span className="font-black text-[17px] text-white tracking-tight">
            Stock<span className="text-blue-400">Box</span>
          </span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="p-1.5 text-white/40 hover:text-white rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
          <NavLink key={to} to={to} end={end} onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                  : 'text-slate-400 hover:text-white hover:bg-white/8'
              }`
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-4 space-y-1 border-t border-white/8 pt-3">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0 shadow-md">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="overflow-hidden flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate leading-tight">{user?.name}</p>
            <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>

        <button onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 w-full transition-all">
          <LogOut className="w-4 h-4 shrink-0" />
          Log Out
        </button>
      </div>
    </aside>
  );
}