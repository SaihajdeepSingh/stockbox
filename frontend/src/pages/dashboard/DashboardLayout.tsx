import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import StockBoxLogo from '@/components/StockBoxLogo';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f0f2f8] flex">

      {/* Desktop sidebar — sticky full height */}
      <div className="hidden lg:flex lg:shrink-0 h-screen sticky top-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex h-full w-64 shrink-0 animate-fade-in">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Mobile topbar */}
        <header className="lg:hidden sticky top-0 z-40 bg-[#060d3a] border-b border-white/8 px-4 h-14 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <StockBoxLogo size={28} />
            <span className="font-black text-white text-base">Stock<span className="text-blue-400">Box</span></span>
          </Link>
        </header>

        {/* Page */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
