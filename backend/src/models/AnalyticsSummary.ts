import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalyticsSummary extends Document {
  brandId: string;
  adId: string;
  type: 'impression' | 'click';
  date: Date;       // YYYY-MM-DD
  hour: number;     // 0-23
  count: number;
}

const AnalyticsSummarySchema: Schema = new Schema({
  brandId: { type: String, required: true, index: true },
  adId: { type: String, required: true, index: true },
  type: { type: String, enum: ['impression', 'click'], required: true },
  date: { type: Date, required: true, index: true },
  hour: { type: Number, required: true, min: 0, max: 23 },
  count: { type: Number, default: 0 },
}, { timestamps: true });

// Compound index for efficient Upsert (Aggregated performance)
AnalyticsSummarySchema.index({ brandId: 1, adId: 1, type: 1, date: 1, hour: 1 }, { unique: true });

export default mongoose.model<IAnalyticsSummary>('AnalyticsSummary', AnalyticsSummarySchema);
