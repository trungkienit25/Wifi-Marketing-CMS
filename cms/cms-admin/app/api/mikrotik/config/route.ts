import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

/**
 * [GLOBAL CONFIG] Master Admin Configuration Schema
 */
const GlobalConfigSchema = z.object({
  masterOverride: z.boolean().default(false),
  interstitialBanner: z.string().url().optional().nullable(),
  interstitialUrl: z.string().url().optional().nullable(),
});

/**
 * [GET] Fetch Global Settings for Master Admin
 */
export async function GET() {
  try {
    const settings = await prisma.globalSettings.findFirst();
    return NextResponse.json({ 
      success: true, 
      data: settings || { masterOverride: false, interstitialBanner: null } 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * [POST] Update Global Override settings (Master Admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = GlobalConfigSchema.parse(body);

    // Get the first record or create it (Single setting architecture)
    const current = await prisma.globalSettings.findFirst();

    const result = await prisma.globalSettings.upsert({
      where: { id: current?.id || 'default' },
      update: {
        masterOverride: validated.masterOverride,
        interstitialBanner: validated.interstitialBanner,
        interstitialUrl: validated.interstitialUrl,
      },
      create: {
        masterOverride: validated.masterOverride,
        interstitialBanner: validated.interstitialBanner,
        interstitialUrl: validated.interstitialUrl,
      }
    });

    console.log(`[Master Admin] Global Override updated: ${validated.masterOverride}`);

    return NextResponse.json({ 
      success: true, 
      message: "Global settings updated successfully.",
      data: result 
    });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.issues }, { status: 400 });
    }
    console.error("[Global Config Error]:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
