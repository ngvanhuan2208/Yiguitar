import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import api from '@/api/axios';
import CourseLandingPage from './components/CourseLandingPage';
import CourseCheckout from './components/CourseCheckout';
import CourseEnrolled from './components/CourseEnrolled';

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewState, setViewState] = useState('landing'); // 'landing', 'checkout', 'enrolled'

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api.get(`courses/${id}`);
        const courseData = response.data;
        setCourse(courseData);

        // Check enrollment status if user is logged in
        if (user && user.enrolledCourses && user.enrolledCourses.some(courseId => String(courseId) === String(id))) {
          setViewState('enrolled');
        } else {
          setViewState('landing');
        }
      } catch (err) {
        console.error('Error fetching course details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchCourse();
    }
  }, [id, user, authLoading]);

  const handleRegisterClick = () => {
    setViewState('checkout');
    window.scrollTo(0, 0);
  };

  if (loading || authLoading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
         <div className="w-12 h-12 border-4 border-[#00c7d3]/20 border-t-[#00c7d3] rounded-full animate-spin"></div>
         <p className="text-[#00c7d3] font-black uppercase text-[10px] tracking-widest italic animate-pulse">Loading Academy...</p>
      </div>
    </div>
  );

  if (!course) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
       <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-200">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
       </div>
       <h3 className="text-xl font-black text-slate-800 uppercase italic mb-4 tracking-tight">Không tìm thấy khóa học</h3>
       <button onClick={() => navigate('/khoa-hoc')} className="bg-[#0f172a] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">Quay lại danh sách</button>
    </div>
  );

  // Render logic based on viewState
  if (viewState === 'enrolled') {
    return <CourseEnrolled course={course} />;
  }

  if (viewState === 'checkout') {
    return (
      <div className="animate-fade-in relative">
        <button 
           onClick={() => setViewState('landing')}
           className="absolute top-4 left-4 lg:left-16 z-50 text-slate-400 hover:text-[#00c7d3] flex items-center gap-2 font-black text-[10px] uppercase tracking-widest mt-24"
        >
           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
           Quay lại giới thiệu
        </button>
        <CourseCheckout course={course} />
      </div>
    );
  }

  return <CourseLandingPage course={course} onRegister={handleRegisterClick} />;
};

export default CourseDetailPage;

