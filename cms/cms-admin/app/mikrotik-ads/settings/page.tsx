"use client";

import React, { useState } from "react";
import PageHeader from "@/components/PageHeader";

export default function MikrotikSettingsPage() {
  const [settings, setSettings] = useState({
    dnsName: "hotspot.bancong.vn",
    apiPort: 8728,
    masterSecret: "********************************",
    interstitialActive: false,
    interstitialBannerUrl: "",
    interstitialRedirectUrl: "",
    seedDataLayout: "Z-Pattern"
  });

  const handleSave = () => {
    alert("Cấu hình hệ thống đã được cập nhật thành công!");
  };

  return (
    <div className="p-8 lg:p-12 max-w-[1200px] mx-auto">
      <PageHeader 
        title="MikroTik Settings" 
        subtitle="Cấu hình thông số kỹ thuật và chiến dịch Master Admin toàn hệ thống."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          
          {/* Technical Section */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-8">
            <h3 className="text-lg font-black text-gray-900 flex items-center gap-3">
               <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.5 21a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 21zm12.79-11.54l1.41.514M5.106 6.215l1.15.964m11.49 9.642l1.149.964M10.29 20.21l1.41-.513M5.106 6.215l1.15.964m11.49 9.642l1.149.964M10.29 20.21l1.41-.513" /></svg>
               </span>
               Hằng số kỹ thuật (Edge Layer)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">DNS Name Hostname</label>
                <input 
                  type="text" 
                  value={settings.dnsName}
                  onChange={(e) => setSettings({...settings, dnsName: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">MikroTik API Port</label>
                <input 
                  type="number" 
                  value={settings.apiPort}
                  onChange={(e) => setSettings({...settings, apiPort: parseInt(e.target.value)})}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Master Secret Key (.env)</label>
              <input 
                type="text" 
                value={settings.masterSecret}
                disabled
                className="w-full px-6 py-4 bg-gray-100 border border-gray-200 rounded-2xl text-sm font-mono text-gray-400 cursor-not-allowed"
              />
              <p className="text-[10px] text-gray-400 mt-2 italic font-medium">Khóa bí mật này được quản lý tại tệp môi trường của Server để mã hóa Database.</p>
            </div>
          </div>

          {/* Interstitial Override Section */}
          <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-white flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                </span>
                Chiến dịch cưỡng bức (Interstitial)
              </h3>
              <button 
                onClick={() => setSettings({...settings, interstitialActive: !settings.interstitialActive})}
                className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${settings.interstitialActive ? 'bg-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.3)]' : 'bg-slate-800 text-slate-500'}`}
              >
                {settings.interstitialActive ? 'Đang kích hoạt' : 'Đang tắt'}
              </button>
            </div>

            <p className="text-xs text-slate-400">Khi kích hoạt, banner này sẽ hiển thị lên 100% người dùng trên toàn bộ hệ thống quán, đè lên cấu hình riêng của từng quán.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">Master Banner URL</label>
                <input 
                  type="text" 
                  value={settings.interstitialBannerUrl}
                  onChange={(e) => setSettings({...settings, interstitialBannerUrl: e.target.value})}
                  placeholder="Link ảnh sự kiện hệ thống..."
                  className="w-full px-6 py-4 bg-slate-800 border border-slate-700 rounded-2xl text-sm font-medium text-white focus:border-amber-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">Master Redirect Link</label>
                <input 
                  type="text" 
                  value={settings.interstitialRedirectUrl}
                  onChange={(e) => setSettings({...settings, interstitialRedirectUrl: e.target.value})}
                  placeholder="https://event.bancong.vn..."
                  className="w-full px-6 py-4 bg-slate-800 border border-slate-700 rounded-2xl text-sm font-medium text-white focus:border-amber-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
           <button 
             onClick={handleSave}
             className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-700 hover:-translate-y-1 transition-all"
           >
             Cập nhật Hệ thống
           </button>
           
           <div className="bg-white rounded-3xl p-8 border border-gray-100 space-y-6">
             <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Tùy chọn Onboarding</h4>
             <div>
               <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Seed Data Layout</label>
               <select 
                 value={settings.seedDataLayout}
                 onChange={(e) => setSettings({...settings, seedDataLayout: e.target.value})}
                 className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-700 outline-none"
               >
                 <option value="Z-Pattern">Z-Pattern Standard</option>
                 <option value="VerticalFeed">Vertical Feed Only</option>
                 <option value="OnePage">One Page Minimal</option>
               </select>
             </div>
             <p className="text-[10px] text-gray-400 italic">Layout mặc định sẽ được tiêm tự động khi Admin tạo brand mới.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
