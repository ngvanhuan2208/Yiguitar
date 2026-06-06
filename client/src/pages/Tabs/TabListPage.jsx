import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api/axios';
import CardSkeleton from '@/components/common/CardSkeleton';

const DIFFICULTY_LEVELS = ['Tất cả', 'Cơ bản', 'Trung bình', 'Nâng cao'];

const TabListPage = () => {
  const [tabs, setTabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficulty, setDifficulty] = useState('Tất cả');
  
  const [showSecondaryMenu, setShowSecondaryMenu] = useState(true);
  const lastScrollY = useRef(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTabs = async () => {
      try {
        const response = await api.get('/tabs');
        setTabs(response.data || []);
      } catch (err) {
        console.error('Error fetching tabs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTabs();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setShowSecondaryMenu(false);
      } else if (currentScrollY < lastScrollY.current) {
        setShowSecondaryMenu(true);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredTabs = useMemo(() => {
    return tabs.filter(tab => {
      const title = tab.title || '';
      const artist = tab.artist || '';
      const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           artist.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDifficulty = difficulty === 'Tất cả' || tab.difficulty === difficulty;
      return matchesSearch && matchesDifficulty;
    });
  }, [tabs, searchTerm, difficulty]);

  return (
    <div className="bg-white min-h-screen pb-20 fade-in">
      {/* ── Secondary Sticky Bar ─────────────────────────── */}
      <div className={`sticky top-[72px] z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 py-4 transition-all duration-500 ${showSecondaryMenu ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}>
        <div className="container mx-auto px-6 lg:px-16 flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-grow max-md:max-w-full max-w-md">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </span>
            <input 
              type="text" 
              placeholder="Tìm tên bài hát hoặc nghệ sĩ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-[#00c7d3]/20 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest mr-2">Độ khó:</span>
            <div className="flex bg-slate-50 p-1 rounded-xl">
              {DIFFICULTY_LEVELS.map(l => (
                <button
                  key={l}
                  onClick={() => setDifficulty(l)}
                  className={`px-4 py-1.5 text-[10px] uppercase font-black tracking-widest rounded-lg transition-all ${
                    difficulty === l ? 'bg-[#00c7d3] text-white shadow-lg shadow-[#00c7d3]/20' : 'text-slate-400 hover:text-slate-800'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-16 mt-12">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black text-slate-800 mb-2 italic underline decoration-[#00c7d3]/30 underline-offset-8 uppercase tracking-tighter">Guitar Tab Library</h1>
          <p className="text-slate-400 font-medium">Tìm và tập luyện những bản nhạc yêu thích với Tab chuẩn</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : filteredTabs.length === 0 ? (
          <div className="py-20 text-center text-slate-400 italic font-medium">Không tìm thấy bài hát nào khớp với tìm kiếm của cậu.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredTabs.map((tab) => (
              <div 
                key={tab._id} 
                className="group relative bg-white border border-slate-100 rounded-[32px] p-8 hover:shadow-2xl hover:shadow-[#00c7d3]/10 transition-all duration-500 cursor-pointer overflow-hidden"
                onClick={() => navigate(`/tabs/${tab._id}`)}
              >
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#00c7d3] group-hover:bg-[#00c7d3] group-hover:text-white group-hover:scale-110 transition-all duration-500">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/></svg>
                  </div>
                  <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${
                    tab.difficulty === 'Nâng cao' ? 'bg-rose-50 text-rose-500 border-rose-100' : 
                    tab.difficulty === 'Trung bình' ? 'bg-amber-50 text-amber-500 border-amber-100' : 'bg-emerald-50 text-emerald-500 border-emerald-100'
                  }`}>
                    {tab.difficulty}
                  </span>
                </div>
                
                <h3 className="text-xl font-black text-slate-800 mb-1 group-hover:text-[#00c7d3] transition-colors line-clamp-1 italic tracking-tight">{tab.title}</h3>
                <p className="text-[10px] font-bold text-slate-400 mb-3 uppercase tracking-[0.2em]">{tab.artist || 'Unknown Artist'}</p>
                
                <p className="text-sm font-black text-[#00c7d3] italic mb-8">
                  {tab.price > 0 ? `${tab.price.toLocaleString('vi-VN')}₫` : 'Miễn phí'}
                </p>
                
                <div className="flex items-center justify-between mt-auto relative z-10">
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
                      {tab.downloadsCount || 0}
                    </div>
                  </div>
                  <button className="text-[#00c7d3] text-[10px] font-black uppercase tracking-widest flex items-center gap-1 group-hover:translate-x-2 transition-all">
                    Xem Chi Tiết →
                  </button>
                </div>

                {/* Subtle bg decoration */}
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-slate-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TabListPage;
