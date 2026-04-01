import { Schema, model } from 'mongoose';
import type { Document } from 'mongoose';

export interface IPartnerAd {
  adId: string;
  title: string;
  imageUrl: string;
  targetUrl: string;
  weight: number;
}

export interface ISuccessPage extends Document {
  brandId: string;
  brandName: string;
  layoutType: 'Vertical' | 'Z-Pattern' | 'NativeFeed';
  primaryBanner: {
    driveId?: string;
    originalUrl?: string;
    optimizedUrl: string; // Cloudinary or R2 URL
  };
  partnerAds: IPartnerAd[];
  strategyType: 'WeightedRandom' | 'Geo' | 'FillRate';
  theme: {
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const PartnerAdSchema = new Schema<IPartnerAd>({
  adId: { type: String, required: true },
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  targetUrl: { type: String, required: true },
  weight: { type: Number, default: 1 },
});

const SuccessPageSchema = new Schema<ISuccessPage>(
  {
    brandId: { type: String, required: true, unique: true, index: true },
    brandName: { type: String, required: true },
    layoutType: {
      type: String,
      enum: ['Vertical', 'Z-Pattern', 'NativeFeed'],
      default: 'Vertical',
    },
    primaryBanner: {
      driveId: { type: String },
      originalUrl: { type: String },
      optimizedUrl: { type: String, required: true },
    },
    partnerAds: [PartnerAdSchema],
    strategyType: {
      type: String,
      enum: ['WeightedRandom', 'Geo', 'FillRate'],
      default: 'WeightedRandom',
    },
    theme: {
      primaryColor: { type: String, default: '#007bff' },
      backgroundColor: { type: String, default: '#ffffff' },
      textColor: { type: String, default: '#333333' },
    },
  },
  { timestamps: true }
);

export default model<ISuccessPage>('SuccessPage', SuccessPageSchema);
