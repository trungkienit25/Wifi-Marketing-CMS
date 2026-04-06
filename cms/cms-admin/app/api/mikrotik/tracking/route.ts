import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * [POST] MikroTik Multi-Tenant Analytics Core
 * Ghi nhận Impression (Hiển thị) hoặc Click (Hành động) vào Summary Document.
 * CƠ CHẾ: Atomic Increments (Không Race Condition)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { brandId, type } = body; // type: 'impression' | 'click'

    if (!brandId || !['impression', 'click'].includes(type)) {
      return NextResponse.json({ success: false, error: "Invalid tracking payload" }, { status: 400 });
    }

    // Ghi nhận vào Document tổng hợp của Brand
    // SỬ DỤNG updateMany để tránh lỗi 500 khi gặp quán giả lập (Mock Brands)
    await prisma.advertisement.updateMany({
      where: { brandId },
      data: {
        [type === 'impression' ? 'impressions' : 'clicks']: {
          increment: 1
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      brandId, 
      type
    }, {
      headers: { "Access-Control-Allow-Origin": "*" } // CORS cho MikroTik
    });

  } catch (error: any) {
    console.error("[Tracking Error]:", error.message);
    return NextResponse.json({ success: false, error: "Tracking failed" }, { status: 500, headers: { "Access-Control-Allow-Origin": "*" } });
  }
}

/**
 * [GET] Trích xuất Analytics phục vụ Dash-Widgets
 */
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get("brandId");

    if (!brandId) return NextResponse.json({ success: false, error: "Missing brandId" }, { status: 400 });

    try {
        const stats = await prisma.advertisement.findUnique({
            where: { brandId },
            select: { impressions: true, clicks: true } as any
        });

        return NextResponse.json({ success: true, data: stats || { impressions: 0, clicks: 0 } });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Fetch failed" }, { status: 500 });
    }
}

/**
 * CORS Pre-flight
 */
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
