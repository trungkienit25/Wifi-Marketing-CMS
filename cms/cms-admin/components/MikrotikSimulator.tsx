"use client";

import React, { useState, useEffect } from "react";

interface MikrotikSimulatorProps {
  brandName: string;
  data: {
    bannerUrl: string;
    redirectUrl: string;
    strategy: string;
    active: boolean;
  };
}

type ViewportType = "iPhone" | "Android" | "Laptop";

export default function MikrotikSimulator({ brandName, data }: MikrotikSimulatorProps) {
  const [viewport, setViewport] = useState<ViewportType>("iPhone");
  const [mockMac, setMockMac] = useState("00:1A:2B:3C:4D:5E");
  const [mockIp, setMockIp] = useState("192.168.88.245");
  const [isRotating, setIsRotating] = useState(false);

  // Kích thước Viewport tiêu chuẩn
  const viewports = {
    iPhone: "w-[360px] h-[740px] rounded-[50px] border-[10px]",
    Android: "w-[380px] h-[720px] rounded-[30px] border-[8px]",
    Laptop: "w-[800px] h-[500px] rounded-[20px] border-[12px] border-b-[30px]",
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      
      {/* 🟢 TOOLBAR: Điều khiển Simulator */}
      <div className="flex items-center gap-6 bg-white px-8 py-4 rounded-2xl shadow-sm border border-gray-100 mb-4 w-full justify-between">
        <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">Thiết bị:</span>
            {(['iPhone', 'Android', 'Laptop'] as ViewportType[]).map((v) => (
                <button 
                    key={v}
                    onClick={() => setViewport(v)}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewport === v ? 'bg-[#0F172A] text-[#C5A059] shadow-lg' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                >
                    {v}
                </button>
            ))}
        </div>

        <div className="flex items-center gap-4 bg-gray-50 px-4 py-1.5 rounded-xl border border-gray-100">
            <div className="flex flex-col">
                <span className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">Mock MAC</span>
                <input 
                    value={mockMac} 
                    onChange={(e) => setMockMac(e.target.value)}
                    className="bg-transparent text-[10px] font-bold text-blue-600 outline-none w-24"
                />
            </div>
            <div className="w-px h-6 bg-gray-200"></div>
            <div className="flex flex-col">
                <span className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">Mock IP</span>
                <input 
                    value={mockIp} 
                    onChange={(e) => setMockIp(e.target.value)}
                    className="bg-transparent text-[10px] font-bold text-emerald-600 outline-none w-24"
                />
            </div>
        </div>
      </div>

      {/* 📱 SIMULATOR VIEWPORT */}
      <div className={`relative ${viewports[viewport]} bg-[#0F172A] border-[#1E293B] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] transition-all duration-700 overflow-hidden group`}>
        
        {/* iPhone Dynamic Island */}
        {viewport === "iPhone" && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#1E293B] rounded-b-2xl z-50"></div>
        )}

        {/* Captive Portal Content */}
        <div className={`w-full h-full bg-[#F8FAFC] ${viewport === "Laptop" ? 'rounded-none' : 'rounded-[32px]'} overflow-y-auto hide-scrollbar flex flex-col`}>
            
            {/* Header (Branding) */}
            <div className="p-6 pb-2 flex items-center justify-between border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-40">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#0F172A] text-[#C5A059] flex items-center justify-center font-black text-sm">
                        {brandName.charAt(0)}
                    </div>
                    <div>
                        <h4 className="text-[11px] font-black text-gray-900 tracking-tight">{brandName}</h4>
                        <p className="text-[8px] text-emerald-500 font-bold uppercase tracking-widest">WiFi Connected</p>
                    </div>
                </div>
                <div className="text-[8px] font-mono text-gray-400 text-right leading-tight">
                    {mockMac}<br/>{mockIp}
                </div>
            </div>

            {/* Campaign Status Check */}
            {!data.active && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-[45] flex items-center justify-center p-10 text-center">
                    <div>
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4 text-gray-400">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                        </div>
                        <h5 className="text-xs font-black text-gray-900 uppercase tracking-widest">Chiến dịch tạm dừng</h5>
                        <p className="text-[9px] text-gray-400 mt-2 font-bold uppercase tracking-wider">Đang hiển thị Default UI</p>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1">
                {/* 1. Primary Banner (Z-Pattern start) */}
                <div className="p-4">
                    <div className="w-full aspect-[4/5] rounded-[24px] overflow-hidden shadow-xl bg-gray-200 relative group-hover:scale-[1.01] transition-transform duration-500">
                        <img src={data.bannerUrl} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-6">
                            <h3 className="text-white font-black text-xl leading-tight mb-4 drop-shadow-lg">Chào mừng Bạn đến với mạng lưới {brandName}</h3>
                            <a href={data.redirectUrl} className="w-full py-4 bg-[#C5A059] text-[#0F172A] font-black text-[10px] uppercase tracking-[0.2em] rounded-xl text-center shadow-lg active:scale-95 transition-all">
                                Xem ngay ưu đãi
                            </a>
                        </div>
                    </div>
                </div>

                {/* 2. Strategy-based Info */}
                <div className="px-6 py-4 flex items-center justify-between border-y border-gray-100 bg-white/50">
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em]">Cấu hình thuật toán</span>
                    <div className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[8px] font-black uppercase">
                        {data.strategy} (Mock: Active)
                    </div>
                </div>

                {/* 3. Partner Ads (Cross-brand logic showcase) */}
                <div className="p-6 space-y-4">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Thương hiệu đối tác</p>
                    
                    {/* Mock Partner 1 */}
                    <div className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-gray-50 hover:border-blue-100 transition-colors">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden">
                             <img src="https://images.unsplash.com/photo-1554118811-1e0d58224f24" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                            <h5 className="text-[10px] font-black text-gray-900">Bancông Cafe</h5>
                            <p className="text-[8px] font-bold text-gray-400">Ưu đãi 15% cho...</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                        </div>
                    </div>

                    {/* Mock Partner 2 */}
                    <div className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-gray-50 hover:border-emerald-100 transition-colors">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden">
                             <img src="https://images.unsplash.com/photo-1544723083-3a05952d431c" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                            <h5 className="text-[10px] font-black text-gray-900">Everbloom</h5>
                            <p className="text-[8px] font-bold text-gray-400">Workshop cắm hoa...</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                        </div>
                    </div>
                </div>

                {/* 4. Footer Log */}
                <div className="p-8 text-center bg-gray-50 mt-4">
                    <p className="text-[7px] font-black text-gray-300 uppercase tracking-[0.4em]">Integrated with MikroTik hEX Aggregator</p>
                </div>
            </div>

        </div>

      </div>

    </div>
  );
}
