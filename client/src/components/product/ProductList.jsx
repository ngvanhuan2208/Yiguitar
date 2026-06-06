import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const MOCK_PRODUCTS = Array.from({ length: 16 }).map((_, index) => ({
  id: index + 1,
  name: `Đàn Guitar Cao Cấp ${index + 1}`,
  price: `${(Math.random() * 5 + 1).toFixed(1)}.000.000 ₫`,
  image: `https://images.unsplash.com/photo-1550993475-785b0a26d253?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80`,
  rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
  reviews: Math.floor(Math.random() * 50) + 10,
}));

const ProductList = ({ products = [], title = "Sản phẩm nổi bật", subtitle = "Danh mục của chúng tôi", viewMoreLink = '', bgLight = false }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  return (
    <section className={`py-20 ${bgLight ? 'bg-white' : 'bg-slate-50'}`}>
      <div className="container mx-auto px-6 lg:px-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-[#00c7d3] font-semibold text-sm uppercase tracking-wider">{subtitle}</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mt-2">{title}</h2>
          </div>
          <div className="text-[#00c7d3] font-semibold cursor-pointer hover:underline hidden sm:block">
            {viewMoreLink ? (
              <a href={viewMoreLink}>Xem tất cả →</a>
            ) : (
              <span>Xem tất cả →</span>
            )}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <Link 
              to={`/product/${product._id || product.id}`}
              key={product._id || product.id} 
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 group cursor-pointer hover:shadow-xl transition-all duration-300 flex flex-col relative"
            >
              {/* Admin Quick Edit Button */}
              {user?.role === 'admin' && (
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate(`/admin/products?edit=${product._id || product.id}`);
                  }}
                  className="absolute -top-2 -right-2 z-[60] bg-amber-400 text-white w-9 h-9 rounded-full flex items-center justify-center shadow-lg hover:bg-amber-500 hover:scale-110 transition-all group/edit"
                  title="Sửa nhanh sản phẩm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                </button>
              )}
              {/* Product Image */}
              <div className="relative overflow-hidden rounded-xl bg-slate-100 aspect-square mb-4">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Favorite Icon */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm text-slate-400 hover:text-red-500 hover:bg-white transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                </div>
              </div>

              {/* Product Info */}
              <div className="flex flex-col flex-grow">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-[14px] h-[14px] ${i < product.rating ? 'text-yellow-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-xs text-slate-400 ml-1 font-medium">({product.reviews})</span>
                </div>
                <h3 className="text-[17px] font-semibold text-slate-800 mb-1.5 group-hover:text-[#00c7d3] transition-colors line-clamp-1">{product.name}</h3>
                <p className="text-[#00c7d3] font-bold text-[17px] mt-auto">
                  {typeof product.price === 'number' ? product.price.toLocaleString('vi-VN') + ' ₫' : product.price}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* View More Button */}
        {viewMoreLink && (
          <div className="flex justify-center mt-10">
            <a
              href={viewMoreLink}
              className="inline-flex items-center gap-2 bg-white border-2 border-[#00c7d3] text-[#00c7d3] font-black text-[11px] uppercase tracking-widest px-8 py-3 rounded-2xl hover:bg-[#00c7d3] hover:text-white transition-all hover:-translate-y-0.5 shadow-sm"
            >
              Xem thêm
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductList;
