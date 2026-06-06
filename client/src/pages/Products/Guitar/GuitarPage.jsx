import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import api from '@/api/axios';
import { useCategories } from '@/context/CategoryContext';
import CardSkeleton from '@/components/common/CardSkeleton';

const PRICE_RANGES = [
  { label: 'Tất cả mức giá', min: 0,        max: Infinity },
  { label: '1tr - 3tr',     min: 1000000,  max: 3000000  },
  { label: '3tr - 5tr',     min: 3000000,  max: 5000000  },
  { label: '5tr - 10tr',    min: 5000000,  max: 10000000 },
  { label: '10tr - 20tr',   min: 10000000, max: 20000000 },
  { label: 'Trên 20tr',     min: 20000000, max: Infinity },
];
const SORT_OPTIONS = [
  { label: 'Phù hợp nhất',       value: 'default'    },
  { label: 'Giá: Thấp → Cao',    value: 'price-asc'  },
  { label: 'Giá: Cao → Thấp',    value: 'price-desc' },
  { label: 'Đánh giá cao nhất',  value: 'rating'     },
  { label: 'Review nhiều nhất',  value: 'reviews'    },
];

const ITEMS_PER_PAGE = 12;

const formatPrice = (p) =>
  p.toLocaleString('vi-VN') + ' ₫';

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[...Array(5)].map((_, i) => (
      <svg key={i} className={`w-3 h-3 ${i < rating ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const GuitarPage = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [allGuitars, setAllGuitars] = useState([]);
  const [loading, setLoading] = useState(true);
  const { categories } = useCategories();

  const initialType = searchParams.get('type') || 'Tất cả';

  // Main states (used for filtering)
  const [appliedFilters, setAppliedFilters] = useState({
    brands: ['Tất cả'],
    priceIndex: 0,
    sort: 'default',
    type: initialType
  });

  // Pending states (used for UI dropdowns)
  const [pendingBrand, setPendingBrand] = useState('Tất cả');
  const [pendingPrice, setPendingPrice] = useState(0);
  const [pendingSort, setPendingSort]   = useState('default');
  const [pendingType, setPendingType]   = useState(initialType);
  const [guitarTypes, setGuitarTypes]   = useState([]);
  const [brandsList, setBrandsList]     = useState(['Tất cả']);
  
  const [currentPage, setCurrentPage] = useState(1);

  // ── Scroll visibility logic ────────────────────────────
  const [showSecondaryMenu, setShowSecondaryMenu] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const type = searchParams.get('type') || 'Tất cả';
    setAppliedFilters(prev => ({ ...prev, type }));
    setPendingType(type);
    setCurrentPage(1);
  }, [searchParams]);

  useEffect(() => {
    const fetchGuitars = async () => {
      try {
        const [productsRes, brandsRes] = await Promise.allSettled([
          api.get('/products?category=Guitar&limit=1000'),
          api.get('/brands')
        ]);
        if (productsRes.status === 'fulfilled') {
          setAllGuitars(productsRes.value.data.products || []);
        } else {
          console.error('Error fetching guitars:', productsRes.reason);
          setAllGuitars([]);
        }
        
        // 1. Get Types from global CategoryContext
        const guitarCat = categories.find(c => c.name === 'Guitar');
        if (guitarCat && guitarCat.subCategories) {
          setGuitarTypes(['Tất cả', ...guitarCat.subCategories]);
        }

        // 2. Get Brands from dedicated Brands API
        if (brandsRes.status === 'fulfilled' && brandsRes.value.data && brandsRes.value.data.length > 0) {
          const activeBrands = brandsRes.value.data
            .filter((brand) => !brand.mainCategory || brand.mainCategory === 'Guitar')
            .map((b) => b.name);
          setBrandsList(['Tất cả', ...activeBrands]);
        } else if (guitarCat && guitarCat.brands) {
          // Fallback to legacy field
          setBrandsList(['Tất cả', ...guitarCat.brands]);
        } else if (brandsRes.status === 'rejected') {
          console.error('Error fetching brands:', brandsRes.reason);
        }
      } catch (err) {
        console.error('Error fetching guitars:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGuitars();
  }, [categories]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 150) {
        setShowSecondaryMenu(false);
      } else if (currentScrollY < lastScrollY.current) {
        setShowSecondaryMenu(true);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleApply = () => {
    setAppliedFilters({
      brands: [pendingBrand],
      priceIndex: pendingPrice,
      sort: pendingSort,
      type: pendingType
    });
    setCurrentPage(1);
  };

  const handleReset = () => {
    const reset = {
      brands: ['Tất cả'],
      priceIndex: 0,
      sort: 'default',
      type: 'Tất cả'
    };
    setPendingBrand('Tất cả');
    setPendingPrice(0);
    setPendingSort('default');
    setPendingType('Tất cả');
    setAppliedFilters(reset);
    setCurrentPage(1);
  };

  // ── Filtered + sorted products ─────────────────────────
  const filtered = useMemo(() => {
    let list = [...allGuitars];

    // Type filter (subcategory)
    if (appliedFilters.type && appliedFilters.type !== 'Tất cả') {
      list = list.filter((g) => g.type === appliedFilters.type);
    }

    // Brand filter
    if (!appliedFilters.brands.includes('Tất cả')) {
      list = list.filter((g) => {
        const productBrandName = typeof g.brand === 'object' ? g.brand?.name : g.brand;
        return appliedFilters.brands.includes(productBrandName);
      });
    }

    // Price filter
    const { min, max } = PRICE_RANGES[appliedFilters.priceIndex];
    if (min !== 0 || max !== Infinity) {
      list = list.filter((g) => g.price >= min && g.price <= max);
    }

    // Sort
    const { sort } = appliedFilters;
    if (sort === 'price-asc')  list.sort((a, b) => a.price   - b.price);
    if (sort === 'price-desc') list.sort((a, b) => b.price   - a.price);
    if (sort === 'rating')     list.sort((a, b) => b.rating  - a.rating);
    if (sort === 'reviews')    list.sort((a, b) => b.reviews - a.reviews);

    return list;
  }, [appliedFilters, allGuitars]);

  // ── Pagination ─────────────────────────────────────────
  const totalPages  = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage    = Math.min(currentPage, totalPages);
  const startIdx    = (safePage - 1) * ITEMS_PER_PAGE;
  const paginated   = filtered.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const goPage = (p) => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const pageButtons = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (totalPages <= 5 || i === 1 || i === totalPages || Math.abs(i - safePage) <= 1) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return pages;
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20 fade-in">
      {/* ── Secondary Filter Bar (Menu Thanh Ngang 2) ─────────────────────────── */}
      <div 
        className={`sticky top-[72px] z-40 bg-white border-b border-slate-200 shadow-sm py-3 mb-8 transition-all duration-500 ease-in-out ${
          showSecondaryMenu ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="container mx-auto px-6 lg:px-16 flex flex-wrap items-center gap-4 lg:gap-8">

          {/* Guitar Type Filter */}
          {guitarTypes.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-bold text-slate-500 uppercase tracking-wider">Loại đàn:</span>
              <select
                value={pendingType}
                onChange={(e) => setPendingType(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-700 px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00c7d3]/20 cursor-pointer min-w-[130px]"
              >
                {guitarTypes.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="text-[13px] font-bold text-slate-500 uppercase tracking-wider">Hãng:</span>
            <select 
              value={pendingBrand}
              onChange={(e) => setPendingBrand(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-700 px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00c7d3]/20 cursor-pointer min-w-[120px]"
            >
              {brandsList.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[13px] font-bold text-slate-500 uppercase tracking-wider">Giá tiền:</span>
            <select 
              value={pendingPrice}
              onChange={(e) => setPendingPrice(Number(e.target.value))}
              className="bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-700 px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00c7d3]/20 cursor-pointer min-w-[140px]"
            >
              {PRICE_RANGES.map((r, i) => (
                <option key={i} value={i}>{r.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[13px] font-bold text-slate-500 uppercase tracking-wider">Sắp xếp:</span>
            <select 
              value={pendingSort}
              onChange={(e) => setPendingSort(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-700 px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00c7d3]/20 cursor-pointer min-w-[160px]"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 ml-auto">
             <button 
              onClick={handleApply}
              className="bg-[#00c7d3] text-white text-sm font-bold px-8 py-2 rounded-lg hover:shadow-lg hover:shadow-[#00c7d3]/30 transition-all active:scale-95"
            >
              Lọc
            </button>
            <button 
              onClick={handleReset}
              className="text-slate-400 hover:text-red-500 font-semibold text-sm transition-colors px-2"
              title="Đặt lại"
            >
              ✕
            </button>
          </div>

        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-16">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
             {[...Array(8)].map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-slate-400">
            <svg className="w-20 h-20 mb-6 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg font-bold">Rất tiếc, chưa tìm thấy cây đàn nào khớp với yêu cầu.</p>
            <p className="text-sm mt-2">Cậu hãy thử thay đổi tiêu chí bộ lọc nhé!</p>
            <button 
              onClick={handleReset}
              className="mt-8 text-[#00c7d3] font-bold border-b-2 border-[#00c7d3] pb-1 hover:text-[#00c7d3] transition-colors"
            >
              Đặt lại tất cả bộ lọc
            </button>
          </div>
        ) : (
          <>
            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {paginated.map((product) => (
                <Link
                  to={`/product/${product._id}`}
                  key={product._id}
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 group cursor-pointer hover:shadow-xl hover:shadow-slate-200/50 hover:border-[#00c7d3]/30 transition-all duration-300 flex flex-col relative"
                >
                  {/* Admin Quick Edit Button */}
                  {user?.role === 'admin' && (
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        navigate(`/admin/products?edit=${product._id}`);
                      }}
                      className="absolute -top-2 -right-2 z-[60] bg-amber-400 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-amber-500 hover:scale-110 transition-all group/edit"
                      title="Sửa nhanh sản phẩm"
                      aria-label="Sửa nhanh sản phẩm"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                      <span className="absolute right-full mr-2 bg-slate-800 text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded opacity-0 group-hover/edit:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">Sửa nhanh</span>
                    </button>
                  )}

                  {/* Image Wrap */}
                  <div className="relative overflow-hidden rounded-xl bg-slate-50 aspect-square mb-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    
                    {/* Floating Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                       <span className="bg-white/90 backdrop-blur-sm text-[10px] font-black text-slate-800 px-2.5 py-1 rounded-md shadow-sm uppercase">
                        {typeof product.brand === 'object' ? product.brand?.name : product.brand}
                      </span>
                    </div>

                    <button 
                      className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm text-slate-400 hover:text-red-500 transform hover:rotate-12 transition-all"
                      aria-label="Thêm vào danh sách yêu thích"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>

                    {/* Quick Action Overlay */}
                    {(['Course', 'Tab'].includes(product.category) || product.stock > 0) && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center translate-y-2 group-hover:translate-y-0">
                        <button 
                          onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                          className="bg-[#00c7d3] text-white text-[13px] font-bold px-6 py-2.5 rounded-xl shadow-lg hover:bg-white hover:text-[#00c7d3] transition-colors"
                        >
                          Thêm vào giỏ
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-col flex-grow justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <StarRating rating={product.rating} />
                        <span className="text-[11px] text-slate-500 font-bold uppercase tracking-tighter">({product.reviews} đánh giá)</span>
                      </div>
                      <h3 className="text-[15px] font-bold text-slate-800 group-hover:text-[#00c7d3] transition-colors line-clamp-2 leading-tight min-h-[40px]">
                        {product.name}
                      </h3>
                    </div>
                    <div className="mt-4 flex items-end justify-between">
                       <p className="text-[#00c7d3] font-black text-[18px]">{formatPrice(product.price)}</p>
                       <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#00c7d3]/10 group-hover:text-[#00c7d3] transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                       </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-16 border-t border-slate-100 pt-10">
                <button
                  onClick={() => goPage(safePage - 1)}
                  disabled={safePage === 1}
                  className="w-11 h-11 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-white hover:text-[#00c7d3] hover:border-[#00c7d3] disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {pageButtons().map((p, i) =>
                  p === '...' ? (
                    <span key={`dots-${i}`} className="w-11 h-11 flex items-center justify-center text-slate-300 font-bold">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => goPage(p)}
                      className={`w-11 h-11 flex items-center justify-center rounded-xl text-sm font-bold shadow-sm transition-all ${
                        p === safePage
                          ? 'bg-[#00c7d3] text-white shadow-[#00c7d3]/30 shadow-lg'
                          : 'border border-slate-200 bg-white text-slate-500 hover:border-[#00c7d3] hover:text-[#00c7d3]'
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}

                <button
                  onClick={() => goPage(safePage + 1)}
                  disabled={safePage === totalPages}
                  className="w-11 h-11 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-white hover:text-[#00c7d3] hover:border-[#00c7d3] disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GuitarPage;
