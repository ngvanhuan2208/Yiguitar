import React, { useState, useEffect } from 'react';
import api from '@/api/axios';
import { normalizeObject } from '@/utils/textUtils';

const DIFFICULTIES = ['Tất cả', 'Cơ bản', 'Trung bình', 'Nâng cao'];
const TYPES = ['Tất cả', 'Miễn phí', 'Trả phí'];
const GENRES = ['Pop', 'Rock', 'Acoustic', 'Fingerstyle', 'Classical', 'Jazz', 'Bolero'];

const TabManagement = () => {
  const [allTabs, setAllTabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('Tất cả');
  const [filterType, setFilterType] = useState('Tất cả');
  
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    author: 'Yi Guitar',
    price: 0,
    genre: 'Pop',
    difficulty: 'Cơ bản',
    demoVideo: '',
    image: '',
    status: true,
    files: [] // Array of { name, url, fileType }
  });

  const fetchTabs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/tabs');
      setAllTabs(response.data || []);
    } catch (err) {
      console.error('Error fetching tabs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTabs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const normalizedData = normalizeObject(formData, ['title', 'artist', 'author', 'demoVideo']);
      
      if (editingId) {
        await api.put(`/tabs/${editingId}`, normalizedData);
      } else {
        await api.post('/tabs', normalizedData);
      }
      
      setShowModal(false);
      resetForm();
      fetchTabs();
      alert(editingId ? 'Cập nhật thành công!' : 'Thêm Tab mới thành công!');
    } catch (err) {
      console.error('Error saving tab:', err);
      alert('Có lỗi xảy ra!');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Cậu có chắc muốn xóa Tab này không?')) return;
    try {
      await api.delete(`/tabs/${id}`);
      fetchTabs();
    } catch (err) {
      console.error('Error deleting tab:', err);
    }
  };

  const handleEdit = (tab) => {
    setEditingId(tab._id);
    setFormData({ ...tab });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      artist: '',
      author: 'Yi Guitar',
      price: 0,
      genre: 'Pop',
      difficulty: 'Cơ bản',
      demoVideo: '',
      image: '',
      status: true,
      files: []
    });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    const data = new FormData();
    data.append('images', file);
    try {
      setLoading(true);
      const res = await api.post('/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const fileUrl = res.data.urls[0];
      const fileName = file.name;
      let fType = 'PDF';
      if (fileName.endsWith('.gpx')) fType = 'GPX';
      else if (fileName.endsWith('.mp3')) fType = 'BackingTrack';

      setFormData(prev => ({
        ...prev,
        files: [...prev.files, { name: fileName, url: fileUrl, fileType: fType }]
      }));
    } catch (err) {
      console.error('Upload error:', err);
      alert('Tải file thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const filteredTabs = allTabs.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = filterDifficulty === 'Tất cả' || t.difficulty === filterDifficulty;
    const matchesType = filterType === 'Tất cả' || 
                        (filterType === 'Miễn phí' ? t.price === 0 : t.price > 0);
    return matchesSearch && matchesDifficulty && matchesType;
  });

  const stats = {
    total: allTabs.length,
    monthlyDownloads: allTabs.reduce((acc, curr) => acc + (curr.downloadsCount || 0), 0),
    premiumCount: allTabs.filter(t => t.price > 0).length
  };

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'Cơ bản': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Trung bình': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Nâng cao': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-400';
    }
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'PDF': return <span className="px-2 py-0.5 bg-rose-50 text-rose-500 rounded text-[8px] font-black tracking-tighter border border-rose-100 uppercase">PDF</span>;
      case 'GPX': return <span className="px-2 py-0.5 bg-blue-50 text-blue-500 rounded text-[8px] font-black tracking-tighter border border-blue-100 uppercase">GPX</span>;
      case 'BackingTrack': return <span className="px-2 py-0.5 bg-emerald-50 text-emerald-500 rounded text-[8px] font-black tracking-tighter border border-emerald-100 uppercase">MP3</span>;
      default: return null;
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen text-slate-600 pb-20 selection:bg-[#00c7d3]/10 fade-in">
      {/* ── HEADER & STATS ─────────────────── */}
      <div className="bg-white border-b border-slate-100 py-12 mb-8 shadow-sm">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h1 className="text-4xl font-black text-slate-800 italic tracking-tight mb-2">QUẢN LÝ <span className="text-[#00c7d3]">TAB GUITAR</span></h1>
              <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">Sheet Music & Tablature Hub • v4.0</p>
            </div>
            <button 
              onClick={() => { resetForm(); setShowModal(true); }}
              className="bg-[#00c7d3] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#00c7d3]/20 hover:-translate-y-1 transition-all active:scale-95"
            >
              + Thêm Tab Mới
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 flex items-center gap-6 shadow-xl shadow-slate-200/40">
               <div className="w-14 h-14 bg-[#00c7d3]/10 rounded-2xl flex items-center justify-center text-[#00c7d3]">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
               </div>
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tổng số Tab</p>
                  <h4 className="text-3xl font-black text-slate-800 italic">{stats.total}</h4>
               </div>
            </div>
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 flex items-center gap-6 shadow-xl shadow-slate-200/40">
               <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
               </div>
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Lượt tải tháng này</p>
                  <h4 className="text-3xl font-black text-slate-800 italic">{stats.monthlyDownloads}</h4>
               </div>
            </div>
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 flex items-center gap-6 shadow-xl shadow-slate-200/40">
               <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
               </div>
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tab Premium</p>
                  <h4 className="text-3xl font-black text-slate-800 italic">{stats.premiumCount}</h4>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-16 mt-12">
        {/* ── FILTER BAR ───────────────────── */}
        <div className="flex flex-wrap gap-4 mb-8">
           <div className="flex-grow min-w-[300px] relative">
              <input 
                type="text" 
                placeholder="Tìm bài hát, nghệ sĩ..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#00c7d3]/10 outline-none transition-all shadow-lg shadow-slate-100"
              />
              <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
           </div>
           
           <select 
             value={filterDifficulty}
             onChange={(e) => setFilterDifficulty(e.target.value)}
             className="bg-white border border-slate-200 rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500 outline-none focus:ring-2 focus:ring-[#00c7d3]/10 shadow-lg shadow-slate-100 transition-all cursor-pointer"
           >
             {DIFFICULTIES.map(d => <option key={d} value={d} className="bg-white">{d}</option>)}
           </select>

           <select 
             value={filterType}
             onChange={(e) => setFilterType(e.target.value)}
             className="bg-white border border-slate-200 rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500 outline-none focus:ring-2 focus:ring-[#00c7d3]/10 shadow-lg shadow-slate-100 transition-all cursor-pointer"
           >
             {TYPES.map(t => <option key={t} value={t} className="bg-white">{t}</option>)}
           </select>
        </div>

        {/* ── DATA TABLE ───────────────────── */}
        <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-2xl shadow-slate-200/40">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Bài hát / Nghệ sĩ</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Độ khó</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Loại</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Định dạng</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTabs.map(tab => (
                <tr key={tab._id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-6">
                    <div>
                       <p className="font-black text-slate-800 italic mb-0.5 text-base tracking-tight">{tab.title}</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{tab.artist}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                     <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getDifficultyColor(tab.difficulty)}`}>
                        {tab.difficulty}
                     </span>
                  </td>
                  <td className="px-8 py-6">
                     {tab.price === 0 ? (
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">FREE</span>
                     ) : (
                       <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest border border-amber-100 bg-amber-50 px-2 py-1 rounded-lg">PREMIUM</span>
                     )}
                  </td>
                  <td className="px-8 py-6">
                     <div className="flex gap-2">
                        {tab.files.map((f, i) => (
                           <div key={i} title={f.name}>{getFileIcon(f.fileType)}</div>
                        ))}
                        {tab.files.length === 0 && <span className="text-slate-200 italic text-[10px]">No files</span>}
                     </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                     <div className="flex items-center justify-center gap-3">
                        <button onClick={() => handleEdit(tab)} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-[#00c7d3] hover:bg-[#00c7d3]/10 transition-all">
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                        </button>
                        <button onClick={() => handleDelete(tab._id)} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all">
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                     </div>
                  </td>
                </tr>
              ))}
              {filteredTabs.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-20 text-center text-slate-400 font-bold italic">Không tìm thấy Tab nào phù hợp.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── UPLOAD MODAL ─────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fade-in overflow-y-auto pt-20 pb-20">
          <div className="bg-white w-full max-w-4xl rounded-[48px] border border-slate-100 shadow-[0_32px_120px_-20px_rgba(0,0,0,0.2)] overflow-hidden animate-zoom-in">
             <form onSubmit={handleSubmit}>
                <div className="p-12">
                   <div className="flex justify-between items-center mb-10">
                      <div>
                        <h2 className="text-4xl font-black text-slate-800 italic">{editingId ? 'Cập nhật' : 'Thêm mới'} Tab Guitar</h2>
                        <p className="text-[#00c7d3] font-black uppercase tracking-[0.2em] text-[10px] mt-2">Dành cho Admin Yi Guitar</p>
                      </div>
                      <button type="button" onClick={() => setShowModal(false)} className="bg-slate-50 text-slate-400 p-4 rounded-full hover:text-slate-800 transition-all">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                      </button>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-6">
                         <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block pl-4">Tên bài hát</label>
                            <input 
                              type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                              className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#00c7d3]/20 transition-all placeholder:text-slate-300" 
                              placeholder="VD: Wind Song, Sunburst..."
                            />
                         </div>
                         <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block pl-4">Nghệ sĩ / Nhạc sĩ</label>
                            <input 
                              type="text" required value={formData.artist} onChange={e => setFormData({...formData, artist: e.target.value})}
                              className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#00c7d3]/20 transition-all" 
                              placeholder="VD: Kotaro Oshio, Sungha Jung..."
                            />
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block pl-4">Độ khó</label>
                               <select 
                                 value={formData.difficulty} onChange={e => setFormData({...formData, difficulty: e.target.value})}
                                 className="w-full bg-slate-50 border-none rounded-2xl p-5 text-xs font-black uppercase tracking-widest text-[#00c7d3] transition-all"
                               >
                                  {DIFFICULTIES.slice(1).map(d => <option key={d} value={d} className="bg-white">{d}</option>)}
                               </select>
                            </div>
                            <div>
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block pl-4">Thể loại</label>
                               <select 
                                 value={formData.genre} onChange={e => setFormData({...formData, genre: e.target.value})}
                                 className="w-full bg-slate-50 border-none rounded-2xl p-5 text-xs font-black uppercase tracking-widest text-slate-400 transition-all"
                               >
                                  {GENRES.map(g => <option key={g} value={g} className="bg-white">{g}</option>)}
                               </select>
                            </div>
                         </div>
                         
                         <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block pl-4">Cấu hình giá</label>
                            <div className="flex gap-4 mb-4">
                               {['Miễn phí', 'Có phí'].map(type => (
                                 <button
                                   key={type} type="button"
                                   onClick={() => setFormData({...formData, price: type === 'Miễn phí' ? 0 : 50000})}
                                   className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                      (type === 'Miễn phí' ? formData.price === 0 : formData.price > 0)
                                      ? 'bg-[#00c7d3] text-white shadow-lg' : 'bg-slate-50 text-slate-400 transition-colors'
                                   }`}
                                 >
                                   {type}
                                 </button>
                               ))}
                            </div>
                            {formData.price > 0 && (
                              <input 
                                 type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})}
                                 className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-black text-[#00c7d3] animate-fade-in"
                                 placeholder="Nhập giá tiền (VNĐ)..."
                              />
                            )}
                         </div>
                      </div>

                      <div className="space-y-6">
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">File tài liệu (PDF, GPX...)</label>
                            <div 
                              onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                              className={`relative group h-[200px] rounded-[32px] border-2 border-dashed flex flex-col items-center justify-center p-8 transition-all ${
                                dragActive ? 'border-[#00c7d3] bg-[#00c7d3]/5 scale-[0.98]' : 'border-slate-100 bg-slate-50/50 hover:border-slate-200'
                              }`}
                            >
                               <svg className={`w-12 h-12 mb-4 transition-transform group-hover:-translate-y-1 ${dragActive ? 'text-[#00c7d3]' : 'text-slate-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
                               <div className="text-center">
                                  <p className="text-xs font-black text-slate-800 italic">Kéo thả file vào đây</p>
                                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">Hoặc click để chọn file từ máy</p>
                               </div>
                               <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" multiple onChange={(e) => handleFileUpload(e.target.files[0])} />
                            </div>
                            {/* File list */}
                            <div className="space-y-2">
                               {formData.files.map((f, i) => (
                                 <div key={i} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-sm">
                                    <div className="flex items-center gap-3">
                                       {getFileIcon(f.fileType)}
                                       <span className="text-[10px] font-bold text-slate-600 truncate max-w-[150px]">{f.name}</span>
                                    </div>
                                    <button type="button" onClick={() => setFormData({...formData, files: formData.files.filter((_, idx) => idx !== i)})} className="text-rose-400 hover:text-rose-600 transition-colors">
                                       <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/></svg></button>
                                 </div>
                               ))}
                            </div>
                         </div>

                         <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block pl-4">Link Video Demo (YouTube)</label>
                            <input 
                              type="text" value={formData.demoVideo} onChange={e => setFormData({...formData, demoVideo: e.target.value})}
                              className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#00c7d3]/20 transition-all placeholder:text-slate-300" 
                              placeholder="Dán link YouTube tại đây..."
                            />
                         </div>
                      </div>
                   </div>

                   <div className="flex gap-4 mt-12 pt-10 border-t border-slate-100">
                      <button type="submit" disabled={loading} className="flex-grow bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200 hover:-translate-y-1 transition-all">
                        {loading ? 'Đang xử lý...' : 'Lưu Tab Ngay'}
                      </button>
                      <button type="button" onClick={() => setShowModal(false)} className="px-10 bg-white text-slate-400 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:text-slate-800 transition-all border border-slate-100">
                        Hủy bỏ
                      </button>
                   </div>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabManagement;
