import cloudinary from "../config/cloudinary.js";
import { extractPublicId } from "./cloudinary/cloudinaryHelps.js";

export interface UploadResult {
  secure_url: string;
  public_id: string;
}

export async function uploadImage(
  file: Express.Multer.File,
  folder: string,
  options?: { publicId?: string; resourceType?: string }
): Promise<UploadResult> {
  const dataURI = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

  const result = await cloudinary.uploader.upload(dataURI, {
    folder,
    public_id: options?.publicId,
    resource_type: (options?.resourceType || "image") as "image" | "video" | "raw" | "auto",
    overwrite: true,
  });

  return {
    secure_url: result.secure_url,
    public_id: result.public_id,
  };
}

export async function uploadImages(
  files: Express.Multer.File[],
  folder: string
): Promise<UploadResult[]> {
  const results: UploadResult[] = [];

  for (const file of files) {
    const result = await uploadImage(file, folder);
    results.push(result);
  }

  return results;
}

export async function deleteImage(imageUrl: string): Promise<void> {
  if (!imageUrl) return;

  try {
    const publicId = extractPublicId(imageUrl);
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }
  } catch (error) {
    console.error(`Failed to delete image: ${imageUrl}`, error);
  }
}

export async function deleteImages(imageUrls: string[]): Promise<void> {
  await Promise.all(imageUrls.map((url) => deleteImage(url)));
}

export function getPublicIdFromUrl(url: string): string | null {
  return extractPublicId(url);
}
