import cloudinary from "../config/cloudinary.js";
import { extractPublicId } from "./cloudinary/cloudinaryHelps.js";
export async function uploadImage(file, folder, options) {
    const dataURI = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
    const result = await cloudinary.uploader.upload(dataURI, {
        folder,
        public_id: options?.publicId,
        resource_type: (options?.resourceType || "image"),
        overwrite: true,
    });
    return {
        secure_url: result.secure_url,
        public_id: result.public_id,
    };
}
export async function uploadImages(files, folder) {
    const results = [];
    for (const file of files) {
        const result = await uploadImage(file, folder);
        results.push(result);
    }
    return results;
}
export async function deleteImage(imageUrl) {
    if (!imageUrl)
        return;
    try {
        const publicId = extractPublicId(imageUrl);
        if (publicId) {
            await cloudinary.uploader.destroy(publicId);
        }
    }
    catch (error) {
        console.error(`Failed to delete image: ${imageUrl}`, error);
    }
}
export async function deleteImages(imageUrls) {
    await Promise.all(imageUrls.map((url) => deleteImage(url)));
}
export function getPublicIdFromUrl(url) {
    return extractPublicId(url);
}
