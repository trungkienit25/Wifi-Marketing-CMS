import type { IPartnerAd } from '../models/SuccessPage.js';

export interface IAdStrategy {
  selectAds(ads: IPartnerAd[], limit: number): IPartnerAd[];
}

/**
 * Weighted Random Strategy: Picks ads based on their 'weight' property.
 */
class WeightedRandomStrategy implements IAdStrategy {
  selectAds(ads: IPartnerAd[], limit: number): IPartnerAd[] {
    if (ads.length <= limit) return ads;

    const result: IPartnerAd[] = [];
    const pool = [...ads];

    while (result.length < limit && pool.length > 0) {
      const totalWeight = pool.reduce((sum, ad) => sum + (ad.weight || 1), 0);
      let random = Math.random() * totalWeight;
      
      for (let i = 0; i < pool.length; i++) {
        random -= (pool[i]?.weight || 1);
        if (random <= 0) {
          result.push(pool.splice(i, 1)[0]!);
          break;
        }
      }
    }
    return result;
  }
}

/**
 * Fill-rate Priority Strategy: (Placeholder logic) 
 * In a real scenario, this would check impression counts from DB/Redis.
 * Here we simulate it by shuffling or picking lower weights if we assume weight inversely correlates with fill.
 */
class FillRatePriorityStrategy implements IAdStrategy {
  selectAds(ads: IPartnerAd[], limit: number): IPartnerAd[] {
    // For now, return shuffled list as placeholder for "Fill Rate" balancing
    return [...ads].sort(() => Math.random() - 0.5).slice(0, limit);
  }
}

/**
 * Geography Strategy: (Placeholder logic)
 * Would require lat/lng comparison.
 */
class GeographyStrategy implements IAdStrategy {
  selectAds(ads: IPartnerAd[], limit: number): IPartnerAd[] {
    // Current requirement placeholder: returns first N
    return ads.slice(0, limit);
  }
}

export class StrategyFactory {
  private static strategies: Record<string, IAdStrategy> = {
    WeightedRandom: new WeightedRandomStrategy(),
    FillRate: new FillRatePriorityStrategy(),
    Geo: new GeographyStrategy(),
  };

  public static getStrategy(type: string): IAdStrategy {
    return this.strategies[type] || this.strategies.WeightedRandom!;
  }
}
