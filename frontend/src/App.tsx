// src/App.tsx — Root routing
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

// Marketing pages
import Home     from '@/pages/Home';
import About    from '@/pages/About';
import Products from '@/pages/Products';
import Pricing  from '@/pages/Pricing';
import Support  from '@/pages/Support';
import Login    from '@/pages/Login';
import Signup   from '@/pages/Signup';

// Dashboard pages
import DashboardLayout from '@/pages/dashboard/DashboardLayout';
import Dashboard  from '@/pages/dashboard/Dashboard';
import Portfolio  from '@/pages/dashboard/Portfolio';
import History    from '@/pages/dashboard/History';
import NewsPage   from '@/pages/dashboard/NewsPage';

// Loading spinner
const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-700 rounded-full animate-spin" />
      <p className="text-slate-500 font-medium">Loading StockBox…</p>
    </div>
  </div>
);

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <Spinner />;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Public-only route (redirect to dashboard if logged in)
const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <Spinner />;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

export default function App() {
  const { isLoading } = useAuth();
  if (isLoading) return <Spinner />;

  return (
    <Routes>
      {/* ── Marketing / Public ── */}
      <Route path="/"        element={<Home />} />
      <Route path="/about"   element={<About />} />
      <Route path="/products"element={<Products />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/support" element={<Support />} />

      {/* ── Auth ── */}
      <Route path="/login"  element={<PublicOnlyRoute><Login  /></PublicOnlyRoute>} />
      <Route path="/signup" element={<PublicOnlyRoute><Signup /></PublicOnlyRoute>} />

      {/* ── Dashboard (protected) ── */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index        element={<Dashboard />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="history"   element={<History />} />
        <Route path="news"      element={<NewsPage />} />
      </Route>

      {/* ── Catch-all ── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
