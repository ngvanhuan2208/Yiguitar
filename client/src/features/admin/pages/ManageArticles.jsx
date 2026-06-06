import React, { useState, useEffect } from 'react';
import api from '@/api/axios';
import { normalizeObject } from '@/utils/textUtils';

const CATEGORIES = ['Guitar', 'Tin tức'];

const ManageArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Guitar',
    summary: '',
    content: '',
    image: '',
    author: 'Admin Yi Guitar'
  });

  const fetchArticles = async () => {
    setLoading(true);
    try {
      // Vì API bài viết đã được nâng cấp phân trang, ta lấy list bài viết từ response.data.articles
      // Admin lấy hết danh sách (limit=999) để dễ quản lý
      const response = await api.get('/articles?limit=999');
      setArticles(response.data.articles || response.data);
    } catch (err) {
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Tự động chuẩn hóa nội dung Tiếng Việt về dạng NFC để tránh lỗi font/nhảy dấu
      const normalizedData = normalizeObject(formData, ['title', 'summary', 'content', 'author']);

      if (editingId) {
        await api.put(`/articles/${editingId}`, normalizedData);
      } else {
        await api.post('/articles', normalizedData);
      }
      setFormData({ title: '', category: 'Guitar', summary: '', content: '', image: '', author: 'Admin Yi Guitar' });
      setEditingId(null);
      fetchArticles();
      alert(editingId ? 'Cập nhật thành công!' : 'Thêm bài viết mới thành công!');
    } catch (err) {
      console.error('Error saving article:', err);
      alert('Có lỗi xảy ra!');
    }
  };

  const handleEdit = (article) => {
    setEditingId(article._id);
    setFormData({
      title: article.title,
      category: article.category,
      summary: article.summary,
      content: article.content,
      image: article.image,
      author: article.author
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Cậu có chắc muốn xóa bài viết này không?')) return;
    try {
      await api.delete(`/articles/${id}`);
      fetchArticles();
    } catch (err) {
      console.error('Error deleting article:', err);
    }
  };

  const toggleFeatured = async (article) => {
    try {
      await api.put(`/articles/${article._id}`, { isFeatured: !article.isFeatured });
      fetchArticles(); // Reload to reflect changes
    } catch (err) {
      console.error('Error toggling featured status:', err);
      alert('Có lỗi xảy ra!');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadingData = new FormData();
    uploadingData.append('images', file);

    try {
      setLoading(true);
      const res = await api.post('/upload', uploadingData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData(prev => ({ ...prev, image: res.data.urls[0] }));
    } catch (err) {
      console.error('Upload error:', err);
      alert('Tải ảnh thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20 fade-in">
      <div className="bg-white border-b border-slate-100 py-10 mb-10">
        <div className="container mx-auto px-6 lg:px-16">
          <h1 className="text-3xl font-black text-slate-800 italic">Quản lý Bài viết</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Admin Dashboard / Articles</p>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-16 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100 sticky top-28">
            <h2 className="text-xl font-black text-slate-800 mb-6 italic">
              {editingId ? '⚡ Chỉnh sửa bài viết' : '➕ Thêm bài viết mới'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-4">Tiêu đề</label>
                <input 
                  type="text" 
                  value={formData.title || ''} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-slate-50 border-none rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#00c7d3]/20 transition-all" 
                  placeholder="Nhập tiêu đề bài viết..."
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-4">Chuyên mục</label>
                  <select 
                    value={formData.category || 'Guitar'} 
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#00c7d3]/20"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-4">Tác giả</label>
                  <input 
                    type="text" 
                    value={formData.author || ''} 
                    onChange={(e) => setFormData({...formData, author: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-[#00c7d3]/20" 
                    placeholder="Tên tác giả..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-4">Ảnh bìa</label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={formData.image || ''} 
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      className="flex-grow bg-slate-50 border-none rounded-xl p-4 text-xs font-bold focus:ring-2 focus:ring-[#00c7d3]/20" 
                      placeholder="URL ảnh hoặc tải lên..."
                    />
                    <label className="bg-slate-900 text-white p-4 rounded-xl cursor-pointer hover:bg-slate-800 transition-all flex items-center justify-center shrink-0 shadow-lg shadow-slate-200">
                      <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                    </label>
                  </div>
                  {formData.image && (
                    <div className="relative group rounded-2xl overflow-hidden border-2 border-slate-50 aspect-video">
                       <img src={formData.image.startsWith('http') ? formData.image : `${import.meta.env.VITE_BASE_URL}${formData.image}`} alt="Preview" className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <p className="text-white text-[10px] font-black uppercase tracking-widest">Ảnh xem trước</p>
                       </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-4">Tóm tắt</label>
                <textarea 
                  rows="3" 
                  value={formData.summary || ''} 
                  onChange={(e) => setFormData({...formData, summary: e.target.value})}
                  className="w-full bg-slate-50 border-none rounded-xl p-6 text-sm font-bold focus:ring-2 focus:ring-[#00c7d3]/20"
                  placeholder="Mô tả ngắn gọn về bài viết..."
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-4">Nội dung</label>
                <textarea 
                  rows="8" 
                  value={formData.content || ''} 
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="w-full bg-slate-50 border-none rounded-[32px] p-6 text-sm font-bold focus:ring-2 focus:ring-[#00c7d3]/20"
                  placeholder="Viết nội dung bài viết vào đây..."
                  required
                ></textarea>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="submit" disabled={loading} className="flex-grow bg-[#00c7d3] text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-[#00c7d3]/30 hover:shadow-xl transition-all disabled:opacity-50">
                  {loading ? 'Đang xử lý...' : (editingId ? 'Cập nhật ngay' : 'Lưu bài viết')}
                </button>
                {editingId && (
                  <button 
                    type="button" 
                    onClick={() => { setEditingId(null); setFormData({ title: '', category: 'Guitar', summary: '', content: '', image: '', author: 'Admin Yi Guitar' }); }}
                    className="bg-slate-100 text-slate-400 px-6 py-4 rounded-xl font-black text-xs uppercase tracking-widest"
                  >
                    Hủy
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
               <h2 className="text-xl font-black text-slate-800 italic">Danh sách bài viết</h2>
               <span className="bg-slate-100 text-slate-400 text-[10px] font-black px-3 py-1 rounded-full">{articles.length} POSTS</span>
            </div>
            
            {loading ? (
              <div className="p-20 text-center text-slate-300 italic font-bold">Đang tải...</div>
            ) : articles.length === 0 ? (
              <div className="p-20 text-center text-slate-400 italic font-medium">Chưa có bài viết nào. Hãy tạo bài đầu tiên nhé!</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tiêu đề</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Chuyên mục</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Nổi bật</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {articles.map((article) => (
                      <tr key={article._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-6">
                           <p className="font-bold text-slate-800 line-clamp-1">{article.title}</p>
                           <p className="text-[10px] text-slate-400 font-medium">Bởi {article.author || 'Yi Guitar'}</p>
                        </td>
                        <td className="px-8 py-6">
                          <span className="bg-white border border-slate-100 text-[10px] font-black px-3 py-1 rounded-full text-slate-500">
                            {article.category}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <button
                            onClick={() => toggleFeatured(article)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                              article.isFeatured ? 'bg-[#00c7d3]' : 'bg-slate-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                                article.isFeatured ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex justify-center gap-4">
                            <button 
                              onClick={() => handleEdit(article)}
                              className="p-2 text-slate-400 hover:text-[#00c7d3] hover:bg-[#00c7d3]/10 rounded-lg transition-all"
                              title="Sửa"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                            </button>
                            <button 
                              onClick={() => handleDelete(article._id)}
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                              title="Xóa"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageArticles;
