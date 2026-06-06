import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@/api/axios';

const TabDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchTab = async () => {
      try {
        const response = await api.get(`/tabs/${id}`);
        setTab(response.data);
      } catch (err) {
        console.error('Error fetching tab details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTab();
  }, [id]);

  const handleDownload = async (fileUrl) => {
    if (!fileUrl) return;
    try {
      setDownloading(true);
      // 1. Increment download count in DB
      await api.post(`/tabs/${id}/download`);
      
      // 2. Trigger browser download
      const link = document.createElement('a');
      link.href = fileUrl;
      link.setAttribute('download', '');
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Update local state to show updated count (optional)
      setTab(prev => ({ ...prev, downloadsCount: (prev.downloadsCount || 0) + 1 }));
    } catch (err) {
      console.error('Download error:', err);
      // Even if API fails, still try to download the file
      window.open(fileUrl, '_blank');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
         <div className="w-12 h-12 border-4 border-[#00c7d3]/20 border-t-[#00c7d3] rounded-full animate-spin"></div>
         <div className="text-[#00c7d3] font-black italic animate-pulse uppercase tracking-[0.3em] text-[10px]">Loading Sheet...</div>
      </div>
    </div>
  );

  if (!tab) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-slate-300">
         <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
      </div>
      <p className="text-slate-500 font-bold mb-8 uppercase tracking-widest text-xs">Không tìm thấy bản nhạc này trong thư viện.</p>
      <button onClick={() => navigate('/tabs')} className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200">Quay lại danh sách</button>
    </div>
  );

  const isImage = (url) => {
    if (!url) return false;
    return url.match(/\.(jpeg|jpg|gif|png|webp)$/i);
  };

  const isPDF = (url) => {
    if (!url) return false;
    return url.match(/\.pdf$/i);
  };

  const displayImage = tab.files && tab.files[0] ? tab.files[0].url : tab.image;
  const isDisplayingImage = isImage(displayImage);
  const isDisplayingPDF = isPDF(displayImage);

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20 selection:bg-[#00c7d3]/10">
      {/* ── STICKY TOP NAVIGATION ─────────────────────────── */}
      <div className="sticky top-[72px] z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 py-4 shadow-sm group">
        <div className="container mx-auto px-6 lg:px-16 flex items-center justify-between">
           <button 
              onClick={() => navigate('/tabs')} 
              className="flex items-center gap-3 text-slate-400 hover:text-slate-800 transition-all font-black uppercase text-[10px] tracking-widest"
           >
              <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
              Thư viện Tab
           </button>
           
           <div className="hidden md:flex items-center gap-4">
              <span className="text-slate-200">|</span>
              <p className="text-xs font-black text-slate-800 italic uppercase tracking-tighter truncate max-w-[200px]">{tab.title}</p>
           </div>

           <div className="flex items-center gap-3">
              {tab.files && tab.files.length > 0 && (
                <button 
                  onClick={() => handleDownload(tab.files[0].url)} 
                  disabled={downloading}
                  className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#00c7d3] transition-all flex items-center gap-2 shadow-lg shadow-slate-900/10 disabled:opacity-50"
                >
                   {downloading ? 'ĐANG TẢI...' : 'TẢI VỀ (PDF/GP)'}
                </button>
              )}
           </div>
        </div>
      </div>

      {/* ── HERO HEADER ─────────────────────────── */}
      <div className="bg-white py-16 lg:py-24 relative overflow-hidden">
        <div className="container mx-auto px-6 lg:px-16 relative z-10">
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-3 mb-6">
               <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] border ${
                tab.difficulty === 'Nâng cao' ? 'bg-rose-50 text-rose-500 border-rose-100' : 
                tab.difficulty === 'Trung bình' ? 'bg-amber-50 text-amber-500 border-amber-100' : 'bg-emerald-50 text-emerald-500 border-emerald-100'
               }`}>
                {tab.difficulty}
               </span>
               <span className="text-[9px] font-black px-4 py-1.5 bg-slate-50 text-slate-400 rounded-full uppercase tracking-[0.2em] border border-slate-100">{tab.genre || 'Acoustic'}</span>
            </div>

            <h1 className="text-5xl lg:text-8xl font-black text-slate-900 leading-[0.9] italic tracking-tighter uppercase mb-6 drop-shadow-sm">{tab.title}</h1>
            
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#00c7d3] font-black italic text-xl">Yi</div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nghệ sĩ trình bày</p>
                    <p className="text-2xl font-black text-slate-800 italic uppercase tracking-tight">{tab.artist}</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
        
        {/* Background Decorative Element */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 opacity-[0.03] select-none pointer-events-none">
           <svg className="w-[600px] h-[600px] fill-current text-slate-900" viewBox="0 0 24 24"><path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/></svg>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-16 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ── LEFT: VIEWER ─────────────────────────── */}
          <div className="lg:col-span-9">
             <div className="bg-white rounded-[40px] shadow-[0_32px_80px_-20px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden relative group">
                <div className="bg-slate-50/50 px-8 py-4 border-b border-slate-100 flex justify-between items-center">
                   <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                      <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                   </div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Yi Guitar</p>
                </div>

                <div className="p-2 md:p-4 lg:p-6 flex items-center justify-center min-h-[500px]">
                   {displayImage && isDisplayingImage ? (
                      <img 
                        src={displayImage} 
                        alt={tab.title} 
                        className="max-w-full h-auto rounded-xl drop-shadow-2xl shadow-indigo-200 selection:bg-none pointer-events-none" 
                      />
                   ) : displayImage && isDisplayingPDF ? (
                      <div className="w-full h-[850px] rounded-xl overflow-hidden shadow-inner bg-slate-100/50">
                         <iframe 
                           src={`${displayImage}#toolbar=0&navpanes=0&scrollbar=0`} 
                           className="w-full h-full border-none"
                           title="PDF Preview"
                         ></iframe>
                      </div>
                   ) : displayImage ? (
                      <div className="py-24 text-center px-10">
                         <div className="w-24 h-24 bg-amber-50 rounded-3xl flex items-center justify-center text-amber-500 mb-8 mx-auto border border-amber-100">
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                         </div>
                         <h3 className="text-xl font-black text-slate-800 italic mb-4">Định dạng file đặc dụng</h3>
                         <p className="text-slate-400 text-sm font-medium max-w-sm mx-auto leading-relaxed">
                            Bản nhạc này là file **.{displayImage.split('.').pop().toUpperCase()}** (Guitar Pro). Cậu hãy tải về để xem chi tiết và luyện tập chuyên nghiệp nhen!
                         </p>
                         <button 
                            onClick={() => handleDownload(tab.files[0].url)} 
                            disabled={downloading}
                            className="mt-10 inline-flex bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 hover:bg-[#00c7d3] transition-all shadow-xl disabled:opacity-50"
                         >
                            {downloading ? 'ĐANG TẢI...' : 'Tải file & Mở ngay'}
                         </button>
                      </div>
                   ) : (
                      <div className="py-40 opacity-20 flex flex-col items-center">
                         <svg className="w-20 h-20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                         <p className="text-xs font-black uppercase tracking-widest italic">Nội dung sắp ra mắt</p>
                      </div>
                   )}
                </div>

                {/* Card Footer Decor */}
                <div className="bg-slate-50/30 py-4 px-10 border-t border-slate-50 flex justify-between items-center">
                   <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">Official Tab by Yi Guitar Team</p>
                   <div className="flex gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                   </div>
                </div>
             </div>
          </div>

          {/* ── RIGHT: SIDEBAR ─────────────────────────── */}
          <div className="lg:col-span-3 lg:sticky lg:top-[160px] space-y-8">
             <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]">
                <h4 className="text-[10px] font-black text-[#00c7d3] uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                   <span className="w-8 h-[2px] bg-[#00c7d3]/20"></span>
                   Chi tiết bản nhạc
                </h4>

                <div className="space-y-8">
                   <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                      </div>
                      <div>
                         <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest block mb-1">Nghệ sĩ / Artist</label>
                         <p className="text-lg font-black text-slate-800 uppercase tracking-tight italic">{tab.artist}</p>
                      </div>
                   </div>

                   <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/></svg>
                      </div>
                      <div>
                         <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest block mb-1">Thể loại / Genre</label>
                         <p className="text-lg font-black text-slate-800 uppercase tracking-tight italic">{tab.genre || 'Acoustic'}</p>
                      </div>
                   </div>

                   <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                      </div>
                      <div>
                         <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest block mb-1">Lượt tải / Downloads</label>
                         <p className="text-lg font-black text-slate-800 uppercase tracking-tight italic">{tab.downloadsCount || 0}</p>
                      </div>
                   </div>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-50">
                    <button className="w-full bg-white border-2 border-slate-100 text-slate-400 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:text-[#00c7d3] hover:border-[#00c7d3]/20 transition-all">
                       THÊM VÀO YÊU THÍCH
                    </button>
                </div>
             </div>

             {tab.demoVideo && (
               <div className="bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl shadow-slate-900/30 relative overflow-hidden group">
                  <div className="relative z-10">
                     <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">CASE STUDY VIDEO</p>
                     <h5 className="text-2xl font-black italic mb-8 leading-tight">Học cách chơi bài này ngay!</h5>
                     <a 
                        href={tab.demoVideo} target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-4 bg-rose-500 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all shadow-xl shadow-rose-500/20"
                     >
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        XEM TRÊN YOUTUBE
                     </a>
                  </div>
                  {/* Decorative background */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-[#00c7d3]/20 rounded-full blur-3xl -mr-24 -mt-24 group-hover:bg-[#00c7d3]/40 transition-all duration-700"></div>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabDetailPage;
