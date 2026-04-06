"use client";

import React, { useState } from "react";
import axios from "axios";

interface MikrotikAdsFormProps {
  brandId: string;
  brandName: string;
  data: {
    bannerUrl: string;
    redirectUrl: string;
    strategy: string;
    active: boolean;
    trackingEnabled?: boolean;
  };
  onChange: (newData: any) => void;
}

export default function MikrotikAdsForm({ brandId, brandName, data, onChange }: MikrotikAdsFormProps) {
  const [isSyncing, setIsSyncing] = useState(false);

  /**
   * SMART ASSET HANDLER: 
   * Tự động chuyển đổi link Google Drive sang Direct Link (UC)
   */
  const convertDriveLink = (url: string) => {
    if (url.includes("drive.google.com")) {
      const match = url.match(/[-\w]{25,}/);
      if (match) {
        // Trả về định dạng Direct Link để MikroTik hEX có thể tải ảnh WebP mượt mà
        return `https://drive.google.com/uc?export=view&id=${match[0]}`;
      }
    }
    return url;
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const originalUrl = e.target.value;
    const convertedUrl = convertDriveLink(originalUrl);
    onChange({ ...data, bannerUrl: convertedUrl });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncing(true);
    
    try {
      const payload = {
        brandName: brandName,
        bannerUrl: data.bannerUrl,
        redirectUrl: data.redirectUrl,
        strategy: data.strategy,
        active: data.active,
        trackingEnabled: data.trackingEnabled, // Thêm trường chiến thuật Tracking mới
        layoutType: 'Z-Pattern' 
      };

      const response = await axios.post(`/api/mikrotik/config/${brandId}`, payload);
      
      if (response.data.success) {
        alert(`✅ Tuyệt vời! Cấu hình của ${brandName} đã được đồng bộ và mã hóa thành công.`);
      } else {
        throw new Error(response.data.error || "Có lỗi từ Server");
      }
    } catch (error: any) {
      console.error("Sync Error:", error);
      alert(`⚠️ Lỗi rồi! Không thể lưu cấu hình: ${error?.response?.data?.error || error.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-10">
      
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Thiết lập Quảng cáo</h2>
          <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-widest font-black flex items-center gap-2">
             <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
             {brandName} ({brandId})
          </p>
        </div>
        <div className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${data.active ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>
          {data.active ? "Đang hoạt động" : "Tạm ngắt"}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Banner Link với Smart Handler */}
        <div className="group">
          <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1 group-focus-within:text-blue-600 transition-colors">Banner URL (Hỗ trợ Google Drive)</label>
          <div className="relative">
            <input 
              type="text" 
              value={data.bannerUrl}
              onChange={handleUrlChange}
              placeholder="Dán link ảnh từ Drive hoặc Link trực tiếp..."
              className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-200 transition-all font-mono placeholder:text-gray-300"
            />
            {data.bannerUrl.includes("drive.google.com/uc") && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-blue-600 text-white text-[8px] font-black rounded-lg uppercase">Link Direct</div>
            )}
          </div>
          <p className="text-[10px] text-gray-400 mt-3 ml-1 italic font-medium leading-relaxed">
            Hệ thống tự động chuyển đổi link Drive sang mã Direct ID cho MikroTik.
          </p>
        </div>

        {/* Redirect Link */}
        <div>
          <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Đích đến sau khi Click</label>
          <input 
            type="text"
            value={data.redirectUrl}
            onChange={(e) => onChange({...data, redirectUrl: e.target.value})}
            placeholder="Facebook, Shopee, Website của quán..."
            className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-200 transition-all font-mono"
          />
        </div>

        {/* Strategy & Tracking Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Chiến lược hiển thị</label>
                <select 
                    value={data.strategy}
                    onChange={(e) => onChange({...data, strategy: e.target.value})}
                    className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-black text-gray-800 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all appearance-none cursor-pointer"
                >
                    <option value="Priority">Priority (Ưu tiên quán - Mặc định)</option>
                    <option value="Direct">Direct (Chỉ hiện quán chính)</option>
                    <option value="WeightedRandom">Weighted Random (Xoay vòng ngẫu nhiên)</option>
                </select>
            </div>
            
            <div className="flex flex-col">
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Theo dõi người dùng (Tracking)</label>
                <div 
                    onClick={() => onChange({...data, trackingEnabled: !data.trackingEnabled})}
                    className={`w-full h-full px-8 min-h-[62px] rounded-2xl flex items-center justify-between cursor-pointer transition-all border ${data.trackingEnabled ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-gray-100 text-gray-400 border-gray-200'}`}
                >
                    <span className="text-[12px] font-black uppercase tracking-widest leading-none">{data.trackingEnabled ? 'Đang Bật' : 'Đã Tắt Tạm'}</span>
                    <div className={`w-10 h-6 bg-white/20 rounded-full relative transition-all ${data.trackingEnabled ? 'bg-white/40' : 'bg-gray-300'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${data.trackingEnabled ? 'right-1' : 'left-1'}`}></div>
                    </div>
                </div>
            </div>
        </div>

        {/* Campaign Active Status */}
        <div className="pt-2">
            <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Tình trạng chiến dịch</label>
            <div 
                onClick={() => onChange({...data, active: !data.active})}
                className={`w-full h-[62px] px-8 rounded-2xl flex items-center justify-between cursor-pointer transition-all border ${data.active ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-gray-100 text-gray-400 border-gray-200'}`}
            >
                <span className="text-[12px] font-black uppercase tracking-widest">{data.active ? 'Campaign Is LIVE' : 'Campaign Paused'}</span>
                <div className={`w-10 h-6 bg-white/20 rounded-full relative transition-all ${data.active ? 'bg-white/40' : 'bg-gray-300'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${data.active ? 'right-1' : 'left-1'}`}></div>
                </div>
            </div>
        </div>

        {/* Sync Button */}
        <button 
          type="submit"
          disabled={isSyncing}
          className={`w-full py-6 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-4 group ${isSyncing ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#0F172A] text-white hover:bg-black shadow-2xl hover:shadow-black/20 hover:-translate-y-1 active:scale-[0.98]'}`}
        >
          {isSyncing ? (
            <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-600 rounded-full animate-spin"></div>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 group-hover:rotate-180 transition-transform duration-700 text-[#C5A059]"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
              Lưu & Đồng bộ MikroTik
            </>
          )}
        </button>

      </form>
    </div>
  );
}
