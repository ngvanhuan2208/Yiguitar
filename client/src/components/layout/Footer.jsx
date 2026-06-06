import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#0B1120] text-slate-400 pt-16 pb-10 px-6 lg:px-16">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Col 1 */}
          <div className="col-span-1 flex flex-col items-center lg:items-start text-center lg:text-left">
            <h2 className="text-[32px] font-black text-[#00c7d3] mb-4 italic italic tracking-tighter">Yi Guitar</h2>
            <p className="text-[14px] leading-[1.8] max-w-[280px] text-slate-500 font-medium">
              Chế tác tinh hoa dành cho những tâm hồn nghệ sĩ. Âm thanh của cậu là nguồn cảm hứng của tụi mình.
            </p>
          </div>

          {/* Col 2 */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <h3 className="text-white font-black uppercase tracking-widest text-[11px] mb-6 opacity-50">Sản phẩm</h3>
            <ul className="space-y-4 text-[15px]">
              <li className="hover:text-[#00c7d3] transition-colors">
                <Link to="/">Trang chủ</Link>
              </li>
              <li className="hover:text-[#00c7d3] transition-colors">
                <Link to="/guitar">Guitar</Link>
              </li>
              <li className="hover:text-[#00c7d3] transition-colors">
                <Link to="/phu-kien">Phụ kiện</Link>
              </li>
              <li className="hover:text-[#00c7d3] transition-colors">
                <Link to="/bai-viet">Bài viết</Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <h3 className="text-white font-black uppercase tracking-widest text-[11px] mb-6 opacity-50">Hỗ trợ khách</h3>
            <ul className="space-y-4 text-[15px]">
              <li className="hover:text-[#00c7d3] transition-colors">
                <Link to="/lien-he">Liên hệ</Link>
              </li>
              <li className="hover:text-[#00c7d3] transition-colors">
                <Link to="/bao-hanh">Tra cứu bảo hành</Link>
              </li>
              <li className="hover:text-[#00c7d3] transition-colors cursor-not-allowed opacity-50">Chính sách đổi trả</li>
              <li className="hover:text-[#00c7d3] transition-colors cursor-not-allowed opacity-50">Câu hỏi thường gặp</li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <h3 className="text-white font-black uppercase tracking-widest text-[11px] mb-6 opacity-50">Kết nối</h3>
            <div className="flex gap-4">
              {/* Facebook */}
              <a href="https://www.facebook.com/share/1GUc2rXZdv/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-transparent border border-[#1E293B] flex items-center justify-center hover:bg-[#00c7d3] hover:border-[#00c7d3] hover:text-white transition-all text-slate-300">
                <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24"><path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" /></svg>
              </a>
              {/* TikTok */}
              <a href="https://www.tiktok.com/@yiguitar?_r=1&_t=ZS-964TmjFM7Jn" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-transparent border border-[#1E293B] flex items-center justify-center hover:bg-[#00c7d3] hover:border-[#00c7d3] hover:text-white transition-all text-slate-300">
                <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 448 512"><path d="M448 209.91a210.06 210.06 0 0 1-122.77-39.25V349.38A162.55 162.55 0 1 1 185 188.31V278.2a74.62 74.62 0 1 0 52.23 71.18V0l88 0a121.18 121.18 0 0 0 1.86 22.32c7.87 33.32 31.27 60.33 64.04 74a121.18 121.18 0 0 0 56.87 13.59v90z"/></svg>
              </a>
              {/* YouTube */}
              <a href="https://www.youtube.com/@yiguitar74?si=SGgm91o31cesu19D" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-transparent border border-[#1E293B] flex items-center justify-center hover:bg-[#00c7d3] hover:border-[#00c7d3] hover:text-white transition-all text-slate-300">
                <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Line */}
        <div className="border-t border-[#1E293B] pt-8 text-center text-sm text-slate-500">
          © 2026 Yi Guitar. Bảo lưu mọi quyền. Được chế tác với niềm đam mê âm nhạc.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
