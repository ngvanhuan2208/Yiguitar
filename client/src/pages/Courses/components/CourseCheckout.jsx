import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '@/api/axios';
import OrderConfirmModal from '@/components/common/OrderConfirmModal';

const CourseCheckout = ({ course }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: ''
  });
  const [errors, setErrors] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);

  // Robust parsing of course data with safe defaults
  const courseData = {
    title: course?.name || 'Đăng ký khóa học',
    instructor: course?.instructor || 'Giảng viên Yi Guitar',
    price: course?.price || 0,
    thumbnail: course?.image || 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&auto=format&fit=crop&q=60'
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Vui lòng nhập họ tên nhen';
    
    // Phone validation: 10 digits
    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại nhen';
    } else if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại phải đúng 10 chữ số nhen';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email nhen';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ nhen';
    }

    if (!formData.address.trim()) newErrors.address = 'Vui lòng nhập địa chỉ nhen';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setShowConfirm(true);
  };

  const handleFinalSubmit = async () => {
    setIsLoading(true);
    try {
      await api.post('/registrations', {
        ...formData,
        courseName: course?.name || courseData.title,
        courseType: course?.type || 'Online'
      });
      
      setShowConfirm(false);
      toast.success('Đăng ký tư vấn thành công! Yi Guitar sẽ liên hệ cậu sớm nhen.', {
        duration: 4000,
        icon: '🎸',
        style: {
          borderRadius: '16px',
          background: '#0f172a',
          color: '#fff',
          fontSize: '13px',
          fontWeight: 'bold'
        }
      });

      navigate('/');
    } catch {
      toast.error('Lỗi khi thanh toán nhen bhen.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen py-12 md:py-20">
      <div className="container mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-12 items-start">
          
          {/* ── LEFT COLUMN: REGISTRATION FORM (60%) ────────────────── */}
          <div className="lg:col-span-6 bg-white rounded-[32px] p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-50">
            <h2 className="text-3xl font-black text-[#0f172a] italic uppercase tracking-tighter mb-8 flex items-center gap-4">
              <span className="w-12 h-1 bg-[#00c7d3] rounded-full"></span>
              Thông tin đăng ký tư vấn
            </h2>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Họ và Tên</label>
                  <input 
                    type="text" 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Nguyễn Văn A" 
                    className={`w-full px-6 py-4 bg-slate-50 border ${errors.fullName ? 'border-red-400' : 'border-slate-200'} rounded-xl focus:outline-none focus:border-[#00c7d3] focus:ring-4 focus:ring-[#00c7d3]/5 transition-all text-slate-700 font-medium`}
                    disabled={isLoading}
                  />
                  {errors.fullName && <p className="text-[10px] font-bold text-red-500 ml-1 italic tracking-wide">{errors.fullName}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Số điện thoại</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="09xx xxx xxx" 
                    className={`w-full px-6 py-4 bg-slate-50 border ${errors.phone ? 'border-red-400' : 'border-slate-200'} rounded-xl focus:outline-none focus:border-[#00c7d3] focus:ring-4 focus:ring-[#00c7d3]/5 transition-all text-slate-700 font-medium`}
                    disabled={isLoading}
                  />
                  {errors.phone && <p className="text-[10px] font-bold text-red-500 ml-1 italic tracking-wide">{errors.phone}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@gmail.com" 
                  className={`w-full px-6 py-4 bg-slate-50 border ${errors.email ? 'border-red-400' : 'border-slate-200'} rounded-xl focus:outline-none focus:border-[#00c7d3] focus:ring-4 focus:ring-[#00c7d3]/5 transition-all text-slate-700 font-medium`}
                  disabled={isLoading}
                />
                {errors.email && <p className="text-[10px] font-bold text-red-500 ml-1 italic tracking-wide">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Địa chỉ</label>
                <input 
                  type="text" 
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="TP. Hồ Chí Minh" 
                  className={`w-full px-6 py-4 bg-slate-50 border ${errors.address ? 'border-red-400' : 'border-slate-200'} rounded-xl focus:outline-none focus:border-[#00c7d3] focus:ring-4 focus:ring-[#00c7d3]/5 transition-all text-slate-700 font-medium`}
                  disabled={isLoading}
                />
                {errors.address && <p className="text-[10px] font-bold text-red-500 ml-1 italic tracking-wide">{errors.address}</p>}
              </div>

              <div className="pt-6">
                <button 
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-2xl shadow-slate-200 active:scale-95 ${
                    isLoading 
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                    : 'bg-[#0f172a] text-white hover:bg-[#00c7d3] hover:-translate-y-1'
                  }`}
                >
                  {isLoading ? 'ĐANG XỬ LÝ...' : 'GỬI ĐĂNG KÝ TƯ VẤN'}
                </button>
              </div>
            </form>
            
            <p className="text-center text-slate-400 text-[10px] font-bold mt-8 italic uppercase tracking-widest">Yi Guitar • Chuyên gia đào tạo âm nhạc hàng đầu</p>
          </div>

          {/* ── RIGHT COLUMN: SUMMARY (40%) ────────────────── */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <div className="bg-slate-50 rounded-[32px] p-8 border border-white shadow-inner">
               <h3 className="text-[10px] font-black text-[#00c7d3] uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                  <span className="w-8 h-[2px] bg-[#00c7d3]/20"></span>
                  Tóm tắt khóa học
               </h3>

               <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 overflow-hidden relative group">
                  <div className="aspect-video w-full rounded-2xl overflow-hidden mb-6 bg-slate-100">
                     <img 
                       src={courseData.thumbnail} 
                       alt={courseData.title} 
                       className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                     />
                  </div>
                  
                  <h4 className="text-xl font-black text-[#0f172a] italic leading-tight uppercase tracking-tight mb-2">
                    {courseData.title}
                  </h4>
                  <p className="text-slate-400 font-bold text-sm uppercase mb-6 flex items-center gap-2">
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                     {courseData.instructor}
                  </p>
                  
                  <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                     <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Tổng học phí</span>
                     <span className="text-2xl font-black text-[#00c7d3] italic">
                       {courseData.price?.toLocaleString()} ₫
                     </span>
                  </div>
               </div>
               
               <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-4 text-slate-400">
                     <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-slate-100 text-[#00c7d3]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-widest">Hỗ trợ trọn đời</span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-400">
                     <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-slate-100 text-[#00c7d3]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-widest">Tài liệu chuẩn quốc tế</span>
                  </div>
               </div>
            </div>
          </div>

        </div>
      </div>

      <OrderConfirmModal 
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleFinalSubmit}
        title="Xác nhận đăng ký học"
        courseName={course?.name || courseData.title}
        customerInfo={formData}
        total={courseData.price}
        isLoading={isLoading}
      />
    </div>
  );
};

export default CourseCheckout;
