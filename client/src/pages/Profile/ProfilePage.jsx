import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import api from '@/api/axios';
import { getApiErrorMessage } from '@/utils/textEncoding';

const ProfilePage = () => {
  const { user, setUser, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'info';
  
  const [activeTab, setActiveTab] = useState(initialTab); // 'info' or 'orders'
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  
  // Sync tab with URL
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  // Profile Form States
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });

  // Password Form States
  const [passData, setPassData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passSaving, setPassSaving] = useState(false);
  const [passMsg, setPassMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
    }
    if (user) {
      setProfileData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (activeTab === 'orders' && user) {
      fetchOrders();
    }
  }, [activeTab, user]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await api.get('/orders/my-orders');
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg({ type: '', text: '' });
    try {
      const res = await api.put('/auth/profile', profileData);
      setUser(res.data);
      setProfileMsg({ type: 'success', text: 'Cập nhật thông tin thành công! ✨' });
    } catch (err) {
      setProfileMsg({ type: 'error', text: getApiErrorMessage(err, 'Có lỗi xảy ra') });
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passData.newPassword !== passData.confirmPassword) {
      setPassMsg({ type: 'error', text: 'Mật khẩu mới không khớp nhau!' });
      return;
    }
    setPassSaving(true);
    setPassMsg({ type: '', text: '' });
    try {
      await api.put('/auth/change-password', {
        oldPassword: passData.oldPassword,
        newPassword: passData.newPassword
      });
      setPassMsg({ type: 'success', text: 'Đổi mật khẩu thành công rồi nhé! 🔐' });
      setPassData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPassMsg({ type: 'error', text: getApiErrorMessage(err, 'Mật khẩu cũ không đúng') });
    } finally {
      setPassSaving(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      setProfileMsg({ type: 'info', text: 'Đang tải ảnh lên...' });
      const res = await api.post('/auth/avatar', formData);
      setUser(res.data);
      setProfileMsg({ type: 'success', text: 'Cập nhật ảnh đại diện thành công! ✨' });
    } catch (err) {
      console.error('Avatar Upload Error:', err);
      const errorMsg = getApiErrorMessage(err, 'Lỗi tải ảnh. Cậu thử lại nhé!');
      setProfileMsg({ type: 'error', text: errorMsg });
    }
  };

  const totalSpent = orders
    .filter(o => o.status !== 'Đã hủy')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Đã hủy': return 'bg-rose-50 text-rose-500 border-rose-100';
      case 'Đã liên hệ': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-amber-50 text-amber-600 border-amber-100';
    }
  };

  if (authLoading || !user) return <div className="min-h-screen bg-white flex items-center justify-center text-slate-300 italic font-bold">Đang tải hồ sơ...</div>;

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-32 fade-in">
      {/* ── Header ────────────────────────── */}
      <div className="bg-gradient-to-b from-[#92E4EC] to-[#A9EBEF] pt-24 pb-32 relative overflow-hidden">
         {/* Decorative Glowing Blob */}
         <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-white/30 rounded-full blur-[80px] -translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
         
         <div className="container mx-auto px-6 lg:px-16 relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-8">
               <div className="relative group">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-[40px] bg-white border-4 border-white backdrop-blur-md flex items-center justify-center text-4xl md:text-5xl font-black text-[#00c7d3] shadow-2xl shadow-cyan-200/50 overflow-hidden">
                    {user.avatar ? (
                      <img src={`${import.meta.env.VITE_BASE_URL}${user.avatar}`} alt={user.name} className="w-full h-full object-cover" />
                    ) : user.name.charAt(0)}
                  </div>
                  {/* Avatar Picker Icon */}
                  <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-slate-900 shadow-xl cursor-pointer hover:scale-110 active:scale-95 transition-all group-hover:bg-[#00c7d3] group-hover:text-white border-4 border-[#A9EBEF]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                  </label>
               </div>
               <div className="text-center md:text-left">
                  <h1 className="text-3xl md:text-5xl font-black italic mb-2 tracking-tight text-[#0f172a] drop-shadow-sm">{user.name}</h1>
                  <p className="text-[#334155] font-bold uppercase tracking-widest text-[10px] md:text-xs flex items-center justify-center md:justify-start gap-2">
                     <svg className="w-4 h-4 text-[#00c7d3]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                     {user.email}
                  </p>
               </div>
            </div>
         </div>
      </div>

      <div className="container mx-auto px-6 lg:px-16 -mt-16 relative z-20">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* ── Sidebar ─────────────────────── */}
            <div className="lg:col-span-3 space-y-4">
               <div className="bg-white rounded-[32px] p-4 shadow-xl shadow-slate-200/50 border border-slate-100">
                  <button onClick={() => setActiveTab('info')} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-[13px] uppercase tracking-wide transition-all ${activeTab === 'info' ? 'bg-[#00c7d3] text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                     Cá nhân
                  </button>
                  <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-[13px] uppercase tracking-wide transition-all mt-2 ${activeTab === 'orders' ? 'bg-[#00c7d3] text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                     Đơn hàng
                  </button>
                  <div className="pt-4 mt-4 border-t border-slate-50">
                     <button onClick={logout} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-[13px] uppercase tracking-wide text-rose-500 hover:bg-rose-50 transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                        Đăng xuất
                     </button>
                  </div>
               </div>

               {activeTab === 'orders' && (
                  <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-xl shadow-slate-300">
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2">Tổng chi tiêu</p>
                     <h2 className="text-2xl md:text-3xl font-black italic text-[#00c7d3]">{totalSpent.toLocaleString('vi-VN')}₫</h2>
                     <p className="text-[10px] font-bold text-white/30 mt-4 leading-relaxed line-clamp-2">Dựa trên tất cả các đơn hàng đã đặt  trừ đơn hủy).</p>
                  </div>
               )}
            </div>

            {/* ── Main Content ────────────────── */}
            <div className="lg:col-span-9">
               {activeTab === 'info' ? (
                  <div className="space-y-8">
                     {/* Personal Info Form */}
                     <div className="bg-white rounded-[40px] p-6 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#00c7d3]/5 rounded-bl-[100px]"></div>
                        <h2 className="text-xl md:text-2xl font-black text-slate-800 italic mb-8">Thông tin liên hệ</h2>
                        <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">Họ và tên hiển thị</label>
                              <input value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#00c7d3]/20 transition-all" />
                           </div>
                           <div className="space-y-2 opacity-60">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">Email (Không thể đổi)</label>
                              <input disabled value={user.email} className="w-full bg-slate-100 border-none rounded-2xl p-4 text-sm font-bold cursor-not-allowed" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">Số điện thoại</label>
                              <input value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#00c7d3]/20 transition-all" placeholder="09xx xxx xxx" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">Địa chỉ mặc định</label>
                              <input value={profileData.address} onChange={e => setProfileData({...profileData, address: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#00c7d3]/20 transition-all" placeholder="Quận/Huyện, Tỉnh/TP" />
                           </div>
                           <div className="md:col-span-2 flex flex-col md:flex-row items-center justify-between pt-6 gap-4">
                              {profileMsg.text && (
                                 <p className={`text-[11px] font-black uppercase ${profileMsg.type === 'success' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {profileMsg.text}
                                 </p>
                              )}
                              <button disabled={profileSaving} type="submit" className="w-full md:w-auto bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:-translate-y-1 transition-all shadow-lg ml-auto">
                                 {profileSaving ? 'Đang lưu...' : 'Lưu hồ sơ'}
                              </button>
                           </div>
                        </form>
                     </div>

                     {/* Change Password Form */}
                     <div className="bg-white rounded-[40px] p-6 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-50 relative overflow-hidden">
                        <h2 className="text-xl md:text-2xl font-black text-slate-800 italic mb-8">Bảo mật & Mật khẩu</h2>
                        <form onSubmit={handleChangePassword} className="space-y-6">
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">Mật khẩu cũ</label>
                                 <input type="password" required value={passData.oldPassword} onChange={e => setPassData({...passData, oldPassword: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#00c7d3]/20 transition-all" />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">Mật khẩu mới</label>
                                 <input type="password" required value={passData.newPassword} onChange={e => setPassData({...passData, newPassword: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#00c7d3]/20 transition-all" />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">Xác nhận mật khẩu</label>
                                 <input type="password" required value={passData.confirmPassword} onChange={e => setPassData({...passData, confirmPassword: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#00c7d3]/20 transition-all" />
                              </div>
                           </div>
                           <div className="flex flex-col md:flex-row items-center justify-between pt-4 gap-4">
                              {passMsg.text && (
                                 <p className={`text-[11px] font-black uppercase ${passMsg.type === 'success' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {passMsg.text}
                                 </p>
                              )}
                              <button disabled={passSaving} type="submit" className="w-full md:w-auto bg-[#00c7d3] text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-cyan-100 ml-auto">
                                 {passSaving ? 'Đang cập nhật...' : 'Đổi mật khẩu ngay'}
                              </button>
                           </div>
                        </form>
                     </div>
                  </div>
               ) : (
                  <div className="bg-white rounded-[40px] p-6 lg:p-10 shadow-xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
                     <h2 className="text-xl md:text-2xl font-black text-slate-800 italic mb-8 px-4">Lịch sử đơn hàng</h2>
                     
                     {ordersLoading ? (
                        <div className="py-20 text-center text-slate-300 font-bold italic">Đang tải danh sách đơn hàng...</div>
                     ) : orders.length === 0 ? (
                        <div className="py-20 text-center">
                           <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-4">
                              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                           </div>
                           <p className="text-slate-400 font-bold italic">Cậu chưa có đơn hàng nào cả.</p>
                           <button onClick={() => navigate('/guitar')} className="mt-6 text-[#00c7d3] font-black text-xs uppercase tracking-widest hover:underline">Đi mua sắm ngay →</button>
                        </div>
                     ) : (
                        <div className="space-y-6">
                           {orders.map((order) => (
                              <div key={order._id} className="bg-slate-50/50 rounded-[32px] p-6 lg:p-8 border border-slate-50 group hover:bg-white hover:shadow-xl transition-all">
                                 <div className="flex flex-col lg:flex-row justify-between gap-6">
                                    <div className="flex gap-6">
                                       <div className="flex -space-x-4 overflow-hidden shrink-0">
                                          {order.items.slice(0, 3).map((item, idx) => (
                                             <img key={idx} src={item.image} className="w-14 h-14 rounded-xl border-2 border-white object-cover bg-white" alt={item.name} />
                                          ))}
                                          {order.items.length > 3 && (
                                             <div className="w-14 h-14 rounded-xl border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-black">+{order.items.length - 3}</div>
                                          )}
                                       </div>
                                       <div>
                                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Mã đơn: #{order._id.slice(-8).toUpperCase()}</p>
                                          <p className="text-[13px] font-black text-slate-800 line-clamp-1">{order.items.map(i => i.name).join(', ')}</p>
                                          <p className="text-xs font-bold text-slate-400 mt-1">{new Date(order.createdAt).toLocaleDateString('vi-VN')} • {order.items.length} sản phẩm</p>
                                       </div>
                                    </div>
                                    <div className="flex items-center justify-between lg:justify-end gap-10">
                                       <div className="text-right">
                                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Tổng thanh toán</p>
                                          <p className="text-lg font-black text-slate-900 italic">{order.totalAmount.toLocaleString('vi-VN')}₫</p>
                                       </div>
                                       <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(order.status)}`}>
                                          {order.status}
                                       </span>
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     )}
                  </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
};

export default ProfilePage;
