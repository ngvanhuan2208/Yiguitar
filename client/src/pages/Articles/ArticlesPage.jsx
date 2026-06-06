import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '@/api/axios';
import CardSkeleton from '@/components/common/CardSkeleton';

const CATEGORIES = ['Tất cả', 'Guitar', 'Tin tức'];

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Tất cả');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/articles?page=${currentPage}&limit=12&category=${filter}`);
      setArticles(response.data.articles || []);
      setTotalPages(response.data.pages || 1);
    } catch (err) {
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1); // Reset page when filter changes
  }, [filter]);

  useEffect(() => {
    fetchArticles();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filter]);

  return (
    <div className="bg-[#fcfcfc] min-h-screen pb-32 fade-in selection:bg-[#00c7d3]/10">
      {/* ── Banner ─────────────────────────── */}
      <div className="bg-gradient-to-br from-[#92E4EC] via-[#A9EBEF] to-[#CEF5F8] py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/20 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#00c7d3]/10 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
        
        <div className="container mx-auto px-6 lg:px-16 relative z-10 text-center">
          <span className="text-[10px] font-extrabold text-[#00c7d3] uppercase tracking-[0.4em] mb-4 inline-block bg-white/50 backdrop-blur-sm px-6 py-2 rounded-full border border-white/50">Magazine</span>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-[#0f172a] mb-8 italic tracking-tighter drop-shadow-sm">Kinh nghiệm & <span className="text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.1)]">Tin tức</span></h1>
          <p className="text-[#334155] max-w-2xl mx-auto text-lg font-medium opacity-80 leading-relaxed">Khám phá thế giới nhạc cụ qua lăng kính của các chuyên gia tại Yi Guitar. Nơi âm nhạc không chỉ để nghe, mà còn để cảm nhận và sẻ chia.</p>
        </div>
      </div>

      {/* ── Filter & Content ─────────────────── */}
      <div className="container mx-auto px-6 lg:px-16 -mt-10 relative z-20">
        {/* Category Tabs */}
        <div className="flex bg-white/90 backdrop-blur-xl p-2.5 rounded-3xl shadow-2xl shadow-slate-200/60 justify-center gap-3 max-w-fit mx-auto border border-white mb-20 ring-1 ring-slate-100">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-10 py-4 rounded-2xl text-[11px] font-extrabold transition-all uppercase tracking-widest ${
                filter === c ? 'bg-[#00c7d3] text-white shadow-xl shadow-[#00c7d3]/30 -translate-y-0.5' : 'text-slate-400 hover:text-slate-800'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {[...Array(8)].map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : articles.length === 0 ? (
          <div className="py-40 text-center text-slate-300 italic font-extrabold text-xl uppercase tracking-tighter opacity-50">— Chuyên mục này đang được cập nhật —</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
              {articles.map((article) => (
                <Link 
                  to={`/bai-viet/${article._id}`} 
                  key={article._id} 
                  className="group flex flex-col bg-white rounded-[40px] overflow-hidden border border-slate-50 hover:shadow-3xl hover:shadow-[#00c7d3]/15 transition-all duration-700 hover:-translate-y-3"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-50">
                    <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" loading="lazy" />
                    <div className="absolute top-6 left-6">
                      <span className="bg-[#00c7d3] text-white text-[9px] font-extrabold px-4 py-2 rounded-full uppercase tracking-widest shadow-lg shadow-[#00c7d3]/20">
                        {article.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-8 pb-10 flex flex-col flex-grow">
                    <div className="flex items-center gap-3 mb-6">
                      <p className="text-[9px] font-extrabold text-[#00c7d3] uppercase tracking-widest">{article.author || 'Yi Guitar'}</p>
                      <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        {article.date ? new Date(article.date).toLocaleDateString('vi-VN') : 'Mới'}
                      </p>
                    </div>
                    
                    <h3 className="text-xl font-extrabold text-slate-800 mb-6 group-hover:text-[#00c7d3] transition-colors leading-[1.3] italic line-clamp-2">
                      {article.title}
                    </h3>
                    
                    <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-8 font-medium italic">
                      {article.summary}
                    </p>
                    
                    <div className="mt-auto flex items-center gap-3 text-[10px] font-extrabold text-slate-800 group-hover:gap-5 transition-all uppercase tracking-[0.2em] opacity-80">
                      KHÁM PHÁ <svg className="w-4 h-4 text-[#00c7d3]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-28 flex justify-center items-center gap-4">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-400 hover:bg-[#00c7d3] hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-slate-400 transition-all shadow-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
                </button>
                
                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-12 h-12 rounded-2xl text-xs font-extrabold transition-all ${
                        currentPage === i + 1 
                          ? 'bg-[#00c7d3] text-white shadow-lg shadow-[#00c7d3]/30' 
                          : 'bg-white border border-slate-100 text-slate-400 hover:border-[#00c7d3] hover:text-[#00c7d3]'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-400 hover:bg-[#00c7d3] hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-slate-400 transition-all shadow-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"/></svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ArticlesPage;
