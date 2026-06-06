import React, { useState } from 'react';
import heroFinal from '../../assets/hero-yiguitar-final.png';

const Hero = () => {
  const [heroImage] = useState(heroFinal);

  return (
    <section className="bg-gradient-to-b from-[#92E4EC] to-[#A9EBEF] py-20 pb-28 relative overflow-hidden">
      {/* Decorative Glowing Blob */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-white/30 rounded-full blur-[80px] -translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>

      <div className="container mx-auto px-6 lg:px-16 flex flex-col lg:flex-row items-center gap-12 relative z-10">
        <div className="lg:w-1/2 w-full pt-10 lg:pt-0">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 bg-white/40 backdrop-blur-md border border-white/50 text-[#334155] px-5 py-2 rounded-full text-sm font-semibold mb-7 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#00c7d3] animate-pulse"></span>
            Bộ sưu tập mới 2026
          </span>
          
          {/* Title */}
          <h1 className="text-4xl lg:text-[54px] font-bold leading-tight mb-6 text-[#0f172a] drop-shadow-sm">
            Tìm kiếm âm thanh <span className="text-white drop-shadow-md">Guitar hoàn hảo</span>
          </h1>
          
          {/* Text */}
          <p className="text-base md:text-lg text-[#334155] max-w-lg mb-10 leading-[1.7]">
            Khám phá bộ sưu tập guitar cao cấp của chúng tôi bao gồm guitar acoustic, electric và classical. Được chế tác cho những nhạc sĩ đòi hỏi sự xuất sắc.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <button className="group px-8 py-3.5 bg-[#111827] text-white rounded-[10px] hover:bg-[#1e293b] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-base font-semibold flex items-center gap-2">
              Mua ngay
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </button>
            <button className="px-8 py-3.5 bg-white text-[#0f172a] rounded-[10px] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-base font-semibold shadow-sm border border-white/70">
              Tìm hiểu thêm
            </button>
          </div>
        </div>

        {/* Image */}
        <div className="lg:w-[50%] w-full flex justify-center lg:justify-end">
          <div className="w-full max-w-[600px] rounded-[24px] overflow-hidden shadow-2xl relative group">
            <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
            {/* Sử dụng biến State heroImage */}
            <img src={heroImage} alt="guitar headstock" className="w-full h-[350px] md:h-[450px] lg:h-[500px] object-cover group-hover:scale-105 transition-transform duration-700" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
