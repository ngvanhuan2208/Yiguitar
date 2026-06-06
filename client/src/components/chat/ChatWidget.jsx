import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '@/api/axios';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext';

const ChatWidget = () => {
  const { user } = useAuth();
  const socket = useSocket();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!user || !socket) return undefined;

    socket.emit('join-chat', user._id);

    const handleReceiveMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    const handleTyping = (data) => {
      if (data.senderRole === 'admin') {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }
    };

    socket.on('receive-message', handleReceiveMessage);
    socket.on('typing', handleTyping);

    return () => {
      socket.off('receive-message', handleReceiveMessage);
      socket.off('typing', handleTyping);
    };
  }, [user, socket]);

  useEffect(() => {
    if (!user?._id) return undefined;

    let isMounted = true;

    const fetchHistory = async () => {
      try {
        const res = await api.get(`/chat/${user._id}`);
        if (isMounted) {
          setMessages(res.data);
        }
      } catch (err) {
        console.error('Error fetching chat history:', err);
      }
    };

    fetchHistory();

    return () => {
      isMounted = false;
    };
  }, [user?._id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  if (!user || location.pathname.startsWith('/admin')) return null;

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !socket) return;

    socket.emit('send-message', {
      conversationId: user._id,
      content: input
    });
    setInput('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-white shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group"
        >
          <svg className="h-7 w-7 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-white bg-[#00c7d3] animate-pulse" />
        </button>
      )}

      {isOpen && (
        <div className="flex h-[520px] w-[380px] flex-col overflow-hidden rounded-[32px] border border-slate-100 bg-white shadow-2xl animate-slide-up">
          <div className="flex items-center justify-between bg-slate-900 p-5 text-white shadow-lg">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-slate-600 bg-slate-700">
                  <img src="/logo-small.png" alt="" className="w-6 opacity-80" />
                </div>
                <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-slate-900 bg-emerald-500" />
              </div>
              <div>
                <h3 className="text-sm font-black italic">Yi Guitar Support</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Đội ngũ hỗ trợ 24/7</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 transition-transform hover:rotate-90">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div ref={scrollRef} className="flex-grow space-y-4 overflow-y-auto bg-slate-50 p-5 scroll-smooth">
            <div className="max-w-[85%] rounded-2xl rounded-tl-none border border-slate-100 bg-white p-4 shadow-sm">
              <p className="text-[11px] font-bold text-slate-800">Chào {user.name}! Yi Guitar có thể giúp gì cho cậu hôm nay?</p>
            </div>

            {messages.map((msg, i) => {
              const isMine = msg.senderRole === 'user';
              return (
                <div key={i} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-[12px] font-medium leading-relaxed ${
                      isMine
                        ? 'rounded-br-none bg-[#00c7d3] text-white shadow-md shadow-[#00c7d3]/20'
                        : 'rounded-bl-none border border-slate-100 bg-white text-slate-800 shadow-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400">
                <div className="flex gap-1">
                  <span className="h-1 w-1 rounded-full bg-current animate-bounce" />
                  <span className="h-1 w-1 rounded-full bg-current animate-bounce [animation-delay:0.2s]" />
                  <span className="h-1 w-1 rounded-full bg-current animate-bounce [animation-delay:0.4s]" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">Admin đang nhập...</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2 border-t border-slate-100 bg-white p-4">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhắn gì đó cho Yi Guitar..."
              className="flex-grow rounded-2xl border-none bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-[#00c7d3]/20"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white transition-all hover:scale-105 hover:bg-slate-800 active:scale-95 disabled:opacity-30 disabled:hover:scale-100"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
