import React from 'react';
import EmptyState from '@/components/common/EmptyState';

const ProductTable = ({ 
  products, 
  loading, 
  currentPage, 
  totalPages, 
  setCurrentPage, 
  handleEdit, 
  handleDelete 
}) => {
  return (
    <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-xl shadow-slate-200/50">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50">
              <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Sản phẩm</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Danh mục</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Giá / Kho</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan="4" className="p-20 text-center text-slate-300 italic font-bold">Đang tải...</td></tr>
            ) : products?.length === 0 ? (
              <tr><td colSpan="4"><EmptyState message="Chưa có sản phẩm nào trong danh mục này" /></td></tr>
            ) : (products || []).map((product) => (
              <tr key={product._id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <img src={product.image} className="w-12 h-12 rounded-xl object-cover bg-slate-100" loading="lazy" />
                    <div>
                      <p className="font-black text-slate-800 line-clamp-1 italic">{product.name || 'Sản phẩm không tên'}</p>
                      <div className="flex items-center gap-2">
                         <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                           {(product.brand && typeof product.brand === 'object') ? (product.brand.name || 'Không rõ hãng') : (product.brand || product.type || 'Không rõ hãng')}
                         </p>
                         {product.isFeatured && <span className="text-[10px] text-amber-500 font-bold">⭐ Nổi bật</span>}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <p className="text-[11px] font-black text-[#00c7d3] uppercase tracking-widest">{product.category || 'Chưa phân loại'}</p>
                  <p className="text-[10px] font-bold text-slate-500 italic">{product.type || 'Chưa có loại'}</p>
                </td>
                <td className="px-8 py-6">
                  <p className="font-black text-slate-800 italic">{(product.price || 0).toLocaleString()}₫</p>
                  {product.category !== 'Course' && product.category !== 'Tab' && (
                    <p className={`text-[10px] font-black uppercase tracking-widest ${(product.stock || 0) > 10 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      Còn {product.stock || 0} trong kho
                    </p>
                  )}
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleEdit(product)} className="p-2 hover:bg-emerald-50 text-emerald-500 rounded-lg transition-colors" aria-label="Chỉnh sửa sản phẩm"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg></button>
                    <button onClick={() => handleDelete(product._id)} className="p-2 hover:bg-rose-50 text-rose-500 rounded-lg transition-colors" aria-label="Xóa sản phẩm"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-8 border-t border-slate-50 flex justify-center gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-8 h-8 rounded-lg font-black text-xs transition-all ${currentPage === i + 1 ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductTable;
