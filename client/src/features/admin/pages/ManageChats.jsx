import React, { useState, useEffect, useRef } from 'react';
import api from '@/api/axios';
import { useSocket } from '@/context/SocketContext';

const ManageChats = () => {
  const socket = useSocket();
  const BASE_URL = import.meta.env.VITE_BASE_URL; 
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef();

  // Helper to mark conversation as read
  const markAsRead = async (userId) => {
    try {
      await api.put(`/chat/read/${userId}`);
      // Clear unread count in local state
      setConversations(prev => prev.map(c => 
        c.user._id === userId ? { ...c, unreadCount: 0 } : c
      ));
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  useEffect(() => {
    // Lấy danh sách conversation ban đầu
    const fetchConversations = async () => {
      try {
        const res = await api.get('/chat/conversations');
        setConversations(res.data);
      } catch (err) {
        console.error('Error fetching conversations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();

    if (!socket) return;

    // Lắng nghe thông báo tin nhắn mới toàn cục
    socket.on('new-chat-notification', (data) => {
      // Cập nhật lại danh sách conversation
      setConversations(prev => {
        const index = prev.findIndex(c => c.user._id === data.userId);
        if (index !== -1) {
          const updated = [...prev];
          updated[index].lastMessage = data.content;
          updated[index].lastMessageDate = new Date();
          // Nếu không phải user đang chọn thì tăng unread
          if (selectedUser?._id !== data.userId) {
            updated[index].unreadCount = (updated[index].unreadCount || 0) + 1;
          }
          return updated.sort((a, b) => new Date(b.lastMessageDate) - new Date(a.lastMessageDate));
        } else {
          // Bổ sung: Nếu là user mới tin chưa có trong list, fetch lại
          fetchConversations();
          return prev;
        }
      });
    });

    return () => {
      socket.off('new-chat-notification');
    };
  }, [selectedUser?._id, socket]);

  useEffect(() => {
    if (!selectedUser || !socket) return;

    // Join room của user được chọn
    socket.emit('join-chat', selectedUser._id);
    // Mark as read when selecting
    markAsRead(selectedUser._id);

    const fetchHistory = async () => {
      try {
        const res = await api.get(`/chat/${selectedUser._id}`);
        setMessages(res.data);
      } catch (err) {
        console.error('Error history:', err);
      }
    };
    fetchHistory();

    const handleReceive = (msg) => {
      if (msg.conversationId === selectedUser._id) {
        setMessages(prev => [...prev, msg]);
      }
    };

    const handleTyping = (data) => {
      if (data.conversationId === selectedUser._id && data.senderRole === 'user') {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }
    };

    socket.on('receive-message', handleReceive);
    socket.on('typing', handleTyping);

    return () => {
      socket.off('receive-message', handleReceive);
      socket.off('typing', handleTyping);
    };
  }, [selectedUser, socket]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || !selectedUser || !socket) return;

    // Server sẽ lấy senderId/senderRole từ socket.user (đã xác thực)
    const data = {
      conversationId: selectedUser._id,
      content: input
    };

    socket.emit('send-message', data);
    setInput('');
  };

  const renderAvatar = (userObj, sizeClass = "w-12 h-12") => {
    if (userObj?.avatar) {
      const url = userObj.avatar.startsWith('http') ? userObj.avatar : `${BASE_URL}${userObj.avatar}`;
      return <img src={url} className={`${sizeClass} rounded-2xl object-cover border-2 border-white ring-2 ring-slate-100`} alt={userObj.name} />;
    }
    
    // Fallback: Ảnh chữ mặc định
    const firstLetter = userObj?.name ? userObj.name.charAt(0).toUpperCase() : '?';
    return (
      <div className={`${sizeClass} rounded-2xl bg-slate-200 flex items-center justify-center text-slate-500 font-black text-lg border-2 border-white ring-2 ring-slate-100`}>
        {firstLetter}
      </div>
    );
  };

  if (loading) return <div className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse">Đang kết nối trung tâm hỗ trợ...</div>;

  return (
    <div className="bg-[#f8fafc] min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 py-6 px-10 shadow-sm">
        <h1 className="text-2xl font-black text-slate-800 italic">Trung Tâm Hỗ Trợ Trực Tuyến</h1>
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Quản lý cuộc trò chuyện với khách hàng theo thời gian thực</p>
      </div>

      <div className="flex-grow flex p-6 gap-6 h-[calc(100vh-120px)] overflow-hidden">
        {/* Sidebar: Danh sách User */}
        <div className="w-[350px] bg-white rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-50 bg-slate-50/50">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Khách hàng trực tuyến</h3>
          </div>
          <div className="flex-grow overflow-y-auto p-4 space-y-2">
            {conversations.map((conv) => (
              <button
                key={conv._id}
                onClick={() => setSelectedUser(conv.user)}
                className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all duration-300 group ${
                  selectedUser?._id === conv.user._id ? 'bg-slate-900 text-white shadow-lg' : 'hover:bg-slate-50 text-slate-600'
                }`}
              >
                <div className="relative">
                  {renderAvatar(conv.user)}
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-grow text-left">
                  <p className={`text-[12px] font-black italic ${selectedUser?._id === conv.user._id ? 'text-white' : 'text-slate-800'}`}>{conv.user.name}</p>
                  <p className={`text-[10px] line-clamp-1 ${selectedUser?._id === conv.user._id ? 'text-slate-400' : 'text-slate-400 font-medium'}`}>
                    {conv.lastMessage}
                  </p>
                </div>
                {conv.unreadCount > 0 && selectedUser?._id !== conv.user._id && (
                  <span className="bg-[#00c7d3] text-white text-[9px] font-black px-2 py-1 rounded-full">{conv.unreadCount}</span>
                )}
              </button>
            ))}
            {conversations.length === 0 && (
              <div className="py-20 text-center text-slate-300 italic text-sm px-6">Chưa có khách hàng nào tham gia trò chuyện.</div>
            )}
          </div>
        </div>

        {/* Khung Chat chi tiết */}
        <div className="flex-grow bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col overflow-hidden relative">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                <div className="flex items-center gap-4">
                  {renderAvatar(selectedUser)}
                  <div>
                    <h2 className="text-lg font-black text-slate-800 italic">{selectedUser.name}</h2>
                    <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Đang trực tuyến</span>
                  </div>
                </div>
                <div className="flex gap-2">
                   <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-slate-900 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg></button>
                   <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-slate-900 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/></svg></button>
                </div>
              </div>

              {/* Messages Area */}
              <div ref={scrollRef} className="flex-grow p-8 overflow-y-auto space-y-6 bg-slate-50/50">
                {messages.map((msg, i) => {
                  const isMe = msg.senderRole === 'admin';
                  return (
                    <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                       <div className={`flex gap-3 max-w-[70%] ${isMe ? 'flex-row-reverse' : ''}`}>
                          {!isMe && renderAvatar(msg.sender, "w-8 h-8")}
                          <div className={`p-4 rounded-[24px] text-sm leading-relaxed shadow-sm ${
                            isMe 
                              ? 'bg-slate-900 text-white rounded-br-none shadow-slate-200' 
                              : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'
                          }`}>
                            {msg.content}
                            <div className={`text-[9px] mt-2 font-bold uppercase tracking-widest opacity-40 ${isMe ? 'text-right' : ''}`}>
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                       </div>
                    </div>
                  );
                })}
                {isTyping && (
                  <div className="flex items-center gap-2 text-[#00c7d3]">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest italic">Khách đang soạn tin...</span>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <form onSubmit={handleSend} className="p-8 bg-white border-t border-slate-100 flex gap-4">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Nhập nội dung tư vấn..."
                  className="flex-grow bg-slate-50 border-none rounded-2xl px-6 py-4 font-medium focus:ring-2 focus:ring-slate-200/50 outline-none"
                />
                <button 
                  type="submit"
                  disabled={!input.trim()}
                  className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:-translate-y-1 active:scale-95 transition-all shadow-xl shadow-slate-200 disabled:opacity-30 disabled:hover:translate-y-0"
                >
                  Gửi tin nhắn
                </button>
              </form>
            </>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-slate-300 gap-4">
               <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
               </div>
               <p className="font-black text-[12px] uppercase tracking-[0.2em] italic">Chọn khách hàng để bắt đầu tư vấn</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageChats;
