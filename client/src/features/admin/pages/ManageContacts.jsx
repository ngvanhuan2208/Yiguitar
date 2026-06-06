import React, { useState, useEffect } from 'react';
import api from '@/api/axios';

const ManageContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/contacts');
      setContacts(response.data);
    } catch (err) {
      console.error('Error fetching contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Cậu có chắc muốn xóa lời nhắn này không?')) return;
    try {
      await api.delete(`/contacts/${id}`);
      fetchContacts();
    } catch (err) {
      console.error('Error deleting contact:', err);
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20 fade-in">
      <div className="bg-white border-b border-slate-100 py-10 mb-10">
        <div className="container mx-auto px-6 lg:px-16 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-slate-800 italic">Lời nhắn từ khách hàng</h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Admin Dashboard / Inquiries</p>
          </div>
          <button 
            onClick={fetchContacts}
            className="bg-slate-50 text-slate-400 p-3 rounded-xl hover:text-[#00c7d3] transition-all"
            title="Làm mới"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-16">
        <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-xl shadow-slate-200/50">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
             <h2 className="text-xl font-black text-slate-800 italic">Hộp thư đến</h2>
             <span className="bg-[#00c7d3] text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg shadow-[#00c7d3]/20">{contacts.length} LỜI NHẮN</span>
          </div>

          {loading ? (
            <div className="p-20 text-center text-slate-300 italic font-bold">Đang kiểm tra thư...</div>
          ) : contacts.length === 0 ? (
            <div className="p-20 text-center text-slate-400 italic font-medium">Hộp thư đang trống. Cậu hãy chờ khách hàng nhắn tin nhé!</div>
          ) : (
            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-slate-50">
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Khách hàng</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tiêu đề & Nội dung</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Ngày gửi</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Thao tác</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {contacts.map((contact) => (
                      <tr key={contact._id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-8 py-8 w-1/4">
                           <div className="space-y-1">
                              <p className="font-black text-slate-800">{contact.name}</p>
                              <p className="text-xs font-bold text-slate-400">{contact.email}</p>
                              <p className="text-[10px] font-black text-[#00c7d3] italic">{contact.phone || 'Không có SĐT'}</p>
                           </div>
                        </td>
                        <td className="px-8 py-8">
                           <div className="max-w-md">
                              <p className="text-sm font-black text-slate-800 mb-2">{contact.subject}</p>
                              <p className="text-sm text-slate-500 leading-relaxed italic line-clamp-2 italic">"{contact.message}"</p>
                           </div>
                        </td>
                        <td className="px-8 py-8">
                           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                              {new Date(contact.createdAt).toLocaleDateString('vi-VN')}
                           </p>
                           <p className="text-[10px] font-bold text-slate-300">
                             {new Date(contact.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                           </p>
                        </td>
                        <td className="px-8 py-8 text-right">
                           <button 
                              onClick={() => handleDelete(contact._id)}
                              className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                              title="Xóa lời nhắn"
                           >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
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
    </div>
  );
};

export default ManageContacts;
