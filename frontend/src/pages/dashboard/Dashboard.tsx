import { useState, useEffect, useCallback } from 'react';
import { TrendingUp, TrendingDown, Search, RefreshCw, IndianRupee, BarChart2, Activity } from 'lucide-react';
import api, { formatINR, formatPct } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import CandlestickChart from '@/components/CandlestickChart';
import TradeModal from '@/components/TradeModal';
import toast from 'react-hot-toast';
import type { StockListItem, Portfolio } from '@/types';

/* ── Stat Card ── */
function StatCard({ label, value, sub, positive }: { label: string; value: string; sub?: string; positive?: boolean }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{label}</p>
      <p className="text-xl font-black text-slate-900 font-mono">{value}</p>
      {sub !== undefined && (
        <p className={`text-xs font-semibold mt-1 ${
          positive === undefined ? 'text-slate-400' : positive ? 'text-emerald-500' : 'text-red-500'
        }`}>{sub}</p>
      )}
    </div>
  );
}

/* ── Stock Row ── */
function StockRow({ stock, selected, onClick }: { stock: StockListItem; selected: boolean; onClick: () => void }) {
  const up = (stock.changePct ?? 0) >= 0;
  return (
    <button onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all duration-150 ${
        selected
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
          : 'hover:bg-slate-50 text-slate-700'
      }`}>
      <div>
        <p className={`font-bold text-sm font-mono ${selected ? 'text-white' : 'text-slate-900'}`}>
          {stock.symbol.replace('NSE:', '')}
        </p>
        <p className={`text-[11px] truncate max-w-[100px] ${selected ? 'text-blue-200' : 'text-slate-400'}`}>
          {stock.name}
        </p>
      </div>
      <div className="text-right">
        <p className={`text-sm font-bold font-mono ${selected ? 'text-white' : 'text-slate-900'}`}>
          {stock.price ? `₹${stock.price.toFixed(2)}` : '—'}
        </p>
        {stock.changePct !== undefined && (
          <p className={`text-[11px] font-semibold ${selected ? (up ? 'text-green-300' : 'text-red-300') : (up ? 'text-emerald-500' : 'text-red-500')}`}>
            {up ? '+' : ''}{stock.changePct.toFixed(2)}%
          </p>
        )}
      </div>
    </button>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stocks,    setStocks]    = useState<StockListItem[]>([]);
  const [selected,  setSelected]  = useState<StockListItem | null>(null);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [search,    setSearch]    = useState('');
  const [loading,   setLoading]   = useState(true);
  const [tradeOpen, setTradeOpen] = useState(false);
  const [refreshing,setRefreshing]= useState(false);

  const fetchData = useCallback(async (showToast = false) => {
    try {
      const [stocksRes, portRes] = await Promise.all([
        api.get('/stocks/popular'),
        api.get('/portfolio'),
      ]);
      setStocks(stocksRes.data.stocks || []);
      setPortfolio(portRes.data.portfolio);
      if (!selected && stocksRes.data.stocks?.length > 0) setSelected(stocksRes.data.stocks[0]);
      if (showToast) toast.success('Prices refreshed');
    } catch { toast.error('Failed to load market data'); }
    finally { setLoading(false); setRefreshing(false); }
  }, [selected]);

  useEffect(() => { fetchData(); }, []);
  useEffect(() => { const id = setInterval(() => fetchData(), 30000); return () => clearInterval(id); }, [fetchData]);

  const filteredStocks = stocks.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.symbol.toLowerCase().includes(search.toLowerCase())
  );
  const currentHolding = selected ? portfolio?.holdings?.find(h => h.symbol === selected.symbol) : null;
  const netWorthChange = portfolio ? portfolio.netWorth - portfolio.totalDeposited : 0;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-[3px] border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-slate-400 text-sm font-medium">Loading market data...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900">Trading Terminal</h1>
          <p className="text-sm text-slate-400 mt-0.5 font-medium">
            {greeting}, <span className="text-blue-600">{user?.name?.split(' ')[0]}</span>
          </p>
        </div>
        <button onClick={() => { setRefreshing(true); fetchData(true); }} disabled={refreshing}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-slate-200 bg-white shadow-sm">
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Cash Balance"   value={formatINR(portfolio?.cashBalance ?? 0, true)} sub="Available to trade" />
        <StatCard label="Portfolio Value" value={formatINR(portfolio?.totalValue ?? 0, true)} sub={`${portfolio?.holdings?.length ?? 0} stocks`} />
        <StatCard label="Net Worth"      value={formatINR(portfolio?.netWorth ?? 0, true)}
          sub={`${netWorthChange >= 0 ? '+' : ''}${formatINR(netWorthChange, true)} overall`} positive={netWorthChange >= 0} />
        <StatCard label="Total P&L"      value={formatINR(portfolio?.totalPnL ?? 0, true)}
          sub={formatPct(portfolio?.totalPnLPct ?? 0)} positive={(portfolio?.totalPnL ?? 0) >= 0} />
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-[230px_1fr] gap-4">

        {/* Stock list */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-3 flex flex-col gap-2 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-all" />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">NSE Stocks</p>
          <div className="space-y-0.5 flex-1 overflow-y-auto max-h-[400px]">
            {filteredStocks.map(stock => (
              <StockRow key={stock.symbol} stock={stock} selected={selected?.symbol === stock.symbol} onClick={() => setSelected(stock)} />
            ))}
          </div>
        </div>

        {/* Chart + trade */}
        <div className="flex flex-col gap-4">

          {/* Chart card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex-1">
            {selected ? (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-black text-slate-900">{selected.name}</h2>
                      <span className="text-[11px] bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded-lg border border-blue-100">
                        {selected.symbol.replace('NSE:', '')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 font-medium">{selected.sector} · NSE</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-slate-900 font-mono">
                      {selected.price ? `₹${selected.price.toFixed(2)}` : '—'}
                    </p>
                    {selected.changePct !== undefined && (
                      <div className={`flex items-center justify-end gap-1 ${(selected.changePct ?? 0) >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {(selected.changePct ?? 0) >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        <span className="font-bold text-sm">{(selected.changePct ?? 0) >= 0 ? '+' : ''}{(selected.changePct ?? 0).toFixed(2)}%</span>
                      </div>
                    )}
                  </div>
                </div>
                <CandlestickChart symbol={selected.symbol} height={300} />
              </>
            ) : (
              <div className="flex items-center justify-center h-64 text-slate-300">
                <div className="text-center">
                  <BarChart2 className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-slate-400 font-medium">Select a stock</p>
                </div>
              </div>
            )}
          </div>

          {/* Trade + Position row */}
          <div className="grid sm:grid-cols-2 gap-4">

            {/* Quick Trade */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between gap-4">
              <div>
                <h3 className="font-black text-slate-900 mb-1">Quick Trade</h3>
                <p className="text-sm text-slate-400 font-medium">
                  {selected ? `${selected.symbol.replace('NSE:', '')} · ${selected.price ? `₹${selected.price.toFixed(2)}` : 'unavailable'}` : 'Select a stock first'}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setTradeOpen(true)} disabled={!selected || !selected.price}
                  className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-black text-sm transition-all shadow-md shadow-emerald-900/20 disabled:opacity-40">
                  BUY
                </button>
                <button onClick={() => setTradeOpen(true)} disabled={!selected || !selected.price || !currentHolding}
                  className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-black text-sm transition-all shadow-md shadow-red-900/20 disabled:opacity-40">
                  SELL
                </button>
              </div>
            </div>

            {/* Position */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
              <h3 className="font-black text-slate-900 mb-3">Your Position</h3>
              {currentHolding ? (
                <div className="space-y-2 text-sm">
                  {[
                    { label: 'Shares held',    val: currentHolding.quantity.toString() },
                    { label: 'Avg buy price',  val: formatINR(currentHolding.avgBuyPrice) },
                    { label: 'Total invested', val: formatINR(currentHolding.totalInvested) },
                  ].map(({ label, val }) => (
                    <div key={label} className="flex justify-between">
                      <span className="text-slate-400 font-medium">{label}</span>
                      <span className="font-bold text-slate-900 font-mono">{val}</span>
                    </div>
                  ))}
                  <div className="flex justify-between border-t border-slate-100 pt-2">
                    <span className="text-slate-400 font-medium">Unrealised P&L</span>
                    <span className={`font-black font-mono ${(portfolio?.holdings?.find(h => h.symbol === selected?.symbol)?.profitLoss ?? 0) >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                      {formatINR(portfolio?.holdings?.find(h => h.symbol === selected?.symbol)?.profitLoss ?? 0)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-24 text-slate-300">
                  <Activity className="w-6 h-6 mb-1 opacity-30" />
                  <p className="text-sm text-slate-400">No position in {selected?.symbol.replace('NSE:', '') ?? '—'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {tradeOpen && selected && (
        <TradeModal stock={selected} cashBalance={portfolio?.cashBalance ?? 0}
          holding={currentHolding ? { quantity: currentHolding.quantity, avgBuyPrice: currentHolding.avgBuyPrice } : null}
          onClose={() => setTradeOpen(false)} onSuccess={() => fetchData()} />
      )}
    </div>
  );
}
