/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api/axios';
import { getApiErrorMessage } from '@/utils/textEncoding';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('yi-guitar-token');
      if (token) {
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
        try {
          const res = await api.get('/auth/me');
          setUser(res.data);
        } catch {
          console.error('Session expired or invalid token');
          localStorage.removeItem('yi-guitar-token');
          delete api.defaults.headers.common.Authorization;
        }
      }
      setLoading(false);
    };

    checkUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, ...userData } = res.data;
      localStorage.setItem('yi-guitar-token', token);
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      setUser(userData);

      if (userData.role === 'admin') {
        navigate('/admin/featured');
      }

      return { success: true };
    } catch (err) {
      return { success: false, message: getApiErrorMessage(err, 'Đăng nhập thất bại') };
    }
  };

  const loginWithGoogle = async (googleData) => {
    try {
      const res = await api.post('/auth/google', googleData);
      const { token, ...userData } = res.data;
      localStorage.setItem('yi-guitar-token', token);
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      setUser(userData);

      if (userData.role === 'admin') {
        navigate('/admin/featured');
      }

      return { success: true };
    } catch {
      return { success: false, message: 'Đăng nhập Google thất bại' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await api.post('/auth/register', { name, email, password });
      // Trả về tín hiệu đã gửi OTP thay vì đăng nhập luôn
      if (res.data.otpSent) {
        return { success: true, otpSent: true, message: res.data.message };
      }
      return { success: true }; // Fallback (though shouldn't hit this based on new logic)
    } catch (err) {
      return { success: false, message: getApiErrorMessage(err, 'Đăng ký thất bại') };
    }
  };

  const verifyOtpAndRegister = async (name, email, password, otp) => {
    try {
      const res = await api.post('/auth/verify-registration', { name, email, password, otp });
      const { token, ...userData } = res.data;
      localStorage.setItem('yi-guitar-token', token);
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      setUser(userData);
      return { success: true };
    } catch (err) {
      return { success: false, message: getApiErrorMessage(err, 'Xác minh OTP thất bại') };
    }
  };

  const logout = () => {
    localStorage.removeItem('yi-guitar-token');
    delete api.defaults.headers.common.Authorization;
    setUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, loginWithGoogle, register, verifyOtpAndRegister, logout, isAuthOpen, setIsAuthOpen }}>
      {children}
    </AuthContext.Provider>
  );
};
