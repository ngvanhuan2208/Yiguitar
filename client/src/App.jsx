import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Home from '@/pages/Home/Home';
import GuitarPage from '@/pages/Products/Guitar/GuitarPage';
import AccessoriesPage from '@/pages/Products/Accessories/AccessoriesPage';
import CoursesPage from '@/pages/Courses/CoursesPage';
import CourseDetailPage from '@/pages/Courses/CourseDetailPage';
import TabListPage from '@/pages/Tabs/TabListPage';
import TabDetailPage from '@/pages/Tabs/TabDetailPage';
import ArticlesPage from '@/pages/Articles/ArticlesPage';
import ArticleDetailPage from '@/pages/Articles/ArticleDetailPage';

// Admin Pages - Lazy Loaded (P7)
const ManageFeatured = lazy(() => import('@/features/admin/pages/ManageFeatured'));
const ManageArticles = lazy(() => import('@/features/admin/pages/ManageArticles'));
const CourseManagement = lazy(() => import('@/features/admin/pages/CourseManagement'));
const TabManagement = lazy(() => import('@/features/admin/pages/TabManagement'));
const ManageContacts = lazy(() => import('@/features/admin/pages/ManageContacts'));
const ManageOrders = lazy(() => import('@/features/admin/pages/ManageOrders'));
const ManageProducts = lazy(() => import('@/features/admin/pages/ManageProducts'));
const ManageCategories = lazy(() => import('@/features/admin/pages/ManageCategories'));
const ManageChats = lazy(() => import('@/features/admin/pages/ManageChats'));
const RevenueReport = lazy(() => import('@/features/admin/pages/RevenueReport'));
const AdminDashboard = lazy(() => import('@/features/admin/pages/AdminDashboard'));

import ContactPage from '@/pages/Contact/ContactPage';
import CartPage from '@/pages/Cart/CartPage';
import ProfilePage from '@/pages/Profile/ProfilePage';
import ProductDetailPage from '@/pages/Products/ProductDetailPage';
import ResetPassword from '@/pages/ResetPassword';
import NotFound from '@/pages/NotFound';
import WarrantyPage from '@/pages/WarrantyPage';
import AuthModal from '@/features/auth/AuthModal';
import ScrollToTop from '@/components/layout/ScrollToTop';
import ChatWidget from '@/components/chat/ChatWidget';
import AdminNotification from '@/features/admin/components/AdminNotification';
import AdminRoute from '@/components/common/AdminRoute';
import BackToTop from '@/components/common/BackToTop';
import Spinner from '@/components/common/Spinner';
import { useAuth } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';

function App() {
  const { isAuthOpen, setIsAuthOpen } = useAuth();
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Toaster position="top-center" reverseOrder={false} />
      <ScrollToTop />
      <AdminNotification />
      {/* 1. Thanh điều hướng ở trên cùng */}
      <Navbar />
      
      {/* Auth Modal at root level to avoid clipping */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      
      {/* 2. Nội dung thay đổi linh hoạt theo trang */}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/guitar" element={<GuitarPage />} />
          <Route path="/phu-kien" element={<AccessoriesPage />} />
          <Route path="/khoa-hoc" element={<CoursesPage />} />
          <Route path="/khoa-hoc/:id" element={<CourseDetailPage />} />
          <Route path="/tabs" element={<TabListPage />} />
          <Route path="/tabs/:id" element={<TabDetailPage />} />
          <Route path="/bai-viet" element={<ArticlesPage />} />
          <Route path="/bai-viet/:id" element={<ArticleDetailPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/bao-hanh" element={<WarrantyPage />} />
          
          {/* ── Admin Routes (Bảo vệ bởi AdminRoute) ──────────────── */}
          <Route path="/admin/*" element={
            <AdminRoute>
              <Suspense fallback={<Spinner />}>
                <Routes>
                  <Route path="featured" element={<ManageFeatured />} />
                  <Route path="articles" element={<ManageArticles />} />
                  <Route path="courses" element={<CourseManagement />} />
                  <Route path="tabs" element={<TabManagement />} />
                  <Route path="contacts" element={<ManageContacts />} />
                  <Route path="orders" element={<ManageOrders />} />
                  <Route path="products" element={<ManageProducts />} />
                  <Route path="categories" element={<ManageCategories />} />
                  <Route path="chats" element={<ManageChats />} />
                  <Route path="revenue" element={<RevenueReport />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                </Routes>
              </Suspense>
            </AdminRoute>
          } />

          <Route path="/ho-so" element={<ProfilePage />} />
          <Route path="/lien-he" element={<ContactPage />} />
          <Route path="/gio-hang" element={<CartPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      
      {/* 3. Chân trang ở dưới cùng (Chỉ gọi 1 lần) */}
      <Footer />
      
      {/* 4. Chat Widget (Tự xử lý ẩn hiện theo auth và route) */}
      <ChatWidget />
      <BackToTop />
    </div>
  );
}

export default App;
