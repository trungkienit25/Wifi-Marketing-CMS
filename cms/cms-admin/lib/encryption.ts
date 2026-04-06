import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;

/**
 * Lấy Khóa Bí Mật từ môi trường.
 * Phải là 32 ký tự (256 bit).
 */
const getSecretKey = () => {
  const secret = process.env.MASTER_SECRET_KEY;
  if (!secret || secret.length < 32) {
    throw new Error("MASTER_SECRET_KEY must be at least 32 characters long.");
  }
  return crypto.scryptSync(secret, "salt", 32);
};

/**
 * Mã hóa dữ liệu (IP, API Keys...)
 */
export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const key = getSecretKey();
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  
  const authTag = cipher.getAuthTag().toString("hex");
  
  // Trả về định dạng: iv.encrypted.authTag
  return `${iv.toString("hex")}.${encrypted}.${authTag}`;
}

/**
 * Giải mã dữ liệu
 */
export function decrypt(encryptedData: string): string {
  const parts = encryptedData.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid encrypted data format.");
  }

  const [ivHex, encryptedHex, tagHex] = parts;
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(tagHex, "hex");
  const key = getSecretKey();
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encryptedHex, "hex", "utf8");
  decrypted += decipher.final("utf8");
  
  return decrypted;
}
