import React, { useState } from 'react';
import toast from 'react-hot-toast';

const CourseLandingPage = ({ course, onRegister }) => {
  const [activeChapter, setActiveChapter] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Robust parsing of course data with safe defaults
  const d = {
    title: course?.name || 'Thông tin khóa học',
    rating: course?.rating || 5.0,
    reviews: course?.reviews || 0,
    instructor: {
      name: course?.instructor || 'Giảng viên Yi Guitar',
      phone: course?.instructorPhone || '09xx xxx xxx',
      title: 'Giảng viên chuyên môn',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=60',
      bio: course?.description || 'Hơn 10 năm kinh nghiệm giảng dạy Guitar chuyên nghiệp.'
    },
    price: course?.price || 0,
    thumbnail: course?.image || 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&auto=format&fit=crop&q=60',
    introVideo: course?.introVideo || '',
    duration: course?.totalDuration || 'Đang cập nhật',
    lessonsCount: course?.curriculum?.reduce((acc, curr) => acc + (curr.lessons?.length || 0), 0) || 0,
    resources: 'Tài liệu giáo trình PDF',
    benefits: course?.benefits?.length > 0 ? course.benefits : [
      'Nắm vững kiến thức nền tảng bài bản',
      'Kỹ thuật thực hành điêu luyện',
      'Đệm hát/Solo các bản nhạc yêu thích',
      'Tư duy âm nhạc và sáng tạo'
    ],
    curriculum: course?.curriculum?.length > 0 ? course.curriculum : [
      { title: 'Chương 1: Khởi đầu đam mê', lessons: ['Đang cập nhật nội dung bài giảng...'] }
    ]
  };

  return (
    <div className="bg-white selection:bg-[#00c7d3]/10">
      
      {/* ── HERO SECTION ─────────────────────────────────── */}
      <section className="bg-[#00c7d3] py-16 lg:py-24 text-white relative overflow-hidden">
        <div className="container mx-auto px-6 lg:px-16 relative z-10">
          <div className="max-w-3xl">
            <nav className="flex items-center gap-2 text-white/70 text-[10px] font-black uppercase tracking-widest mb-8 cursor-pointer hover:text-white transition-colors" onClick={() => window.history.back()}>
              <svg className="w-3 h-3 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"/></svg>
              <span>Quay lại</span>
            </nav>

            <h1 className="text-4xl lg:text-5xl font-black italic tracking-tighter leading-tight uppercase mb-8 drop-shadow-2xl">
              {d.title}
            </h1>

            <div className="flex flex-wrap items-center gap-8 text-sm font-bold">
              <div className="flex items-center gap-3">
                 <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Giảng viên hướng dẫn</p>
                    <p className="text-lg font-black italic uppercase tracking-tight">{d.instructor.name}</p>
                 </div>
              </div>

              <div className="flex items-center gap-3">
                 <div className="w-12 h-12 rounded-2xl bg-[#0f172a] flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-[#00c7d3]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Hotline tư vấn</p>
                    <p className="text-lg font-black italic uppercase tracking-tight">{d.instructor.phone}</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
        {/* Decor */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-[120px] -mr-64 -mt-64"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0f172a]/10 rounded-full blur-[100px] -ml-48 -mb-48"></div>
      </section>

      <div className="container mx-auto px-6 lg:px-16 py-12 lg:py-20 lg:grid lg:grid-cols-12 gap-16">
        
        {/* ── MAIN CONTENT (65%) ─────────────────────────── */}
        <div className="lg:col-span-8 space-y-16">
          
          {/* KHỐI: BẠN SẼ HỌC ĐƯỢC GÌ */}
          <div className="bg-slate-50 border border-slate-100 rounded-[32px] p-8 md:p-12">
            <h2 className="text-2xl font-black text-[#0f172a] italic uppercase tracking-tighter mb-8">Bạn sẽ học được gì?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {d.benefits?.map((benefit, i) => (
                <div key={i} className="flex items-start gap-4 group">
                  <div className="w-6 h-6 rounded-full bg-[#00c7d3]/10 flex items-center justify-center text-[#00c7d3] shrink-0 mt-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                  </div>
                  <span className="text-slate-600 font-medium group-hover:text-slate-900 transition-colors uppercase text-sm font-bold tracking-tight">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* KHỐI: NỘI DUNG KHÓA HỌC */}
          <div>
            <div className="flex items-center justify-between mb-8">
               <h2 className="text-2xl font-black text-[#0f172a] italic uppercase tracking-tighter">Nội dung khóa học</h2>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-full border border-slate-100">Cập nhật 2024</span>
            </div>
            <div className="space-y-4">
              {d.curriculum?.map((chapter, i) => (
                <div key={i} className="bg-white border border-slate-100 rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <button 
                    onClick={() => setActiveChapter(activeChapter === i ? -1 : i)}
                    className="w-full px-8 py-6 flex items-center justify-between hover:bg-slate-50 transition-all text-left"
                  >
                    <div className="flex items-center gap-4">
                       <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${activeChapter === i ? 'bg-[#00c7d3] text-white' : 'bg-slate-100 text-slate-400'}`}>
                          <svg className={`w-4 h-4 transition-transform duration-300 ${activeChapter === i ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"/></svg>
                       </div>
                       <span className="font-black text-[#0f172a] uppercase text-sm tracking-tight">{chapter.title}</span>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{chapter.lessons?.length || 0} bài giảng</span>
                  </button>
                  
                  {activeChapter === i && (
                    <div className="px-8 pb-8 space-y-4 animate-fade-in divide-y divide-slate-50">
                      {chapter.lessons?.map((lesson, j) => (
                        <div key={j} onClick={() => toast.error('Video bài giảng sẽ được cung cấp đầy đủ sau khi bạn ghi danh khóa học!', { icon: '🔒' })} className="flex items-center gap-4 text-slate-500 hover:text-amber-500 cursor-pointer group pt-4 first:pt-0">
                           <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-amber-500/10 group-hover:text-amber-500 transition-colors">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                           </div>
                           <span className="text-xs font-black uppercase tracking-widest opacity-80">{lesson}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── STICKY SIDEBAR (35%) ─────────────────────────── */}
        <div className="lg:col-span-4 lg:-mt-64 relative z-30">
          <div className="sticky top-24 bg-white rounded-[40px] shadow-[0_32px_80px_-20px_rgba(0,152,165,0.2)] border border-slate-100 overflow-hidden group">
             <div className="aspect-video relative overflow-hidden bg-[#0f172a]">
                {isPlaying && d.introVideo ? (
                  <video 
                    width="100%" 
                    height="100%" 
                    src={d.introVideo} 
                    controls
                    autoPlay
                    className="absolute inset-0 z-10 object-cover"
                  ></video>
                ) : (
                  <>
                    <img src={d.thumbnail} alt="Course Preview" className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div 
                         onClick={() => { if (d.introVideo) setIsPlaying(true); else toast.error('Video trailer đang được cập nhật!', { icon: '🎬' }); }}
                         className="w-16 h-16 bg-[#00c7d3] rounded-full flex items-center justify-center text-white shadow-2xl animate-pulse cursor-pointer border-4 border-white/20 hover:scale-110 transition-transform"
                       >
                          <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                       </div>
                    </div>
                    <p className="absolute bottom-4 w-full text-center text-white text-[10px] font-black uppercase tracking-widest drop-shadow-md">Trailer khóa học</p>
                  </>
                )}
             </div>

             <div className="p-10 space-y-8">
                <div>
                   <p className="text-4xl font-black text-[#00c7d3] italic uppercase tracking-tighter">
                     {d.price?.toLocaleString()} ₫
                   </p>
                   <div className="flex items-center gap-2 mt-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest italic">Ưu đãi ghi danh hôm nay</p>
                   </div>
                </div>

                <button 
                  onClick={onRegister}
                  className="w-full bg-[#0f172a] hover:bg-[#00c7d3] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-slate-200 hover:-translate-y-1 transition-all active:scale-95"
                >
                   ĐĂNG KÝ NGAY
                </button>

                <div className="space-y-6 pt-8 border-t border-slate-50">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đặc quyền học viên:</p>
                   <div className="grid gap-5">
                      <div className="flex items-center gap-4 text-slate-600">
                         <div className="w-10 h-10 rounded-xl bg-[#00c7d3]/10 flex items-center justify-center text-[#00c7d3]">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                         </div>
                         <span className="text-xs font-black uppercase tracking-widest italic opacity-80">{d.duration} học tập</span>
                      </div>
                      <div className="flex items-center gap-4 text-slate-600">
                         <div className="w-10 h-10 rounded-xl bg-[#00c7d3]/10 flex items-center justify-center text-[#00c7d3]">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2 2V13a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                         </div>
                         <span className="text-xs font-black uppercase tracking-widest italic opacity-80">{d.lessonsCount} bài giảng video</span>
                      </div>
                      <div 
                         onClick={() => toast.error('Vui lòng ghi danh khóa học để truy cập tài liệu!', { icon: '🔒' })}
                         className="flex items-center gap-4 text-slate-600 cursor-pointer hover:text-amber-500 transition-colors group/pdf"
                      >
                         <div className="w-10 h-10 rounded-xl bg-[#00c7d3]/10 flex items-center justify-center text-[#00c7d3] group-hover/pdf:bg-amber-500/10 group-hover/pdf:text-amber-500 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                         </div>
                         <span className="text-xs font-black uppercase tracking-widest italic opacity-80">{d.resources}</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CourseLandingPage;
