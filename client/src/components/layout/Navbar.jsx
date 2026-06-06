import React, { useEffect, useMemo } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useCategories } from '@/context/CategoryContext';
import logoImg from '@/assets/logo.png';


const Navbar = () => {
  const { cartCount } = useCart();
  const { user, logout, setIsAuthOpen } = useAuth();
  const { categories } = useCategories();
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const guitarTypes = useMemo(() => {
    const guitarCat = categories.find(c => c.name === 'Guitar');
    return guitarCat ? (guitarCat.subCategories || []) : [];
  }, [categories]);
  
  const profileRef = React.useRef(null);
  const mobileMenuRef = React.useRef(null);

  // U2: Click Outside Dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('.hamburger-btn')) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const activeStyle = ({ isActive }) => 
    isActive ? "text-[#00c7d3] transition-colors py-3" : "hover:text-[#00c7d3] transition-colors py-3";

  return (
    <nav className="bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="flex items-center justify-between px-6 lg:px-16 py-4">
      {/* Left Area - Logo */}
      <div className="flex items-center gap-4 flex-1 justify-start">
        {/* Hamburger Icon (U1) */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-slate-600 hover:text-[#00c7d3] transition-colors hamburger-btn"
          aria-label={isMobileMenuOpen ? "Đóng menu" : "Mở menu"}
        >
          {isMobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
          )}
        </button>
        <Link to="/" className="group inline-block">
          <img 
            src={logoImg} 
            alt="Yi Guitar Logo" 
            className="h-[52px] lg:h-[60px] w-auto object-contain cursor-pointer transform group-hover:scale-[1.03] transition-all duration-300 drop-shadow-[0_2px_8px_rgba(0,168,181,0.2)]"
          />
        </Link>
      </div>

      {/* Center Area - Navigation Menu */}
      <ul className="hidden lg:flex items-center justify-center gap-8 xl:gap-11 text-[15px] font-semibold text-[#334155]">
        <li>
          <NavLink to="/" className={activeStyle}>Trang chủ</NavLink>
        </li>

        {/* Dropdown Guitar */}
        <li className="relative group cursor-pointer transition-colors py-3">
          <NavLink to="/guitar" className="flex items-center gap-1 hover:text-[#00c7d3] transition-colors">
            Guitar
            {guitarTypes.length > 0 && (
              <svg className="w-4 h-4 ml-1 text-slate-500 group-hover:text-[#00c7d3] transition-transform group-hover:-rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
            )}
          </NavLink>
          {guitarTypes.length > 0 && (
            <div className="absolute top-full left-0 bg-white border border-slate-100 shadow-xl rounded-xl py-2 w-52 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-1 z-50">
              <ul className="text-[#475569] text-[14px]">
                <li className="px-5 py-2.5 hover:text-[#00c7d3] hover:bg-[#F2FCFC] transition-colors border-b border-slate-50">
                  <Link to="/guitar" className="block w-full font-bold">Tất cả Guitar</Link>
                </li>
                {guitarTypes.map(type => (
                  <li key={type} className="px-5 py-2.5 hover:text-[#00c7d3] hover:bg-[#F2FCFC] transition-colors">
                    <Link to={`/guitar?type=${encodeURIComponent(type)}`} className="block w-full">{type}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
        
        <li>
          <NavLink to="/phu-kien" className={activeStyle}>Phụ kiện</NavLink>
        </li>
        
        {/* Dropdown Khóa học */}
        <li className="relative group cursor-pointer transition-colors py-3">
          <div className="flex items-center gap-1 hover:text-[#00c7d3] transition-colors relative">
            Khóa học
            <span className="absolute -right-2 top-0 w-1.5 h-1.5 bg-[#00c7d3] rounded-full animate-pulse"></span>
            <svg className="w-4 h-4 ml-2 text-slate-500 group-hover:text-[#00c7d3] transition-transform group-hover:-rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
          <div className="absolute top-full left-0 bg-white border border-slate-100 shadow-xl rounded-xl py-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-1 z-50">
            <ul className="text-[#475569] text-[14px]">
              <li className="px-5 py-2.5 hover:text-[#00c7d3] hover:bg-[#F2FCFC] transition-colors">
                <Link to="/khoa-hoc?type=Online" className="block w-full">Khóa học Online</Link>
              </li>
              <li className="px-5 py-2.5 hover:text-[#00c7d3] hover:bg-[#F2FCFC] transition-colors">
                <Link to="/khoa-hoc?type=Offline" className="block w-full">Khóa học Offline</Link>
              </li>
            </ul>
          </div>
        </li>
        
        <li className="relative py-3">
          <NavLink to="/tabs" className={activeStyle}>
            Tab Guitar
            <span className="absolute -right-2 top-0 w-1.5 h-1.5 bg-[#00c7d3] rounded-full"></span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/bai-viet" className={activeStyle}>Bài viết</NavLink>
        </li>
        <li>
          <NavLink to="/lien-he" className={activeStyle}>Liên hệ</NavLink>
        </li>
      </ul>

      {/* Right Area - Actions */}
      <div className="flex items-center justify-end flex-1 gap-5 lg:gap-7">
        {/* Cart Icon */}
        <Link to="/gio-hang" className="relative cursor-pointer group">
          <button 
            className="p-2 text-[#475569] hover:text-[#00c7d3] transition-colors bg-slate-50 rounded-full group-hover:bg-[#E3F8F9]"
            aria-label="Xem giỏ hàng"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </button>
          {cartCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EE4D2D] opacity-40"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-[#EE4D2D] text-[8px] text-white justify-center items-center font-black">{cartCount}</span>
            </span>
          )}
        </Link>
        
        {/* Login / User Profile */}
        {user ? (
          <div className="relative" ref={profileRef}>
             <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 pl-4 pr-1 py-1 border border-slate-100 rounded-full hover:bg-slate-50 transition-all group"
              aria-label="Menu cá nhân"
             >
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Xin chào,</p>
                  <p className="text-[13px] font-black text-slate-800 leading-none">{user.name.split(' ')[0]}</p>
                </div>
                <div className="w-9 h-9 bg-gradient-to-br from-[#92E4EC] to-[#00c7d3] rounded-full flex items-center justify-center font-black text-white text-sm shadow-sm overflow-hidden">
                  {user.avatar ? (
                    <img src={`${import.meta.env.VITE_BASE_URL}${user.avatar}`} alt={user.name} className="w-full h-full object-cover" />
                  ) : user.name.charAt(0)}
                </div>
             </button>

             {/* Profile Dropdown */}
             {isProfileOpen && (
                <div className="absolute top-full right-0 mt-3 bg-white border border-slate-100 shadow-2xl rounded-2xl py-3 w-56 animate-zoom-in z-50">
                    <div className="px-5 py-3 border-b border-slate-50 mb-2">
                       <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Quyền hạn</p>
                       <p className="text-[13px] font-black text-[#00c7d3]">{user.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}</p>
                    </div>
                    
                    <Link to="/ho-so" className="block px-5 py-2.5 text-[14px] font-semibold text-slate-600 hover:text-[#00c7d3] hover:bg-[#F2FCFC] transition-colors" onClick={() => setIsProfileOpen(false)}>👤 Hồ sơ của tôi</Link>
                    
                    {user.role === 'admin' && (
                      <>
                        <Link to="/admin/dashboard" className="block px-5 py-2.5 text-[14px] font-black text-[#00c7d3] hover:bg-[#F2FCFC] transition-colors" onClick={() => setIsProfileOpen(false)}>📊 Bảng điều khiển</Link>
                        <Link to="/admin/revenue" className="block px-5 py-2.5 text-[14px] font-black text-slate-800 hover:text-[#00c7d3] hover:bg-slate-50 transition-colors" onClick={() => setIsProfileOpen(false)}>💰 Báo cáo doanh thu</Link>
                        <Link to="/admin/chats" className="block px-5 py-2.5 text-[14px] font-black text-slate-800 hover:text-emerald-500 hover:bg-slate-50 transition-colors flex items-center justify-between" onClick={() => setIsProfileOpen(false)}>
                           <span>💬 Tư vấn khách hàng</span>
                           <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        </Link>
                      </>
                    )}
                   <button 
                     onClick={() => { logout(); setIsProfileOpen(false); }}
                     className="w-full text-left px-5 py-3 text-[14px] font-bold text-red-500 hover:bg-red-50 transition-colors mt-2 border-t border-slate-50"
                   >
                     Đăng xuất
                   </button>
                </div>
              )}
          </div>
        ) : (
          <button 
            onClick={() => setIsAuthOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 text-[#00c7d3] border-2 border-[#00c7d3] rounded-[12px] hover:bg-[#00c7d3] hover:text-white hover:shadow-lg hover:shadow-[#00c7d3]/30 transition-all font-semibold"
          >
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            Login
          </button>
        )}
      </div>
    </div>

      {/* Mobile Menu (U1) */}
      {isMobileMenuOpen && (
        <div 
          ref={mobileMenuRef}
          className="lg:hidden absolute top-full left-0 w-full bg-white border-t border-slate-50 shadow-xl py-6 px-6 animate-slide-down"
        >
          <ul className="flex flex-col gap-5 text-[15px] font-bold text-[#475569]">
            <li><Link to="/" className="block py-2" onClick={() => setIsMobileMenuOpen(false)}>Trang chủ</Link></li>
            <li><Link to="/guitar" className="block py-2 text-[#00c7d3]" onClick={() => setIsMobileMenuOpen(false)}>Đàn Guitar</Link></li>
            <li><Link to="/phu-kien" className="block py-2" onClick={() => setIsMobileMenuOpen(false)}>Phụ kiện</Link></li>
            <li><Link to="/khoa-hoc" className="block py-2" onClick={() => setIsMobileMenuOpen(false)}>Khóa học</Link></li>
            <li><Link to="/tabs" className="block py-2" onClick={() => setIsMobileMenuOpen(false)}>Tab Guitar</Link></li>
            <li><Link to="/bai-viet" className="block py-2" onClick={() => setIsMobileMenuOpen(false)}>Bài viết</Link></li>
            <li><Link to="/lien-he" className="block py-2" onClick={() => setIsMobileMenuOpen(false)}>Liên hệ</Link></li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
