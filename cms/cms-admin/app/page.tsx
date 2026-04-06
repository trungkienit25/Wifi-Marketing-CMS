"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// --- 1. KHAI BÁO KIỂU DỮ LIỆU ---
interface ChartDataPoint {
  name: string;
  impressions: number;
  clicks: number;
}

interface DashboardStats {
  totalImpressions: number;
  totalClicks: number;
  chartData: ChartDataPoint[];
}

// --- DỮ LIỆU CÁC DỰ ÁN MIKROTIK ADS (MULTI-TENANT) ---
const WEBSITES = [
  { 
    id: "bancong", 
    name: "Bancông", 
    desc: "Cafe & Restaurant Phố Cổ", 
    status: "active", 
    link: "/mikrotik-ads/bancong", 
    icon: "☕",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200"
  },
  { 
    id: "everbloom", 
    name: "Everbloom", 
    desc: "Fine Dining & Floral Event", 
    status: "active", 
    link: "/mikrotik-ads/everbloom", 
    icon: "🌸",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200"
  },
  { 
    id: "lalot", 
    name: "Lalot", 
    desc: "Ẩm Thực Truyền Thống Việt", 
    status: "active", 
    link: "/mikrotik-ads/lalot", 
    icon: "🍲",
    color: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-200"
  },
];

export default function Dashboard() {
  
  const [stats, setStats] = useState<DashboardStats>({
    totalImpressions: 0,
    totalClicks: 0,
    chartData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Trong tương lai sẽ fetch từ API thực tế
        const res = await axios.get("/api/stats/summary");
        setStats(res.data);
      } catch (error) {
        console.warn("Using sample WiFi Marketing data...");
        setStats({
          totalImpressions: 42890,
          totalClicks: 1245,
          chartData: [
            { name: "T2", impressions: 4200, clicks: 120 },
            { name: "T3", impressions: 5900, clicks: 245 },
            { name: "T4", impressions: 4500, clicks: 135 },
            { name: "T5", impressions: 6200, clicks: 360 },
            { name: "T6", impressions: 7800, clicks: 480 },
            { name: "T7", impressions: 9500, clicks: 620 },
            { name: "CN", impressions: 8100, clicks: 590 },
          ]
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#F8FAFC]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
        <span className="text-sm font-semibold text-gray-500 tracking-widest uppercase">Khởi tạo MKT-WIFI CMS...</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <div className="bg-white border-b border-gray-200 pt-12 pb-24 px-8 lg:px-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-50 to-white pointer-events-none"></div>
        <div className="max-w-[1400px] mx-auto relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-2">MKT-WIFI CMS v2.0</h1>
          <p className="text-gray-500 font-medium">Hệ thống quản trị quảng cáo tập trung (Multi-tenant) cho MikroTik hEX.</p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-8 lg:px-12 -mt-12 relative z-20 space-y-10">
        
        <div>
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4 ml-1">Cửa hàng thành viên</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {WEBSITES.map((site) => (
              <div key={site.id} className="relative group rounded-3xl p-6 transition-all duration-300 bg-white shadow-lg hover:shadow-xl hover:-translate-y-1 border border-gray-100">
                <div className="absolute top-5 right-5">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Active
                    </span>
                </div>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5 shadow-sm ${site.bg} ${site.color} ${site.border} border`}>
                  {site.icon}
                </div>
                <h3 className="text-xl font-bold mb-1 text-gray-900">{site.name}</h3>
                <p className="text-sm mb-6 text-gray-500">{site.desc}</p>
                <Link href={site.link} className="inline-flex items-center justify-center w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-xl transition-colors">
                  Quản lý Quảng cáo →
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4 ml-1">Chỉ số mạng lưới</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-shadow">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Tổng Impressions</h3>
                <p className="text-4xl font-black text-gray-900">
                  {(stats?.totalImpressions || 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-shadow">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Tổng Clicks</h3>
                <p className="text-4xl font-black text-gray-900">
                  {(stats?.totalClicks || 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M21.75 12H19.5m-.166 5.834l-1.591-1.591M12 19.5v2.25m-5.834-.166l1.591-1.591M2.25 12h2.25m.166-5.834l1.591 1.591" /></svg>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-shadow">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Hiệu suất trung bình (CTR)</h3>
                <p className="text-4xl font-black text-emerald-500">
                  {stats?.totalImpressions > 0 
                    ? ((stats.totalClicks / stats.totalImpressions) * 100).toFixed(2) 
                    : "0.00"}%
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="mb-6">
              <h3 className="text-base font-bold text-gray-900">Lượt Impressions (Hiển thị)</h3>
              <p className="text-xs text-gray-400 mt-1">Dữ liệu 7 ngày gần nhất toàn hệ thống</p>
            </div>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', fontWeight: 'bold', color: '#0f172a' }} 
                    itemStyle={{ color: '#3b82f6' }}
                  />
                  <Line type="monotone" dataKey="impressions" name="Hiển thị" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="mb-6">
              <h3 className="text-base font-bold text-gray-900">Lượt Click quảng cáo</h3>
              <p className="text-xs text-gray-400 mt-1">Tương tác khách hàng tại điểm phát</p>
            </div>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }} 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', fontWeight: 'bold', color: '#0f172a' }}
                    itemStyle={{ color: '#f59e0b' }}
                  />
                  <Bar dataKey="clicks" name="Lượt Click" fill="#f59e0b" radius={[6, 6, 0, 0]} maxBarSize={35} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}