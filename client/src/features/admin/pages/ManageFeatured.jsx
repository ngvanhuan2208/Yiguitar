import React, { useState, useEffect } from 'react';
import api from '@/api/axios';

const CATEGORIES = ['Tất cả', 'Guitar', 'Accessory', 'Course', 'Tab'];

const ManageFeatured = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Tất cả');

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products?limit=200');
      setProducts(response.data.products);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching products:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    fetchProducts();
  }, []);

  const toggleFeatured = async (id) => {
    try {
      const response = await api.patch(`/products/${id}/feature`);
      const updatedProduct = response.data;
      setProducts(products.map(p => p._id === id ? updatedProduct : p));
    } catch (err) {
      console.error('Error toggling featured status:', err);
    }
  };

  if (loading) return <div className="p-20 text-center text-slate-400">Đang tải dữ liệu...</div>;

  const filteredProducts = activeTab === 'Tất cả'
    ? products
    : products.filter(p => p.category === activeTab);

  const countFeatured = (cat) => {
    const list = cat === 'Tất cả' ? products : products.filter(p => p.category === cat);
    return list.filter(p => p.isFeatured).length;
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20 fade-in">
      <div className="bg-white border-b border-slate-100 py-10 mb-8">
        <div className="container mx-auto px-6 lg:px-16">
          <h1 className="text-3xl font-black text-slate-800 italic">Quản Lý Sản Phẩm Nổi Bật</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">
            Chọn tối đa 4 sản phẩm mỗi danh mục để hiển thị tại trang chủ
          </p>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-3 mt-6">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === cat
                    ? 'bg-slate-900 text-white shadow-lg'
                    : 'bg-white border border-slate-200 text-slate-500 hover:border-[#00c7d3] hover:text-[#00c7d3]'
                }`}
              >
                {cat}
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black ${
                  activeTab === cat ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {countFeatured(cat)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-16">
        <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-xl shadow-slate-200/50">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Sản phẩm</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Danh mục</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Giá</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Nổi bật</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <img src={product.image} alt="" className="w-12 h-12 rounded-xl object-cover bg-slate-100" />
                      <div>
                        <p className="font-black text-slate-800 italic line-clamp-1">{product.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                          {typeof product.brand === 'object' ? product.brand?.name : (product.brand || 'No Brand')}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-3 py-1 rounded-full uppercase tracking-widest">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-8 py-5 font-black text-slate-800 italic">
                    {product.price.toLocaleString('vi-VN')} ₫
                  </td>
                  <td className="px-8 py-5 text-center">
                    <button
                      onClick={() => toggleFeatured(product._id)}
                      className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none ${
                        product.isFeatured ? 'bg-[#00c7d3]' : 'bg-slate-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                          product.isFeatured ? 'translate-x-8' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <span className={`block text-[9px] mt-1.5 font-black uppercase tracking-widest ${product.isFeatured ? 'text-[#00c7d3]' : 'text-slate-300'}`}>
                      {product.isFeatured ? '⭐ Nổi bật' : 'Ẩn'}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-16 text-center text-slate-300 italic font-bold">
                    Không có sản phẩm nào trong danh mục này.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageFeatured;
