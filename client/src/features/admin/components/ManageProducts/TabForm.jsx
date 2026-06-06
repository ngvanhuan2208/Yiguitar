import React from 'react';

const TabForm = ({ 
  formData, 
  setFormData, 
  categories, 
  handleTabFileChange, 
  loading, 
  api, // Need api for thumbnail upload if handled in component
  handleSubmit, 
  setShowModal 
}) => {
  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* 🎼 DEDICATED TAB FORM */}
      <div className="space-y-2 md:col-span-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Tên bản nhạc (Bài hát)</label>
        <input required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl p-4 text-lg font-black focus:ring-2 focus:ring-amber-400/20" placeholder="Ví dụ: More Than Words, Kiss The Rain..." />
      </div>

      <div className="space-y-4 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 bg-amber-50/30 p-8 rounded-[40px] border border-amber-100/50">
        <div className="md:col-span-2">
           <h4 className="text-[11px] font-black text-amber-600 uppercase tracking-[0.3em] italic mb-2">Thông tin bản nhạc</h4>
        </div>
        
        <div className="space-y-2">
           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Nghệ sĩ / Tác giả</label>
           <input value={formData.artist || ''} onChange={e => setFormData({...formData, artist: e.target.value})} className="w-full bg-white border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-amber-200" placeholder="Ca sĩ hoặc người chuyển soạn..." />
        </div>

        <div className="space-y-2">
           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Độ khó biểu diễn</label>
           <select value={formData.level || 'Dễ'} onChange={e => setFormData({...formData, level: e.target.value})} className="w-full bg-white border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-amber-200">
             <option>Dễ</option>
             <option>Trung bình</option>
             <option>Khó</option>
             <option>Cực khó</option>
           </select>
        </div>

        <div className="space-y-2">
           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Thể loại Tab</label>
           <select 
             required 
             value={formData.type || ''} 
             onChange={e => setFormData({...formData, type: e.target.value})} 
             className="w-full bg-white border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-amber-200"
           >
             <option value="">Chọn thể loại...</option>
             {(categories.find(c => c.name === 'Tab')?.subCategories || []).map(sub => (
               <option key={sub} value={sub}>{sub}</option>
             ))}
           </select>
        </div>

        <div className="space-y-2">
           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Giá sở hữu (VNĐ)</label>
           <input type="number" required value={formData.price || 0} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full bg-white border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-amber-200" />
        </div>

        <div className="md:col-span-2 space-y-4 pt-4">
           <div className="flex justify-between items-center px-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tệp tin Tab (Ảnh bản nhạc đầy đủ)</label>
              <label className="cursor-pointer bg-amber-500 text-white px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-amber-600 transition-all shadow-md shadow-amber-200">
                {loading ? 'Đang tải...' : '+ Tải tệp từ máy'}
                <input type="file" accept="image/*" onChange={handleTabFileChange} className="hidden" disabled={loading} />
              </label>
           </div>
           
           <div className="bg-white rounded-[32px] p-6 border border-amber-100 min-h-[150px] flex items-center justify-center relative overflow-hidden">
              {formData.tabimage ? (
                <img src={formData.tabimage} className="max-h-60 object-contain rounded-xl" />
              ) : (
                <div className="text-center">
                  <p className="text-[10px] font-bold text-slate-300 italic mb-2">Chưa có tệp nào được tải lên</p>
                  <p className="text-[8px] text-slate-200 uppercase font-bold tracking-widest italic">Cậu nên dùng ảnh PNG/JPG rõ nét nhé</p>
                </div>
              )}
           </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-1 block">Ảnh minh họa (Thumbnail)</label>
        <div className="relative group w-full h-48 bg-slate-50 rounded-[32px] overflow-hidden border border-dashed border-slate-200 flex items-center justify-center">
          {formData.image ? (
            <img src={formData.image} className="w-full h-full object-cover" />
          ) : (
            <div className="text-center">
               <p className="text-[10px] font-bold text-slate-300">Click để tải ảnh bìa</p>
            </div>
          )}
          <input type="file" accept="image/*" onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const data = new FormData();
              data.append('images', file);
              api.post('/upload', data).then(res => setFormData(prev => ({...prev, image: res.data.urls[0]})));
            }
          }} className="absolute inset-0 opacity-0 cursor-pointer" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Giới thiệu ngắn gọn</label>
        <textarea rows="6" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-50 border-none rounded-[32px] p-6 text-sm font-semibold focus:ring-2 focus:ring-amber-200 placeholder:text-slate-300 h-[192px]" placeholder="Nói qua một chút về bài nhạc, những lưu ý khi tập luyện..."></textarea>
      </div>

      <div className="md:col-span-2 pt-10 border-t border-slate-50 flex gap-4">
        <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-800 transition-colors">Hủy bỏ</button>
        <button type="submit" className="flex-2 bg-slate-900 text-white px-20 py-4 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:-translate-y-1 transition-all shadow-xl shadow-slate-200">Lưu bản nhạc</button>
      </div>
    </form>
  );
};

export default TabForm;
