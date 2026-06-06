import React from 'react';

const CategoryModal = ({ 
  showCategoryModal, 
  setShowCategoryModal, 
  filterCategory, 
  TAB_LABELS, 
  newSubCategory, 
  setNewSubCategory, 
  handleAddSubCategory 
}) => {
  if (!showCategoryModal) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[70] flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md rounded-[32px] p-10 shadow-2xl">
        <h2 className="text-2xl font-black text-slate-800 italic mb-2">Thêm danh mục con</h2>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">
          Cho danh mục: <span className="text-[#00c7d3]">{(TAB_LABELS[filterCategory] || 'Sản phẩm')}</span>
        </p>
        <div className="space-y-2 mb-6">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Tên danh mục con</label>
          <input
            autoFocus
            value={newSubCategory || ''}
            onChange={e => setNewSubCategory(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddSubCategory()}
            placeholder="Ví dụ: Acoustic, Electric, Online..."
            className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#00c7d3]/20"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { setShowCategoryModal(false); setNewSubCategory(''); }}
            className="flex-1 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-800 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleAddSubCategory}
            className="flex-1 bg-slate-900 text-white px-10 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:-translate-y-0.5 transition-all shadow-xl shadow-slate-200"
          >
            Thêm danh mục
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
