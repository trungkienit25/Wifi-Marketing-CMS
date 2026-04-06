"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import AnalyticsCounters from "@/components/AnalyticsCounters";
import MikrotikAdsForm from "@/components/MikrotikAdsForm";
import MikrotikSimulator from "@/components/MikrotikSimulator";

export default function EverbloomAdsPage() {
  const brandId = "everbloom";
  const brandName = "Everbloom Events";
  
  const [adConfig, setAdConfig] = useState({
    bannerUrl: "https://drive.google.com/uc?export=view&id=1XyZ-v_QpX7H_G2gX4t_H-Y5U0W_Z1q",
    redirectUrl: "https://everbloom.vn",
    strategy: "WeightedRandom",
    active: true,
  });

  const [analytics, setAnalytics] = useState({
    impressions: 1240, // Simulated or real fetch
    clicks: 85
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
        try {
            const [configRes, trackingRes] = await Promise.all([
                axios.get(`/api/mikrotik/config/${brandId}`),
                axios.get(`/api/mikrotik/tracking?brandId=${brandId}`)
            ]);

            if (configRes.data.success && configRes.data.data) {
                const dbData = configRes.data.data;
                setAdConfig({
                    bannerUrl: dbData.bannerUrl || adConfig.bannerUrl,
                    redirectUrl: dbData.redirectUrl || adConfig.redirectUrl,
                    strategy: dbData.strategy || adConfig.strategy,
                    active: dbData.active !== undefined ? dbData.active : adConfig.active,
                });
            }

            if (trackingRes.data.success) {
                setAnalytics({
                    impressions: trackingRes.data.data.impressions || 1240,
                    clicks: trackingRes.data.data.clicks || 85,
                });
            }
        } catch (error) {
            console.error("Failed to fetch brand data:", error);
        } finally {
            setIsLoading(false);
        }
    }
    fetchData();
  }, [brandId]);

  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-10 h-10 border-4 border-[#0F172A] border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
  }

  return (
    <div className="p-10 max-w-[1600px] mx-auto min-h-screen bg-[#F8FAFC]">
      
      <div className="mb-12">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-tight">Dashboard Quảng cáo <span className="text-emerald-600">Everbloom</span></h1>
        <p className="text-sm font-bold text-gray-400 mt-2 uppercase tracking-widest">Multi-tenant Managed Profile / Events & Workshops Infrastructure</p>
      </div>

      <AnalyticsCounters impressions={analytics.impressions} clicks={analytics.clicks} />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
        <div className="xl:col-span-12 lg:col-span-12 xl:col-span-7">
          <MikrotikAdsForm 
             brandId={brandId} 
             brandName={brandName} 
             data={adConfig} 
             onChange={setAdConfig} 
          />
        </div>

        <div className="xl:col-span-12 lg:col-span-12 xl:col-span-5 flex justify-center">
            <div className="sticky top-10 w-full lg:w-auto">
                <MikrotikSimulator brandName={brandName} data={adConfig} />
            </div>
        </div>
      </div>

    </div>
  );
}