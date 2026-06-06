import React from 'react';

const CourseEnrolled = ({ course }) => {
  // Robust parsing of course data with safe defaults
  const courseData = {
    title: course?.name || 'Không gian học tập',
    instructor: {
        name: course?.instructor || 'Giảng viên Yi Guitar',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=60',
        bio: course?.description || 'Giảng viên chuyên môn tại Yi Guitar Studio.'
    },
    schedule: course?.schedule || 'Đang cập nhật lịch học...',
    zaloLink: course?.zaloLink || '#',
    curriculumUrl: course?.curriculumUrl || '#'
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20">
      {/* ── HEADER BANNER ─────────────────────────────────── */}
      <div className="bg-[#0f172a] py-20 relative overflow-hidden">
        <div className="container mx-auto px-6 lg:px-16 relative z-10">
          <div className="flex flex-col gap-4">
             <div className="flex items-center gap-3">
                <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest border border-emerald-200/50 flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                   Đã ghi danh
                </span>
             </div>
             <h1 className="text-4xl lg:text-7xl font-black text-white italic leading-tight uppercase tracking-tighter max-w-4xl">
               {courseData.title}
             </h1>
          </div>
        </div>
        
        {/* Decorative Grid */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#00c7d3 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00c7d3]/20 rounded-full blur-[120px] -mr-48 -mt-48"></div>
      </div>

      <div className="container mx-auto px-6 lg:px-16 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ── COLUMN LEFT: MAIN CONTENT ──────────────────── */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* KHỐI 1: THÔNG TIN GIẢNG VIÊN */}
            <div className="bg-white rounded-[32px] p-10 shadow-xl shadow-slate-200/40 border border-slate-50 relative group overflow-hidden">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-10 flex items-center gap-3">
                  <span className="w-8 h-[2px] bg-slate-100"></span>
                  Người đồng hành
               </h3>
               
               <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-3xl overflow-hidden shadow-2xl relative z-10 p-1 bg-white border border-slate-100">
                       <img src={courseData.instructor.avatar} alt={courseData.instructor.name} className="w-full h-full object-cover rounded-2xl" />
                    </div>
                    <div className="absolute -inset-2 bg-gradient-to-tr from-[#00c7d3] to-[#0f172a] rounded-[40px] opacity-20 blur-xl group-hover:opacity-40 transition-opacity"></div>
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                     <h4 className="text-3xl font-black text-[#0f172a] italic uppercase tracking-tight mb-2">
                       {courseData.instructor.name}
                     </h4>
                     <p className="text-slate-500 font-medium leading-relaxed max-w-xl">
                       {courseData.instructor.bio}
                     </p>
                  </div>
               </div>
            </div>

            {/* KHỐI 2: LỊCH HỌC CỤ THỂ */}
            <div className="bg-white rounded-[32px] p-10 shadow-xl shadow-slate-200/40 border border-slate-50">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-10 flex items-center gap-3">
                  <span className="w-8 h-[2px] bg-slate-100"></span>
                  Lịch trình học tập
               </h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 flex items-start gap-5">
                     <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#00c7d3] shadow-sm">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Giờ học Online</p>
                        <p className="text-lg font-black text-slate-800 italic uppercase">19:30 - 21:00</p>
                     </div>
                  </div>
                  
                  <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 flex items-start gap-5">
                     <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#00c7d3] shadow-sm">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ngày trong tuần</p>
                        <p className="text-lg font-black text-slate-800 italic uppercase">Thứ 2 & Thứ 6</p>
                     </div>
                  </div>
               </div>
            </div>

          </div>

          {/* ── COLUMN RIGHT: RESOURCES & ACTION ───────────── */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-8">
            <div className="bg-[#0f172a] rounded-[40px] p-10 text-white shadow-2xl shadow-slate-900/40 relative overflow-hidden group">
               <h3 className="text-[10px] font-black text-[#00c7d3] uppercase tracking-[0.4em] mb-10 relative z-10 flex items-center gap-3">
                  <span className="w-8 h-[2px] bg-[#00c7d3]/20"></span>
                  Khu vực tài nguyên
               </h3>
               
               <div className="space-y-4 relative z-10">
                  <a 
                    href={courseData.zaloLink} 
                    className="flex items-center justify-between bg-white/5 hover:bg-white/10 p-6 rounded-3xl border border-white/10 transition-all group/btn"
                  >
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#00c7d3] rounded-xl flex items-center justify-center shadow-lg shadow-[#00c7d3]/20">
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"/></svg>
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest">Nhóm Zalo / Cộng đồng</span>
                     </div>
                     <svg className="w-4 h-4 opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"/></svg>
                  </a>
                  
                  <a 
                    href={courseData.curriculumUrl} 
                    className="flex items-center justify-between bg-[#00c7d3] hover:bg-[#00c7d3] p-6 rounded-3xl shadow-xl shadow-[#00c7d3]/20 transition-all group/btn"
                  >
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest">Tải giáo trình (PDF)</span>
                     </div>
                     <svg className="w-4 h-4 group-hover/btn:translate-y-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 14l-7 7-7-7m14-10l-7 7-7-7"/></svg>
                  </a>
               </div>
               
               {/* Decorative background */}
               <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#00c7d3]/10 rounded-full blur-[80px] -mr-32 -mb-32"></div>
            </div>
            
            <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-xl shadow-slate-200/30 text-center">
               <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mb-6">Trạng thái hiện tại</p>
               <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest italic">
                  Đang diễn ra • Kỳ tháng 04
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CourseEnrolled;
