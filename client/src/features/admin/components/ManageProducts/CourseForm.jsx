import React from 'react';

const CourseForm = ({ 
  formData, 
  setFormData, 
  categories, 
  filterCategory, 
  editingProduct, 
  handleFileChange, 
  removeImage, 
  loading, 
  handleSubmit, 
  setShowModal 
}) => {
  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 🎓 COURSE PRODUCT FORM */}
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Tên khóa học</label>
        <input required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#00c7d3]/20" />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Danh mục chính</label>
        <select 
          disabled={filterCategory !== 'Tất cả' && !editingProduct}
          value={formData.category || 'Course'} 
          onChange={e => setFormData({...formData, category: e.target.value})} 
          className={`w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#00c7d3]/20 ${filterCategory !== 'Tất cả' && !editingProduct ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          {categories.map(cat => (
            <option key={cat._id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
      </div>
      <div className="space-y-3 md:col-span-2 bg-slate-50/50 p-6 rounded-[32px] border border-slate-100">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 block mb-2">Hình thức học tập</label>
        <div className="grid grid-cols-2 gap-4">
          {['Online', 'Offline'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFormData({ ...formData, type })}
              className={`py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${
                formData.type === type 
                  ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 -translate-y-0.5' 
                  : 'bg-white text-slate-400 hover:bg-slate-50 border border-slate-100'
              }`}
            >
              {type === 'Online' ? '🌐 Khóa học Online' : '🏫 Khóa học Offline'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Giá khóa học (VNĐ)</label>
        <input type="number" required value={formData.price || 0} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#00c7d3]/20" />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Giảng viên</label>
        <input value={formData.instructor || ''} onChange={e => setFormData({...formData, instructor: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#00c7d3]/20" />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Trình độ</label>
        <select value={formData.level || 'Cơ bản'} onChange={e => setFormData({...formData, level: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#00c7d3]/20">
          <option>Cơ bản</option>
          <option>Trung bình</option>
          <option>Nâng cao</option>
        </select>
      </div>

      <div className="space-y-4 md:col-span-2 bg-slate-50/50 p-6 rounded-[24px] border border-dashed border-slate-200">
        <div className="flex justify-between items-center px-4">
          <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Hình ảnh khóa học</label>
          <label className="cursor-pointer bg-white border border-slate-200 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm">
            {loading ? 'Đang tải...' : '+ Tải ảnh từ máy'}
            <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" disabled={loading} />
          </label>
        </div>

        <div className="flex flex-wrap gap-4 mt-2 px-2">
          {formData.images && formData.images.map((img, idx) => (
            <div key={idx} className="relative group w-24 h-24 rounded-2xl overflow-hidden border-2 border-white shadow-md">
              <img src={img} className="w-full h-full object-cover" />
              <button type="button" onClick={() => removeImage(idx)} className="absolute inset-0 bg-rose-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all font-black">XÓA</button>
              {formData.image === img && <div className="absolute top-1 left-1 bg-emerald-500 text-[6px] text-white font-black px-1.5 py-0.5 rounded-full uppercase">Bìa</div>}
            </div>
          ))}
        </div>
        <div className="px-4 mt-4">
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Hoặc dán URL ảnh bìa</label>
          <input value={formData.image || ''} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full bg-white border border-slate-100 rounded-xl p-3 text-xs font-bold focus:ring-2 focus:ring-[#00c7d3]/20" placeholder="https://..." />
        </div>
      </div>

      <div className="space-y-2 md:col-span-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Giới thiệu khóa học</label>
        <textarea rows="4" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-semibold focus:ring-2 focus:ring-[#00c7d3]/20 placeholder:text-slate-300" placeholder="Mô tả nội dung khóa học..."></textarea>
      </div>

      <div className="space-y-2 md:col-span-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Video giới thiệu (YouTube)</label>
        <input value={formData.videoId || ''} onChange={e => setFormData({...formData, videoId: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#00c7d3]/20 placeholder:text-slate-300" placeholder="Dán link YouTube tại đây..." />
      </div>

      <div className="md:col-span-2 pt-10 border-t border-slate-50 flex gap-4">
        <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-800 transition-colors">Hủy bỏ</button>
        <button type="submit" className="flex-2 bg-slate-900 text-white px-20 py-4 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:-translate-y-1 transition-all shadow-xl shadow-slate-200">Lưu khóa học</button>
      </div>
    </form>
  );
};

export default CourseForm;
