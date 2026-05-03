import { useState, useEffect } from 'react';
import { History as HistoryIcon, TrendingUp, TrendingDown, ChevronLeft, ChevronRight } from 'lucide-react';
import api, { formatINR } from '@/lib/api';
import toast from 'react-hot-toast';
import type { Trade } from '@/types';

interface HistoryData { trades: Trade[]; pagination: { page: number; limit: number; total: number; pages: number }; }

export default function History() {
  const [data,    setData]    = useState<HistoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [page,    setPage]    = useState(1);
  const [stats,   setStats]   = useState<{ totalTrades: number; buyTrades: number; sellTrades: number; totalPnL: number; winRate: number } | null>(null);

  const load = async (p = 1) => {
    setLoading(true);
    try {
      const [histRes, statsRes] = await Promise.all([
        api.get('/portfolio/history', { params: { page: p, limit: 15 } }),
        api.get('/portfolio/stats'),
      ]);
      setData(histRes.data);
      setStats(statsRes.data.stats);
    } catch { toast.error('Failed to load history'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(page); }, [page]);

  const fmt = (d: string) => new Date(d).toLocaleString('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-xl font-black text-slate-900">Trade History</h1>
        <p className="text-sm text-slate-400 mt-0.5 font-medium">All your buy and sell orders</p>
      </div>

      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: 'Total Trades', value: stats.totalTrades.toString(),         color: ''                   },
            { label: 'Buy Orders',   value: stats.buyTrades.toString(),            color: 'text-emerald-500'   },
            { label: 'Sell Orders',  value: stats.sellTrades.toString(),           color: 'text-red-500'       },
            { label: 'Realised P&L', value: formatINR(stats.totalPnL, true),      color: stats.totalPnL >= 0 ? 'text-emerald-500' : 'text-red-500' },
            { label: 'Win Rate',     value: `${stats.winRate}%`,                  color: stats.winRate >= 50 ? 'text-emerald-500' : 'text-red-500' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white border border-slate-200/80 rounded-2xl p-4 text-center shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
              <p className={`text-xl font-black mt-1 font-mono ${color || 'text-slate-900'}`}>{value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <HistoryIcon className="w-4 h-4 text-blue-600" />
          <h2 className="font-black text-slate-900">Transactions ({data?.pagination.total ?? 0})</h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-[3px] border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : data?.trades?.length ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {['Date & Time','Stock','Type','Qty','Price','Total','P&L','Balance After'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.trades.map((t, i) => (
                    <tr key={t._id} className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${i % 2 === 0 ? '' : 'bg-slate-50/30'}`}>
                      <td className="px-4 py-3 text-[11px] text-slate-400 whitespace-nowrap font-mono">{fmt(t.createdAt)}</td>
                      <td className="px-4 py-3">
                        <p className="font-black text-slate-900 text-sm font-mono">{t.symbol.replace('NSE:','')}</p>
                        <p className="text-[11px] text-slate-400 truncate max-w-[90px]">{t.companyName}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-1 rounded-full ${t.type === 'BUY' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                          {t.type === 'BUY' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {t.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-900 text-sm font-mono">{t.quantity}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 font-mono">{formatINR(t.price)}</td>
                      <td className="px-4 py-3 font-bold text-slate-900 text-sm font-mono">{formatINR(t.total)}</td>
                      <td className={`px-4 py-3 font-black text-sm font-mono ${t.type === 'BUY' ? 'text-slate-300' : (t.profitLoss ?? 0) >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {t.type === 'BUY' ? '—' : `${(t.profitLoss ?? 0) >= 0 ? '+' : ''}${formatINR(t.profitLoss ?? 0)}`}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 font-mono">{formatINR(t.balanceAfter, true)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {data.pagination.pages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
                <p className="text-xs text-slate-400 font-medium">Page {data.pagination.page} of {data.pagination.pages}</p>
                <div className="flex gap-1.5">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all disabled:opacity-30">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button onClick={() => setPage(p => Math.min(data.pagination.pages, p + 1))} disabled={page === data.pagination.pages}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all disabled:opacity-30">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <HistoryIcon className="w-10 h-10 text-slate-200 mb-3" />
            <p className="font-bold text-slate-500">No trades yet</p>
            <p className="text-sm text-slate-400 mt-1">Your executed trades will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}