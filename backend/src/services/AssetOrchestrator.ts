import { v2 as cloudinary } from 'cloudinary';
import type { UploadApiResponse } from 'cloudinary';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { Readable } from 'stream';

dotenv.config();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

// Cloudflare R2 Configuration (S3 Compatible)
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});

export class AssetOrchestrator {
  /**
   * Extracts file ID from Google Drive URL.
   */
  private static extractDriveId(url: string): string | null {
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
    return match?.[1] ?? null;
  }

  /**
   * Downloads image from Drive, processes it with Cloudinary, and uploads it to Cloudflare R2.
   * Returns the final Edge URL.
   */
  public static async processAsset(driveUrl: string, brandId: string): Promise<{ driveId: string; optimizedUrl: string }> {
    const driveId = this.extractDriveId(driveUrl);
    if (!driveId) throw new Error('Invalid Google Drive URL');

    // Use Public Drive URL (Note: This is a hack, usually you need API keys)
    const directUrl = `https://drive.google.com/uc?export=download&id=${driveId}`;

    try {
      // 1. Download from Google Drive
      const response = await axios({
        url: directUrl,
        method: 'GET',
        responseType: 'arraybuffer',
      });
      const imageBuffer = Buffer.from(response.data);

      // 2. Upload to Cloudinary for Pre-processing (Resize to 720px, Convert to WebP, Compress quality)
      const cloudinaryResult: UploadApiResponse = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `wifi_marketing/${brandId}`,
            public_id: `banner_${Date.now()}`,
            format: 'webp',
            transformation: [{ width: 720, crop: 'limit', quality: 'auto:best' }],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result!);
          }
        );
        Readable.from(imageBuffer).pipe(uploadStream);
      });

      // 3. Upload to Cloudflare R2 (Edge Cache)
      // We fetch the optimized result from Cloudinary (using transform URL) or its secure_url
      const optimizedUrl = cloudinaryResult.secure_url;
      const optimizedResponse = await axios({ url: optimizedUrl, responseType: 'arraybuffer' });
      const optimizedBuffer = Buffer.from(optimizedResponse.data);

      const fileName = `brands/${brandId}/${driveId}.webp`;
      const putCommand = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: fileName,
        Body: optimizedBuffer,
        ContentType: 'image/webp',
      });

      await r2Client.send(putCommand);

      const finalEdgeUrl = `${process.env.R2_PUBLIC_URL}/${fileName}`;

      // Check file size (Requirement: < 200KB)
      if (optimizedBuffer.length > 200 * 1024) {
        console.warn(`Warning: Processed image for ${brandId} is over 200KB: ${optimizedBuffer.length / 1024} KB`);
      }

      return {
        driveId,
        optimizedUrl: finalEdgeUrl,
      };
    } catch (error: any) {
      console.error('Error during Asset Orchestration:', error.message);
      throw new Error(`Orchestration failed: ${error.message}`);
    }
  }
}
