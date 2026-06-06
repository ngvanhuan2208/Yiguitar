import React, { useState, useEffect } from 'react';
import api from '@/api/axios';
import EmptyState from '@/components/common/EmptyState';
import ConfirmModal from '@/components/common/ConfirmModal';
import { toast } from 'react-hot-toast';

const LOCATIONS = ['Quận 1', 'Quận 7', 'Bình Thạnh', 'Thủ Đức'];

const CourseManagement = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Online');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    instructor: 'Giảng viên Yi Guitar',
    instructorPhone: '',
    type: 'Online',
    level: 'Cơ bản',
    price: 0,
    image: '',
    description: '',
    schedule: '',
    location: LOCATIONS[0],
    maxStudents: 20,
    totalDuration: '',
    introVideo: '',
    benefits: ['', '', '', ''],
    curriculum: [{ title: 'Chương 1: ', lessons: [''] }],
    attachments: [],
    status: true
  });

  const [uploadProgress, setUploadProgress] = useState(0);

  // CRM: Registrations state
  const [registrations, setRegistrations] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({ title: '', message: '', onConfirm: () => {} });

  const fetchRegistrations = async () => {
    try {
      const response = await api.get('/registrations');
      setRegistrations(response.data);
    } catch (err) {
      console.error('Error fetching registrations:', err);
    }
  };


  const handleConfirmRegistration = async (id) => {
    try {
      const resp = await api.patch(`/registrations/${id}`, { status: 'Confirmed' });
      setRegistrations(prev => prev.map(reg => 
        reg._id === id ? resp.data : reg
      ));
      toast.success('Đã xác nhận liên hệ khách hàng bhen n!');
    } catch {
      toast.error('Lỗi khi xác nhận nhen n.');
    }
  };

  const handleCancelRegistration = (id) => {
    setConfirmConfig({
      title: 'Hủy đăng ký tư vấn',
      message: 'Cậu có chắc muốn hủy đăng ký tư vấn này không nhen?',
      onConfirm: async () => {
        try {
          const resp = await api.patch(`/registrations/${id}`, { status: 'Cancelled' });
          setRegistrations(prev => prev.map(reg => reg._id === id ? resp.data : reg));
          toast.success('Đã hủy tư vấn nhen bhen.');
        } catch {
          toast.error('Lỗi khi hủy nhen n.');
        }
      }
    });
    setShowConfirm(true);
  };

  const handleDeleteRegistrationPermanently = (id) => {
    setConfirmConfig({
      title: 'Xóa vĩnh viễn',
      message: 'Xác nhận xóa hoàn toàn bản ghi này nhen n?',
      onConfirm: async () => {
        try {
          await api.delete(`/registrations/${id}`);
          setRegistrations(prev => prev.filter(reg => reg._id !== id));
          toast.success('Đã xóa vĩnh viễn bhen n.');
        } catch {
          toast.error('Lỗi khi xóa nhen n.');
        }
      }
    });
    setShowConfirm(true);
  };

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

  useEffect(() => {
    fetchCourses();
    fetchRegistrations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.type === 'Offline') {
      if (!formData.schedule?.trim()) {
        alert('Vui lòng nhập lịch học cho khóa học Offline.');
        return;
      }
      if (!formData.location?.trim()) {
        alert('Vui lòng nhập địa điểm cho khóa học Offline.');
        return;
      }
    }

    try {
      setLoading(true);
      const form = new FormData();

      const normalizedPrice = Number(formData.price);
      if (!Number.isFinite(normalizedPrice)) {
        throw new Error('Giá tiền khóa học không hợp lệ.');
      }

      form.append('name', formData.name || '');
      form.append('instructor', formData.instructor || '');
      form.append('instructorPhone', formData.instructorPhone || '');
      form.append('type', formData.type || 'Online');
      form.append('level', formData.level || 'Cơ bản');
      form.append('price', String(normalizedPrice));
      form.append('description', formData.description || '');
      form.append('schedule', formData.schedule || '');
      form.append('location', formData.location || '');
      form.append('maxStudents', String(formData.maxStudents ?? 20));
      form.append('totalDuration', formData.totalDuration || '');
      form.append('status', String(Boolean(formData.status)));
      form.append('curriculum', JSON.stringify(formData.curriculum || []));
      form.append('benefits', JSON.stringify(formData.benefits || []));
      form.append('attachments', JSON.stringify(formData.attachments || []));

      // Append files if they are File objects
      if (formData.imageFile) form.append('image', formData.imageFile);
      if (formData.introVideoFile) form.append('introVideo', formData.introVideoFile);
      
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      };

      if (editingId) {
        await api.put(`/courses/${editingId}`, form, config);
      } else {
        await api.post('/courses', form, config);
      }
      
      setShowModal(false);
      resetForm();
      fetchCourses();
      alert(editingId ? 'Cập nhật thành công!' : 'Thêm khóa học mới thành công!');
    } catch (err) {
      console.error('Error saving course:', err);
      const msg = err.response?.data?.message || err.message || 'Có lỗi xảy ra khi lưu khóa học!';
      alert(`Lỗi: ${msg}`);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = (id) => {
    setConfirmConfig({
      title: 'Xóa khóa học',
      message: 'Cậu có chắc muốn xóa khóa học này không?',
      onConfirm: async () => {
        try {
          await api.delete(`/courses/${id}`);
          fetchCourses();
          toast.success('Đã xóa khóa học thành công!');
        } catch (err) {
          console.error('Error deleting course:', err);
          toast.error('Lỗi khi xóa khóa học.');
        }
      }
    });
    setShowConfirm(true);
  };

  const handleEdit = (course) => {
    setEditingId(course._id);
    
    // Deep copy and ensure data structures are correct
    const curriculum = course.curriculum?.length 
      ? JSON.parse(JSON.stringify(course.curriculum)) 
      : [{ title: 'Chương 1: ', lessons: [''] }];
      
    const benefits = (course.benefits?.length === 4) 
      ? [...course.benefits] 
      : (course.benefits?.length ? [...course.benefits] : ['', '', '', '']);

    setFormData({ 
      ...course,
      benefits,
      curriculum
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      instructor: 'Giảng viên Yi Guitar',
      instructorPhone: '',
      type: activeTab,
      level: 'Cơ bản',
      price: 0,
      image: '',
      description: '',
      schedule: '',
      location: LOCATIONS[0],
      maxStudents: 20,
      totalDuration: '',
      introVideo: '',
      benefits: ['', '', '', ''],
      curriculum: [{ title: 'Chương 1: ', lessons: [''] }],
      attachments: [],
      status: true
    });
    setUploadProgress(0);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setFormData(prev => ({ ...prev, imageFile: file, image: URL.createObjectURL(file) }));
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) setFormData(prev => ({ ...prev, introVideoFile: file }));
  };

  const handleChapterChange = (index, value) => {
    const newCurriculum = [...formData.curriculum];
    newCurriculum[index].title = value;
    setFormData({ ...formData, curriculum: newCurriculum });
  };

  const handleAddChapter = () => {
    setFormData({
      ...formData,
      curriculum: [...formData.curriculum, { title: `Chương ${formData.curriculum.length + 1}: `, lessons: [''] }]
    });
  };

  const handleRemoveChapter = (index) => {
    setFormData({
      ...formData,
      curriculum: formData.curriculum.filter((_, i) => i !== index)
    });
  };

  const handleLessonChange = (chapterIndex, lessonIndex, value) => {
    const newCurriculum = [...formData.curriculum];
    newCurriculum[chapterIndex].lessons[lessonIndex] = value;
    setFormData({ ...formData, curriculum: newCurriculum });
  };

  const handleAddLesson = (chapterIndex) => {
    const newCurriculum = [...formData.curriculum];
    newCurriculum[chapterIndex].lessons.push('');
    setFormData({ ...formData, curriculum: newCurriculum });
  };

  const handleRemoveLesson = (chapterIndex, lessonIndex) => {
    const newCurriculum = [...formData.curriculum];
    newCurriculum[chapterIndex].lessons = newCurriculum[chapterIndex].lessons.filter((_, i) => i !== lessonIndex);
    setFormData({ ...formData, curriculum: newCurriculum });
  };

  const handleBenefitChange = (index, value) => {
    const newBenefits = [...formData.benefits];
    newBenefits[index] = value;
    setFormData({ ...formData, benefits: newBenefits });
  };

  const filteredCourses = allCourses.filter(c => c.type === activeTab);

  const stats = {
    total: allCourses.length,
    onlineActive: registrations.filter(r => r.courseType === 'Online').length,
    offlineMonthly: registrations.filter(r => r.courseType === 'Offline').length,
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen text-slate-600 pb-20 selection:bg-[#00c7d3]/10 fade-in">
      {/* ── HEADER & STATS ─────────────────── */}
      <div className="bg-white border-b border-slate-100 py-12 mb-10 shadow-sm">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h1 className="text-4xl font-black text-slate-800 italic tracking-tight mb-2">QUẢN LÝ <span className="text-[#00c7d3]">KHÓA HỌC</span></h1>
              <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">Education Management System • v4.0</p>
            </div>
            <button 
              onClick={() => { resetForm(); setShowModal(true); }}
              className="bg-[#00c7d3] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#00c7d3]/20 hover:-translate-y-1 transition-all active:scale-95"
            >
              + Thêm Khóa Học
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 flex items-center gap-6 shadow-xl shadow-slate-200/40">
               <div className="w-14 h-14 bg-[#00c7d3]/10 rounded-2xl flex items-center justify-center text-[#00c7d3]">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
               </div>
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tổng số khóa học</p>
                  <h4 className="text-3xl font-black text-slate-800 italic">{stats.total}</h4>
               </div>
            </div>
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 flex items-center gap-6 shadow-xl shadow-slate-200/40">
               <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
               </div>
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Học viên Online</p>
                  <h4 className="text-3xl font-black text-slate-800 italic">{stats.onlineActive}</h4>
               </div>
            </div>
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 flex items-center gap-6 shadow-xl shadow-slate-200/40">
               <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
               </div>
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Học viên Offline</p>
                  <h4 className="text-3xl font-black text-slate-800 italic">{stats.offlineMonthly}</h4>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-16 mt-16">
        {/* ── TABS ─────────────────────────── */}
        <div className="flex gap-1 bg-slate-100 p-1.5 rounded-2xl w-fit mb-10 border border-slate-200/50">
           {[
             { id: 'Online', label: 'Khóa học Online' },
             { id: 'Offline', label: 'Khóa học Offline' },
             { id: 'Registrations', label: 'Xác nhận đăng ký' }
           ].map(t => (
             <button
               key={t.id}
               onClick={() => setActiveTab(t.id)}
               className={`px-10 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                 activeTab === t.id ? 'bg-[#00c7d3] text-white shadow-lg' : 'text-slate-400 hover:text-slate-600 hover:bg-white'
               }`}
             >
               {t.label}
             </button>
           ))}
        </div>

        {/* ── TABLE ────────────────────────── */}
        <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-2xl shadow-slate-200/40">
          {activeTab === 'Registrations' ? (
            registrations.length === 0 ? (
              <EmptyState message="Chưa có lượt đăng ký tư vấn nào" />
            ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ngày đăng ký</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Khách hàng</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Khóa học</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Trạng thái</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {registrations.map(reg => (
                  <tr key={reg._id} className="hover:bg-cyan-50/30 transition-colors">
                    <td className="px-8 py-6 text-xs font-bold text-slate-400 italic">
                      {new Date(reg.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-black text-slate-800 italic uppercase underline decoration-slate-100">{reg.fullName}</p>
                      <p className="text-[10px] font-black text-[#00c7d3] tracking-widest mt-1">{reg.phone}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                         <span className="text-xs font-black text-slate-600 uppercase tracking-tight">{reg.courseName}</span>
                         <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${
                            reg.courseType === 'Online' ? 'bg-cyan-500/10 text-cyan-600' : 'bg-slate-800 text-white'
                         }`}>
                           {reg.courseType}
                         </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        reg.status === 'Confirmed' 
                        ? 'bg-emerald-50 text-emerald-500' 
                        : reg.status === 'Cancelled'
                        ? 'bg-rose-50 text-rose-500'
                        : 'bg-amber-50 text-amber-500'
                      }`}>
                        {reg.status === 'Confirmed' ? 'Đã xác nhận' : reg.status === 'Cancelled' ? 'Đã hủy' : 'Chờ tư vấn'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleConfirmRegistration(reg._id)}
                          disabled={reg.status !== 'Pending'}
                          className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                            reg.status !== 'Pending'
                            ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                            : 'bg-[#00c7d3]/10 text-[#00c7d3] hover:bg-[#00c7d3] hover:text-white'
                          }`}
                        >
                          Duyệt
                        </button>
                        <button 
                          onClick={() => handleCancelRegistration(reg._id)}
                          disabled={reg.status !== 'Pending'}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                            reg.status !== 'Pending'
                            ? 'bg-slate-50 text-slate-200 cursor-not-allowed'
                            : 'bg-amber-50 text-amber-500 hover:bg-amber-500 hover:text-white'
                          }`}
                          title="Hủy tư vấn"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                        <button 
                          onClick={() => handleDeleteRegistrationPermanently(reg._id)}
                          className="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"
                          title="Xóa vĩnh viễn"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            )
          ) : (
            filteredCourses.length === 0 ? (
              <EmptyState message={`Chưa có khóa học ${activeTab} nào`} />
            ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Khóa học</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Giảng viên</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Giá tiền</th>
                  {activeTab === 'Online' ? (
                    <>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tổng thời lượng</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Sỉ số học viên</th>
                    </>
                  ) : (
                    <>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Lịch học</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Sỉ số học viên</th>
                    </>
                  )}
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCourses.map(c => (
                  <tr key={c._id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                             <img src={c.image} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                             <p className="font-black text-slate-800 italic mb-0.5">{c.name}</p>
                             <div className="flex items-center gap-2">
                                <span className={`w-1.5 h-1.5 rounded-full ${c.status ? 'bg-[#00c7d3]' : 'bg-rose-500'}`}></span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase">{c.status ? 'Đang bật' : 'Đang ẩn'}</span>
                             </div>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-sm font-bold text-slate-500">{c.instructor}</td>
                    <td className="px-8 py-6 text-sm font-black text-[#00c7d3] italic underline decoration-slate-100">{c.price.toLocaleString()}₫</td>
                    
                    {activeTab === 'Online' ? (
                      <>
                        <td className="px-8 py-6 text-xs font-bold text-slate-500">{c.totalDuration || '—'}</td>
                        <td className="px-8 py-6 text-center">
                           <div className="inline-flex items-center gap-1.5">
                              <span className="text-xs font-black text-slate-800">
                                 {registrations.filter(r => r.courseName === c.name).length}
                              </span>
                              <span className="text-[10px] font-bold text-slate-400">HỌC VIÊN</span>
                           </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-8 py-6 text-xs font-bold text-slate-500">
                           <p>{c.schedule || 'Chưa xếp'}</p>
                           <p className="text-[10px] font-black text-[#00c7d3] uppercase mt-1">{c.location}</p>
                        </td>
                        <td className="px-8 py-6 text-center">
                           <div className="inline-flex items-center gap-1.5">
                              <span className="text-xs font-black text-slate-800">
                                 {registrations.filter(r => r.courseName === c.name).length}
                              </span>
                              <span className="text-[10px] font-bold text-slate-400">HỌC VIÊN</span>
                           </div>
                        </td>
                      </>
                    )}

                    <td className="px-8 py-6 text-center">
                       <div className="flex items-center justify-center gap-3">
                          <button onClick={() => handleEdit(c)} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-[#00c7d3] hover:bg-[#00c7d3]/10 transition-all">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                          </button>
                          <button onClick={() => handleDelete(c._id)} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ))}
        </div>
      </div>

      {/* ── DYNAMIC MODAL ─────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fade-in pt-10 pb-10">
          <div className="bg-white w-full max-w-6xl max-h-[90vh] rounded-[48px] border border-slate-100 shadow-[0_32px_120px_-20px_rgba(0,0,0,0.2)] overflow-hidden animate-zoom-in flex flex-col">
            <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
              {/* MODAL HEADER - Fixed */}
              <div className="p-10 lg:p-12 pb-6 lg:pb-8 border-b border-slate-50 shrink-0">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-4xl font-black text-slate-800 italic leading-none">{editingId ? 'Cập nhật' : 'Thêm mới'} Khóa học</h2>
                    <p className="text-[#00c7d3] font-black uppercase tracking-[0.2em] text-[10px] mt-3">Dành cho Admin Yi Guitar</p>
                  </div>
                  <button type="button" onClick={() => setShowModal(false)} className="bg-slate-50 text-slate-400 p-4 rounded-full hover:text-slate-800 transition-all">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
              </div>

              {/* MODAL BODY - Scrollable */}
              <div className="flex-1 overflow-y-auto p-10 lg:p-12 custom-scrollbar">
                {/* TYPE SELECTOR */}
                <div className="grid grid-cols-2 gap-6 mb-12">
                   {['Online', 'Offline'].map(t => (
                     <label key={t} className={`flex items-center justify-center p-8 rounded-[32px] border-2 cursor-pointer transition-all ${
                        formData.type === t ? 'border-[#00c7d3] bg-[#00c7d3]/5' : 'border-slate-50 hover:border-slate-100 bg-slate-50/50'
                     }`}>
                        <input 
                           type="radio" name="type" className="hidden" value={t} 
                           checked={formData.type === t} 
                           onChange={() => {
                             const newType = t;
                             setFormData(prev => {
                               if (newType === 'Online') {
                                 return { ...prev, type: newType, schedule: '', location: '' };
                               }
                               return { ...prev, type: newType };
                             });
                           }} 
                        />
                        <div className="text-center">
                           <div className={`text-2xl font-black italic mb-1 ${formData.type === t ? 'text-[#00c7d3]' : 'text-slate-400'}`}>{t}</div>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t === 'Online' ? 'Học qua Video & Tài liệu' : 'Học tại trung tâm'}</p>
                        </div>
                     </label>
                   ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                  {/* CỘT 1: THÔNG TIN CƠ BẢN */}
                  <div className="space-y-6">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest pl-4 mb-4 border-l-4 border-[#00c7d3]">1. Thông tin chung</h3>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block pl-4">Tên khóa học</label>
                      <input 
                        type="text" required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#00c7d3]/20 transition-all placeholder:text-slate-300" 
                        placeholder="VD: Guitar đệm hát cấp tốc..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block pl-4">Giá tiền</label>
                        <input 
                          type="number" required value={formData.price ?? 0} onChange={e => setFormData({...formData, price: e.target.value === '' ? '' : Number(e.target.value)})}
                          className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#00c7d3]/5 transition-all" 
                        />
                      </div>
                      {formData.type === 'Online' && (
                        <div>
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block pl-4">Thời lượng tổng</label>
                           <input 
                             type="text" value={formData.totalDuration || ''} onChange={e => setFormData({...formData, totalDuration: e.target.value})}
                             className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#00c7d3]/5 transition-all"
                             placeholder="10 giờ..."
                           />
                        </div>
                      )}
                    </div>

                    {formData.type === 'Offline' && (
                      <div className="bg-slate-50 border-l-4 border-blue-500 p-6 rounded-2xl space-y-4">
                        <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2 pl-2">Thông tin khóa Offline</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block pl-4">Lịch học <span className="text-rose-500">*</span></label>
                            <input 
                              type="text" value={formData.schedule || ''} onChange={e => setFormData({...formData, schedule: e.target.value})}
                              className="w-full bg-white border-none rounded-xl p-4 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-500/20 transition-all"
                              placeholder="VD: Tối 2-4-6..."
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block pl-4">Địa điểm <span className="text-rose-500">*</span></label>
                            <input 
                              type="text" value={formData.location || ''} onChange={e => setFormData({...formData, location: e.target.value})}
                              className="w-full bg-white border-none rounded-xl p-4 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-500/20 transition-all"
                              placeholder="Nhập địa chỉ cơ sở..."
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest pl-4 mt-8 mb-4 border-l-4 border-[#00c7d3]">2. Giảng viên & Media</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block pl-4">Tên giảng viên</label>
                        <input 
                          type="text" required value={formData.instructor || ''} onChange={e => setFormData({...formData, instructor: e.target.value})}
                          className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#00c7d3]/5" 
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block pl-4">Số điện thoại</label>
                        <input 
                          type="text" value={formData.instructorPhone || ''} onChange={e => setFormData({...formData, instructorPhone: e.target.value})}
                          className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#00c7d3]/5" 
                          placeholder="09xx..."
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block pl-4">Ảnh Thumbnail</label>
                      <div className="flex gap-4">
                        <input 
                          type="text" value={formData.image || ''} onChange={e => setFormData({...formData, image: e.target.value})}
                          className="flex-grow bg-slate-50 border-none rounded-2xl p-5 text-[10px] font-bold text-slate-500" 
                          placeholder="Link ảnh hoặc tải lên..."
                        />
                        <label className="bg-[#00c7d3] p-5 rounded-2xl cursor-pointer hover:bg-[#00c7d3] transition-all shadow-lg shadow-[#00c7d3]/20 shrink-0">
                          <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block pl-4">Video Trailer (MP4)</label>
                      <div className="flex gap-4">
                        <input 
                          type="text" readOnly value={formData.introVideoFile ? formData.introVideoFile.name : (formData.introVideo || '')}
                          className="flex-grow bg-slate-50 border-none rounded-2xl p-5 text-[10px] font-bold text-slate-500 italic" 
                          placeholder="Chưa chọn video..."
                        />
                        <label className="bg-slate-800 p-5 rounded-2xl cursor-pointer hover:bg-slate-700 transition-all shrink-0">
                          <input type="file" className="hidden" onChange={handleVideoUpload} accept="video/mp4" />
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                        </label>
                      </div>
                    </div>

                    <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em] pl-4 mt-10 mb-6 border-l-4 border-[#00c7d3]">
                      3. Bạn sẽ học được gì?
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                       {formData.benefits.map((benefit, i) => (
                          <div key={i} className="space-y-1.5">
                             <p className="text-[9px] font-black text-slate-300 uppercase pl-2">Mục {i+1}</p>
                             <input 
                               type="text" value={benefit || ''} onChange={e => handleBenefitChange(i, e.target.value)}
                               className="w-full bg-white border border-slate-100 rounded-xl p-4 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-[#00c7d3]/5"
                             />
                          </div>
                       ))}
                    </div>
                  </div>

                  {/* CỘT 2: GIÁO TRÌNH CHI TIẾT */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pl-4 border-l-4 border-[#00c7d3] mb-6">
                       <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em]">4. Giáo trình (Curriculum)</h3>
                    </div>
                    
                    <div className="space-y-6">
                       {formData.curriculum.map((chapter, cIndex) => (
                          <div key={cIndex} className="bg-slate-100/50 border border-slate-100 rounded-3xl p-6 relative group/chapter">
                             <div className="flex items-center gap-3 mb-4">
                                <input 
                                   type="text" value={chapter.title || ''} onChange={e => handleChapterChange(cIndex, e.target.value)}
                                   className="flex-grow bg-white border border-slate-200 rounded-xl p-3 text-sm font-black text-slate-800 uppercase tracking-tight"
                                   placeholder="Tên Chương..."
                                />
                                <button type="button" onClick={() => handleRemoveChapter(cIndex)} className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all opacity-0 group-hover/chapter:opacity-100">
                                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                </button>
                             </div>

                             <div className="space-y-3 pl-4 border-l-2 border-slate-200">
                                {chapter.lessons.map((lesson, lIndex) => (
                                   <div key={lIndex} className="flex items-center gap-2 group/lesson">
                                      <input 
                                         type="text" value={lesson || ''} onChange={e => handleLessonChange(cIndex, lIndex, e.target.value)}
                                         className="flex-grow bg-white border border-slate-200 rounded-lg p-3 text-xs font-bold text-slate-600"
                                         placeholder={`Bài ${lIndex+1}...`}
                                      />
                                      <button type="button" onClick={() => handleRemoveLesson(cIndex, lIndex)} className="w-8 h-8 rounded-lg text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover/lesson:opacity-100">
                                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
                                      </button>
                                   </div>
                                ))}
                                <button type="button" onClick={() => handleAddLesson(cIndex)} className="text-[10px] font-black text-[#00c7d3] uppercase tracking-widest hover:underline pt-2">+ Thêm bài giảng</button>
                             </div>
                          </div>
                       ))}

                       <button 
                          type="button" onClick={handleAddChapter}
                          className="w-full py-6 border-2 border-dashed border-slate-200 rounded-3xl text-[11px] font-black text-slate-400 uppercase tracking-widest hover:border-[#00c7d3] hover:text-[#00c7d3] hover:bg-[#00c7d3]/5 transition-all"
                       >
                          + THÊM CHƯƠNG MỚI
                       </button>
                    </div>
                  </div>
                </div>

                {uploadProgress > 0 && (
                   <div className="mt-12 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="flex justify-between mb-2">
                         <span className="text-[10px] font-black text-[#00c7d3] uppercase tracking-widest">Đang tải lên dữ liệu...</span>
                         <span className="text-[10px] font-black text-[#00c7d3]">{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                         <div className="bg-[#00c7d3] h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                      </div>
                   </div>
                )}
              </div>

              {/* MODAL FOOTER - Fixed */}
              <div className="p-8 lg:p-10 bg-slate-50 border-t border-slate-100 shrink-0">
                <div className="flex gap-4">
                  <button type="submit" disabled={loading} className="flex-grow bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200 hover:-translate-y-1 transition-all disabled:opacity-50">
                    {loading ? 'ĐANG XỬ LÝ...' : (editingId ? 'CẬP NHẬT KHÓA HỌC' : 'LƯU KHÓA HỌC NGAY')}
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} className="px-10 bg-white text-slate-400 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:text-slate-800 transition-all border border-slate-100">
                    Hủy bỏ
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      <ConfirmModal 
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
      />
    </div>
  );
};

export default CourseManagement;
