import { useState, useEffect } from 'react';
import {
  RefreshCw, Briefcase, TrendingUp, TrendingDown, RotateCcw,
  AlertTriangle, X, ArrowUp, ArrowDown, Info, IndianRupee,
} from 'lucide-react';
import api, { formatINR, formatPct } from '@/lib/api';
import toast from 'react-hot-toast';
import type { Portfolio as PortfolioType, Holding } from '@/types';

/* ══ Confirm Reset Modal ══════════════════════════════════════ */
function ConfirmModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-slide-up">
        <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6 text-red-500" />
        </div>
        <h3 className="text-lg font-black text-slate-900 text-center mb-2">Reset Portfolio?</h3>
        <p className="text-sm text-slate-500 text-center leading-relaxed mb-6">
          Your balance resets to <strong className="text-slate-800">₹10,00,000</strong>.
          All holdings and trade history will be permanently deleted.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 py-2.5 border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all text-sm">
            Cancel
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all text-sm shadow-lg shadow-red-100">
            Yes, Reset
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══ Stock Info Modal (click stock name) ══════════════════════ */
function StockInfoModal({ holding, cashBalance, onClose, onTradeSuccess }: {
  holding: Holding;
  cashBalance: number;
  onClose: () => void;
  onTradeSuccess: () => void;
}) {
  const [activeTab, setActiveTab] = useState<'info' | 'buy' | 'sell'>('info');
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);

  const total = parseFloat((holding.currentPrice * qty).toFixed(2));
  const canBuy  = cashBalance >= total && qty > 0;
  const canSell = holding.quantity >= qty && qty > 0;

  const executeTrade = async (type: 'BUY' | 'SELL') => {
    setLoading(true);
    try {
      const res = await api.post('/portfolio/trade', {
        symbol: holding.symbol, type, quantity: qty,
        companyName: holding.companyName, exchange: 'NSE',
      });
      toast.success(res.data.message || `${type} order executed!`);
      onTradeSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Trade failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-up">

        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-slate-100">
          <div>
            <h2 className="font-black text-slate-900 text-lg">{holding.companyName}</h2>
            <p className="text-sm text-slate-400 font-mono font-medium">{holding.symbol.replace('NSE:','')} · NSE</p>
          </div>
          <button onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100">
          {(['info', 'buy', 'sell'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-sm font-bold capitalize transition-all ${
                activeTab === tab
                  ? tab === 'sell' ? 'text-red-500 border-b-2 border-red-500' : tab === 'buy' ? 'text-emerald-600 border-b-2 border-emerald-500' : 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-400 hover:text-slate-600'
              }`}>
              {tab === 'info' ? 'Position Info' : tab === 'buy' ? 'Buy More' : 'Sell'}
            </button>
          ))}
        </div>

        <div className="p-5">
          {/* Info tab */}
          {activeTab === 'info' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Current Price',   val: formatINR(holding.currentPrice),   color: '' },
                  { label: 'Shares Held',     val: holding.quantity.toString(),        color: '' },
                  { label: 'Avg Buy Price',   val: formatINR(holding.avgBuyPrice),    color: '' },
                  { label: 'Total Invested',  val: formatINR(holding.totalInvested),  color: '' },
                  { label: 'Current Value',   val: formatINR(holding.currentValue),   color: '' },
                  { label: 'Unrealised P&L',  val: `${holding.profitLoss >= 0 ? '+' : ''}${formatINR(holding.profitLoss)}`,
                    color: holding.profitLoss >= 0 ? 'text-emerald-600' : 'text-red-500' },
                ].map(({ label, val, color }) => (
                  <div key={label} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">{label}</p>
                    <p className={`font-black text-sm font-mono ${color || 'text-slate-900'}`}>{val}</p>
                  </div>
                ))}
              </div>

              {/* P&L bar */}
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">
                  <span>Return</span>
                  <span className={holding.profitPct >= 0 ? 'text-emerald-600' : 'text-red-500'}>
                    {formatPct(holding.profitPct)}
                  </span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${holding.profitPct >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.min(Math.abs(holding.profitPct) * 2, 100)}%` }}
                  />
                </div>
              </div>

              {/* Quick action buttons */}
              <div className="flex gap-2 pt-1">
                <button onClick={() => setActiveTab('buy')}
                  className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm rounded-xl transition-all shadow-md shadow-emerald-100">
                  Buy More
                </button>
                <button onClick={() => setActiveTab('sell')}
                  className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-black text-sm rounded-xl transition-all shadow-md shadow-red-100">
                  Sell
                </button>
              </div>
            </div>
          )}

          {/* Buy / Sell tab */}
          {(activeTab === 'buy' || activeTab === 'sell') && (
            <div className="space-y-4">
              {/* Price */}
              <div className="flex justify-between items-center bg-slate-50 rounded-xl p-3 border border-slate-100">
                <span className="text-sm text-slate-500 font-medium">Market Price</span>
                <span className="font-black text-slate-900 font-mono">{formatINR(holding.currentPrice)}</span>
              </div>

              {/* Qty selector */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Quantity</label>
                <div className="flex items-center gap-2">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-10 h-10 rounded-xl border-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-black text-lg flex items-center justify-center transition-all">
                    −
                  </button>
                  <input type="number" value={qty} min={1}
                    max={activeTab === 'sell' ? holding.quantity : undefined}
                    onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                    className="flex-1 text-center border-2 border-slate-200 rounded-xl py-2.5 text-slate-900 font-black font-mono focus:outline-none focus:border-blue-400 transition-all" />
                  <button onClick={() => setQty(q => q + 1)}
                    className="w-10 h-10 rounded-xl border-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-black text-lg flex items-center justify-center transition-all">
                    +
                  </button>
                </div>
                {activeTab === 'sell' && (
                  <p className="text-xs text-slate-400 mt-1.5 font-medium">You own {holding.quantity} shares</p>
                )}
              </div>

              {/* Summary */}
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Price per share</span>
                  <span className="font-bold font-mono">{formatINR(holding.currentPrice)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1.5">
                  <span className="font-bold text-slate-700">{activeTab === 'buy' ? 'Total Cost' : 'Total Proceeds'}</span>
                  <span className="font-black font-mono text-slate-900">{formatINR(total)}</span>
                </div>
              </div>

              {/* Available */}
              {activeTab === 'buy' && (
                <p className="text-xs text-slate-400 font-medium">
                  Available: <strong className="text-slate-700 font-mono">{formatINR(cashBalance)}</strong>
                </p>
              )}

              {/* Execute */}
              <button
                onClick={() => executeTrade(activeTab === 'buy' ? 'BUY' : 'SELL')}
                disabled={loading || (activeTab === 'buy' ? !canBuy : !canSell)}
                className={`w-full py-3.5 rounded-xl font-black text-white text-sm transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                  activeTab === 'buy'
                    ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-100'
                    : 'bg-red-500 hover:bg-red-600 shadow-red-100'
                }`}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Executing...
                  </span>
                ) : (
                  `${activeTab === 'buy' ? 'Buy' : 'Sell'} ${qty} share${qty !== 1 ? 's' : ''} for ${formatINR(total)}`
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══ Stat Card ════════════════════════════════════════════════ */
function StatCard({ label, value, sub, positive }: { label: string; value: string; sub?: string; positive?: boolean }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{label}</p>
      <p className="text-xl font-black text-slate-900 font-mono">{value}</p>
      {sub && (
        <p className={`text-xs font-semibold mt-1 ${
          positive === undefined ? 'text-slate-400' : positive ? 'text-emerald-500' : 'text-red-500'
        }`}>{sub}</p>
      )}
    </div>
  );
}

const BAR_COLORS = ['bg-blue-600','bg-purple-500','bg-emerald-500','bg-amber-500','bg-rose-500','bg-cyan-500','bg-indigo-500','bg-orange-500'];

/* ══ Main Portfolio Component ════════════════════════════════ */
export default function Portfolio() {
  const [portfolio,    setPortfolio]    = useState<PortfolioType | null>(null);
  const [loading,      setLoading]      = useState(true);
  const [resetting,    setResetting]    = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);
  const [selectedHolding, setSelectedHolding] = useState<Holding | null>(null);
  const [tradeType,    setTradeType]    = useState<'info' | 'buy' | 'sell'>('info');

  const load = async () => {
    try {
      const res = await api.get('/portfolio');
      setPortfolio(res.data.portfolio);
    } catch { toast.error('Failed to load portfolio'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleReset = async () => {
    setShowConfirm(false);
    setResetting(true);
    try {
      await api.post('/portfolio/reset');
      toast.success('Portfolio reset to ₹10,00,000!');
      await load();
    } catch { toast.error('Reset failed. Try again.'); }
    finally { setResetting(false); }
  };

  const openHolding = (h: Holding, tab: 'info' | 'buy' | 'sell') => {
    setSelectedHolding(h);
    setTradeType(tab);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-[3px] border-blue-200 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );

  const pnlPos    = (portfolio?.totalPnL ?? 0) >= 0;
  const netChange = (portfolio?.netWorth ?? 0) - (portfolio?.totalDeposited ?? 0);

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Modals */}
      {showConfirm && <ConfirmModal onConfirm={handleReset} onCancel={() => setShowConfirm(false)} />}
      {selectedHolding && (
        <StockInfoModal
          holding={selectedHolding}
          cashBalance={portfolio?.cashBalance ?? 0}
          onClose={() => setSelectedHolding(null)}
          onTradeSuccess={load}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900">Portfolio</h1>
          <p className="text-sm text-slate-400 mt-0.5 font-medium">Your holdings and performance</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-slate-200 bg-white shadow-sm">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
          <button onClick={() => setShowConfirm(true)} disabled={resetting}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-xl transition-all border border-red-100 bg-white shadow-sm disabled:opacity-50">
            <RotateCcw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
            Reset
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Cash Balance"   value={formatINR(portfolio?.cashBalance ?? 0, true)} />
        <StatCard label="Invested Value" value={formatINR(portfolio?.totalInvested ?? 0, true)} />
        <StatCard label="Current Value"  value={formatINR(portfolio?.totalValue ?? 0, true)}
          sub={formatPct(portfolio?.totalPnLPct ?? 0)} positive={pnlPos} />
        <StatCard label="Net Worth"      value={formatINR(portfolio?.netWorth ?? 0, true)}
          sub={`${netChange >= 0 ? '+' : ''}${formatINR(netChange, true)} overall`} positive={netChange >= 0} />
      </div>

      {/* Holdings table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-600" />
            <h2 className="font-black text-slate-900">Holdings ({portfolio?.holdings?.length ?? 0})</h2>
          </div>
          {(portfolio?.totalPnL ?? 0) !== 0 && (
            <div className={`flex items-center gap-1.5 text-sm font-bold ${pnlPos ? 'text-emerald-500' : 'text-red-500'}`}>
              {pnlPos ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              Unrealised P&L: {formatINR(portfolio?.totalPnL ?? 0)}
            </div>
          )}
        </div>

        {portfolio?.holdings?.length ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Stock','Qty','Avg Buy','Current','Invested','Value','P&L','P&L %','Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {portfolio.holdings.map((h, i) => (
                  <tr key={h.symbol} className={`border-b border-slate-50 transition-colors ${i % 2 === 0 ? 'hover:bg-slate-50' : 'bg-slate-50/30 hover:bg-slate-50'}`}>

                    {/* Stock — clickable info */}
                    <td className="px-4 py-3">
                      <button onClick={() => openHolding(h, 'info')}
                        className="text-left group flex items-center gap-1.5">
                        <div>
                          <p className="font-black text-slate-900 text-sm font-mono group-hover:text-blue-600 transition-colors flex items-center gap-1">
                            {h.symbol.replace('NSE:','')}
                            <Info className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />
                          </p>
                          <p className="text-[11px] text-slate-400 truncate max-w-[100px]">{h.companyName}</p>
                        </div>
                      </button>
                    </td>

                    <td className="px-4 py-3 font-bold text-slate-900 text-sm font-mono">{h.quantity}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 font-mono">{formatINR(h.avgBuyPrice)}</td>
                    <td className="px-4 py-3 font-bold text-slate-900 text-sm font-mono">{formatINR(h.currentPrice)}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 font-mono">{formatINR(h.totalInvested)}</td>
                    <td className="px-4 py-3 font-bold text-slate-900 text-sm font-mono">{formatINR(h.currentValue)}</td>
                    <td className={`px-4 py-3 font-black text-sm font-mono ${h.profitLoss >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                      {h.profitLoss >= 0 ? '+' : ''}{formatINR(h.profitLoss)}
                    </td>
                    <td className={`px-4 py-3 font-black text-sm ${h.profitPct >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                      {formatPct(h.profitPct)}
                    </td>

                    {/* Buy / Sell action buttons */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openHolding(h, 'buy')}
                          title="Buy more"
                          className="w-7 h-7 flex items-center justify-center bg-emerald-50 hover:bg-emerald-500 border border-emerald-200 hover:border-emerald-500 text-emerald-600 hover:text-white rounded-lg transition-all group/btn">
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openHolding(h, 'sell')}
                          title="Sell"
                          className="w-7 h-7 flex items-center justify-center bg-red-50 hover:bg-red-500 border border-red-200 hover:border-red-500 text-red-500 hover:text-white rounded-lg transition-all group/btn">
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <Briefcase className="w-10 h-10 text-slate-200 mb-3" />
            <p className="font-bold text-slate-500">No holdings yet</p>
            <p className="text-sm text-slate-400 mt-1">Go to the trading terminal and buy your first stock.</p>
          </div>
        )}
      </div>

      {/* Allocation */}
      {(portfolio?.holdings?.length ?? 0) > 0 && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
          <h3 className="font-black text-slate-900 mb-5">Portfolio Allocation</h3>
          <div className="space-y-3.5">
            {portfolio!.holdings.map((h, i) => {
              const pct = portfolio!.totalInvested > 0 ? (h.totalInvested / portfolio!.totalInvested) * 100 : 0;
              return (
                <div key={h.symbol}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-bold text-slate-800 font-mono">{h.symbol.replace('NSE:','')}</span>
                    <span className="text-slate-400 font-medium">{pct.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-700 ${BAR_COLORS[i % BAR_COLORS.length]}`}
                      style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
