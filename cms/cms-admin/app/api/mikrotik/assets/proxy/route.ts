import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

/**
 * ASSET PROXY ENDPOINT (Replacing Express AssetProxyController)
 * Serves as an anonymizing proxy for Google Drive assets.
 * Helps overcome CORS issues on MikroTik captive portal.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('u');

  if (!targetUrl) {
    return new NextResponse("URL parameter 'u' is required", { status: 400 });
  }

  try {
    // 1. Fetch from Target Link (Drive or External)
    const response = await axios({
      method: 'get',
      url: targetUrl,
      responseType: 'arraybuffer',
      timeout: 10000,
    });

    // 2. Prepare Headers (Cache for 1 year to reduce server load)
    const headers = new Headers();
    headers.set('Content-Type', response.headers['content-type'] || 'image/jpeg');
    headers.set('Cache-Control', 'public, max-age=31536000, s-maxage=31536000');
    
    // 3. Respond with binary image data
    return new NextResponse(response.data, {
      status: 200,
      headers
    });

  } catch (error: any) {
    console.error("[Proxy Error]:", error.message);
    // If proxy fails, return 404 so the client can fallback to Base64 (Tier 3)
    return new NextResponse("Asset not reachable via proxy", { status: 404 });
  }
}
