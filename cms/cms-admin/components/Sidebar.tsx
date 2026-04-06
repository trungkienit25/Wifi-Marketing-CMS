"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  // --- DÒNG LỆNH QUAN TRỌNG: Ẩn thanh Sidebar nếu đang ở trang Đăng nhập ---
  if (pathname === "/login") return null;

  const isActive = (path: string) => pathname === path;

  const activeClass = "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl bg-white/10 text-white shadow-sm border border-white/5 transition-all duration-300";
  const inactiveClass = "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-300";

  // --- HÀM XỬ LÝ ĐĂNG XUẤT ---
  const handleLogout = () => {
    // Xóa cookie bằng cách set max-age về 0
    document.cookie = "cms_token=; path=/; max-age=0";
    // Load lại trang để middleware tự đẩy về trang /login
    window.location.href = "/login";
  };

  return (
    <aside className="w-[260px] bg-[#0F172A] text-white flex flex-col h-full flex-shrink-0 shadow-2xl z-50">
      
      {/* 1. Logo Brand */}
      <div className="p-8 pb-6">
        <h1 className="text-2xl font-black text-[#C5A059] tracking-wider drop-shadow-md">SUPER CMS</h1>
        <p className="text-[10px] text-gray-400 font-semibold tracking-widest mt-1.5 uppercase">Hệ thống quản trị</p>
      </div>

      {/* 2. Menu Navigation */}
      <div className="flex-1 overflow-y-auto py-2 hide-scrollbar">
        <div className="mb-8">
          <p className="px-8 text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">Báo cáo</p>
          <nav className="space-y-1 px-4">
            <Link href="/" className={isActive("/") ? activeClass : inactiveClass}>Tổng quan</Link>
          </nav>
        </div>

        <div className="mb-8">
          <p className="px-8 text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">Quản lý Wifi Marketing</p>
          <nav className="space-y-1 px-4">
            <Link href="/mikrotik-ads/bancong" className={isActive("/mikrotik-ads/bancong") ? activeClass : inactiveClass}>Bancông Cafe</Link>
            <Link href="/mikrotik-ads/everbloom" className={isActive("/mikrotik-ads/everbloom") ? activeClass : inactiveClass}>Everbloom Events</Link>
            <Link href="/mikrotik-ads/lalot" className={isActive("/mikrotik-ads/lalot") ? activeClass : inactiveClass}>Lalot Restaurant</Link>
            <Link href="/mikrotik-ads/settings" className={isActive("/mikrotik-ads/settings") ? activeClass : inactiveClass}>Hệ thống (Global)</Link>
          </nav>
        </div>
      </div>

      {/* 3. Nút Đăng Xuất */}
      <div className="p-6 border-t border-white/10 bg-[#0B1221]">
        <div 
          onClick={handleLogout} 
          className="flex items-center gap-3 px-2 py-2 text-sm font-medium text-gray-400 hover:text-white cursor-pointer transition-colors group"
        >
          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white font-bold group-hover:bg-[#C5A059] group-hover:text-[#0F172A] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 ml-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
          </div>
          <span>Đăng xuất</span>
        </div>
      </div>
    </aside>
  );
}