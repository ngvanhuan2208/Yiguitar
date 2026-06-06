import { toast } from 'react-hot-toast';
import React, { useState } from 'react';
import api from '@/api/axios';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/contacts', formData);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error('Error submitting contact form:', err);
      toast.error('Có lỗi xảy ra khi gửi tin nhắn. Cậu vui lòng thử lại nhé!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen pb-20 fade-in">
      {/* ── Header ─────────────────────────── */}
      <div className="bg-gradient-to-b from-[#92E4EC] to-[#A9EBEF] py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-white/40 rounded-full blur-[80px] -translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="container mx-auto px-6 lg:px-16 relative z-10 text-center lg:text-left">
          <h1 className="text-4xl lg:text-7xl font-bold text-[#0f172a] mb-6 drop-shadow-sm">Liên hệ với Yi Guitar</h1>
          <p className="text-[#334155] max-w-2xl text-lg font-medium leading-[1.7]">Tụi mình luôn sẵn sàng lắng nghe và hỗ trợ cậu mọi lúc. Đừng ngần ngại gửi lời nhắn nhé!</p>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-16 -mt-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white rounded-[48px] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-50">
          
          {/* Info Section */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#92E4EC] to-[#A9EBEF] p-10 lg:p-20 text-[#0f172a] relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/30 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            
            <h2 className="text-3xl font-bold mb-12">Thông tin liên hệ</h2>
            
            <div className="space-y-10">
              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-2xl bg-white/50 border border-white flex items-center justify-center text-[#00c7d3] shadow-sm shrink-0">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                </div>
                <div>
                  <p className="text-[10px] font-black text-[#00c7d3] uppercase tracking-widest mb-1">Địa chỉ</p>
                  <p className="text-lg font-bold">49 Bế Văn Đàn, Thanh Khê, Đà Nẵng</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-2xl bg-white/50 border border-white flex items-center justify-center text-[#00c7d3] shadow-sm shrink-0">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                </div>
                <div>
                  <p className="text-[10px] font-black text-[#00c7d3] uppercase tracking-widest mb-1">Điện thoại</p>
                  <p className="text-lg font-bold">0766 665 689</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-2xl bg-white/50 border border-white flex items-center justify-center text-[#00c7d3] shadow-sm shrink-0">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </div>
                <div>
                  <p className="text-[10px] font-black text-[#00c7d3] uppercase tracking-widest mb-1">Email</p>
                  <p className="text-lg font-bold">Ngocnhiloveguitar@gmail.com</p>
                </div>
              </div>
            </div>

            <div className="mt-20 flex gap-4">
               {[
                 { name: 'FB', url: 'https://www.facebook.com/share/1GUc2rXZdv/?mibextid=wwXIfr' },
                 { name: 'YT', url: 'https://www.youtube.com/@yiguitar74?si=SGgm91o31cesu19D' },
                 { name: 'TK', url: 'https://www.tiktok.com/@yiguitar?_r=1&_t=ZS-964TmjFM7Jn' }
               ].map(s => (
                 <a 
                   key={s.name} 
                   href={s.url} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="w-10 h-10 rounded-xl bg-white/50 border border-white flex items-center justify-center text-xs font-black text-[#0f172a] hover:bg-[#0f172a] hover:text-white transition-all cursor-pointer"
                 >
                   {s.name}
                 </a>
               ))}
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-7 p-10 lg:p-20">
            <h2 className="text-3xl font-black text-slate-800 mb-10 italic underline decoration-[#00c7d3]/20 underline-offset-8">Gửi tin nhắn cho tụi mình</h2>
            
            {success ? (
              <div className="bg-emerald-50 text-emerald-600 p-8 rounded-[32px] border border-emerald-100 flex flex-col items-center text-center">
                 <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                 </div>
                 <h3 className="text-xl font-black mb-2">Đã gửi thành công!</h3>
                 <p className="font-bold opacity-80">Cảm ơn cậu nhé, tụi mình sẽ phản hồi sớm nhất có thể.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Họ và tên</label>
                    <input 
                      type="text" 
                      placeholder="Nguyễn Văn A"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold focus:ring-2 focus:ring-[#00c7d3]/20 transition-all shadow-sm"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Số điện thoại</label>
                    <input 
                      type="tel" 
                      placeholder="09xx xxx xxx"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold focus:ring-2 focus:ring-[#00c7d3]/20 transition-all shadow-sm"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Email</label>
                  <input 
                    type="email" 
                    placeholder="email@vidu.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value, subject: 'Yêu cầu hỗ trợ từ khách hàng'})}
                    className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold focus:ring-2 focus:ring-[#00c7d3]/20 transition-all shadow-sm"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Lời nhắn</label>
                  <textarea 
                    rows="6" 
                    placeholder="Viết lời nhắn vào đây nha..."
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-[32px] p-8 text-sm font-bold focus:ring-2 focus:ring-[#00c7d3]/20 transition-all shadow-sm"
                    required
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-[#00c7d3] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#00c7d3]/30 hover:-translate-y-1 transition-all disabled:opacity-50"
                >
                  {loading ? 'Đang gửi...' : 'Gửi yêu cầu ngay'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ── Map ──────────────────────────── */}
      <div className="container mx-auto px-6 lg:px-16 mt-20">
        <div className="rounded-[48px] overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000 shadow-xl border border-slate-100 h-[500px]">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3834.0071049214675!2d108.2003471!3d16.0651211!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3142196bd1e6d42b%3A0xcbc0421dfc10722f!2sYi%20Guitar!5e0!3m2!1svi!2s!4v1778345544089!5m2!1svi!2s"
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
