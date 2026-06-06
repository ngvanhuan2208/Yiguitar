import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const adminModules = [
    {
      title: 'Quản lý Sản phẩm',
      desc: 'Kho đàn Guitar, phụ kiện và quản lý kho hàng',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      path: '/admin/products',
      color: 'from-cyan-500 to-blue-600'
    },
    {
      title: 'Quản lý Đơn hàng',
      desc: 'Xử lý đơn hàng, vận chuyển và trạng thái thanh toán',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      path: '/admin/orders',
      color: 'from-blue-600 to-indigo-700'
    },
    {
      title: 'Báo cáo Doanh thu',
      desc: 'Phân tích tài chính, tăng trưởng và xu hướng bán hàng',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      path: '/admin/revenue',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      title: 'Sản phẩm Nổi bật',
      desc: 'Thiết lập danh sách sản phẩm hiển thị tại trang chủ',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      path: '/admin/featured',
      color: 'from-amber-400 to-orange-500'
    },
    {
      title: 'Quản lý Bài viết',
      desc: 'Viết bài mới, tin tức và kiến thức về Guitar',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2zM14 2v4h4" />
        </svg>
      ),
      path: '/admin/articles',
      color: 'from-purple-500 to-pink-600'
    },
    {
      title: 'Quản lý Khoá học',
      desc: 'Quản lý các khóa học Guitar online và offline',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      path: '/admin/courses',
      color: 'from-sky-500 to-blue-500'
    },
    {
      title: 'Quản lý Tab Guitar',
      desc: 'Cập nhật danh mục và các bản nhạc Tab mới',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      ),
      path: '/admin/tabs',
      color: 'from-indigo-500 to-violet-600'
    },
    {
      title: 'Hộp thư Liên hệ',
      desc: 'Quản lý lời nhắn, góp ý và yêu cầu hỗ trợ từ trang Liên hệ',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      path: '/admin/contacts',
      color: 'from-indigo-500 to-blue-600'
    }
  ];

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20 fade-in select-none">
      {/* ── HEADER SECTION ────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-100 py-12 mb-12 shadow-sm">
        <div className="container mx-auto px-6 lg:px-16 flex flex-col items-center text-center">
             <div className="w-20 h-20 bg-slate-900 rounded-[32px] flex items-center justify-center text-white mb-6 shadow-2xl shadow-slate-900/20">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
             </div>
             <h1 className="text-4xl font-black text-slate-800 italic leading-none tracking-tight">Admin Control Center</h1>
             <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-4 flex items-center gap-3 justify-center">
                <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></span>
                Quản trị hệ thống Yi Guitar
                <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></span>
             </p>
        </div>
      </div>

      {/* ── MODULES GRID ──────────────────────────────────────────────────── */}
      <div className="container mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {adminModules.map((module, index) => (
            <Link 
              key={index} 
              to={module.path}
              className="group relative bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40 hover:-translate-y-2 transition-all duration-500 overflow-hidden"
            >
              {/* Background Glow Effect */}
              <div className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${module.color} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500`}></div>
              
              <div className={`w-14 h-14 bg-gradient-to-br ${module.color} text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-indigo-500/10`}>
                {module.icon}
              </div>
              
              <h3 className="text-xl font-black text-slate-800 italic mb-2 group-hover:text-cyan-600 transition-colors">
                 {module.title}
              </h3>
              <p className="text-xs font-bold text-slate-400 leading-relaxed uppercase tracking-wider">
                 {module.desc}
              </p>

              <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-300 group-hover:text-cyan-500 transition-colors">
                Truy cập ngay
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>
          ))}

          {/* Special Quick Back Card */}
          <Link 
              to="/"
              className="bg-slate-900 p-8 rounded-[40px] shadow-2xl shadow-slate-900/30 hover:-translate-y-2 transition-all duration-500 flex flex-col justify-center items-center text-center group"
            >
              <div className="w-14 h-14 bg-white/10 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-xl font-black text-white italic mb-2">Về Trang Chủ</h3>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Xem giao diện khách hàng</p>
          </Link>
        </div>
      </div>

      {/* ── FOOTER STATS MINI (OPTIONAL) ──────────────────────────────────── */}
      <div className="mt-24 container mx-auto px-6 lg:px-16 flex flex-col items-center">
         <div className="w-full h-px bg-slate-100 mb-8"></div>
         <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">Yi Guitar Advanced Admin System v2.0</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
