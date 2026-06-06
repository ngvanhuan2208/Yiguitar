import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '@/api/axios';
import { normalizeObject } from '@/utils/textUtils';

// Presentational Components
import ProductTable from '../components/ManageProducts/ProductTable';
import GuitarForm from '../components/ManageProducts/GuitarForm';
import CourseForm from '../components/ManageProducts/CourseForm';
import TabForm from '../components/ManageProducts/TabForm';
import CategoryModal from '../components/ManageProducts/CategoryModal';
import BrandModal from '../components/ManageProducts/BrandModal';
import ConfirmModal from '@/components/common/ConfirmModal';

const ManageProducts = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [newSubCategory, setNewSubCategory] = useState('');
  const [newBrand, setNewBrand] = useState({ name: '', logo: '', description: '' });
  const [filterCategory, setFilterCategory] = useState(searchParams.get('category') || 'Guitar');
  const [categories, setCategories] = useState([]);
  const [brandsList, setBrandsList] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [targetDeleteId, setTargetDeleteId] = useState(null);

  const TABS = ['Guitar', 'Accessory'];
  const TAB_LABELS = { Guitar: '🎸 Guitar', Accessory: '🎵 Phụ kiện', Course: '🎓 Khoá học', Tab: '🎼 Tab Guitar' };

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'Guitar',
    type: '',
    price: 0,
    image: '',
    images: [],
    stock: 0,
    rating: 5,
    reviews: 0,
    description: '',
    videoId: '',
    instructor: '',
    level: 'Cơ bản',
    artist: '',
    tabimage: '',
    warranty: '12 Tháng'
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const categoryParam = filterCategory !== 'Tất cả' ? `&category=${filterCategory}` : '';
      const response = await api.get(`/products?page=${currentPage}&limit=8${categoryParam}`);
      setProducts(response.data?.products || []);
      setTotalPages(response.data?.pages || 1);
    } catch (err) {
      console.error('Error fetching products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories([]);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await api.get('/brands');
      setBrandsList(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error fetching brands:', err);
      setBrandsList([]);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  useEffect(() => {
    const catParam = searchParams.get('category');
    if (catParam) {
      setFilterCategory(catParam);
    }

    const editId = searchParams.get('edit');
    if (editId) {
       const loadProductToEdit = async () => {
         try {
           const res = await api.get(`/products/${editId}`);
           handleEdit(res.data);
           setSearchParams({});
         } catch (err) {
           console.error('Error loading product for quick edit:', err);
         }
       };
       loadProductToEdit();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filterCategory]);

  const extractVideoID = (url) => {
    if (!url) return '';
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Tự động chuẩn hóa nội dung Tiếng Việt về dạng NFC để tránh lỗi font/nhảy dấu
      const normalizedFormData = normalizeObject(formData, ['name', 'description']);

      let productData = {
        ...normalizedFormData,
        videoId: extractVideoID(normalizedFormData.videoId)
      };

      // Fallback: Nếu là Tab và thiếu ảnh thumbnail, lấy luôn file Tab làm thumbnail
      if (formData.category === 'Tab' && !productData.image && productData.tabimage) {
        productData.image = productData.tabimage;
      }

      // Xử lý brand: Nếu rỗng thì để null để tránh lỗi ép kiểu ObjectId của MongoDB
      if (!productData.brand) {
        productData.brand = null;
      }

      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, productData);
      } else {
        await api.post('/products', productData);
      }
      setShowModal(false);
      setEditingProduct(null);
      fetchProducts();
      resetForm();
    } catch (err) {
      console.error('Error saving product:', err);
      const errorMsg = err.response?.data?.message || 'Có lỗi xảy ra khi lưu dữ liệu!';
      alert(`❌ Lỗi: ${errorMsg}`);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    const brandId = (product.brand && typeof product.brand === 'object') ? product.brand._id : product.brand;
    setFormData({ 
      ...product, 
      brand: brandId || '',
      images: product.images || []
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setTargetDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/products/${targetDeleteId}`);
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('❌ Lỗi: Không thể xóa sản phẩm.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      brand: '',
      category: 'Guitar',
      type: '',
      price: 0,
      image: '',
      images: [],
      stock: 0,
      rating: 5,
      reviews: 0,
      description: '',
      videoId: '',
      instructor: '',
      level: 'Cơ bản',
      artist: '',
      tabimage: '',
      warranty: '12 Tháng'
    });
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const data = new FormData();
    files.forEach(file => data.append('images', file));

    try {
      setLoading(true);
      const res = await api.post('/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const newUrls = res.data.urls;
      
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...newUrls],
        image: prev.image || newUrls[0]
      }));
    } catch (err) {
      console.error('Upload error:', err);
      alert('Tải ảnh thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const handleTabFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('images', file);

    try {
      setLoading(true);
      const res = await api.post('/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData(prev => ({ ...prev, tabimage: res.data.urls[0] }));
    } catch (err) {
      console.error('Tab upload error:', err);
      alert('Tải file Tab thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => {
      const updatedImages = (prev.images || []).filter((_, i) => i !== index);
      return {
        ...prev,
        images: updatedImages,
        image: prev.image === prev.images[index] ? (updatedImages[0] || '') : prev.image
      };
    });
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      brand: '',
      category: filterCategory,
      type: filterCategory === 'Course' ? 'Online' : '',
      price: 0,
      image: '',
      images: [],
      stock: 0,
      rating: 5,
      reviews: 0,
      description: '',
      videoId: '',
      instructor: '',
      level: 'Cơ bản',
      artist: '',
      tabimage: '',
      warranty: '12 Tháng'
    });
    setShowModal(true);
  };

  const handleAddSubCategory = async () => {
    if (!newSubCategory.trim()) return;
    const currentCatObj = categories.find(c => c.name === filterCategory);
    try {
      await api.post('/categories/sub', {
        mainCategory: filterCategory,
        categoryId: currentCatObj?._id,
        subName: newSubCategory.trim()
      });
      setNewSubCategory('');
      setShowCategoryModal(false);
      fetchCategories();
      alert(`Đã thêm "${newSubCategory.trim()}" vào danh mục ${filterCategory}!`);
    } catch (err) {
      console.error('Error adding subcategory:', err);
      alert('Không thể thêm danh mục!');
    }
  };

  const handleAddBrand = async () => {
    if (!newBrand.name.trim()) return;
    try {
      await api.post('/brands', {
        name: newBrand.name.trim(),
        logo: newBrand.logo.trim(),
        description: newBrand.description.trim(),
        mainCategory: filterCategory
      });
      setNewBrand({ name: '', logo: '', description: '' });
      setShowBrandModal(false);
      fetchBrands();
      alert(`Đã tạo thương hiệu "${newBrand.name.trim()}" thành công!`);
    } catch (err) {
      console.error('Error adding brand:', err);
      const errorMsg = err.response?.data?.message || 'Không thể tạo thương hiệu mới!';
      alert(`❌ Lỗi: ${errorMsg}`);
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20 fade-in">
      <div className="bg-white border-b border-slate-100 pb-0 mb-10">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="pt-10 pb-6">
            <h1 className="text-3xl font-black text-slate-800 italic">Quản lý Sản phẩm</h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Chọn danh mục để quản lý sản phẩm</p>
          </div>

          <div className="flex items-end gap-1">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => { setFilterCategory(tab); setCurrentPage(1); }}
                className={`px-6 py-3 font-black text-[11px] uppercase tracking-widest rounded-t-2xl transition-all ${
                  filterCategory === tab ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                }`}
              >
                {TAB_LABELS[tab]}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t-2 border-slate-900">
          <div className="container mx-auto px-6 lg:px-16 py-4 flex justify-between items-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {(TAB_LABELS[filterCategory] || TAB_LABELS['Guitar'])} — quản lý sản phẩm & danh mục con
            </p>
            <div className="flex items-center gap-3">
              {filterCategory !== 'Tab' && (
                <>
                  <button onClick={() => setShowCategoryModal(true)} className="px-5 py-2.5 rounded-xl border-2 border-slate-200 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:border-[#00c7d3] hover:text-[#00c7d3] transition-all">+ Thêm danh mục con</button>
                  <button onClick={() => setShowBrandModal(true)} className="px-5 py-2.5 rounded-xl border-2 border-slate-200 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:border-slate-900 hover:text-slate-900 transition-all">+ Thêm thương hiệu</button>
                </>
              )}
              <button onClick={openAddModal} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:-translate-y-0.5 transition-all shadow-lg shadow-slate-300/50">
                + Thêm {(TAB_LABELS[filterCategory] || '').split(' ').slice(1).join(' ') || 'Sản phẩm'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-16">
        <ProductTable 
          products={products}
          loading={loading}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      </div>

      {/* Main Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[70] flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-white w-full max-w-4xl rounded-[40px] overflow-hidden shadow-2xl animate-zoom-in max-h-[90vh] overflow-y-auto">
            <div className="p-10">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black text-slate-800 italic">
                  {editingProduct ? 'Cập nhật' : 'Thêm mới'} {formData.category === 'Tab' ? 'bản nhạc' : 'sản phẩm'}
                </h2>
                <button onClick={() => setShowModal(false)} className="text-slate-300 hover:text-slate-800 transition-colors">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>

              {formData.category === 'Tab' ? (
                <TabForm 
                  formData={formData} setFormData={setFormData}
                  categories={categories} handleTabFileChange={handleTabFileChange}
                  loading={loading} api={api} handleSubmit={handleSubmit} setShowModal={setShowModal}
                />
              ) : formData.category === 'Course' ? (
                <CourseForm 
                  formData={formData} setFormData={setFormData}
                  categories={categories} brandsList={brandsList}
                  filterCategory={filterCategory} editingProduct={editingProduct}
                  handleFileChange={handleFileChange} removeImage={removeImage}
                  loading={loading} handleSubmit={handleSubmit} setShowModal={setShowModal}
                />
              ) : (
                <GuitarForm 
                  formData={formData} setFormData={setFormData}
                  categories={categories} brandsList={brandsList}
                  filterCategory={filterCategory} editingProduct={editingProduct}
                  handleFileChange={handleFileChange} removeImage={removeImage}
                  loading={loading} handleSubmit={handleSubmit} setShowModal={setShowModal}
                />
              )}
            </div>
          </div>
        </div>
      )}

      <CategoryModal 
        showCategoryModal={showCategoryModal} setShowCategoryModal={setShowCategoryModal}
        filterCategory={filterCategory} TAB_LABELS={TAB_LABELS}
        newSubCategory={newSubCategory} setNewSubCategory={setNewSubCategory}
        handleAddSubCategory={handleAddSubCategory}
      />

      <BrandModal 
        showBrandModal={showBrandModal} setShowBrandModal={setShowBrandModal}
        filterCategory={filterCategory} TAB_LABELS={TAB_LABELS}
        newBrand={newBrand} setNewBrand={setNewBrand}
        handleAddBrand={handleAddBrand}
      />

      <ConfirmModal 
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
        message="Cậu có chắc chắn muốn xóa sản phẩm này chứ? Hành động này không thể hoàn tác."
      />
    </div>
  );
};

export default ManageProducts;
