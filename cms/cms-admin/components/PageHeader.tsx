"use client";

import React from "react";
import Link from "next/link";

interface PageHeaderProps {
  title: string;
  subtitle: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
      <div>
        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 tracking-widest uppercase mb-1.5">
          <Link href="/" className="hover:text-gray-900 transition-colors">Tổng Quan</Link>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-2.5 h-2.5 text-gray-300">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
          <span className="text-gray-300 font-bold">Mikrotik Ads</span>
        </div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">{title}</h1>
        <p className="text-gray-500 font-medium">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        <Link 
          href="/" 
          className="px-6 py-2.5 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-600 shadow-sm hover:shadow-gray-200/50 hover:bg-gray-50 transition-all flex items-center gap-2 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
          Trở lại
        </Link>
      </div>
    </div>
  );
}
