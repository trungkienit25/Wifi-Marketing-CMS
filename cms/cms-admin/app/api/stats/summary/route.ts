import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * [GET] Dashboard Summary Statistics
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get("brandId");

    const where = brandId ? { brandId } : {};

    // Aggregate stats from Advertisement model (atomic counters)
    const ads = await prisma.advertisement.findMany({
      where,
      select: {
        brandId: true,
        impressions: true,
        clicks: true,
      }
    });

    const summary = ads.reduce((acc, curr) => ({
      impressions: acc.impressions + (curr.impressions || 0),
      clicks: acc.clicks + (curr.clicks || 0),
    }), { impressions: 0, clicks: 0 });

    return NextResponse.json({
      success: true,
      data: {
        totalImpressions: summary.impressions,
        totalClicks: summary.clicks,
        activeBrands: ads.length,
        ctr: summary.impressions > 0 ? ((summary.clicks / summary.impressions) * 100).toFixed(2) : 0
      }
    });

  } catch (error: any) {
    console.error("[Stats Error]:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
