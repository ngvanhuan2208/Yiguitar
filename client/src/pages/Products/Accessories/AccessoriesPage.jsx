import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import api from '@/api/axios';
import { useCategories } from '@/context/CategoryContext';

const ACCESSORY_TYPES = ['Tất cả', 'Dây đàn', 'Capo', 'Bao đàn', 'Máy lên dây', 'Khác'];
const PRICE_RANGES = [
  { label: 'Tất cả mức giá', min: 0,        max: Infinity },
  { label: 'Dưới 100k',     min: 0,        max: 100000   },
  { label: '100k - 300k',   min: 100000,   max: 300000   },
  { label: '300k - 500k',   min: 300000,   max: 500000   },
  { label: 'Trên 500k',     min: 500000,   max: Infinity },
];
const SORT_OPTIONS = [
  { label: 'Phù hợp nhất',       value: 'default'    },
  { label: 'Giá: Thấp → Cao',    value: 'price-asc'  },
  { label: 'Giá: Cao → Thấp',    value: 'price-desc' },
  { label: 'Đánh giá cao nhất',  value: 'rating'     },
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

const AccessoriesPage = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [allAccessories, setAllAccessories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Main states (used for filtering)
  const [appliedFilters, setAppliedFilters] = useState({
    type: 'Tất cả',
    priceIndex: 0,
    sort: 'default'
  });

  // Pending states (used for UI dropdowns)
  const [pendingType, setPendingType]   = useState('Tất cả');
  const [pendingPrice, setPendingPrice] = useState(0);
  const [pendingSort, setPendingSort]   = useState('default');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [showSecondaryMenu, setShowSecondaryMenu] = useState(true);
  const lastScrollY = useRef(0);

  const { categories } = useCategories();
  const [accessoryTypes, setAccessoryTypes] = useState(ACCESSORY_TYPES);

  useEffect(() => {
    const accCat = categories.find(c => c.name === 'Accessory');
    if (accCat && accCat.subCategories) {
      setAccessoryTypes(['Tất cả', ...accCat.subCategories]);
    }
  }, [categories]);

  useEffect(() => {
    const fetchAccessories = async () => {
      try {
        const response = await api.get('/products?category=Accessory&limit=1000');
        setAllAccessories(response.data.products || []);
      } catch (err) {
        console.error('Error fetching accessories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAccessories();
  }, []);

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
      type: pendingType,
      priceIndex: pendingPrice,
      sort: pendingSort
    });
    setCurrentPage(1);
  };

  const handleReset = () => {
    const reset = { type: 'Tất cả', priceIndex: 0, sort: 'default' };
    setPendingType('Tất cả');
    setPendingPrice(0);
    setPendingSort('default');
    setAppliedFilters(reset);
    setCurrentPage(1);
  };

  // ── Filtered + sorted products ─────────────────────────
  const filtered = useMemo(() => {
    let list = [...allAccessories];

    // Category type filter
    if (appliedFilters.type !== 'Tất cả') {
      // Mapping display name to backend 'type' field
      // This part might need adjustment depending on how we store accessories
      list = list.filter((g) => {
        if (appliedFilters.type === 'Dây đàn') return g.type === 'Strings';
        if (appliedFilters.type === 'Capo') return g.type === 'Capo';
        if (appliedFilters.type === 'Bao đàn') return g.type === 'Bags';
        if (appliedFilters.type === 'Máy lên dây') return g.type === 'Tuner';
        return true;
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

    return list;
  }, [appliedFilters, allAccessories]);

  // ── Pagination ─────────────────────────────────────────
  const totalPages  = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage    = Math.min(currentPage, totalPages);
  const startIdx    = (safePage - 1) * ITEMS_PER_PAGE;
  const paginated   = filtered.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20 fade-in">
      {/* ── Secondary Filter Bar ─────────────────────────── */}
      <div 
        className={`sticky top-[72px] z-40 bg-white border-b border-slate-200 shadow-sm py-3 mb-8 transition-all duration-500 ease-in-out ${
          showSecondaryMenu ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="container mx-auto px-6 lg:px-16 flex flex-wrap items-center gap-4 lg:gap-8">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-bold text-slate-400 uppercase tracking-wider">Loại:</span>
            <select 
              value={pendingType}
              onChange={(e) => setPendingType(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-700 px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00c7d3]/20 cursor-pointer min-w-[120px]"
            >
              {accessoryTypes.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[13px] font-bold text-slate-400 uppercase tracking-wider">Giá tiền:</span>
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
            <span className="text-[13px] font-bold text-slate-400 uppercase tracking-wider">Sắp xếp:</span>
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
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-16">
        {loading ? (
           <div className="py-32 text-center text-slate-400 font-medium">Đang tải phụ kiện chuyên dụng...</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-slate-400">
             <p className="text-lg font-bold">Chưa tìm thấy phụ kiện phù hợp.</p>
             <button onClick={handleReset} className="mt-4 text-[#00c7d3] font-bold border-b border-[#00c7d3]">Đặt lại bộ lọc</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {paginated.map((product) => (
              <Link
                to={`/product/${product._id}`}
                key={product._id}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 group cursor-pointer hover:shadow-xl transition-all duration-300 flex flex-col relative"
              >
                {/* Admin Quick Edit Button */}
                {user?.role === 'admin' && (
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      navigate(`/admin/products?edit=${product._id}`);
                    }}
                    className="absolute -top-2 -right-2 z-[60] bg-amber-400 text-white w-9 h-9 rounded-full flex items-center justify-center shadow-lg hover:bg-amber-500 hover:scale-110 transition-all group/edit"
                    title="Sửa nhanh phụ kiện"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                  </button>
                )}

                <div className="relative overflow-hidden rounded-xl bg-slate-50 aspect-square mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Quick Action Overlay */}
                  {(['Course', 'Tab'].includes(product.category) || product.stock > 0) && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center translate-y-2 group-hover:translate-y-0">
                      <button 
                        onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                        className="bg-[#00c7d3] text-white text-[12px] font-bold px-5 py-2 rounded-xl shadow-lg hover:bg-white hover:text-[#00c7d3] transition-colors"
                      >
                        Thêm vào giỏ
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex flex-col flex-grow">
                   <div className="flex items-center gap-2 mb-2">
                      <StarRating rating={product.rating} />
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">({product.reviews})</span>
                   </div>
                   <h3 className="text-[14px] font-bold text-slate-800 group-hover:text-[#00c7d3] transition-colors line-clamp-2 leading-tight min-h-[36px]">
                    {product.name}
                   </h3>
                   <div className="mt-4 flex items-end justify-between">
                     <p className="text-[#00c7d3] font-black text-[17px]">{formatPrice(product.price)}</p>
                     <button 
                        onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                        className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-[#00c7d3]/10 group-hover:text-[#00c7d3] transition-colors"
                     >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                     </button>
                   </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccessoriesPage;
