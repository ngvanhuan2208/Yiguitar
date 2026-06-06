import React from 'react';

const BrandModal = ({ 
  showBrandModal, 
  setShowBrandModal, 
  filterCategory, 
  TAB_LABELS, 
  newBrand, 
  setNewBrand, 
  handleAddBrand 
}) => {
  if (!showBrandModal) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[70] flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md rounded-[32px] p-10 shadow-2xl">
        <h2 className="text-2xl font-black text-slate-800 italic mb-2">Thêm thương hiệu mới</h2>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">
          Cho danh mục: <span className="text-slate-900">{(TAB_LABELS[filterCategory] || 'Sản phẩm')}</span>
        </p>
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-1 block">Tên hãng</label>
            <input
              autoFocus
              value={newBrand.name || ''}
              onChange={e => setNewBrand({ ...newBrand, name: e.target.value })}
              placeholder="Ví dụ: Yamaha, Ba Đờn..."
              className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-slate-900/20"
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-1 block">URL Logo (Ảnh vuông)</label>
            <input
              value={newBrand.logo || ''}
              onChange={e => setNewBrand({ ...newBrand, logo: e.target.value })}
              placeholder="https://..."
              className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-slate-900/20"
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-1 block">Mô tả ngắn</label>
            <input
              value={newBrand.description || ''}
              onChange={e => setNewBrand({ ...newBrand, description: e.target.value })}
              placeholder="Hãng đàn đến từ..."
              className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-slate-900/20"
            />
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { setShowBrandModal(false); setNewBrand({ name: '', logo: '', description: '' }); }}
            className="flex-1 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-800 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleAddBrand}
            className="flex-1 bg-slate-900 text-white px-10 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:-translate-y-0.5 transition-all shadow-xl shadow-slate-200"
          >
            Thêm hãng
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrandModal;
