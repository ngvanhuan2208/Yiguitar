import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '@/api/axios';
import CardSkeleton from '@/components/common/CardSkeleton';

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await api.get('/articles?page=1&limit=4&isFeatured=true');
        setArticles(response.data.articles || []);
      } catch (err) {
        console.error('Error fetching articles:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  if (loading) {
    return (
      <section className="py-20 lg:py-28 bg-[#fcfcfc]">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-black text-[#0f172a] mb-4 italic tracking-tighter">
              Bài viết <span className="text-slate-300">mới nhất</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}
          </div>
        </div>
      </section>
    );
  }

  if (articles.length === 0) return null;

  return (
    <section className="py-20 lg:py-28 bg-[#fcfcfc]">
      <div className="container mx-auto px-6 lg:px-16">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <span className="text-[10px] font-black text-[#00c7d3] uppercase tracking-[0.3em] mb-3 block">Tin tức & Kinh nghiệm</span>
            <h2 className="text-3xl lg:text-5xl font-black text-[#0f172a] italic tracking-tighter">
              Bài viết <span className="text-slate-300">nổi bật</span>
            </h2>
          </div>
          <Link to="/bai-viet" className="group flex items-center gap-2 text-[11px] font-black text-slate-400 hover:text-[#00c7d3] transition-colors uppercase tracking-widest">
            Xem tất cả
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10">
          {articles.map((article) => (
            <Link 
              to={`/bai-viet/${article._id}`} 
              key={article._id} 
              className="group flex flex-col bg-white rounded-[30px] overflow-hidden border border-slate-100 hover:border-[#00c7d3]/30 hover:shadow-2xl hover:shadow-[#00c7d3]/10 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-50">
                <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" loading="lazy" />
                <div className="absolute top-4 left-4">
                  <span className="bg-[#00c7d3] text-white text-[9px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-[#00c7d3]/20">
                    {article.category}
                  </span>
                </div>
              </div>

              <div className="p-6 pb-8 flex flex-col flex-grow">
                <div className="flex items-center gap-3 mb-4">
                  <p className="text-[9px] font-extrabold text-[#00c7d3] uppercase tracking-widest">{article.author || 'Yi Guitar'}</p>
                  <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    {article.date ? new Date(article.date).toLocaleDateString('vi-VN') : 'Mới'}
                  </p>
                </div>
                
                <h3 className="text-lg font-extrabold text-slate-800 mb-4 group-hover:text-[#00c7d3] transition-colors leading-snug line-clamp-2">
                  {article.title}
                </h3>
                
                <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-6 font-medium">
                  {article.summary}
                </p>
                
                <div className="mt-auto flex items-center gap-2 text-[10px] font-extrabold text-slate-800 group-hover:gap-4 transition-all uppercase tracking-[0.2em] opacity-80">
                  ĐỌC TIẾP <svg className="w-4 h-4 text-[#00c7d3]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArticleList;
