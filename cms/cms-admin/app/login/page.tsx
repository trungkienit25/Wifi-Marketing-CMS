// file: src/app/login/page.tsx
"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // MÔ PHỎNG ĐĂNG NHẬP (Bạn có thể thay bằng API gọi xuống Backend thực tế)
    // Ví dụ: axios.post('http://localhost:5000/api/login', { username, password })
    setTimeout(() => {
      if (username === "admin" && password === "admin123") {
        // Đăng nhập thành công -> Lưu Cookie với tên 'cms_token' sống trong 1 ngày
        document.cookie = "cms_token=authenticated_token_example; path=/; max-age=86400";
        // Force reload để Middleware nhận diện Cookie và chuyển trang
        window.location.href = "/";
      } else {
        setError("Sai tài khoản hoặc mật khẩu. Thử: admin / admin123");
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[100px]"></div>

      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl border border-white/50 p-10 relative z-10">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-[#C5A059] tracking-wider drop-shadow-sm mb-2">SUPER CMS</h1>
          <p className="text-sm font-semibold text-gray-500 tracking-widest uppercase">Hệ Thống Quản Trị</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[13px] font-bold text-gray-700 mb-2 uppercase tracking-wide">Tài khoản</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 transition-all outline-none"
              placeholder="Nhập tên đăng nhập..."
              required
            />
          </div>

          <div>
            <label className="block text-[13px] font-bold text-gray-700 mb-2 uppercase tracking-wide">Mật khẩu</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 transition-all outline-none"
              placeholder="Nhập mật khẩu..."
              required
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm font-medium text-center">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-[#0F172A] hover:bg-[#1e293b] text-white rounded-xl font-bold tracking-wide transition-all shadow-lg active:scale-95 flex justify-center items-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              "ĐĂNG NHẬP"
            )}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
          <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500 font-medium tracking-wide">Hoặc</span></div>
        </div>

        <button 
          type="button" 
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full py-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 rounded-xl font-bold tracking-wide transition-all shadow-sm active:scale-95 flex justify-center items-center gap-3"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
          ĐĂNG NHẬP BẰNG GMAIL
        </button>
        
        <p className="text-center text-xs text-gray-400 mt-8 font-medium">
          © {new Date().getFullYear()} Super CMS. All rights reserved.
        </p>
      </div>
    </div>
  );
}