import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '@/api/axios';

const LEVEL_FILTERS = ['Tất cả', 'Cơ bản', 'Nâng cao', 'Chuyên sâu'];
const PRICE_FILTERS = [
  { label: 'Tất cả', min: 0, max: Infinity },
  { label: 'Dưới 500k', min: 0, max: 500000 },
  { label: '500k - 1tr', min: 500000, max: 1000000 },
  { label: 'Trên 1tr', min: 1000000, max: Infinity }
];

const CoursesPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const typeParam = searchParams.get('type') || 'Tất cả'; // 'Online' or 'Offline'

  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering states
  const [level, setLevel] = useState('Tất cả');
  const [priceRange, setPriceRange] = useState(0);
  
  const [showSecondaryMenu, setShowSecondaryMenu] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await api.get('/courses');
        setAllCourses(response.data || []);
      } catch (err) {
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setShowSecondaryMenu(false);
      } else if (currentScrollY < lastScrollY.current) {
        setShowSecondaryMenu(true);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredCourses = useMemo(() => {
    return allCourses.filter(course => {
      const matchesType = typeParam === 'Tất cả' || course.type === typeParam;
      const matchesLevel = level === 'Tất cả' || course.level === level;
      const { min, max } = PRICE_FILTERS[priceRange];
      const matchesPrice = course.price >= min && course.price <= max;
      return matchesType && matchesLevel && matchesPrice;
    });
  }, [allCourses, typeParam, level, priceRange]);

  return (
    <div className="bg-[#fcfdfe] min-h-screen pb-20 fade-in">
      <div className={`sticky top-[72px] z-40 bg-white border-b border-slate-100 py-4 transition-all duration-500 ${showSecondaryMenu ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}>
        <div className="container mx-auto px-6 lg:px-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-black text-slate-800">Khóa học {typeParam !== 'Tất cả' ? typeParam : ''}</h1>
            <div className="flex gap-4">
              <select 
                value={level} 
                onChange={(e) => setLevel(e.target.value)}
                className="bg-slate-50 border-none text-sm font-bold text-slate-600 px-4 py-2 rounded-xl focus:ring-2 focus:ring-[#00c7d3]/20"
              >
                {LEVEL_FILTERS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <select 
                value={priceRange} 
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="bg-slate-50 border-none text-sm font-bold text-slate-600 px-4 py-2 rounded-xl focus:ring-2 focus:ring-[#00c7d3]/20"
              >
                {PRICE_FILTERS.map((p, i) => <option key={i} value={i}>{p.label}</option>)}
              </select>
            </div>
          </div>
          <div className="text-slate-400 text-sm font-bold uppercase tracking-widest">{filteredCourses.length} Khóa học</div>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-16 mt-12">
        {loading ? (
          <div className="py-20 text-center text-slate-400">Đang tải giáo trình...</div>
        ) : filteredCourses.length === 0 ? (
          <div className="py-20 text-center text-slate-400 italic">Chưa tìm thấy khóa học phù hợp.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {filteredCourses.map((course) => (
              <div 
                key={course._id} 
                onClick={() => navigate(`/khoa-hoc/${course._id}`)}
                className="group bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-[#00c7d3]/10 transition-all duration-500 cursor-pointer"
              >
                <div className="relative h-60 overflow-hidden">
                  <img src={course.image} alt={course.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-white/95 backdrop-blur-md text-[10px] font-black px-3 py-1.5 rounded-full text-[#00c7d3] uppercase tracking-wider shadow-sm">
                      {course.type}
                    </span>
                    <span className="bg-[#00c7d3] text-[10px] font-black px-3 py-1.5 rounded-full text-white uppercase tracking-wider shadow-sm">
                      {course.level}
                    </span>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#00c7d3]">
                       <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/></svg>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Giảng viên</p>
                      <p className="text-[13px] font-bold text-slate-700">{course.instructor || 'Giảng viên Yi Guitar'}</p>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-[#00c7d3] transition-colors leading-tight min-h-[56px]">
                    {course.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-6">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-3.5 h-3.5 ${i < (course.rating || 5) ? 'fill-current' : 'text-slate-200'}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                      ))}
                    </div>
                    <span className="text-xs font-bold text-slate-300">({course.reviews || 0} HV)</span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Học phí</p>
                      <p className="text-2xl font-black text-[#00c7d3]">{course.price.toLocaleString('vi-VN')} ₫</p>
                    </div>
                    <button className="bg-slate-900 text-white text-xs font-black px-6 py-3 rounded-2xl hover:bg-[#00c7d3] transition-colors uppercase tracking-widest shadow-xl shadow-slate-900/10">
                      Chi tiết
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
