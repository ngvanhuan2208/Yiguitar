import React, { useState, useEffect } from 'react';
import Hero from '@/components/layout/Hero';
import ProductList from '@/components/product/ProductList';
import ArticleList from '@/components/article/ArticleList';
import ContactBlock from '@/components/layout/ContactBlock';
import api from '@/api/axios';

const Home = () => {
  const [featuredGuitars, setFeaturedGuitars] = useState([]);
  const [featuredAccessories, setFeaturedAccessories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const [guitarRes, accessoryRes] = await Promise.allSettled([
          api.get('/products?isFeatured=true&category=Guitar&limit=4'),
          api.get('/products?isFeatured=true&category=Accessory&limit=4'),
        ]);
        if (guitarRes.status === 'fulfilled') {
          setFeaturedGuitars(guitarRes.value.data.products || []);
        } else {
          console.error('Error fetching featured guitars:', guitarRes.reason);
          setFeaturedGuitars([]);
        }

        if (accessoryRes.status === 'fulfilled') {
          setFeaturedAccessories(accessoryRes.value.data.products || []);
        } else {
          console.error('Error fetching featured accessories:', accessoryRes.reason);
          setFeaturedAccessories([]);
        }
      } catch (err) {
        console.error('Error fetching featured products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const hasAnyFeatured = featuredGuitars.length > 0 || featuredAccessories.length > 0;

  return (
    <div className="fade-in">
      <Hero />

      {!loading && featuredGuitars.length > 0 && (
        <ProductList
          products={featuredGuitars}
          title="Guitar nổi bật"
          subtitle="Nhạc cụ được yêu thích"
          viewMoreLink="/guitar"
        />
      )}

      {!loading && featuredAccessories.length > 0 && (
        <ProductList
          products={featuredAccessories}
          title="Phụ kiện nổi bật"
          subtitle="Trang bị hoàn hảo cho cây đàn"
          viewMoreLink="/phu-kien"
          bgLight
        />
      )}

      {/* Fallback if no featured products are set yet */}
      {!loading && !hasAnyFeatured && (
         <div className="py-20 bg-slate-50 text-center">
            <p className="text-slate-400 italic font-medium">Bắt đầu hành trình âm nhạc của cậu cùng Yi Guitar.</p>
            <div className="mt-8 flex justify-center gap-4">
               <button onClick={() => window.location.href='/guitar'} className="bg-[#00c7d3] text-white px-8 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:-translate-y-1 transition-all">Xem Guitar</button>
               <button onClick={() => window.location.href='/phu-kien'} className="bg-white text-slate-600 border border-slate-200 px-8 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:-translate-y-1 transition-all">Xem Phụ kiện</button>
            </div>
         </div>
      )}

      <ArticleList />
      <ContactBlock />
    </div>
  );
};

export default Home;
