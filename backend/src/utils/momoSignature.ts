import crypto from "crypto";
import qs from "querystring";

export function createMomoSignature(rawData: Record<string, any>, secretKey: string): string {
  // Sắp xếp key theo alphabet
  const sortedKeys = Object.keys(rawData).sort();
  const rawSignature = sortedKeys
    .map((key) => `${key}=${rawData[key]}`)
    .join("&");

  return crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");
}
