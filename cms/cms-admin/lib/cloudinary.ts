import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * [ASSET PIPELINE] Đẩy ảnh lên Cloudinary và tối ưu hóa 
 * cho thiết bị di động kết nối WiFi MikroTik.
 */
export async function optimizeAsset(imageUrl: string, brandId: string) {
  try {
    // 1. Kiểm tra môi trường (Nếu chưa cấu hình thì bỏ qua)
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
        console.warn("[Cloudinary] No cloud_name provided. Skipping optimization.");
        return imageUrl;
    }

    // 2. Upload to Cloudinary (Dùng brandId làm folder để dễ quản lý)
    const uploadResult = await cloudinary.uploader.upload(imageUrl, {
      folder: `mikrotik-ads/${brandId}`,
      resource_type: "image",
      overwrite: true,
      invalidate: true,
      // Ép chất lượng nén cực cao cho MikroTik (dưới 100-200KB)
      transformation: [
        { width: 1080, crop: "limit" }, // Đảm bảo độ phân giải di động chuẩn
        { quality: "auto:low" },        // Tự động chọn chất lượng nén thấp nhưng vẫn rõ nét
        { fetch_format: "webp" }       // Bán ưu tiên WebP cho tất cả thiết bị hiện đại
      ]
    });

    console.log(`[Asset Pipeline] Optimized: ${brandId} -> ${uploadResult.secure_url}`);
    return uploadResult.secure_url;
  } catch (error: any) {
    console.error("[Asset Error]:", error.message);
    return imageUrl; // Fallback về link gốc nếu có lỗi Cloudinary
  }
}

export default cloudinary;
