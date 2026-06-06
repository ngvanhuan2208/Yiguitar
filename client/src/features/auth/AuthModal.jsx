import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { toast } from 'react-hot-toast';
import api from '@/api/axios';
import { useAuth } from '@/context/AuthContext';
import { getApiErrorMessage } from '@/utils/textEncoding';

const AuthModal = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState('login');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  // OTP States
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(0);
  const otpRefs = React.useRef([]);
  
  const emailRef = React.useRef(null);
  const { login, register, verifyOtpAndRegister, loginWithGoogle } = useAuth();

  React.useEffect(() => {
    let timer;
    if (countdown > 0 && mode === 'verify-otp') {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown, mode]);

  React.useEffect(() => {
    if (!isOpen) return undefined;

    const focusTimer = setTimeout(() => emailRef.current?.focus(), 100);
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const mockGoogleUser = {
          name: 'Google User',
          email: 'google_user@example.com',
          googleId: tokenResponse.access_token,
          avatar: 'https://placehold.co/100x100?text=G'
        };
        await loginWithGoogle(mockGoogleUser);
        onClose();
      } catch {
        setErrors({ general: 'Đăng nhập Google thất bại' });
      } finally {
        setLoading(false);
      }
    },
    onError: () => setErrors({ general: 'Đăng nhập Google thất bại' })
  });

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    const result = await register(formData.name, formData.email, formData.password);
    setLoading(false);
    if (result.success && result.otpSent) {
      setCountdown(60);
      setOtp(['', '', '', '', '', '']);
      toast.success('Đã gửi lại mã OTP mới');
      setErrors({});
    } else {
      setErrors({ general: result.message });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email) newErrors.email = 'Email không được để trống';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email không hợp lệ';

    if (mode === 'register' && !formData.name) newErrors.name = 'Vui lòng nhập tên của bạn';

    if (mode !== 'forgot' && mode !== 'verify-otp') {
      if (!formData.password) newErrors.password = 'Mật khẩu không được để trống';
      else if (formData.password.length < 6) newErrors.password = 'Mật khẩu phải từ 6 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setErrors({});
    setLoading(true);

    try {
      if (mode === 'login') {
        const result = await login(formData.email, formData.password);
        if (result.success) onClose();
        else setErrors({ general: result.message });
        return;
      }

      if (mode === 'register') {
        const result = await register(formData.name, formData.email, formData.password);
        if (result.success && result.otpSent) {
          setMode('verify-otp');
          setCountdown(60);
          setOtp(['', '', '', '', '', '']);
          toast.success(result.message);
        } else setErrors({ general: result.message });
        return;
      }

      if (mode === 'verify-otp') {
        const otpString = otp.join('');
        if (otpString.length < 6) {
          setErrors({ general: 'Vui lòng nhập đủ 6 số OTP' });
          setLoading(false);
          return;
        }
        const result = await verifyOtpAndRegister(formData.name, formData.email, formData.password, otpString);
        if (result.success) {
          toast.success('Đăng ký thành công!');
          onClose();
        } else {
          setErrors({ general: result.message });
        }
        return;
      }

      await api.post('/auth/forgot-password', { email: formData.email });
      toast.success('Vui lòng kiểm tra email để đặt lại mật khẩu!');
      setMode('login');
      setFormData((prev) => ({ ...prev, password: '' }));
    } catch (err) {
      setErrors({ general: getApiErrorMessage(err, 'Không thể gửi email khôi phục.') });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto overflow-x-hidden">
      <div
        className="fixed inset-0 bg-[#0f172a]/60 backdrop-blur-sm animate-fade-in transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        <div className="relative my-auto w-full max-w-[440px] overflow-hidden rounded-[40px] border border-white/20 bg-white shadow-2xl animate-zoom-in">
          <div className="relative bg-[#00c7d3] p-8 pb-10">
            <button
              onClick={onClose}
              className="absolute right-6 top-6 text-white/60 transition-colors hover:text-white"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-[28px] font-black italic tracking-tight text-white">
              {mode === 'login' ? 'Chào mừng trở lại' : mode === 'register' ? 'Tạo tài khoản mới' : mode === 'verify-otp' ? 'Xác thực Email' : 'Khôi phục mật khẩu'}
            </h2>
            <p className="mt-1 text-sm font-semibold text-white/80">
              {mode === 'login'
                ? 'Đăng nhập vào tài khoản Yi Guitar của bạn'
                : mode === 'register'
                  ? 'Gia nhập cộng đồng yêu đàn Yi Guitar nào!'
                  : mode === 'verify-otp'
                    ? 'Nhập mã 6 số tụi mình vừa gửi vào email của cậu'
                    : 'Nhập email để bọn mình gửi link đặt lại mật khẩu.'}
            </p>
          </div>

          <div className="p-8 pt-10">
            {errors.general && (
              <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-xs font-black text-red-500 animate-shake" role="alert">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === 'register' && (
                <div className="space-y-1.5">
                  <label className="ml-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Họ và tên</label>
                  <div className="group relative">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-[#00c7d3]">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Nguyễn Văn A"
                      className={`w-full rounded-2xl border-none bg-slate-50 p-4 pl-14 text-sm font-bold transition-all placeholder:text-slate-300 focus:ring-2 ${errors.name ? 'ring-2 ring-red-500' : 'focus:ring-[#00c7d3]/20'}`}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  {errors.name && <p className="ml-4 mt-1 text-[10px] font-bold text-red-500">{errors.name}</p>}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="ml-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Địa chỉ email</label>
                <div className="group relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-[#00c7d3]">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    ref={emailRef}
                    type="email"
                    placeholder="email.cua.ban@example.com"
                    className={`w-full rounded-2xl border-none bg-slate-50 p-4 pl-14 text-sm font-bold transition-all placeholder:text-slate-300 focus:ring-2 ${errors.email ? 'ring-2 ring-red-500' : 'focus:ring-[#00c7d3]/20'}`}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                {errors.email && <p className="ml-4 mt-1 text-[10px] font-bold text-red-500">{errors.email}</p>}
              </div>

              {mode !== 'forgot' && mode !== 'verify-otp' && (
                <div className="space-y-1.5">
                  <label className="ml-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Mật khẩu</label>
                  <div className="group relative">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-[#00c7d3]">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className={`w-full rounded-2xl border-none bg-slate-50 p-4 pl-14 text-sm font-bold transition-all placeholder:text-slate-300 focus:ring-2 ${errors.password ? 'ring-2 ring-red-500' : 'focus:ring-[#00c7d3]/20'}`}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                  {errors.password && <p className="ml-4 mt-1 text-[10px] font-bold text-red-500">{errors.password}</p>}
                </div>
              )}

              {mode === 'verify-otp' && (
                <div className="space-y-4">
                  <div className="flex justify-between gap-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (otpRefs.current[index] = el)}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-14 rounded-2xl border border-slate-200 bg-white text-center text-xl font-black text-[#00c7d3] shadow-sm transition-all focus:border-[#00c7d3] focus:ring-4 focus:ring-[#00c7d3]/10"
                      />
                    ))}
                  </div>
                  <div className="text-center">
                    {countdown > 0 ? (
                      <p className="text-[11px] font-bold text-slate-400">
                        Gửi lại mã sau <span className="text-[#00c7d3]">{countdown}s</span>
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={loading}
                        className="text-[11px] font-black uppercase tracking-wider text-[#00c7d3] hover:underline"
                      >
                        Gửi lại mã
                      </button>
                    )}
                  </div>
                </div>
              )}

              {mode === 'login' && (
                <div className="flex justify-end pr-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setErrors({});
                    }}
                    className="text-[11px] font-black uppercase tracking-tight text-[#00c7d3] hover:underline"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full rounded-2xl bg-[#00c7d3] py-5 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-cyan-100 transition-all hover:scale-[1.02] hover:shadow-cyan-200 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? 'Vui lòng chờ...' : mode === 'login' ? 'Đăng nhập' : mode === 'register' ? 'Tạo tài khoản' : mode === 'verify-otp' ? 'Xác thực' : 'Gửi yêu cầu'}
              </button>
            </form>

            {mode !== 'verify-otp' && (
              <div className="relative mt-8 border-t border-slate-50 pt-8">
              <span className="absolute left-1/2 top-[-12px] -translate-x-1/2 bg-white px-4 text-[10px] font-black uppercase tracking-widest text-slate-300">
                Hoặc tiếp tục với
              </span>
              <button
                type="button"
                onClick={() => handleGoogleLogin()}
                className="group flex w-full items-center justify-center gap-4 rounded-2xl border-2 border-slate-100 p-4 transition-all hover:bg-slate-50"
              >
                <svg className="h-5 w-5" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                </svg>
                <span className="text-sm font-black text-slate-700">Google</span>
              </button>
            </div>
            )}
          </div>

          <div className="border-t border-slate-100 bg-slate-50 p-8 text-center">
            <p className="mb-1 text-[11px] font-black uppercase tracking-widest text-slate-400">
              {mode === 'login' ? 'Mới đến Yi Guitar?' : 'Đã có tài khoản?'}
            </p>
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setErrors({});
              }}
              className="text-sm font-black text-[#00c7d3] hover:underline"
            >
              {mode === 'login' ? 'Tạo tài khoản mới' : 'Đăng nhập ngay'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
