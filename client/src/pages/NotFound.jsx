import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-white px-6">
      <div className="text-center">
        <h1 className="text-9xl font-black text-slate-100 italic relative z-0">
          404
          <span className="absolute inset-0 flex items-center justify-center text-3xl text-slate-800 italic z-10">Oops!</span>
        </h1>
        <h2 className="text-3xl font-black text-slate-800 mt-4 italic">Trang không tồn tại</h2>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2 mb-10">
          Có vẻ như đường dẫn này đã bị hỏng hoặc không còn tồn tại nữa.
        </p>
        <Link 
          to="/" 
          className="inline-block bg-[#00c7d3] text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#00c7d3]/30 hover:-translate-y-1 transition-all"
        >
          Quay lại trang chủ
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
