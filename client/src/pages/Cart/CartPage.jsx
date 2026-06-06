import { toast } from 'react-hot-toast';
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import api from '@/api/axios';
import OrderConfirmModal from '@/components/common/OrderConfirmModal';

const CartPage = () => {
  const location = useLocation();
  const buyNowItem = location.state?.buyNowItem;
  const isBuyNow = !!buyNowItem;

  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { user, setIsAuthOpen, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    note: ''
  });
  const [loading, setLoading] = useState(false);
  const [ordered, setOrdered] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ── Protection Logic (U4) ─────────────────
  useEffect(() => {
    if (!authLoading && !user) {
      // Keep user on page, just open modal
      setIsAuthOpen(true);
    }
  }, [user, authLoading, setIsAuthOpen]);

  // Autofill if user is logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        address: user.address || prev.address
      }));
    }
  }, [user]);

  const displayItems = isBuyNow ? [buyNowItem] : cartItems;
  const displayTotal = isBuyNow ? (buyNowItem.price * (buyNowItem.quantity || 1)) : cartTotal;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Cậu cần đăng nhập để tiến hành đặt hàng nhé!');
      setIsAuthOpen(true);
      return;
    }
    if (displayItems.length === 0) {
      toast.error('Giỏ hàng đang trống, cậu hãy chọn sản phẩm trước nhé!');
      return;
    }
    
    // Open Confirmation Modal instead of immediate submission
    setShowConfirm(true);
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      const orderData = {
        items: displayItems.map(item => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        customerInfo: formData,
        totalAmount: displayTotal,
        userId: user._id
      };
      await api.post('/orders', orderData);
      setOrdered(true);
      setShowConfirm(false);
      
      if (isBuyNow) {
        removeFromCart(buyNowItem._id);
      } else {
        clearCart();
      }
    } catch (err) {
      console.error('Error submitting order:', err);
      const errorMsg = err.response?.data?.message || 'Có lỗi xảy ra, cậu vui lòng thử lại nhé!';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (ordered) {
    return (
      <div className="bg-white min-h-screen py-20 fade-in">
        <div className="container mx-auto px-6 text-center">
           <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto mb-8 shadow-xl shadow-emerald-200">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
           </div>
           <h1 className="text-4xl font-black text-slate-900 mb-4 italic">Đặt trước thành công!</h1>
           <p className="text-slate-500 font-medium max-w-md mx-auto mb-10 leading-relaxed">
             Cảm ơn cậu đã tin tưởng Yi Guitar. Tụi mình đã nhận được yêu cầu và sẽ gọi điện tư vấn cho cậu sớm nhất có thể nhé!
           </p>
           <Link to="/" className="inline-block bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:-translate-y-1 transition-all shadow-xl shadow-slate-200">
              Quay lại trang chủ
           </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-32 fade-in">
      <div className="bg-gradient-to-b from-[#92E4EC] to-[#A9EBEF] py-20 mb-12">
        <div className="container mx-auto px-6 lg:px-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-[#0f172a] mb-2 drop-shadow-sm">Giỏ hàng của cậu</h1>
          <p className="text-[#334155] font-medium">Kiểm tra lại danh sách và để lại thông tin để Yi Guitar tư vấn nhé!</p>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-16">
        {displayItems.length === 0 ? (
          <div className="bg-white rounded-[48px] p-20 text-center shadow-xl shadow-slate-200/50 border border-slate-100">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-6">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
             </div>
             <p className="text-xl font-bold text-slate-400 mb-8 italic">Giỏ hàng đang trống trơn nè...</p>
             <Link to="/guitar" className="bg-[#00c7d3] text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-cyan-100">
                Đi xem đàn ngay
             </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Cart List */}
            <div className="lg:col-span-8 space-y-4">
              {displayItems.map((item) => (
                <div key={item._id} className="bg-white p-6 rounded-[32px] flex items-center gap-6 shadow-sm border border-slate-50 group hover:shadow-xl hover:shadow-slate-200/50 transition-all">
                  <div className="w-24 h-24 lg:w-32 lg:h-32 bg-slate-50 rounded-2xl overflow-hidden shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-black text-slate-800 line-clamp-1">{item.name}</h3>
                    <p className="text-[#00c7d3] font-black text-sm mt-1 mb-4 italic">
                      {item.price.toLocaleString('vi-VN')}₫
                    </p>
                    <div className="flex items-center gap-4">
                       <div className="flex items-center bg-slate-50 rounded-xl px-2 py-1 border border-slate-100">
                          <button disabled={isBuyNow} onClick={() => updateQuantity(item._id, -1)} aria-label="Giảm số lượng" className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors font-bold text-lg disabled:opacity-20">-</button>
                          <span className="w-10 text-center font-black text-slate-800">{item.quantity}</span>
                          <button disabled={isBuyNow} onClick={() => updateQuantity(item._id, 1)} aria-label="Tăng số lượng" className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors font-bold text-lg disabled:opacity-20">+</button>
                       </div>
                       {!isBuyNow && <button onClick={() => removeFromCart(item._id)} className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-red-500 transition-colors ml-4">Gỡ bỏ</button>}
                    </div>
                  </div>
                  <div className="hidden md:block text-right shrink-0 pr-6">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Thành tiền</p>
                     <p className="text-xl font-black text-slate-900 italic">{(item.price * item.quantity).toLocaleString('vi-VN')}₫</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Form Section */}
            <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
              <div className="bg-white p-10 rounded-[48px] shadow-2xl shadow-slate-200/50 border border-slate-50">
                <h2 className="text-2xl font-black text-slate-800 mb-8 italic">Thông tin nhận tư vấn</h2>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Họ và tên</label>
                     <input 
                       type="text" 
                       required
                       placeholder="Nguyễn Văn A"
                       value={formData.name}
                       onChange={(e) => setFormData({...formData, name: e.target.value})}
                       className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#00c7d3]/20 transition-all"
                     />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Số điện thoại</label>
                     <input 
                       type="tel" 
                       required
                       placeholder="09xx xxx xxx"
                       value={formData.phone}
                       onChange={(e) => setFormData({...formData, phone: e.target.value})}
                       className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#00c7d3]/20 transition-all"
                     />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Email nhận xác nhận</label>
                     <input 
                       type="email" 
                       required
                       placeholder="example@gmail.com"
                       value={formData.email}
                       onChange={(e) => setFormData({...formData, email: e.target.value})}
                       className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#00c7d3]/20 transition-all"
                     />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Địa chỉ</label>
                     <input 
                       type="text" 
                       placeholder="Quận/Huyện, Tỉnh/TP"
                       value={formData.address}
                       onChange={(e) => setFormData({...formData, address: e.target.value})}
                       className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#00c7d3]/20 transition-all"
                     />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Ghi chú (nếu có)</label>
                     <textarea 
                       rows="3" 
                       placeholder="Cậu cần shop tư vấn thêm gì không?"
                       value={formData.note}
                       onChange={(e) => setFormData({...formData, note: e.target.value})}
                       className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#00c7d3]/20 transition-all resize-none"
                     ></textarea>
                   </div>

                   <div className="pt-6 border-t border-slate-100 mt-6">
                      <div className="flex justify-between items-center mb-6">
                         <span className="text-sm font-black text-slate-400 uppercase tracking-widest">{isBuyNow ? 'Món đặt ngay' : 'Toàn bộ giỏ'}</span>
                         <span className="text-2xl font-black text-[#00c7d3] italic">{displayTotal.toLocaleString('vi-VN')}₫</span>
                      </div>
                      <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-300 hover:-translate-y-1 transition-all disabled:opacity-50"
                      >
                        {loading ? 'Đang gửi yêu cầu...' : 'Gửi yêu cầu đặt trước'}
                      </button>
                      <p className="text-[10px] text-center text-slate-400 mt-4 font-bold italic">
                        * Tụi mình sẽ liên hệ lại qua điện thoại để xác nhận đơn hàng nhé!
                      </p>
                   </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      <OrderConfirmModal 
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleFinalSubmit}
        customerInfo={formData}
        items={displayItems}
        total={displayTotal}
        isLoading={loading}
      />
    </div>
  );
};

export default CartPage;
