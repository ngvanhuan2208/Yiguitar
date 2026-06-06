import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '@/api/axios';

const WarrantyPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [warrantyInfo, setWarrantyInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.error('Vui lòng nhập mã đơn hàng hoặc số điện thoại!');
      return;
    }

    try {
      setLoading(true);
      setWarrantyInfo(null);
      const response = await api.get(`/orders/warranty-lookup?query=${searchQuery.trim()}`);
      setWarrantyInfo(response.data);
      toast.success('Đã tìm thấy thông tin bảo hành!');
    } catch (err) {
      if (err.response && err.response.status === 404) {
        toast.error('Không tìm thấy đơn hàng nào khớp với thông tin này!');
      } else {
        toast.error('Có lỗi xảy ra khi tra cứu. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black italic text-slate-800 uppercase tracking-tighter mb-4">
            Tra Cứu <span className="text-[#00c7d3]">Bảo Hành</span>
          </h1>
          <p className="text-slate-500 font-medium">
            Nhập số điện thoại mua hàng để kiểm tra thời hạn bảo hành của bạn tại Yi Guitar.
          </p>
        </div>

        <div className="bg-white rounded-[32px] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-grow">
              <input
                type="text"
                placeholder="Nhập SĐT hoặc Mã đơn hàng (VD: 0987...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-[#00c7d3]/20 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#00c7d3] transition-all whitespace-nowrap flex items-center justify-center min-w-[160px] shadow-lg shadow-slate-900/10 disabled:opacity-70"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Kiểm tra ngay'
              )}
            </button>
          </form>

          {warrantyInfo && (
            <div className="mt-8 pt-8 border-t border-slate-100 animate-fade-in">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Kết quả tra cứu</h3>
              
              <div className="mb-8 pl-4 border-l-4 border-[#00c7d3]">
                <p className="text-[13px] font-bold text-slate-500 mb-1">Khách hàng: <span className="text-slate-800">{warrantyInfo.customerName}</span></p>
                <p className="text-[11px] text-slate-400 font-medium">{warrantyInfo.lookupType}: <span className="text-slate-600">{warrantyInfo.lookupValue}</span></p>
                <p className="text-[11px] text-slate-400 font-medium">Tổng số sản phẩm tìm thấy: <span className="text-slate-600">{warrantyInfo.products.length}</span></p>
              </div>

              <div className="space-y-6">
                {warrantyInfo.products.map((product, index) => (
                  <div key={index} className="bg-slate-50 rounded-3xl p-6 md:p-8 border border-slate-100 relative overflow-hidden shadow-sm">
                    <div className={`absolute top-0 left-0 w-2 h-full ${product.isExpired ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                      <div>
                        <p className="font-black text-slate-800 text-xl md:text-2xl mb-1">{product.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">Thuộc Mã ĐH: {product.orderId}</p>
                      </div>
                      
                      <div className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${
                        product.isExpired 
                          ? 'bg-rose-100 text-rose-600' 
                          : 'bg-emerald-100 text-emerald-600'
                      }`}>
                        <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${product.isExpired ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
                        {product.isExpired ? 'Đã hết hạn bảo hành' : 'Đang bảo hành'}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-white p-4 lg:p-5 rounded-2xl border border-slate-100 shadow-sm">
                        <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ngày mua</p>
                        <p className="font-bold text-slate-700 text-sm md:text-lg">{formatDate(product.purchaseDate)}</p>
                      </div>
                      <div className="bg-white p-4 lg:p-5 rounded-2xl border border-slate-100 shadow-sm">
                        <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Thời hạn</p>
                        <p className="font-bold text-slate-700 text-sm md:text-lg">{product.warrantyText}</p>
                      </div>
                      <div className="bg-white p-4 lg:p-5 rounded-2xl border border-slate-100 shadow-sm">
                        <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Hết hạn vào</p>
                        <p className={`font-bold text-sm md:text-lg ${product.isExpired ? 'text-rose-500' : 'text-emerald-500'}`}>
                          {product.warrantyText === 'Không bảo hành' ? 'Không áp dụng' : formatDate(product.expiryDate)}
                        </p>
                      </div>
                    </div>

                  </div>
                ))}
              </div>

              <div className="mt-8 text-center bg-white p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_-12px_rgba(0,199,211,0.2)] border border-[#00c7d3]/20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00c7d3] to-transparent opacity-50"></div>
                <p className="text-slate-600 text-sm md:text-base font-medium leading-relaxed">
                  Các sản phẩm còn thời hạn sẽ tiếp tục được bảo vệ an toàn bởi gói bảo hành tương ứng. 
                  <br className="hidden sm:block" />
                  Đối với sản phẩm đã hết hạn, Yi Guitar vẫn luôn hỗ trợ sửa chữa với chi phí cực kỳ ưu đãi!
                </p>
                <div className="mt-4 inline-flex items-center gap-3 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-[#00c7d3]/10 flex items-center justify-center text-[#00c7d3]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hỗ trợ kỹ thuật 24/7</p>
                    <p className="font-black text-[#00c7d3] text-lg sm:text-xl tracking-wide">0766 665 689</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WarrantyPage;
