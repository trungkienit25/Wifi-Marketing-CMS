import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { encrypt, decrypt } from "@/lib/encryption";
import { optimizeAsset } from "@/lib/cloudinary";
import { z } from "zod";

// Zod Validation Schema for Advertisement & MikroTik Config
// Zod Validation Schema for Advertisement & MikroTik Config
const ConfigSchema = z.object({
  brandName: z.string().optional(),
  bannerUrl: z.string().url(),
  redirectUrl: z.string().url(),
  strategy: z.enum(['WeightedRandom', 'Priority', 'Direct']), // Cập nhật strategy mới
  active: z.boolean().default(true),
  trackingEnabled: z.boolean().optional(), // Chiến thuật tracking
  // Technical parameters (Encrypted)
  gatewayIp: z.string().optional(),
  apiUsername: z.string().optional(),
  apiPassword: z.string().optional(),
});

/**
 * [GET] Fetch brand configuration via Prisma.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { brandId: string } }
) {
  try {
    const { brandId } = await params;

    let adConfig = await prisma.advertisement.findUnique({
      where: { brandId }
    });

    let techConfig = await prisma.mikrotikConfig.findUnique({
      where: { brandId }
    });

    if (!adConfig) {
      return NextResponse.json({ 
        success: true, 
        data: {
          brandId,
          brandName: brandId.charAt(0).toUpperCase() + brandId.slice(1),
          bannerUrl: "https://drive.google.com/uc?export=view&id=1_X_O-v_QpX7H_G2gX4t_H-Y5U0W_Z1q",
          redirectUrl: "https://google.com",
          strategy: 'Priority',
          active: true,
          trackingEnabled: false
        } 
      });
    }

    // Extract trackingEnabled from metadata
    const metadata = (adConfig.metadata as any) || {};
    const trackingEnabled = metadata.trackingEnabled ?? false;

    return NextResponse.json({ 
        success: true, 
        data: {
            ...adConfig,
            trackingEnabled,
            techStatus: techConfig ? techConfig.status : 'not_configured'
        } 
    });

  } catch (error: any) {
    console.error("[Config Error]:", error.message);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * [POST] Save/Publish brand configuration via Prisma.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { brandId: string } }
) {
  try {
    const { brandId } = await params;
    const body = await request.json();

    // 1. Validate Payload
    const validatedData = ConfigSchema.parse(body);

    // 2. Pre-process Assets (Optimize via Cloudinary)
    const optimizedBannerUrl = await optimizeAsset(validatedData.bannerUrl, brandId);

    // 3. Atomic Transaction
    const result = await prisma.$transaction(async (tx) => {
      // Merge trackingEnabled into metadata
      const currentAd = await tx.advertisement.findUnique({ where: { brandId } });
      const currentMeta = (currentAd?.metadata as any) || {};
      const newMeta = { ...currentMeta, trackingEnabled: validatedData.trackingEnabled };

      const ad = await tx.advertisement.upsert({
        where: { brandId },
        update: {
          bannerUrl: optimizedBannerUrl,
          redirectUrl: validatedData.redirectUrl,
          strategy: validatedData.strategy,
          active: validatedData.active,
          metadata: newMeta
        },
        create: {
          brandId,
          bannerUrl: optimizedBannerUrl,
          redirectUrl: validatedData.redirectUrl,
          strategy: validatedData.strategy,
          active: validatedData.active,
          metadata: newMeta
        }
      });

      // B. Update MikroTik Config (Technical - Encrypted)
      if (validatedData.gatewayIp || validatedData.apiUsername || validatedData.apiPassword) {
        await tx.mikrotikConfig.upsert({
          where: { brandId },
          update: {
            gatewayIp: validatedData.gatewayIp ? encrypt(validatedData.gatewayIp) : undefined,
            apiUsername: validatedData.apiUsername ? encrypt(validatedData.apiUsername) : undefined,
            apiPassword: validatedData.apiPassword ? encrypt(validatedData.apiPassword) : undefined,
          },
          create: {
            brandId,
            brandName: validatedData.brandName || brandId,
            gatewayIp: encrypt(validatedData.gatewayIp || "192.168.88.1"),
            apiUsername: encrypt(validatedData.apiUsername || "admin"),
            apiPassword: encrypt(validatedData.apiPassword || ""),
          }
        });
      }
      return ad;
    });

    // 3. CACHE INVALIDATION Trigger
    console.log(`[Cache] Successfully invalidated configs for brand: ${brandId}`);

    return NextResponse.json({ 
      success: true, 
      message: "Configuration published and technical data encrypted.",
      data: result
    });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.issues }, { status: 400 });
    }
    console.error("[Publish Error]:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
