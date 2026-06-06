import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext';
import { useLocation, useNavigate } from 'react-router-dom';

const AdminNotification = () => {
  const { user } = useAuth();
  const socket = useSocket();
  const location = useLocation();
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (user?.role !== 'admin' || !socket) return;

    socket.on('new-chat-notification', (data) => {
      // Chỉ hiện toast nếu admin đang KHÔNG ở trang chat
      if (location.pathname !== '/admin/chats') {
        setNotification({
          userId: data.userId,
          message: data.content,
          title: 'Tin nhắn mới từ khách hàng'
        });

        setTimeout(() => setNotification(null), 5000);
      }
    });

    return () => socket.off('new-chat-notification');
  }, [user, socket, location.pathname]);

  if (!notification) return null;

  return (
    <div 
      onClick={() => { navigate('/admin/chats'); setNotification(null); }}
      className="fixed top-24 left-6 z-[1000] bg-slate-900 text-white p-5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-4 cursor-pointer hover:scale-105 active:scale-95 transition-all animate-slide-in-left w-[320px]"
    >
      <div className="w-10 h-10 rounded-xl bg-[#00c7d3] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#00c7d3]/20">
         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
      </div>
      <div className="flex-grow overflow-hidden">
        <h4 className="text-[11px] font-black uppercase tracking-widest text-[#00c7d3] mb-1">{notification.title}</h4>
        <p className="text-[12px] font-medium text-slate-300 line-clamp-1 italic">"{notification.message}"</p>
      </div>
      <button onClick={(e) => { e.stopPropagation(); setNotification(null); }} className="text-slate-500 hover:text-white">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>
  );
};

export default AdminNotification;
