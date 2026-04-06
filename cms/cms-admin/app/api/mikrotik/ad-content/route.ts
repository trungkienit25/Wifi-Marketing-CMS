import { NextRequest, NextResponse } from "next/server";
import { adEngine } from "@/lib/ad-engine";

/**
 * [GET] MikroTik High-Speed Ad Aggregator
 * Trả về JSON Payload chứa Banner + Partner Ads cho alogin.html.
 * RESPONSE TARGET: <100ms
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const brandId = searchParams.get("brandId") || "default";

  try {
    const startTime = Date.now();
    const data = await adEngine.getAdContent(brandId);
    const duration = Date.now() - startTime;

    console.log(`[Ad-Delivery] Served ${brandId} in ${duration}ms`);

    return NextResponse.json(
      { success: true, data },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30", // Tối ưu cache ở Edge Node
          "X-Response-Time": `${duration}ms`,
          "Access-Control-Allow-Origin": "*", // CORS BẮT BUỘC cho MikroTik
        }
      }
    );
  } catch (error: any) {
    console.error("[Ad-Delivery Error]:", error.message);
    return NextResponse.json(
      { success: false, error: "Aggregator failure" },
      { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
}

/**
 * Handle OPTIONS for CORS pre-flight
 */
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
