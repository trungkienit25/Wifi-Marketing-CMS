import prisma from "./prisma";

/**
 * [STRATEGY PATTERN] 
 * Ad Delivery Engine core logic.
 * Handles how advertisements are filtered and prioritized.
 */
export class AdEngine {
  
  /**
   * Aggregate ad content based on brand strategy.
   */
  async getAdContent(brandId: string) {
    // 1. Check Global System Override
    const globalSettings = await prisma.globalSettings.findFirst();
    if (globalSettings?.masterOverride && globalSettings.interstitialBanner) {
        return {
          meta: { brandId: "system", brandName: "System Announcement" },
          ads: [{
            id: "system-01",
            brandId: "system",
            bannerUrl: globalSettings.interstitialBanner,
            redirectUrl: globalSettings.interstitialUrl || "#",
            isOverride: true
          }],
          strategy: "MasterOverride",
          timestamp: Date.now()
        };
    }

    // 2. Fetch Brand Configuration
    const brand = await prisma.advertisement.findUnique({ where: { brandId } });

    if (!brand || !brand.active) {
      return this.getFallbackContent(brandId);
    }

    // 3. Fetch Partners (Cross-Marketing)
    let partners = await prisma.advertisement.findMany({
      where: { 
        brandId: { not: brandId },
        active: true 
      },
      take: 6,
      orderBy: { updatedAt: "desc" }
    });

    // [FALLBACK]: Nếu DB chưa đủ đối tác (mới khởi tạo), tự động thêm Mock Partners cho "đẹp đội hình"
    if (partners.length < 2) {
        const mocks = [
            { brandId: 'everbloom', bannerUrl: 'https://drive.google.com/uc?export=view&id=1LlT-v_QpX7H_G2gX4t_H-Y5U0W_Z1q', redirectUrl: '#' },
            { brandId: 'bancong', bannerUrl: 'https://drive.google.com/uc?export=view&id=1LlT-v_QpX7H_G2gX4t_H-Y5U0W_Z1q', redirectUrl: '#' }
        ].filter(m => m.brandId !== brandId);
        
        // Merge - ưu tiên DB thật lên đầu
        partners = [...partners, ...(mocks as any)];
    }

    // 4. APPLY STRATEGY
    let finalAds: any[] = [];
    const mainAd = {
        id: brand.brandId,
        brandId: brand.brandId,
        bannerUrl: brand.bannerUrl,
        redirectUrl: brand.redirectUrl || "#",
        isMain: true
    };

    const partnerAds = partners.map(p => ({
        id: p.brandId,
        brandId: p.brandId,
        bannerUrl: p.bannerUrl,
        redirectUrl: p.redirectUrl || "#",
        isPartner: true
    }));

    switch (brand.strategy) {
      case "Direct":
        // Only show main brand ad
        finalAds = [mainAd];
        break;

      case "WeightedRandom":
        // Shuffle everything, main brand has 2 slots to appear more often
        finalAds = this.shuffle([...partnerAds, mainAd, mainAd]);
        break;

      case "Priority":
      default:
        // Main brand first, then partners
        finalAds = [mainAd, ...this.shuffle(partnerAds)];
        break;
    }

    return {
      meta: {
        brandId,
        brandName: brand.brandId.charAt(0).toUpperCase() + brand.brandId.slice(1),
        theme: (brand.metadata as any)?.theme || "light",
        trackingEnabled: (brand.metadata as any)?.trackingEnabled ?? false // Mặc định tắt tạm để Bạn test
      },
      ads: finalAds.slice(0, 5), 
      strategy: brand.strategy || "Priority",
      timestamp: Date.now()
    };
  }

  /**
   * Professional Shuffle Algorithm (Fisher-Yates)
   */
  private shuffle(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  /**
   * Fallback logic for unknown/inactive brands.
   */
  private getFallbackContent(brandId: string) {
    return {
      meta: { 
        brandId, 
        brandName: "Guest WiFi",
        trackingEnabled: false // Không track cho khách không đăng ký
      },
      ads: [{
          id: "fallback-banner",
          brandId: brandId,
          bannerUrl: "https://drive.google.com/uc?export=view&id=1_X_O-v_QpX7H_G2gX4t_H-Y5U0W_Z1q",
          redirectUrl: "#",
      }],
      strategy: "Default",
      timestamp: Date.now()
    };
  }
}

export const adEngine = new AdEngine();
