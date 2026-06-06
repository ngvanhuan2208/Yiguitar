import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '@/api/axios';

const ArticleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await api.get(`/articles/${id}`);
        setArticle(response.data);
      } catch (err) {
        console.error('Error fetching article:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  // Logic tính thời gian đọc (Trung bình 200 từ/phút)
  const calculateReadTime = (content) => {
    if (!content) return 0;
    const words = content.trim().split(/\s+/).length;
    const time = Math.ceil(words / 200);
    return time < 1 ? 1 : time;
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-slate-100 border-t-[#00c7d3] rounded-full animate-spin"></div>
        <p className="text-slate-400 font-bold italic animate-pulse">Đang nạp bài viết...</p>
      </div>
    </div>
  );

  if (!article) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-slate-50 p-10 rounded-[40px] border border-slate-100 mb-8 max-w-md">
        <p className="text-slate-500 font-bold mb-6 italic">Cáo lỗi! Bài viết này không tồn tại hoặc đã được chuyển sang thư mục bảo mật.</p>
        <button onClick={() => navigate('/bai-viet')} className="bg-[#00c7d3] text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-[#00c7d3]/20 hover:-translate-y-1 transition-all">Quay lại danh sách</button>
      </div>
    </div>
  );

  const readTime = calculateReadTime(article.content);

  return (
    <div className="bg-white min-h-screen pb-32 fade-in selection:bg-[#00c7d3]/20">
      <article className="max-w-3xl mx-auto px-6 lg:px-0">
        
        {/* ── 1. Article Header ───────────────────── */}
        <header className="pt-16 lg:pt-28 mb-12">
          {/* Category Tag */}
          <div className="flex justify-start mb-6">
            <span className="text-[11px] font-black text-[#00c7d3] uppercase tracking-[0.3em] font-display">
              {article.category}
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-left text-4xl lg:text-5xl font-extrabold text-slate-900 leading-[1.15] mb-10 tracking-tight">
            {(article.title || '').normalize('NFC')}
          </h1>

          {/* Meta Info: Author & Date */}
          <div className="flex items-center gap-4 py-8 border-y border-slate-100">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 flex-shrink-0 border-2 border-white ring-1 ring-slate-100 shadow-sm">
              <img src="https://ui-avatars.com/api/?name=Yi+Guitar&background=00A8B5&color=fff&bold=true" alt="Author" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-black text-slate-800 tracking-tight">
                {article.author || 'Yi Guitar Admin'}
              </p>
              <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <span>{new Date(article.date).toLocaleDateString('vi-VN')}</span>
                <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                <span>{readTime} phút đọc</span>
              </div>
            </div>
          </div>
        </header>

        {/* ── 2. Featured Image ───────────────────── */}
        <figure className="mb-16 -mx-0 lg:-mx-12">
          <div className="rounded-2xl overflow-hidden shadow-2xl shadow-slate-200/50">
            <img src={article.image} alt={article.title} className="w-full h-full object-cover max-h-[500px]" />
          </div>
          {article.caption && (
            <figcaption className="mt-4 text-center text-xs italic text-slate-400 font-medium">
              {article.caption}
            </figcaption>
          )}
        </figure>

        {/* ── 3. Smart Content Engine ──────────────────────────── */}
        <div className="text-left text-slate-700 leading-loose text-lg lg:text-xl space-y-10 font-medium break-words">
          {(article.content || '').normalize('NFC').split('\n').map((para, i) => {
            const cleanPara = para.trim();
            if (!cleanPara) return null;

            // 1. Nhận diện Trích dẫn (bắt đầu bằng ">")
            if (cleanPara.startsWith('>')) {
              return (
                <blockquote key={i} className="pl-8 py-6 my-10 border-l-[6px] border-[#00c7d3] bg-slate-50 italic text-slate-600 rounded-r-2xl text-xl lg:text-2xl font-body">
                  {cleanPara.substring(1).trim()}
                </blockquote>
              );
            }

            // 2. Nhận diện Đề mục Số (VD: "1. Tiêu đề")
            const isHeading = /^\d+\.\s/.test(cleanPara);
            if (isHeading) {
              return (
                <div key={i} className="pt-10 pb-4 mt-16 mb-8 border-b-2 border-slate-50 relative group">
                  <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight">
                    {cleanPara}
                  </h2>
                  {/* Cyan Underline Accent */}
                  <div className="absolute -bottom-[2px] left-0 w-20 h-[3px] bg-[#00c7d3] group-hover:w-32 transition-all duration-500"></div>
                </div>
              );
            }

            // 3. Đoạn văn chuẩn (Chỉ Drop-cap cho đoạn ĐẦU TIÊN)
            const dropCapClass = i === 0 
              ? "first-letter:text-4xl first-letter:font-extrabold first-letter:text-[#00c7d3] first-letter:mr-1"
              : "";

            return (
              <p key={i} className={`${dropCapClass} mb-8 clear-both`}>
                {cleanPara}
              </p>
            );
          })}
        </div>

        {/* ── 4. Article Footer ──────────────────────────── */}
        <footer className="mt-24 pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">Chia sẻ:</p>
             <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-[#1877F2] hover:text-white transition-all cursor-pointer shadow-sm">
               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
             </button>
             <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-[#1DA1F2] hover:text-white transition-all cursor-pointer shadow-sm">
               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
             </button>
          </div>
          
          <Link to="/bai-viet" className="text-xs font-black text-[#00c7d3] hover:opacity-70 transition-all uppercase tracking-[0.2em] flex items-center gap-2 group">
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Danh sách bài viết
          </Link>
        </footer>
      </article>
    </div>
  );
};

export default ArticleDetailPage;
