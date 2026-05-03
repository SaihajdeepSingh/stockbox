import { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, RefreshCw, Clock } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import type { NewsArticle } from '@/types';

function NewsCard({ article }: { article: NewsArticle }) {
  const dateStr = new Date(article.datetime * 1000).toLocaleString('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });
  return (
    <a href={article.url} target="_blank" rel="noopener noreferrer"
      className="group bg-white border border-slate-200/80 rounded-2xl p-5 flex gap-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
      {article.image && (
        <img src={article.image} alt="" onError={e => { (e.target as HTMLImageElement).style.display='none'; }}
          className="w-20 h-20 object-cover rounded-xl shrink-0 bg-slate-100" />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-lg">{article.source}</span>
          {article.category && <span className="text-[11px] text-slate-400 capitalize font-medium">{article.category}</span>}
        </div>
        <h3 className="font-bold text-slate-900 text-sm leading-snug mb-1.5 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {article.headline}
        </h3>
        {article.summary && <p className="text-[12px] text-slate-400 line-clamp-2 leading-relaxed">{article.summary}</p>}
        <div className="flex items-center gap-3 mt-2">
          <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
            <Clock className="w-3 h-3" /> {dateStr}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-blue-500 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
            Read <ExternalLink className="w-3 h-3" />
          </span>
        </div>
      </div>
    </a>
  );
}

export default function NewsPage() {
  const [news,      setNews]      = useState<NewsArticle[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [refreshing,setRefreshing]= useState(false);

  const load = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await api.get('/stocks/news', { params: isRefresh ? { t: Date.now() } : {} });
      setNews(res.data.news || []);
      if (isRefresh) toast.success('News refreshed');
    } catch { toast.error('Failed to load news'); }
    finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900">Market News</h1>
          <p className="text-sm text-slate-400 mt-0.5 font-medium">Live financial news powered by Finnhub</p>
        </div>
        <button onClick={() => load(true)} disabled={refreshing}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-slate-200 bg-white shadow-sm">
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="bg-white border border-slate-200/80 rounded-2xl p-5 flex gap-4 animate-pulse">
              <div className="w-20 h-20 bg-slate-100 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-slate-100 rounded w-1/4" />
                <div className="h-4 bg-slate-100 rounded" />
                <div className="h-4 bg-slate-100 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : news.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {news.map(article => <NewsCard key={article.id} article={article} />)}
        </div>
      ) : (
        <div className="bg-white border border-slate-200/80 rounded-2xl flex flex-col items-center justify-center py-20">
          <Newspaper className="w-10 h-10 text-slate-200 mb-3" />
          <p className="font-bold text-slate-500">No news available</p>
          <p className="text-sm text-slate-400 mt-1">Check back later for market updates.</p>
        </div>
      )}
    </div>
  );
}
