import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { io } from 'socket.io-client';
import api from '@/api/axios';
import * as XLSX from 'xlsx';

const COLORS = ['#00c7d3', '#0f172a', '#64748b', '#94a3b8'];

const RevenueReport = () => {
  const [data, setData] = useState({
    kpis: { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0, canceledOrders: 0, growth: 0 },
    chartData: [],
    categoryStats: [],
    topProducts: [],
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Tháng này');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  const fetchData = async () => {
    try {
      const params = {};
      if (dateRange.from && dateRange.to) {
        params.startDate = dateRange.from;
        params.endDate = dateRange.to;
      } else {
        params.filter = filter;
      }

      const res = await api.get('/admin/revenue-stats', { params });
      setData(res.data);
    } catch (err) {
      console.error('Error fetching revenue stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = () => {
    try {
      // 1. Chuẩn bị dữ liệu Đơn hàng (Flatten)
      const ordersData = data.recentOrders.map(order => ({
        'Mã Đơn': `#${order._id.slice(-6)}`,
        'Khách Hàng': order.customerInfo.name,
        'Số Điện Thoại': order.customerInfo.phone,
        'Ngày Đặt': new Date(order.createdAt).toLocaleDateString('vi-VN'),
        'Tổng Tiền (₫)': order.totalAmount,
        'Trạng Thái': order.status === 'Completed' ? 'Thành công' : order.status
      }));

      // 2. Chuẩn bị dữ liệu KPI Tổng quan
      const kpiData = [
        ['CHỈ SỐ', 'GIÁ TRỊ'],
        ['Tổng doanh thu', data.kpis.totalRevenue],
        ['Tổng đơn thành công', data.kpis.totalOrders],
        ['Giá trị trung bình đơn', Math.round(data.kpis.avgOrderValue)],
        ['Số đơn đã hủy', data.kpis.canceledOrders],
        ['Tỉ lệ tăng trưởng', `${data.kpis.growth}%`]
      ];

      // 3. Tạo Workbook & Sheets
      const wb = XLSX.utils.book_new();
      
      const wsOrders = XLSX.utils.json_to_sheet(ordersData);
      const wsKPI = XLSX.utils.aoa_to_sheet(kpiData);

      // Thêm sheets vào workbook
      XLSX.utils.book_append_sheet(wb, wsOrders, "Danh sách Đơn hàng");
      XLSX.utils.book_append_sheet(wb, wsKPI, "Tổng quan KPI");

      // 4. Xuất file
      const fileName = `Bao-cao-doanh-thu-${new Date().toLocaleDateString('vi-VN').replace(/\//g, '-')}.xlsx`;
      XLSX.writeFile(wb, fileName);

    } catch (error) {
      console.error('Lỗi khi xuất Excel:', error);
      alert('Không thể xuất file lúc này. Vui lòng thử lại!');
    }
  };

  useEffect(() => {
    fetchData();

    // ── SOCKET.IO REAL-TIME LISTENER (Fix S7: Auth) ────────────────────
    const token = localStorage.getItem('yi-guitar-token');
    const socket = io(import.meta.env.VITE_BASE_URL, {
      auth: { token }
    });
    
    socket.on('dashboard-update', (payload) => {
      console.log('⚡ Dashboard real-time update received:', payload);
      // Khi có đơn hàng mới hoặc cập nhật, ta fetch lại data
      fetchData();
    });

    return () => socket.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, dateRange]);

  const kpiCards = [
    { 
      title: 'Tổng doanh thu', 
      value: data.kpis.totalRevenue.toLocaleString('vi-VN') + ' ₫', 
      trend: `+${data.kpis.growth}%`, 
      color: 'text-emerald-500',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3 1.343 3 3-1.343 3-3 3m0-13a9 9 0 110 18 9 9 0 010-18zm0 0V3m0 18v-3" /></svg>
    },
    { 
      title: 'Tổng đơn thành công', 
      value: data.kpis.totalOrders, 
      trend: '+5.2%', 
      color: 'text-emerald-500',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    },
    { 
      title: 'Trung bình/Đơn (AOV)', 
      value: Math.round(data.kpis.avgOrderValue).toLocaleString('vi-VN') + ' ₫', 
      trend: '-1.4%', 
      color: 'text-rose-500',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
    },
    { 
      title: 'Số đơn hủy', 
      value: data.kpis.canceledOrders, 
      trend: '+0.5%', 
      color: 'text-rose-500', 
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    }
  ];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#00c7d3] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Đang tổng hợp dữ liệu...</p>
      </div>
    </div>
  );

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20 fade-in select-none">
      {/* ── HEADER & SMART FILTERS ────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-100 py-10 mb-8 sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-6 lg:px-16 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black text-[#0f172a] italic leading-none">Báo Cáo Doanh Thu</h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Cập nhật thời gian thực qua Socket.io
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex bg-slate-100 p-1 rounded-xl">
              {['Hôm nay', 'Tuần này', 'Tháng này', 'Năm nay'].map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    setFilter(f);
                    setDateRange({ from: '', to: '' });
                  }}
                  className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${
                    filter === f && !dateRange.from ? 'bg-white text-[#00c7d3] shadow-sm' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2">
               <input 
                 type="date" 
                 value={dateRange.from}
                 onChange={(e) => {
                   setDateRange(prev => ({ ...prev, from: e.target.value }));
                   setFilter('');
                 }}
                 className="text-xs font-bold text-slate-600 outline-none border-none bg-transparent" 
               />
               <span className="text-slate-300">/</span>
               <input 
                 type="date" 
                 value={dateRange.to}
                 onChange={(e) => {
                   setDateRange(prev => ({ ...prev, to: e.target.value }));
                   setFilter('');
                 }}
                 className="text-xs font-bold text-slate-600 outline-none border-none bg-transparent" 
               />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-16 space-y-8">
        {/* ── KPI GRID ────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiCards.map((card, i) => (
            <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 group hover:-translate-y-1 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-slate-50 text-[#00c7d3] rounded-2xl group-hover:bg-[#00c7d3] group-hover:text-white transition-colors">
                  {card.icon}
                </div>
                <span className={`text-[10px] font-black px-2 py-1 rounded-lg bg-slate-50 ${card.color}`}>
                  {card.trend}
                </span>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{card.title}</p>
              <h3 className="text-2xl font-black text-[#0f172a] tracking-tight">{card.value}</h3>
            </div>
          ))}
        </div>

        {/* ── CHARTS SECTION ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Area Chart */}
          <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/30">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-xl font-black text-[#0f172a] italic">Xu hướng Doanh thu</h2>
              <div className="flex items-center gap-4 text-[10px] font-black text-slate-400">
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#00c7d3]"></span> DOANH THU</div>
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-slate-200"></span> ĐƠN HÀNG</div>
              </div>
            </div>
            
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.chartData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00c7d3" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00c7d3" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}}
                  />
                  <Tooltip 
                    contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '20px'}}
                    itemStyle={{fontWeight: 900, fontSize: '12px'}}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#00c7d3" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/30">
            <h2 className="text-xl font-black text-[#0f172a] italic mb-10">Cơ cấu Danh mục</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.categoryStats}
                    innerRadius={80}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.categoryStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend 
                    verticalAlign="bottom" 
                    iconType="circle"
                    formatter={(value) => <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 pt-6 border-t border-slate-50 text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phân tích chuyên mục có doanh thu cao nhất</p>
            </div>
          </div>
        </div>

        {/* ── TOP PRODUCTS & DATA TABLE ─────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Top 5 Products */}
          <div className="lg:col-span-1 bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/30">
            <h2 className="text-xl font-black text-[#0f172a] italic mb-8">Top 5 Bán Chạy</h2>
            <div className="space-y-6">
              {data.topProducts.map((p, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 overflow-hidden flex-shrink-0 border border-slate-100">
                    <img src={p.image} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-sm font-black text-slate-800 line-clamp-1">{p.name}</h4>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.totalQty} Đã bán</p>
                      <p className="text-[10px] font-black text-[#00c7d3]">{p.totalRevenue.toLocaleString('vi-VN')} ₫</p>
                    </div>
                    <div className="w-full h-1 bg-slate-50 rounded-full mt-2 overflow-hidden">
                      <div 
                        className="h-full bg-[#00c7d3] rounded-full" 
                        style={{width: data.kpis.totalRevenue > 0 ? `${(p.totalRevenue / data.kpis.totalRevenue) * 100}%` : '0%'}}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/30 overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <h2 className="text-xl font-black text-[#0f172a] italic">Đơn hàng gần đây</h2>
              <button 
                onClick={handleExportExcel}
                className="px-5 py-2.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#00c7d3] transition-all flex items-center gap-2 shadow-lg shadow-slate-900/20"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Xuất Excel
              </button>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Mã Đơn</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Khách hàng</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Ngày</th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Tổng Tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {data.recentOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-slate-50/30 transition-colors">
                        <td className="px-8 py-5">
                          <span className="text-xs font-black text-slate-400 tracking-tighter uppercase">#{order._id.slice(-6)}</span>
                        </td>
                        <td className="px-8 py-5">
                          <p className="text-sm font-black text-slate-700 italic">{order.customerInfo.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold">{order.customerInfo.phone}</p>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-50 px-3 py-1 rounded-full uppercase">
                            {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right font-black text-[#0f172a] text-sm">
                          {order.totalAmount.toLocaleString('vi-VN')} ₫
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueReport;
