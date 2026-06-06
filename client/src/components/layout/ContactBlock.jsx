import React from 'react';
import { Link } from 'react-router-dom';

const ContactBlock = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-[#00c7d3] rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-96 h-96 bg-purple-600 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
      
      <div className="container mx-auto px-6 lg:px-16 relative z-10 text-center">
        <h2 className="text-3xl lg:text-5xl font-black text-white mb-6 tracking-tight">
          Cần Tư Vấn Chọn Đàn?
        </h2>
        <p className="text-slate-300 text-lg lg:text-xl max-w-2xl mx-auto mb-10 font-medium">
          Hãy để những chuyên gia của Yi Guitar giúp bạn tìm ra cây đàn hoàn hảo nhất cho hành trình âm nhạc của mình.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            to="/lien-he" 
            className="px-8 py-4 bg-[#00c7d3] text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:-translate-y-1 hover:shadow-xl hover:shadow-[#00c7d3]/30 transition-all duration-300 inline-flex justify-center items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            Liên hệ ngay
          </Link>
          <a 
            href="tel:0123456789" 
            className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-2xl font-black text-sm uppercase tracking-widest hover:-translate-y-1 hover:bg-white/20 transition-all duration-300 inline-flex justify-center items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
            Gọi: 0766 665 689
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactBlock;
