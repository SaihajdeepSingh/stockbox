// src/components/CandlestickChart.tsx — TradingView Lightweight Charts
import { useEffect, useRef, useState } from 'react';
import {
  createChart, ColorType, CrosshairMode,
  type IChartApi, type ISeriesApi,
} from 'lightweight-charts';
import api from '@/lib/api';
import { formatINR } from '@/lib/api';

interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface CandlestickChartProps {
  symbol: string;
  height?: number;
}

const RESOLUTIONS = [
  { label: '1W', value: 'D', days: 7   },
  { label: '1M', value: 'D', days: 30  },
  { label: '3M', value: 'D', days: 90  },
  { label: '6M', value: 'D', days: 180 },
  { label: '1Y', value: 'D', days: 365 },
];

export default function CandlestickChart({ symbol, height = 400 }: CandlestickChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef     = useRef<IChartApi | null>(null);
  const seriesRef    = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const [resolution, setResolution] = useState(RESOLUTIONS[2]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [lastCandle, setLastCandle] = useState<CandleData | null>(null);

  // Create chart once
  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      width:  containerRef.current.clientWidth,
      height,
      layout: {
        background:   { type: ColorType.Solid, color: '#ffffff' },
        textColor:    '#475569',
        fontFamily:   "'Inter', sans-serif",
        fontSize:     12,
      },
      grid: {
        vertLines:   { color: '#f1f5f9', style: 1 },
        horzLines:   { color: '#f1f5f9', style: 1 },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { color: '#3b82f6', labelBackgroundColor: '#1d4ed8' },
        horzLine: { color: '#3b82f6', labelBackgroundColor: '#1d4ed8' },
      },
      rightPriceScale: {
        borderColor: '#e2e8f0',
        scaleMargins: { top: 0.1, bottom: 0.1 },
      },
      timeScale: {
        borderColor: '#e2e8f0',
        timeVisible: false,
        secondsVisible: false,
      },
    });

    const series = chart.addCandlestickSeries({
      upColor:          '#10b981',
      downColor:        '#ef4444',
      borderUpColor:    '#10b981',
      borderDownColor:  '#ef4444',
      wickUpColor:      '#10b981',
      wickDownColor:    '#ef4444',
    });

    chartRef.current  = chart;
    seriesRef.current = series;

    chart.subscribeCrosshairMove((param) => {
      if (param.seriesData && seriesRef.current) {
        const data = param.seriesData.get(seriesRef.current) as CandleData;
        if (data) setLastCandle(data);
      }
    });

    const ro = new ResizeObserver(entries => {
      const { width } = entries[0].contentRect;
      chart.resize(width, height);
    });
    ro.observe(containerRef.current);

    return () => {
      ro.disconnect();
      chart.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height]);

  // Fetch candles when symbol or resolution changes
  useEffect(() => {
    if (!symbol || !seriesRef.current) return;

    const fetchCandles = async () => {
      setLoading(true);
      setError('');
      try {
        const to   = Math.floor(Date.now() / 1000);
        const from = to - resolution.days * 24 * 60 * 60;

        const res = await api.get(`/stocks/candles/${symbol}`, {
          params: { resolution: resolution.value, from, to },
        });

        const rawCandles: CandleData[] = res.data.candles || [];
        if (rawCandles.length === 0) {
          setError('No data available for this period.');
          return;
        }

        const formatted = rawCandles.map((c) => ({
          time:  c.time as unknown as import('lightweight-charts').Time,
          open:  c.open,
          high:  c.high,
          low:   c.low,
          close: c.close,
        }));

        seriesRef.current?.setData(formatted);
        chartRef.current?.timeScale().fitContent();
        setLastCandle(rawCandles[rawCandles.length - 1]);
      } catch (err) {
        setError('No data available for this period.');
      } finally {
        setLoading(false);
      }
    };

    fetchCandles();
  }, [symbol, resolution]);

  const change     = lastCandle ? lastCandle.close - lastCandle.open : 0;
  const changePct  = lastCandle && lastCandle.open ? (change / lastCandle.open) * 100 : 0;
  const isPositive = change >= 0;

  return (
    <div className="flex flex-col h-full">
      {/* OHLC info bar */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 px-1 mb-3 text-sm">
        {lastCandle ? (
          <>
            <span className={`font-bold text-base ${isPositive ? 'text-bull' : 'text-bear'}`}>
              {formatINR(lastCandle.close)}
            </span>
            <span className={`font-medium ${isPositive ? 'text-bull' : 'text-bear'}`}>
              {isPositive ? '+' : ''}{change.toFixed(2)} ({isPositive ? '+' : ''}{changePct.toFixed(2)}%)
            </span>
            <span className="text-slate-500">O: {formatINR(lastCandle.open)}</span>
            <span className="text-slate-500">H: {formatINR(lastCandle.high)}</span>
            <span className="text-slate-500">L: {formatINR(lastCandle.low)}</span>
          </>
        ) : (
          <span className="text-slate-400 text-xs">Hover over chart for OHLC data</span>
        )}
      </div>

      {/* Resolution selector */}
      <div className="flex gap-1 mb-3">
        {RESOLUTIONS.map(r => (
          <button
            key={r.label}
            onClick={() => setResolution(r)}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              resolution.label === r.label
                ? 'bg-brand-700 text-white'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="relative flex-1">
        {loading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-lg">
            <div className="flex gap-2 items-center text-brand-700">
              <div className="w-5 h-5 border-2 border-brand-200 border-t-brand-700 rounded-full animate-spin" />
              <span className="text-sm font-medium">Loading chart…</span>
            </div>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <p className="text-slate-500 text-sm">{error}</p>
          </div>
        )}
        <div ref={containerRef} className="w-full chart-container" style={{ height }} />
      </div>
    </div>
  );
}