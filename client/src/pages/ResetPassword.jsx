import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '@/api/axios';
import { getApiErrorMessage } from '@/utils/textEncoding';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.put(`/auth/reset-password/${token}`, { password });
      toast.success(data.message || 'Đặt lại mật khẩu thành công!');
      navigate('/');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Không thể đặt lại mật khẩu.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[70vh] bg-slate-50 px-4 py-16">
      <div className="mx-auto max-w-md rounded-[32px] bg-white p-8 shadow-xl">
        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#00c7d3]">Reset Password</p>
        <h1 className="mt-3 text-3xl font-black italic text-slate-900">Tạo mật khẩu mới</h1>
        <p className="mt-3 text-sm font-medium text-slate-500">
          Nhập mật khẩu mới để hoàn tất quá trình khôi phục tài khoản.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              Mật khẩu mới
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu mới"
              className="w-full rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-800 outline-none ring-1 ring-slate-100 transition focus:ring-2 focus:ring-[#00c7d3]/30"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[#00c7d3] py-4 text-xs font-black uppercase tracking-[0.25em] text-white disabled:opacity-50"
          >
            {loading ? 'Đang xử lý...' : 'Xác nhận'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ResetPassword;
