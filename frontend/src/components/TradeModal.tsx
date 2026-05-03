// src/components/TradeModal.tsx — Buy / Sell order modal
import { useState } from 'react';
import { X, TrendingUp, TrendingDown, AlertCircle, IndianRupee } from 'lucide-react';
import { formatINR } from '@/lib/api';
import api, { getErrorMessage } from '@/lib/api';
import toast from 'react-hot-toast';
import type { StockListItem } from '@/types';

interface TradeModalProps {
  stock:       StockListItem;
  cashBalance: number;
  holding?:    { quantity: number; avgBuyPrice: number } | null;
  onClose:     () => void;
  onSuccess:   () => void;
}

export default function TradeModal({
  stock, cashBalance, holding, onClose, onSuccess,
}: TradeModalProps) {
  const [type,     setType]     = useState<'BUY' | 'SELL'>('BUY');
  const [quantity, setQuantity] = useState(1);
  const [loading,  setLoading]  = useState(false);

  const price    = stock.price || 0;
  const total    = parseFloat((price * quantity).toFixed(2));
  const canBuy   = cashBalance >= total && quantity > 0;
  const canSell  = !!holding && holding.quantity >= quantity && quantity > 0;
  const canTrade = type === 'BUY' ? canBuy : canSell;

  const handleTrade = async () => {
    if (!canTrade) return;
    setLoading(true);
    try {
      const res = await api.post('/portfolio/trade', {
        symbol:      stock.symbol,
        type,
        quantity,
        companyName: stock.name,
        exchange:    'NSE',
      });
      toast.success(res.data.message || `${type} order executed!`);
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-lg text-slate-900">{stock.name}</h2>
            <p className="text-sm text-slate-500">{stock.symbol} · NSE</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Current price */}
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-slate-500">Market Price</span>
            <div className="text-right">
              <span className="text-2xl font-bold text-slate-900">{formatINR(price)}</span>
              {stock.changePct !== undefined && (
                <span className={`ml-2 text-sm font-medium ${stock.changePct >= 0 ? 'text-bull' : 'text-bear'}`}>
                  {stock.changePct >= 0 ? '+' : ''}{stock.changePct.toFixed(2)}%
                </span>
              )}
            </div>
          </div>

          {/* Buy/Sell toggle */}
          <div className="flex rounded-xl overflow-hidden border border-slate-200">
            <button
              onClick={() => setType('BUY')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 font-semibold text-sm transition-all ${
                type === 'BUY'
                  ? 'bg-bull text-white shadow-inner'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <TrendingUp className="w-4 h-4" /> BUY
            </button>
            <button
              onClick={() => setType('SELL')}
              disabled={!holding}
              className={`flex-1 flex items-center justify-center gap-2 py-3 font-semibold text-sm transition-all disabled:opacity-40 ${
                type === 'SELL'
                  ? 'bg-bear text-white shadow-inner'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <TrendingDown className="w-4 h-4" /> SELL
            </button>
          </div>

          {/* Quantity */}
          <div>
            <label className="label">Quantity (shares)</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-10 h-10 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-lg flex items-center justify-center"
              >
                −
              </button>
              <input
                type="number"
                value={quantity}
                min={1}
                max={type === 'SELL' ? holding?.quantity || 1 : undefined}
                onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="input text-center flex-1 font-semibold text-lg"
              />
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="w-10 h-10 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-lg flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>

          {/* Order summary */}
          <div className="bg-slate-50 rounded-xl p-4 space-y-2.5">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Price per share</span>
              <span className="font-medium">{formatINR(price)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Quantity</span>
              <span className="font-medium">{quantity} shares</span>
            </div>
            <div className="border-t border-slate-200 pt-2.5 flex justify-between">
              <span className="font-semibold text-slate-700">
                {type === 'BUY' ? 'Total Cost' : 'Total Proceeds'}
              </span>
              <span className="font-bold text-slate-900 text-base">{formatINR(total)}</span>
            </div>
          </div>

          {/* Balance info */}
          <div className="flex items-center justify-between text-sm text-slate-500">
            <div className="flex items-center gap-1">
              <IndianRupee className="w-3.5 h-3.5" />
              <span>Available: <strong className="text-slate-700">{formatINR(cashBalance)}</strong></span>
            </div>
            {holding && (
              <span>Holding: <strong className="text-slate-700">{holding.quantity} shares</strong></span>
            )}
          </div>

          {/* Warning */}
          {!canTrade && quantity > 0 && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>
                {type === 'BUY'
                  ? `Insufficient balance. You need ${formatINR(total)} but have ${formatINR(cashBalance)}.`
                  : `Insufficient shares. You own ${holding?.quantity || 0} but want to sell ${quantity}.`}
              </span>
            </div>
          )}

          {/* Execute button */}
          <button
            onClick={handleTrade}
            disabled={!canTrade || loading}
            className={`w-full py-3.5 rounded-xl font-bold text-white transition-all text-base
              disabled:opacity-50 disabled:cursor-not-allowed
              ${type === 'BUY'
                ? 'bg-bull hover:bg-green-600 active:bg-green-700'
                : 'bg-bear hover:bg-red-600 active:bg-red-700'
              }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Executing…
              </span>
            ) : (
              `${type === 'BUY' ? 'Buy' : 'Sell'} ${quantity} share${quantity !== 1 ? 's' : ''} for ${formatINR(total)}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
