import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import api from '@/api/axios';
import Breadcrumb from '@/components/common/Breadcrumb';

const StarRating = ({ rating, reviews }) => (
  <div className="flex items-center gap-2 px-3 py-1 bg-white/50 backdrop-blur-sm rounded-full border border-slate-100 shadow-sm w-fit">
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className={`w-3 h-3 ${i < rating ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{reviews} Reviews</span>
  </div>
);

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, setIsAuthOpen } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeMedia, setActiveMedia] = useState('image'); // 'image' or 'video'
  const [displayImage, setDisplayImage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
        setDisplayImage(res.data.image);
      } catch (err) {
        console.error('Error fetching product data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    setActiveMedia('image');
    window.scrollTo(0, 0);
  }, [id]);



  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-[#00c7d3]/10 border-t-[#00c7d3] rounded-full animate-spin"></div>
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] animate-pulse">Loading Details...</p>
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
      <h2 className="text-2xl font-black text-slate-800 mb-6">Sản phẩm không tồn tại</h2>
      <Link to="/guitar" className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
        Quay lại cửa hàng
      </Link>
    </div>
  );

  const formatPrice = (p) => p.toLocaleString('vi-VN') + ' ₫';

  // Merge unique images for gallery
  const galleryImages = Array.from(new Set([product.image, ...(product.images || [])])).filter(Boolean);

  return (
    <div className="bg-white min-h-screen pb-32">
      {/* Cinematic Header with Background Blur */}
      <div className="relative pt-6 pb-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00c7d3]/5 blur-[120px] rounded-full -mr-64 -mt-32 pointer-events-none"></div>
        
        <div className="container mx-auto px-6 lg:px-16 relative z-10">
          {/* Minimal Breadcrumb (U6) */}
          <Breadcrumb 
            paths={[
              { name: product.category, link: `/${product.category?.toLowerCase() === 'guitar' ? 'guitar' : 'phu-kien'}` },
              { name: product.name }
            ]} 
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-16 items-start">
            
            {/* Left Col: Media Gallery */}
            <div className="lg:col-span-6 sticky top-32">
               <div className="space-y-4">
                  {/* Main Display Area */}
                  <div className="relative aspect-square bg-[#fcfdfe] rounded-[32px] overflow-hidden border border-slate-50 flex items-center justify-center p-2 group shadow-2xl shadow-slate-100/50">
                    {activeMedia === 'video' && product.videoId ? (
                       <iframe 
                         className="w-full h-full absolute inset-0 z-20"
                         src={`https://www.youtube-nocookie.com/embed/${product.videoId}?autoplay=1&rel=0&modestbranding=1&controls=1`}
                         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                         allowFullScreen
                         title={product.name}
                       ></iframe>
                    ) : (
                      <div className="w-full h-full relative overflow-hidden">
                        <img 
                          src={displayImage} 
                          alt={product.name} 
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" 
                        />
                      </div>
                    )}
                  </div>

                  {/* Integrated Thumbnail Gallery (Images + Video) */}
                  <div className="flex flex-wrap items-center gap-3 px-2">
                    {galleryImages.map((img, idx) => (
                      <button 
                        key={idx}
                        onClick={() => {
                          setActiveMedia('image');
                          setDisplayImage(img);
                        }}
                        className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${activeMedia === 'image' && displayImage === img ? 'border-[#00c7d3] scale-105' : 'border-slate-50 opacity-40 hover:opacity-100'}`}
                      >
                        <img src={img} className="w-full h-full object-cover" />
                      </button>
                    ))}
                    
                    {product.videoId && (
                      <button 
                        onClick={() => setActiveMedia('video')}
                        className={`w-14 h-14 rounded-xl overflow-hidden border-2 relative transition-all group ${activeMedia === 'video' ? 'border-[#00c7d3] scale-105' : 'border-slate-50 opacity-40 hover:opacity-100'}`}
                      >
                        <img src={`https://img.youtube.com/vi/${product.videoId}/0.jpg`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                           <div className="w-5 h-5 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white">
                              <svg className="w-2 h-2 ml-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M4.516 2.13l11.968 7.87L4.516 17.87V2.13z" /></svg>
                           </div>
                        </div>
                      </button>
                    )}
                  </div>
               </div>
            </div>

            {/* Right Col: Information Hub */}
            <div className="lg:col-span-6 flex flex-col pt-0 lg:pt-2">
                  <div className="mb-2">
                 <span className="text-[10px] font-black text-[#00c7d3] uppercase tracking-[0.3em] mb-2 block">
                   {typeof product.brand === 'object' ? product.brand?.name : product.brand}
                 </span>
                 <h1 className="text-3xl lg:text-4xl font-black text-slate-800 leading-tight mb-4">
                   {product.name}
                 </h1>
              </div>

              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-50">
                <StarRating rating={product.rating} reviews={product.reviews} />
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${(['Course', 'Tab'].includes(product.category) || product.stock > 0) ? 'bg-emerald-500' : 'bg-rose-400'}`}></div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${(['Course', 'Tab'].includes(product.category) || product.stock > 0) ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {(['Course', 'Tab'].includes(product.category) || product.stock > 0) ? 'Còn hàng' : 'Hết hàng'}
                  </span>
                </div>
              </div>

              {/* SPECIFICATIONS GRID - Condense */}
              <div className="mb-8">
                 <div className="grid grid-cols-2 gap-y-4 gap-x-8 bg-slate-50/50 rounded-2xl p-6 border border-slate-100/50">
                    {[
                      { label: 'Thương hiệu', value: typeof product.brand === 'object' ? product.brand?.name : product.brand },
                      { label: 'Dòng đàn', value: product.type },
                      { label: 'Tình trạng', value: 'Mới 100%' },
                      { label: 'Bảo hành', value: product.warranty || '12 Tháng' }
                    ].map((spec, i) => (
                      <div key={i} className="flex flex-col">
                         <span className="text-[8px] font-black text-[#00c7d3] uppercase tracking-widest mb-0.5">{spec.label}</span>
                         <p className="text-[12px] font-bold text-slate-700">{spec.value}</p>
                      </div>
                    ))}
                 </div>
              </div>

              {/* PRODUCT DESCRIPTION - Moved here */}
              <div className="mt-8 mb-8">
                 <h3 className="text-[12px] font-black italic text-slate-800 uppercase tracking-[0.3em] mb-3">Thông tin chi tiết</h3>
                 <div className="text-slate-500 font-medium leading-[1.7] text-sm whitespace-pre-wrap">
                    {product.description || "Hành trình âm nhạc của mỗi người đều bắt đầu từ một cảm xúc. Yi Guitar chọn lọc những chế tác tuyệt vời nhất để cùng cậu viết nên những giai điệu riêng bản."}
                 </div>
              </div>

              {/* COMPACT ACTION HUB */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-100/30 mb-8">
                 <div className="flex items-center justify-between gap-4 mb-6">
                    <div>
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block opacity-60 mb-1">Giá sở hữu</label>
                       <p className="text-2xl font-black text-slate-800 tracking-tighter">{formatPrice(product.price)}</p>
                    </div>
                    
                    {(!['Course', 'Tab'].includes(product.category) && product.stock > 0) && (
                      <div className="flex items-center bg-slate-50 border border-slate-100 rounded-xl h-10 px-1">
                        <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-8 h-full flex items-center justify-center text-slate-400 hover:text-slate-800 transition-all font-bold">－</button>
                        <input type="text" readOnly value={qty} className="w-8 h-full bg-transparent border-none text-center font-black text-xs text-slate-800 focus:ring-0" />
                        <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="w-8 h-full flex items-center justify-center text-slate-400 hover:text-slate-800 transition-all font-bold">＋</button>
                      </div>
                    )}
                 </div>

                    <div className="flex gap-4">
                    {(['Course', 'Tab'].includes(product.category) || product.stock > 0) ? (
                      <>
                        <button 
                          onClick={() => addToCart(product, qty)}
                          className="flex-1 bg-slate-900 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl h-12 flex items-center justify-center gap-3 hover:-translate-y-1 transition-all active:scale-95"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                          Thêm vào giỏ hàng
                        </button>
                        <button 
                          onClick={() => {
                            if (!user) {
                              setIsAuthOpen(true);
                            } else {
                              navigate('/gio-hang', { state: { buyNowItem: { ...product, quantity: qty } } });
                            }
                          }}
                          className="flex-1 bg-[#00c7d3] text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl h-12 hover:-translate-y-1 transition-all active:scale-95"
                        >
                          Đặt hàng
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={() => navigate('/lien-he')}
                        className="w-full bg-amber-500 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl h-12 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3 shadow-lg shadow-amber-100"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        Sản phẩm tạm hết hàng - Liên hệ ngay
                      </button>
                    )}
                  </div>
              </div>
              


            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
