import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

/**
 * AdminRoute — Bảo vệ tất cả route /admin/*
 * - Nếu đang loading auth → hiện spinner chờ (tránh flash redirect)
 * - Nếu chưa login → redirect về trang chủ
 * - Nếu login nhưng không phải admin → redirect về trang chủ
 * - Nếu là admin → render children bình thường
 */
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Chờ auth check xong để tránh redirect nhầm khi đang verify token
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#00c7d3]/10 border-t-[#00c7d3] rounded-full animate-spin"></div>
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] animate-pulse">Đang xác thực...</p>
        </div>
      </div>
    );
  }

  // Chưa login hoặc không phải admin → về trang chủ
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
