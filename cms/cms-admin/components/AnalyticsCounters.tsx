"use client";

import React from "react";

interface AnalyticsCountersProps {
  impressions: number;
  clicks: number;
}

export default function AnalyticsCounters({ impressions, clicks }: AnalyticsCountersProps) {
  const ctr = impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : "0.00";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      
      {/* Impressions Counter */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500 group">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644m17.5 0a1.012 1.012 0 010 .644M12 18.75l3.086-6.253 1.258 2.516a.75.75 0 001.341-.012l3.34-6.681m-14.708 0l3.34 6.681a.75.75 0 001.341.012l1.258-2.516L12 18.75z" /></svg>
          </div>
          <span className="text-[10px] font-black text-blue-600/50 uppercase tracking-widest">Real-time</span>
        </div>
        <div>
          <h3 className="text-3xl font-black text-gray-900 tracking-tight">{impressions.toLocaleString()}</h3>
          <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">Lượt hiển thị (Impressions)</p>
        </div>
      </div>

      {/* Clicks Counter */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-500 group">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M16.5 16.5l1.591 1.591M12 18.75V21m-4.5-4.5l-1.591 1.591M5.25 10.5H3m4.5-4.5L5.909 4.409" /></svg>
          </div>
          <span className="text-[10px] font-black text-emerald-600/50 uppercase tracking-widest">Active Link</span>
        </div>
        <div>
          <h3 className="text-3xl font-black text-gray-900 tracking-tight">{clicks.toLocaleString()}</h3>
          <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">Lượt tương tác (Clicks)</p>
        </div>
      </div>

      {/* CTR Counter */}
      <div className="bg-[#0F172A] rounded-3xl p-8 shadow-2xl flex flex-col justify-between hover:-translate-y-1 transition-all duration-500 group border border-white/5">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#C5A059] group-hover:bg-[#C5A059] group-hover:text-[#0F172A] transition-colors duration-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1-3m8.5 3l1-3m0 0l.5-1.5m-.5 1.5h-9.5m0 0l-.5-1.5m.75 3L12 3" /></svg>
          </div>
          <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-gray-400 uppercase tracking-widest">Performance</div>
        </div>
        <div>
          <h3 className="text-3xl font-black text-white tracking-tight">{ctr}%</h3>
          <p className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-widest">Tỷ lệ nhấp (CTR)</p>
        </div>
      </div>

    </div>
  );
}
