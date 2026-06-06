import React from 'react';

const OrderConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Xác nhận đơn hàng", 
  items = [], 
  courseName = null,
  customerInfo = {}, 
  total = 0,
  isLoading = false 
}) => {
  if (!isOpen) return null;

  const formatPrice = (p) => p?.toLocaleString('vi-VN') + ' ₫';

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-6 animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-[40px] overflow-hidden shadow-2xl animate-zoom-in flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight italic">
            {title}
          </h2>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-white hover:text-slate-900 transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-8 space-y-8">
          
          {/* Customer Info */}
          <div className="space-y-4">
             <h3 className="text-[10px] font-black text-[#00c7d3] uppercase tracking-[0.3em] flex items-center gap-3">
                <span className="w-8 h-[2px] bg-[#00c7d3]/20"></span>
                Thông tin người nhận
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <div>
                   <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Họ và tên</p>
                   <p className="font-bold text-slate-800">{customerInfo.name || customerInfo.fullName}</p>
                </div>
                <div>
                   <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Số điện thoại</p>
                   <p className="font-bold text-slate-800">{customerInfo.phone}</p>
                </div>
                <div className="md:col-span-2">
                   <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Địa chỉ nhận hàng</p>
                   <p className="font-bold text-slate-800">{customerInfo.address}</p>
                </div>
             </div>
          </div>

          {/* Order Items / Course */}
          <div className="space-y-4">
             <h3 className="text-[10px] font-black text-[#00c7d3] uppercase tracking-[0.3em] flex items-center gap-3">
                <span className="w-8 h-[2px] bg-[#00c7d3]/20"></span>
                Chi tiết đơn hàng
             </h3>
             
             <div className="space-y-3">
                {courseName ? (
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center gap-4">
                     <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white shrink-0">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 14l9-5-9-5-9 5 9 5z"/><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>
                     </div>
                     <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Khóa học đăng ký</p>
                        <p className="font-black text-slate-800 italic">{courseName}</p>
                     </div>
                  </div>
                ) : (
                  items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 group">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                             <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                             <p className="font-bold text-slate-800 line-clamp-1 text-sm">{item.name}</p>
                             <p className="text-[11px] text-slate-400 font-medium">Số lượng: <span className="text-slate-900 font-black">{item.quantity}</span></p>
                          </div>
                       </div>
                       <p className="font-black text-slate-900 text-sm italic">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))
                )}
             </div>
          </div>

          {/* Total */}
          <div className="pt-6 border-t border-dashed border-slate-200">
             <div className="flex justify-between items-center">
                <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Tổng cộng</span>
                <span className="text-3xl font-black text-[#00c7d3] italic">{formatPrice(total)}</span>
             </div>
          </div>

        </div>

        {/* Actions */}
        <div className="p-8 bg-slate-50/50 border-t border-slate-50 grid grid-cols-2 gap-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-slate-900 transition-colors disabled:opacity-50"
          >
            Quay lại chỉnh sửa
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-slate-900 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-[#00c7d3] hover:shadow-[#00c7d3]/20 hover:-translate-y-0.5 transition-all disabled:bg-slate-300 disabled:shadow-none disabled:translate-y-0"
          >
            {isLoading ? (
               <div className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Đang xử lý...</span>
               </div>
            ) : (
              'Xác nhận đặt hàng'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmModal;
