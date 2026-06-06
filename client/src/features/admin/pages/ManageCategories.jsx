import React, { useEffect, useState, useCallback } from 'react';
import api from '@/api/axios';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [brandsList, setBrandsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMain, setActiveMain] = useState('');
  const [newSub, setNewSub] = useState('');
  const [newBrand, setNewBrand] = useState({ name: '', logo: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchBrands = useCallback(async () => {
    try {
      const response = await api.get('/brands');
      setBrandsList(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error fetching brands:', err);
      setBrandsList([]);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await api.get('/categories');
      const data = Array.isArray(response.data) ? response.data : [];
      setCategories(data);
      // Logic để giữ activeMain cũ nếu vẫn tồn tại, nếu không chọn cái đầu tiên
      setActiveMain(prev => {
        const hasActiveCategory = data.some((category) => category?.name === prev);
        return hasActiveCategory ? prev : (data[0]?.name || '');
      });
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories([]);
      setActiveMain('');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, [fetchCategories, fetchBrands]);

  const handleAddMain = async (e) => {
    e.preventDefault();
    const name = prompt('Nhập tên danh mục chính mới:', '');
    if (!name?.trim()) return;

    try {
      setIsSubmitting(true);
      await api.post('/categories', { name: name.trim() });
      await fetchCategories();
    } catch (err) {
      console.error('Error adding main category:', err);
      alert('Lỗi: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditMain = async (id, currentName) => {
    const name = prompt('Nhập tên danh mục chính mới:', currentName);
    if (!name?.trim() || name.trim() === currentName) return;

    try {
      setIsSubmitting(true);
      await api.put(`/categories/${id}`, { name: name.trim() });
      await fetchCategories();
    } catch (err) {
      console.error('Error updating main category:', err);
      alert('Không thể cập nhật danh mục.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMain = async (id, name) => {
    if (!window.confirm(`Xác nhận xóa danh mục chính "${name}"?`)) return;

    try {
      setIsDeleting(true);
      await api.delete(`/categories/${id}`);
      setActiveMain('');
      await fetchCategories();
    } catch (err) {
      console.error('Error deleting main category:', err);
      alert('Không thể xóa danh mục.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddSub = async (e) => {
    e.preventDefault();
    if (!newSub.trim()) return;

    try {
      setIsSubmitting(true);
      await api.post('/categories/sub', { mainCategory: activeMain, subName: newSub.trim() });
      await fetchCategories();
      setNewSub('');
    } catch (err) {
      console.error('Error adding subcategory:', err);
      alert('Không thể thêm loại mới.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSub = async (subName) => {
    if (!window.confirm(`Xác nhận xóa loại "${subName}" khỏi danh mục ${activeMain}?`)) return;

    try {
      setIsDeleting(true);
      await api.delete('/categories/sub', { data: { mainCategory: activeMain, subName } });
      await fetchCategories();
    } catch (err) {
      console.error('Error deleting subcategory:', err);
      alert('Không thể xóa loại này.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddBrand = async (e) => {
    e.preventDefault();
    if (!newBrand.name.trim()) return;

    try {
      setIsSubmitting(true);
      await api.post('/brands', {
        name: newBrand.name.trim(),
        mainCategory: activeMain,
        logo: newBrand.logo.trim(),
        description: newBrand.description.trim()
      });
      await fetchBrands();
      setNewBrand({ name: '', logo: '', description: '' });
    } catch (err) {
      console.error('Error adding brand:', err);
      alert('Lỗi khi thêm thương hiệu mới.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditBrand = async (brand) => {
    const name = prompt('Nhập tên thương hiệu mới:', brand.name);
    if (!name?.trim()) return;
    const logoInput = prompt('Nhập link logo mới:', brand.logo || '');
    const logo = logoInput ?? brand.logo ?? '';

    try {
      setIsSubmitting(true);
      await api.put(`/brands/${brand._id}`, {
        name: name.trim(),
        logo: logo.trim(),
        description: brand.description || '',
        mainCategory: brand.mainCategory || activeMain
      });
      await fetchBrands();
    } catch (err) {
      console.error('Error updating brand:', err);
      alert('Không thể cập nhật thương hiệu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBrand = async (id, name) => {
    if (!window.confirm(`Xác nhận xóa thương hiệu "${name}"? Thao tác này không thể hoàn tác.`)) return;

    try {
      setIsDeleting(true);
      await api.delete(`/brands/${id}`);
      await fetchBrands();
    } catch (err) {
      console.error('Error deleting brand:', err);
      alert('Không thể xóa thương hiệu này.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <div className="p-20 text-center text-slate-400 font-bold italic">Đang tải cấu trúc danh mục...</div>;
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="p-20 text-center">
        <p className="text-slate-400 font-bold italic mb-4">Chưa có dữ liệu danh mục hoặc lỗi kết nối.</p>
        <button onClick={fetchCategories} className="text-xs font-black uppercase tracking-widest text-[#00c7d3]">
          Thử tải lại
        </button>
      </div>
    );
  }

  const activeCategory =
    (categories || []).find((category) => category && category.name === activeMain) ||
    (categories && categories[0]);
  const brandsInActiveCategory = (brandsList || []).filter((brand) => brand && brand.mainCategory === activeMain);

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20 fade-in">
      <div className="bg-white border-b border-slate-100 py-10 mb-10">
        <div className="container mx-auto px-6 lg:px-16 flex justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 italic">Quản lý Phân loại</h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">
              Cấu hình các loại sản phẩm và thương hiệu
            </p>
          </div>
          <button
            onClick={handleAddMain}
            disabled={isSubmitting}
            className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:-translate-y-1 transition-all shadow-xl shadow-slate-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {isSubmitting ? 'Đang xử lý...' : '+ Danh mục chính mới'}
          </button>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-4">
              Danh mục chính
            </h3>
            {(categories || []).map((cat) => (
              cat && (
                <div key={cat._id} className="relative group/main">
                  <button
                    onClick={() => setActiveMain(cat.name)}
                    className={`w-full p-6 pr-32 rounded-[32px] text-left transition-all flex justify-between items-center ${
                      activeMain === cat.name
                        ? 'bg-slate-900 text-white shadow-xl shadow-slate-200'
                        : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-50'
                    }`}
                  >
                    <span className="font-black italic">{cat.name}</span>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] opacity-60 font-bold uppercase tracking-widest">
                        {cat.subCategories?.length || 0} loại
                      </span>
                      <span className="text-[10px] opacity-60 font-bold uppercase tracking-widest mt-1">
                        {(brandsList || []).filter((brand) => brand && brand.mainCategory === cat.name).length} hiệu
                      </span>
                    </div>
                  </button>

                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2 opacity-0 group-hover/main:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditMain(cat._id, cat.name);
                      }}
                      disabled={isSubmitting}
                      className="min-w-[84px] h-8 px-3 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-900 hover:text-white transition-all text-[10px] font-black uppercase tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
                      title="Sửa danh mục chính"
                    >
                      {isSubmitting ? 'Đang xử lý...' : 'Sửa'}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMain(cat._id, cat.name);
                      }}
                      disabled={isDeleting}
                      className="min-w-[84px] h-8 px-3 rounded-full bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
                      title="Xóa danh mục chính"
                    >
                      {isDeleting ? 'Đang xử lý...' : 'Xóa'}
                    </button>
                  </div>
                </div>
              )
            ))}
          </div>

          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white p-10 rounded-[48px] shadow-xl shadow-slate-200/50 border border-slate-50">
              {activeMain ? (
                <>
                  <div className="mb-16">
                    <div className="flex flex-wrap justify-between items-center gap-6 mb-10">
                      <div>
                        <h2 className="text-2xl font-black text-slate-800 italic">Các loại {activeMain}</h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                          Quản lý các danh mục con
                        </p>
                      </div>
                      <form onSubmit={handleAddSub} className="flex gap-2 w-full md:w-auto">
                        <input
                          value={newSub}
                          onChange={(e) => setNewSub(e.target.value)}
                          placeholder="Tên loại... (ví dụ: Acoustic)"
                          disabled={isSubmitting}
                          className="flex-1 bg-slate-50 border-none rounded-2xl px-6 py-3 text-sm font-bold focus:ring-2 focus:ring-[#00c7d3]/20 transition-all disabled:opacity-60"
                        />
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="bg-[#00c7d3] text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-cyan-100 flex-shrink-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                          {isSubmitting ? 'Đang xử lý...' : '+ Thêm loại'}
                        </button>
                      </form>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {activeCategory?.subCategories?.map((sub, index) => (
                        <div
                          key={`${sub}-${index}`}
                          className="group relative bg-slate-50 p-6 rounded-3xl border border-slate-100 hover:border-[#00c7d3]/30 transition-all text-center"
                        >
                          <p className="font-bold text-slate-700">{sub}</p>
                          <button
                            onClick={() => handleDeleteSub(sub)}
                            disabled={isDeleting}
                            className="absolute -top-2 right-2 min-w-[84px] h-8 px-3 bg-white text-rose-500 rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-50 text-[10px] font-black uppercase tracking-wide disabled:opacity-100 disabled:cursor-not-allowed"
                          >
                            {isDeleting ? 'Đang xử lý...' : 'Xóa'}
                          </button>
                        </div>
                      ))}
                      {(!activeCategory?.subCategories || activeCategory.subCategories.length === 0) && (
                        <div className="col-span-full py-10 text-center text-slate-300 italic font-bold">
                          Danh mục này chưa có loại con nào.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-10 border-t border-slate-50">
                    <div className="flex flex-wrap justify-between items-center gap-6 mb-10">
                      <div>
                        <h2 className="text-2xl font-black text-slate-800 italic">Thương hiệu {activeMain}</h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                          Quản lý các hãng theo danh mục
                        </p>
                      </div>
                      <form
                        onSubmit={handleAddBrand}
                        className="flex flex-col gap-3 w-full md:w-auto bg-slate-50 p-6 rounded-3xl border border-slate-100"
                      >
                        <div className="flex gap-2">
                          <input
                            value={newBrand.name}
                            onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })}
                            placeholder="Tên hãng... (ví dụ: Yamaha)"
                            disabled={isSubmitting}
                            className="flex-grow bg-white border-none rounded-2xl px-6 py-3 text-sm font-bold focus:ring-2 focus:ring-slate-900/20 shadow-sm disabled:opacity-60"
                          />
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                          >
                            {isSubmitting ? 'Đang xử lý...' : '+ Thêm'}
                          </button>
                        </div>
                        <input
                          value={newBrand.logo}
                          onChange={(e) => setNewBrand({ ...newBrand, logo: e.target.value })}
                          placeholder="Link Logo (URL)..."
                          disabled={isSubmitting}
                          className="w-full bg-white border-none rounded-2xl px-6 py-2 text-[11px] font-bold focus:ring-2 focus:ring-slate-900/10 shadow-sm disabled:opacity-60"
                        />
                      </form>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {brandsInActiveCategory.map((brand) => (
                        <div
                          key={brand._id}
                          className="group relative bg-[#F2FCFC] p-6 rounded-3xl border border-[#00c7d3]/10 hover:border-[#00c7d3]/30 transition-all text-center"
                        >
                          {brand.logo && (
                            <img
                              src={brand.logo}
                              alt={brand.name}
                              className="w-8 h-8 mx-auto mb-2 object-contain opacity-60 group-hover:opacity-100"
                            />
                          )}
                          <p className="font-bold text-[#00c7d3]">{brand.name || 'Không tên'}</p>
                          <div className="absolute -top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEditBrand(brand)}
                              disabled={isSubmitting}
                              className="min-w-[84px] h-8 px-3 bg-white text-slate-700 rounded-full shadow-lg flex items-center justify-center hover:bg-slate-900 hover:text-white text-[10px] font-black uppercase tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                              {isSubmitting ? 'Đang xử lý...' : 'Sửa'}
                            </button>
                            <button
                              onClick={() => handleDeleteBrand(brand._id, brand.name)}
                              disabled={isDeleting}
                              className="min-w-[84px] h-8 px-3 bg-white text-rose-500 rounded-full shadow-lg flex items-center justify-center hover:bg-rose-50 text-[10px] font-black uppercase tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                              {isDeleting ? 'Đang xử lý...' : 'Xóa'}
                            </button>
                          </div>
                        </div>
                      ))}
                      {brandsInActiveCategory.length === 0 && (
                        <div className="col-span-full py-10 text-center text-slate-300 italic font-bold">
                          Chưa có thương hiệu nào được thêm cho danh mục này.
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-20 text-slate-300 italic font-bold">
                  <p className="text-4xl mb-6">📂</p>
                  <p>Chọn một danh mục chính để quản lý</p>
                </div>
              )}
            </div>

            <div className="bg-amber-50 rounded-[32px] p-8 border border-amber-100">
              <div className="flex gap-4">
                <div className="text-2xl">💡</div>
                <div>
                  <p className="text-amber-800 font-black text-[10px] uppercase tracking-widest mb-1">Hướng dẫn nhanh</p>
                  <p className="text-amber-700/80 text-sm font-bold">
                    Thương hiệu thêm ở đây sẽ tự động hiển thị trong bộ lọc Hãng ở trang danh sách sản phẩm tương ứng.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCategories;
