import React from 'react';

const GuitarForm = ({ 
  formData, 
  setFormData, 
  categories, 
  brandsList, 
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
      {/* 🎸 CLASSIC PRODUCT FORM */}
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Tên sản phẩm</label>
        <input required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#00c7d3]/20" />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Danh mục chính</label>
        <select 
          disabled={filterCategory !== 'Tất cả' && !editingProduct}
          value={formData.category || 'Guitar'} 
          onChange={e => setFormData({...formData, category: e.target.value})} 
          className={`w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#00c7d3]/20 ${filterCategory !== 'Tất cả' && !editingProduct ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          {categories.map(cat => (
            <option key={cat._id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Phân loại cụ thể</label>
        <select 
          required 
          value={formData.type || ''} 
          onChange={e => setFormData({...formData, type: e.target.value})} 
          className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#00c7d3]/20"
        >
          <option value="">Chọn loại...</option>
          {(categories.find(c => c.name === formData.category)?.subCategories || []).map(sub => (
            <option key={sub} value={sub}>{sub}</option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Hãng sản xuất</label>
        <select 
          required 
          value={formData.brand || ''} 
          onChange={e => setFormData({...formData, brand: e.target.value})} 
          className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#00c7d3]/20"
        >
          <option value="">Chọn hãng...</option>
          {(brandsList || [])
            .map(brand => (
              <option key={brand._id} value={brand._id}>{brand.name}</option>
          ))}
          {!(brandsList && brandsList.length > 0) && (
            <option disabled>Chưa có hãng nào trong hệ thống</option>
          )}
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Giá bán (VNĐ)</label>
        <input type="number" required value={formData.price || 0} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#00c7d3]/20" />
      </div>
      <div className="space-y-4 md:col-span-2 bg-slate-50/50 p-6 rounded-[24px] border border-dashed border-slate-200">
        <div className="flex justify-between items-center px-4">
          <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Bộ sưu tập hình ảnh</label>
          <label className="cursor-pointer bg-white border border-slate-200 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm">
            {loading ? 'Đang tải...' : '+ Tải ảnh từ máy'}
            <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" disabled={loading} />
          </label>
        </div>

        {/* Image Previews */}
        <div className="flex flex-wrap gap-4 mt-2 px-2">
          {formData.images && formData.images.map((img, idx) => (
            <div key={idx} className="relative group w-24 h-24 rounded-2xl overflow-hidden border-2 border-white shadow-md">
              <img src={img} className="w-full h-full object-cover" />
              <button 
                type="button" 
                onClick={() => removeImage(idx)}
                className="absolute inset-0 bg-rose-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all font-black"
              >
                XÓA
              </button>
              {formData.image === img && (
                <div className="absolute top-1 left-1 bg-emerald-500 text-[6px] text-white font-black px-1.5 py-0.5 rounded-full uppercase">Bìa</div>
              )}
            </div>
          ))}
          {(!formData.images || formData.images.length === 0) && (
            <div className="w-full py-10 flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-100 rounded-2xl">
               <p className="text-[10px] font-bold uppercase tracking-widest">Chưa có ảnh nào được tải lên</p>
            </div>
          )}
        </div>
        
        <div className="px-4">
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Hoặc dán URL ảnh bìa (Thumbnail)</label>
          <input value={formData.image || ''} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full bg-white border border-slate-100 rounded-xl p-3 text-xs font-bold focus:ring-2 focus:ring-[#00c7d3]/20" placeholder="https://..." />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Tồn kho</label>
        <input type="number" required value={formData.stock || 0} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#00c7d3]/20" />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Thời gian bảo hành</label>
        <input value={formData.warranty || ''} onChange={e => setFormData({...formData, warranty: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#00c7d3]/20" placeholder="Ví dụ: 12 Tháng, 24 Tháng..." />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Đánh giá (1-5 sao)</label>
        <select value={formData.rating || 5} onChange={e => setFormData({...formData, rating: Number(e.target.value)})} className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#00c7d3]/20">
          {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v} ⭐</option>)}
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Số lượng đánh giá</label>
        <input type="number" value={formData.reviews || 0} onChange={e => setFormData({...formData, reviews: Number(e.target.value)})} className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#00c7d3]/20" />
      </div>
      
      <div className="space-y-2 md:col-span-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Giới thiệu sản phẩm (Chi tiết)</label>
        <textarea rows="4" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-semibold focus:ring-2 focus:ring-[#00c7d3]/20 placeholder:text-slate-300" placeholder="Mô tả chi tiết về cần đàn, gỗ mặt, gỗ lưng, chất âm..."></textarea>
      </div>
      <div className="space-y-2 md:col-span-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Video Test (Dán Link YouTube)</label>
        <input value={formData.videoId || ''} onChange={e => setFormData({...formData, videoId: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#00c7d3]/20 placeholder:text-slate-300" placeholder="Cậu có thể dán cả đường link YouTube vào đây, tớ sẽ tự xử lý nhé!" />
      </div>

      <div className="md:col-span-2 pt-10 border-t border-slate-50 flex gap-4">
        <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-800 transition-colors">Hủy bỏ</button>
        <button type="submit" className="flex-2 bg-slate-900 text-white px-20 py-4 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:-translate-y-1 transition-all shadow-xl shadow-slate-200">Lưu sản phẩm</button>
      </div>
    </form>
  );
};

export default GuitarForm;
