import React, { useState, useEffect } from 'react';
import api from '@/api/axios';
import EmptyState from '@/components/common/EmptyState';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState(null);
  const [updateStatus, setUpdateStatus] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [filterStatus, setFilterStatus] = useState('Tất cả');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/orders/${editingOrder._id}`, {
        status: updateStatus,
        adminNote: adminNote
      });
      setEditingOrder(null);
      fetchOrders();
    } catch (err) {
      console.error('Error updating order:', err);
      alert('Có lỗi xảy ra khi cập nhật!');
    }
  };

  const openEditModal = (order) => {
    setEditingOrder(order);
    setUpdateStatus(order.status);
    setAdminNote(order.adminNote || '');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Chờ tư vấn': return 'bg-amber-100 text-amber-600 border-amber-200';
      case 'Đã thanh toán': return 'bg-sky-100 text-sky-600 border-sky-200';
      case 'Đang giao': return 'bg-indigo-100 text-indigo-600 border-indigo-200';
      case 'Hoàn thành': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
      case 'Đã hủy': return 'bg-rose-100 text-rose-600 border-rose-200';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const filteredOrders = orders.filter(o => filterStatus === 'Tất cả' || o.status === filterStatus);

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20 fade-in">
      <div className="bg-white border-b border-slate-100 py-10 mb-10">
        <div className="container mx-auto px-6 lg:px-16 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-slate-800 italic">Quản lý Đơn hàng</h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Admin Dashboard / Orders</p>
          </div>
          <div className="flex gap-4">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-600 focus:ring-2 focus:ring-[#00c7d3]/20"
            >
              <option>Tất cả</option>
              <option>Chờ tư vấn</option>
              <option>Đã thanh toán</option>
              <option>Đang giao</option>
              <option>Hoàn thành</option>
              <option>Đã hủy</option>
            </select>
            <button 
              onClick={fetchOrders}
              className="bg-slate-50 text-slate-400 p-3 rounded-xl hover:text-[#00c7d3] transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-16">
        <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-xl shadow-slate-200/50">
          {loading ? (
            <div className="p-20 text-center text-slate-300 italic font-bold">Đang tải danh sách đơn hàng...</div>
          ) : filteredOrders.length === 0 ? (
            <EmptyState message="Chưa có đơn hàng nào khớp với trạng thái này" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Đơn hàng / Khách</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Sản phẩm</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Giá trị</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Trạng thái</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-8">
                        <p className="text-[10px] font-black text-slate-300 mb-1">{order._id.slice(-6).toUpperCase()}</p>
                        <p className="font-black text-slate-800">{order.customerInfo.name}</p>
                        <p className="text-xs font-bold text-slate-400">{order.customerInfo.phone}</p>
                        <p className="text-[10px] font-black text-[#00c7d3]">{order.customerInfo.email}</p>
                      </td>
                      <td className="px-8 py-8 max-w-xs">
                        {order.items.map(item => (
                          <p key={item._id} className="text-xs font-bold text-slate-600 line-clamp-1 mb-1">
                            • {item.name} <span className="text-slate-400">x{item.quantity}</span>
                          </p>
                        ))}
                      </td>
                      <td className="px-8 py-8">
                        <p className="text-base font-black text-slate-800 italic">{order.totalAmount.toLocaleString()}₫</p>
                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">
                          {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                      </td>
                      <td className="px-8 py-8">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                        {order.adminNote && (
                          <p className="text-[10px] text-slate-400 font-medium italic mt-2 line-clamp-1">Note: {order.adminNote}</p>
                        )}
                      </td>
                      <td className="px-8 py-8 text-right">
                        <button 
                          onClick={() => openEditModal(order)}
                          className="px-6 py-2.5 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#00c7d3] hover:text-white transition-all shadow-sm"
                        >
                          Xử lý
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingOrder && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-[40px] overflow-hidden shadow-2xl animate-zoom-in">
            <div className="p-10">
               <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-slate-800 italic">Cập nhật đơn hàng</h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Mã: {editingOrder._id.slice(-6).toUpperCase()}</p>
                  </div>
                  <button onClick={() => setEditingOrder(null)} className="text-slate-300 hover:text-slate-800 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
               </div>

               <form onSubmit={handleUpdate} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Trạng thái xử lý</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {['Chờ tư vấn', 'Đã thanh toán', 'Đang giao', 'Hoàn thành', 'Đã hủy'].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setUpdateStatus(s)}
                          className={`py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                            updateStatus === s ? 'bg-[#00c7d3] border-[#00c7d3] text-white shadow-lg shadow-[#00c7d3]/30' : 'bg-slate-50 border-slate-50 text-slate-400 hover:border-slate-100'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Ghi chú của Admin</label>
                    <textarea 
                      rows="4" 
                      placeholder="Ghi chú quá trình tư vấn (VD: Khách chốt mẫu BDA-100...)"
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      className="w-full bg-slate-50 border-none rounded-3xl p-6 text-sm font-bold focus:ring-2 focus:ring-[#00c7d3]/20 transition-all resize-none"
                    ></textarea>
                  </div>

                  <div className="pt-4 flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setEditingOrder(null)}
                      className="flex-1 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-800 transition-colors"
                    >
                      Hủy bỏ
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-200 hover:-translate-y-1 transition-all"
                    >
                      Lưu thay đổi
                    </button>
                  </div>
               </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;


